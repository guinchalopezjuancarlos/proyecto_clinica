import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class VentaComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  doctorInfo:any;
  Form: any;
  allVentas: any = [];
  clientes: any = [];
  metodosPago: any = [];
  estadosVenta:any = [];

  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Cliente',
    'Fecha',
    'Metodo de Pago',
    'Estado',
    'Total',
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
    this.loadClientes();
    this.metodos();
    this.estados();

  }

  loadData(): void {
    this.backendService.getVentas().subscribe({
      next: (data) => {
        this.allVentas = data.map((venta: any) => ({
          ...venta,
          id: venta.id.toString()
        }));
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
      cliente: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      metodopago: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      total: new FormControl(null, [Validators.required]),
      clienteObj: new FormControl(null, [Validators.required]),
    });
  }
  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent)
    dialogRef.instance.visible = true;
    dialogRef.instance.action.subscribe(x => {
      if (x) {
         this.backendService.deleteVenta(i.id)?.subscribe((res: any) => {
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

  read(venta: any): void {
    if (!venta) {
      console.error('El no es válido:', venta);
      return;
    }


    this.Form.patchValue({
      id: venta.id,
      cliente: venta.cliente.nombre,
      clienteObj: venta.cliente,
      fecha: venta.fecha,
      metodopago: venta.metodopago,
      estado: venta.estado,
      total: venta.total,
    });

    // Abre el popup.
    this.editPopup = true;
  }
  update() {
    this.formSubmissionFlag = true;

    // Crear FormData
    const formData: any = new FormData();
    formData.append('id', this.Form.value.id);
    formData.append('cliente', this.Form.value.cliente);
    formData.append('fecha', this.Form.value.fecha);
    formData.append('metodopago', this.Form.value.metodopago);
    formData.append('estado', this.Form.value.estado);
    formData.append('total', this.Form.value.total);


    const Data= JSON.stringify({
      "id":this.Form.value.id,
      cliente: this.Form.value.clienteObj,
      "fecha": this.Form.value.fecha,
      "metodopago": this.Form.value.metodopago,
      "estado": this.Form.value.estado,
      "total": this.Form.value.total
    });
    console.log('Datos convertidos a JSON:', Data);

    // Enviar la solicitud con el JSON
    this.backendService.updateVenta(Data)?.subscribe((res: any) => {
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

  loadClientes(): void {
    this.backendService.getClientes().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.clientes = data.map((cliente: any) => ({
          ...cliente,
          id: cliente.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.clientes);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }


  metodos(): void {
    this.metodosPago = [
      { id: '1', name: 'Pago Qr' },
      { id: '2', name: 'Tigo Money' },
    ];
  }

  estados(): void {
    this.estadosVenta = [
      { id: '1', name: 'NO CANCELADO' },
      { id: '2', name: 'CANCELADO' },
    ];
  }



  downloadPDF() {
    const doc = new jsPDF();
    const tableBody = this.allVentas.map(x => [
      x.id,
      x.cliente.nombre,
      x.fecha,
      x.estado,
      x.total,
    ]);

    doc.text('Citas Medicas', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre de Cliente', 'Fecha', 'Estado', 'Total']],
      body: tableBody,
    });

    doc.save('ventas.pdf'); // Descargar el PDF
  }
}
