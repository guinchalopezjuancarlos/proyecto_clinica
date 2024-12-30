import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  clienteInfo:any;
  clienteForm: any;
  allClientes:any = [];

  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Nombre',
    'Cedula',
    'Email',
    'Celular',
    'Direccion',
    'Actions'
  ];
  message: string;
  createFormImageUrl: string | ArrayBuffer;
  editFormImageUrl: string | ArrayBuffer;
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
    this.backendService.getClientes().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.allClientes = data.map((cliente: any) => ({
          ...cliente,
          id: cliente.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.allClientes);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }





  setForm() {
    debugger
    this.clienteForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      cedula: new FormControl(null, [Validators.required]),
      celular: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
    });
  }



  create() {

    this.formSubmissionFlag  = true;
    const formData: any = new FormData();
    formData.append('nombre', this.clienteForm.value.nombre);
    formData.append('email', this.clienteForm.value.email);
    formData.append('cedula', this.clienteForm.value.cedula);
    formData.append('celular', this.clienteForm.value.celular);
    formData.append('direccion', this.clienteForm.value.direccion);
    const Data= JSON.stringify({
      "nombre": this.clienteForm.value.nombre,
      "cedula": this.clienteForm.value.cedula,
      "email": this.clienteForm.value.email,
      "celular": this.clienteForm.value.celular,
      "direccion": this.clienteForm.value.direccion
    });
     this.backendService.createCliente(Data)?.subscribe(async (res: any) => {

        this.clienteForm.reset();
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
  read(cliente: any): void {
    if (!cliente) {
      console.error('El usuario no es válido:', cliente);
      return;
    }


    this.clienteForm.patchValue({
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      cedula: cliente.cedula,
      celular: cliente.celular,
      direccion: cliente.direccion,
    });

    // Abre el popup.
    this.editPopup = true;
  }
  update() {
    this.formSubmissionFlag = true;

    // Crear FormData
    const formData: any = new FormData();
    formData.append('id', this.clienteForm.value.id);
    formData.append('nombre', this.clienteForm.value.nombre);
    formData.append('email', this.clienteForm.value.email);
    formData.append('cedula', this.clienteForm.value.cedula);
    formData.append('celular', this.clienteForm.value.celular);
    formData.append('direccion', this.clienteForm.value.direccion);


    const Data= JSON.stringify({
      "id":this.clienteForm.value.id,
      "nombre": this.clienteForm.value.nombre,
      "cedula": this.clienteForm.value.cedula,
      "email": this.clienteForm.value.email,
      "celular": this.clienteForm.value.celular,
      "direccion": this.clienteForm.value.direccion
    });
    console.log('Datos convertidos a JSON:', Data);

    // Enviar la solicitud con el JSON
    this.backendService.updateCliente(Data)?.subscribe((res: any) => {
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
         this.backendService.deleteCliente(i.id)?.subscribe((res: any) => {
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
        this.loadData();
      }
    })
  }


  downloadPDF() {
    const doc = new jsPDF();
    const tableBody = this.allClientes.map(cliente => [
      cliente.id,
      cliente.nombre,
      cliente.cedula,
      cliente.email,
      cliente.celular,
      cliente.direccion,
    ]);

    doc.text('Clientes', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre', 'Cedula', 'Email', 'Celular', 'Direccion']],
      body: tableBody,
    });

    doc.save('clientes.pdf'); // Descargar el PDF
  }


}
