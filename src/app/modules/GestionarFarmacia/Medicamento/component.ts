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
export class MedicamentoComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  doctorInfo:any;
  Form: any;
  allMedicamentos:any = [];

  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Nombre',
    'Precio',
    'Stock',
    'Descripcion',
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
    this.backendService.getMedicamentos().subscribe({
      next: (data) => {
        this.allMedicamentos = data.map((medicamento: any) => ({
          ...medicamento,
          id: medicamento.id.toString()
        }));

        console.log(this.allMedicamentos);
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }



  setForm() {

    this.Form = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl(null, [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
      stock: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
    });
  }



  create() {

    this.formSubmissionFlag  = true;
    const formData: any = new FormData();
    formData.append('nombre', this.Form.value.nombre);
    formData.append('precio', this.Form.value.precio);
    formData.append('stock', this.Form.value.stock);
    formData.append('descripcion', this.Form.value.descripcion);
    const Data= JSON.stringify({
      "nombre": this.Form.value.nombre,
      "precio": this.Form.value.precio,
      "stock": this.Form.value.stock,
      "descripcion": this.Form.value.descripcion
    });
     this.backendService.createMedicamento(Data)?.subscribe(async (res: any) => {

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
  read(medicamento: any): void {
    if (!medicamento) {
      console.error('El usuario no es válido:', medicamento);
      return;
    }


    this.Form.patchValue({
      id: medicamento.id,
      nombre: medicamento.nombre,
      precio: medicamento.precio,
      stock: medicamento.stock,
      descripcion: medicamento.descripcion,
    });

    // Abre el popup.
    this.editPopup = true;
  }
  update() {
    this.formSubmissionFlag = true;

    // Crear FormData
    const formData: any = new FormData();
    formData.append('id', this.Form.value.id);
    formData.append('doctor', this.Form.value.doctor);
    formData.append('paciente', this.Form.value.paciente);
    formData.append('fecha', this.Form.value.fecha);
    formData.append('notas', this.Form.value.notas);



    const Data= JSON.stringify({
      "id":this.Form.value.id,
      "doctor": this.Form.value.doctor,
      "paciente": this.Form.value.paciente,
      "fecha": this.Form.value.fecha,
      "notas": this.Form.value.notas
    });
    console.log('Datos convertidos a JSON:', Data);

    // Enviar la solicitud con el JSON
    this.backendService.updateCitaMedica(Data)?.subscribe((res: any) => {
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
         this.backendService.deleteMedicamento(i.id)?.subscribe((res: any) => {
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
    const tableBody = this.allMedicamentos.map(x => [
      x.id,
      x.nombre,
      x.precio,
      x.stock,
      x.descripcion,
    ]);

    doc.text('Medicamentos', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre', 'Precio', 'Stock', 'Descripcion']],
      body: tableBody,
    });

    doc.save('Medicamentos.pdf'); // Descargar el PDF
  }



}
