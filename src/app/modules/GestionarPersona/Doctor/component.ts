import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DoctorComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  doctorInfo:any;
  Form: any;
  allDoctores:any = [];

  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Nombre',
    'Cedula',
    'Email',
    'Celular',
    'Especialidad',
    'Actions'
  ];
  message: string;
  serverError: boolean;
  popUpShowHideFlag: boolean;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;
  constructor(
    private backendService: BackendService,
    private viewContainer: ViewContainerRef
    ) {

  }

  ngOnInit(): void {
    this.loadData();
    this.setForm();
  }

  loadData(): void {
    this.backendService.getDoctores().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.allDoctores = data.map((doctor: any) => ({
          ...doctor,
          id: doctor.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.allDoctores);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }





  setForm() {
    debugger
    this.Form = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      cedula: new FormControl(null, [Validators.required]),
      celular: new FormControl(null, [Validators.required]),
      especialidad: new FormControl(null, [Validators.required]),
    });
  }



  create() {

    this.formSubmissionFlag  = true;
    const formData: any = new FormData();
    formData.append('nombre', this.Form.value.nombre);
    formData.append('email', this.Form.value.email);
    formData.append('cedula', this.Form.value.cedula);
    formData.append('celular', this.Form.value.celular);
    formData.append('especialidad', this.Form.value.especialidad);
    const Data= JSON.stringify({
      "nombre": this.Form.value.nombre,
      "cedula": this.Form.value.cedula,
      "email": this.Form.value.email,
      "celular": this.Form.value.celular,
      "especialidad": this.Form.value.especialidad
    });
     this.backendService.createDoctor(Data)?.subscribe(async (res: any) => {

        this.Form.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag  = false;
        Swal.fire({
          title: '',
           text: 'created Successfully',
          icon: 'success',
           confirmButtonText: 'Close'
         })

     }, err => {
       console.log(err);
       Swal.fire({
         title: 'Error!',
         text: 'There is an error from backend side.',
        icon: 'error',
         confirmButtonText: 'Close'
       })
       this.serverError = true;
     })
     this.ngOnInit();
  }
  read(doctor: any): void {
    if (!doctor) {
      console.error('El usuario no es válido:', doctor);
      return;
    }


    this.Form.patchValue({
      id: doctor.id,
      nombre: doctor.nombre,
      email: doctor.email,
      cedula: doctor.cedula,
      celular: doctor.celular,
      especialidad: doctor.especialidad,
    });

    // Abre el popup.
    this.editPopup = true;
  }
  update() {
    this.formSubmissionFlag = true;

    // Crear FormData
    const formData: any = new FormData();
    formData.append('id', this.Form.value.id);
    formData.append('nombre', this.Form.value.nombre);
    formData.append('email', this.Form.value.email);
    formData.append('cedula', this.Form.value.cedula);
    formData.append('celular', this.Form.value.celular);
    formData.append('especialidad', this.Form.value.especialidad);


    const Data= JSON.stringify({
      "id":this.Form.value.id,
      "nombre": this.Form.value.nombre,
      "cedula": this.Form.value.cedula,
      "email": this.Form.value.email,
      "celular": this.Form.value.celular,
      "especialidad": this.Form.value.especialidad
    });
    console.log('Datos convertidos a JSON:', Data);

    // Enviar la solicitud con el JSON
    this.backendService.updateDoctor(Data)?.subscribe((res: any) => {
      console.log('status:', res);

        this.formSubmissionFlag = false;
        this.closeModal.nativeElement.click();
        Swal.fire({
          title: '',
          text: ' updated Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        });

    });
    this.ngOnInit();
  }


  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent)
    dialogRef.instance.visible = true;
    dialogRef.instance.action.subscribe(x => {
      if (x) {
         this.backendService.deleteDoctor(i.id)?.subscribe((res: any) => {
             dialogRef.instance.visible = false;
             Swal.fire({
               title: '',
               text: 'Deleted Successfully',
               icon: 'success',
               confirmButtonText: 'Close'
             })

         })
        dialogRef.instance.visible = false;
        Swal.fire({
          title: '',
          text: ' Deleted Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        })

      }
      this.ngOnInit();
    })

  }

  downloadPDF() {
    const doc = new jsPDF();
    const tableBody = this.allDoctores.map(x => [
      x.id,
      x.nombre,
      x.cedula,
      x.email,
      x.celular,
      x.especialidad,
    ]);

    doc.text('Doctores', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre', 'Cedula', 'Email', 'Celular', 'Especialidad']],
      body: tableBody,
    });

    doc.save('doctores.pdf'); // Descargar el PDF
  }



}
