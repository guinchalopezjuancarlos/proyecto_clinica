import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class DispensacionComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  doctorInfo:any;
  Form: any;
  allMedicamentos:any = [];
  selectedMedicamento: any = null;
  cantidad: number = 1;
  carrito: any[] = [];
  total: number = 0;
  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Nombre',
    'Cantidad',
    'Subtotal',
    'Actions'
  ];
  message: string;
  serverError: boolean;
  popUpShowHideFlag: boolean;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;
  qrImage: string | null = null;
  constructor(
    private backendService: BackendService,
    private viewContainer: ViewContainerRef
    ) {

  }

  ngOnInit(): void {
    this.loadData();
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



  agregarMedicamento() {
    console.log('Medicamento seleccionado:', this.selectedMedicamento);
    console.log('Cantidad ingresada:', this.cantidad);

    if (this.selectedMedicamento && this.cantidad > 0) {
      // Verificar si el producto ya está en el carrito
      const productoExistente = this.carrito.find(
        (item) => item.id === this.selectedMedicamento.id
      );

      if (productoExistente) {
        // Si ya existe, actualiza la cantidad y el subtotal
        productoExistente.cantidad += this.cantidad;
        productoExistente.subtotal =
          productoExistente.cantidad * this.selectedMedicamento.precio;
      } else {
        // Si no existe, lo agrega al carrito
        const subtotal = this.selectedMedicamento.precio * this.cantidad;
        this.carrito.push({
          id: this.selectedMedicamento.id,
          nombre: this.selectedMedicamento.nombre,
          precio: this.selectedMedicamento.precio,
          cantidad: this.cantidad,
          subtotal,
        });
      }

      this.actualizarTotal();
      this.limpiarFormulario();
    } else {
      alert('Seleccione un medicamento y una cantidad válida.');
    }
  }

  pagar(): void {
    if (this.carrito.length === 0) {
      alert('No hay productos en el carrito para pagar.');
      return;
    }

    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    localStorage.setItem('total', JSON.stringify(this.total));
    console.log('Procesando pago...');
    console.log('Detalles del carrito:', this.carrito);
    console.log('Total a pagar:', this.total);
    this.carrito = [];
    this.total = 0;
    window.location.href = '/generarcobro';
  }


  eliminarMedicamento(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }

  limpiarFormulario() {
    this.selectedMedicamento = null;
    this.cantidad = 1;
  }


}
