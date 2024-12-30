import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocketService } from 'src/app/core/shared/socket.service';
import { DatePipe } from '@angular/common';
import { RolesService } from 'src/app/core/shared/services/roles.service';
import { HttpClient } from '@angular/common/http';
import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef

  selectedRoles:any = [];
  closeResult: string;
  userInfo:any;
  userForm: any;
  allUsers:any = [];
  userRoles:any = [];
  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'User Name',
    'Email',
    'Rol',
    'Actions'
  ];
  message: string;
  imagePath: any;
  createFormImageUrl: string | ArrayBuffer;
  editFormImageUrl: string | ArrayBuffer;
  changedFileName: string;
  userImage: string;
  serverError: boolean;
  popUpShowHideFlag: boolean;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;
  constructor(
    private backendService: BackendService,
    private viewContainer: ViewContainerRef
    ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.loadData();
    this.roles();
    this.setForm();
  }

  loadData(): void {
    this.backendService.getUsers().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.allUsers = data.map((user: any) => ({
          ...user,
          id: user.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.allUsers);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }


  roles(): void {
    this.userRoles = [
      { id: 'ADMIN', roleName: 'ADMIN' },
      { id: 'NORMAL', roleName: 'NORMAL' },
    ];
}


  setForm() {
    debugger
    this.userForm = new FormGroup({
      id: new FormControl(null),
      role: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null, [Validators.required]),
    });
  }



  create() {
    if (!this.validForm()) {
      return
    }
    this.formSubmissionFlag  = true;
    const formData: any = new FormData();
    formData.append('role', this.userForm.value.role);
    formData.append('email', this.userForm.value.email);
    formData.append('password', this.userForm.value.password);
    formData.append('password_confirmation', this.userForm.value.password_confirmation);
    formData.append('username', this.userForm.value.username);
    const userData= JSON.stringify({
      "username": this.userForm.value.username,
      "role": this.userForm.value.role,
      "email": this.userForm.value.email,
      "password": this.userForm.value.password
    });
     this.backendService.createUser(userData)?.subscribe(async (res: any) => {

        this.userForm.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag  = false;
        Swal.fire({
          title: '',
           text: 'User created Successfully',
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
  }
  read(user: any): void {
    if (!user) {
      console.error('El usuario no es válido:', user);
      return;
    }

    // Actualiza el formulario con los datos del usuario, incluido el rol.
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role, // Asegúrate de que `user` contiene `roleId`.
    });

    // Abre el popup.
    this.editPopup = true;
  }
  update() {
    this.formSubmissionFlag = true;

    // Crear FormData
    const formData: any = new FormData();
    formData.append('id', this.userForm.value.id);
    formData.append('role', this.userForm.value.role);
    formData.append('email', this.userForm.value.email);
    formData.append('username', this.userForm.value.username);


    const userData= JSON.stringify({
      "id":this.userForm.value.id,
      "username": this.userForm.value.username,
      "role": this.userForm.value.role,
      "email": this.userForm.value.email
    });
    console.log('Datos convertidos a JSON:', userData);

    // Enviar la solicitud con el JSON
    this.backendService.updateUser(userData)?.subscribe((res: any) => {
      console.log('status:', res);

        this.formSubmissionFlag = false;
        this.closeModal.nativeElement.click();
        Swal.fire({
          title: '',
          text: 'User updated Successfully',
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
         this.backendService.deleteUser(i.id)?.subscribe((res: any) => {
             dialogRef.instance.visible = false;
             Swal.fire({
               title: '',
               text: 'User Deleted Successfully',
               icon: 'success',
               confirmButtonText: 'Close'
             })

         })
        dialogRef.instance.visible = false;
        Swal.fire({
          title: '',
          text: 'User Deleted Successfully',
          icon: 'success',
          confirmButtonText: 'Close'
        })
        this.loadData();
      }
    })
  }
  validForm() {
    this.errors = [];
    this.formError = {};
    let validFlag = true;
    if (!this.userForm.value.email) {
      this.errors.push('email');
      this.formError.errorForEmail = 'Email is required';
      validFlag = false;
    }
    if (!this.userForm.value.password) {
      this.errors.push('password');
      this.formError.errorForPassword = 'Password is required';
      validFlag = false;
    }
    return validFlag;
  }



  downloadPDF() {
    const doc = new jsPDF();
    const tableBody = this.allUsers.map(x => [
      x.id,
      x.username,
      x.email,
      x.role,

    ]);

    doc.text('Users', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre', 'Email', 'Rol']],
      body: tableBody,
    });

    doc.save('Users.pdf'); // Descargar el PDF
  }

}
