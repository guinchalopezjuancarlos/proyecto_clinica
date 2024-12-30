import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Pago {
  id: string;
  paciente: Paciente;
  fechapago: string;
  metodopago: string;
  estado: string;
  tipoConsulta: string;
  montoTotal: number;
}

interface Paciente {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-pago',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PagoComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  allPacientes: Paciente[] = [];
  allPagos: Pago[] = [];
  form!: FormGroup;
  errors!: FormGroup;
  formSubmissionFlag = false;
  editPopup = false;

  constructor(
    private backendService: BackendService,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadDataPacientes();
    this.initForm();
  }

  initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      paciente: new FormControl(null, [Validators.required]),
      fechapago: new FormControl(null, [Validators.required]),
      metodopago: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      tipoConsulta: new FormControl(null, [Validators.required]),
      montoTotal: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  loadData(): void {
    this.backendService.getPagos().subscribe({
      next: (data) => {
        this.allPagos = data.map((pago: any) => ({
          ...pago,
          id: pago.id.toString(),
        }));
      },
      error: (err) => {
        Swal.fire('Error', `Ocurrió un problema al obtener los pagos: ${err.message}`, 'error');
      },
    });
  }

  loadDataPacientes(): void {
    this.backendService.getPacientes().subscribe({
      next: (data) => {
        this.allPacientes = data.map((paciente: any) => ({
          ...paciente,
          id: paciente.id.toString(),
        }));
      },
      error: (err) => {
        Swal.fire('Error', `Ocurrió un problema al obtener los pacientes: ${err.message}`, 'error');
      },
    });
  }

  validateForm(): boolean {
    if (this.form.invalid) {
      Swal.fire('Error', 'Complete todos los campos requeridos.', 'error');
      return false;
    }
    return true;
  }

  create(): void {
    if (!this.validateForm()) return;

    this.formSubmissionFlag = true;
    const formData = this.form.value;

    this.backendService.createPago(formData).subscribe({
      next: () => {
        this.form.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag = false;
        Swal.fire('Éxito', 'Pago creado exitosamente.', 'success');
        this.loadData();
      },
      error: (err) => {
        Swal.fire('Error', `Ocurrió un problema al crear el pago: ${err.message}`, 'error');
        this.formSubmissionFlag = false;
      },
    });
  }

  update(): void {
    if (!this.validateForm()) return;

    this.formSubmissionFlag = true;
    const formData = this.form.value;

    this.backendService.updatePago(formData).subscribe({
      next: () => {
        this.form.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag = false;
        Swal.fire('Éxito', 'Pago actualizado exitosamente.', 'success');
        this.loadData();
      },
      error: (err) => {
        Swal.fire('Error', `Ocurrió un problema al actualizar el pago: ${err.message}`, 'error');
        this.formSubmissionFlag = false;
      },
    });
  }

  read(pago: Pago): void {
    if (!pago) {
      console.error('El pago no es válido:', pago);
      return;
    }

    this.form.patchValue({
      id: pago.id,
      paciente: pago.paciente?.id,
      fechapago: pago.fechapago,
      metodopago: pago.metodopago,
      estado: pago.estado,
      tipoConsulta: pago.tipoConsulta,
      montoTotal: pago.montoTotal,
    });

    this.editPopup = true;
  }

  delete(id: string): void {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent);
    dialogRef.instance.visible = true;

    dialogRef.instance.action.subscribe((confirm: boolean) => {
      if (confirm) {
        this.backendService.deletePago(id).subscribe({
          next: () => {
            dialogRef.instance.visible = false;
            Swal.fire('Éxito', 'Pago eliminado exitosamente.', 'success');
            this.loadData();
          },
          error: (err) => {
            Swal.fire('Error', `Ocurrió un problema al eliminar el pago: ${err.message}`, 'error');
          },
        });
      }
      dialogRef.instance.visible = false;
    });
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const headerColor: [number, number, number] = [41, 128, 185];
    const textColor: [number, number, number] = [0, 0, 0];
    const tableBody = this.allPagos.map((pago) => [
      pago.id,
      pago.paciente?.nombre || 'N/A',
      pago.fechapago,
      pago.metodopago,
      pago.estado,
      pago.tipoConsulta,
      pago.montoTotal,
    ]);

    doc.setFillColor(...headerColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Informe de Pagos', 105, 20, { align: 'center' });

    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 40);

    autoTable(doc, {
      startY: 50,
      head: [['ID', 'Paciente', 'Fecha de Pago', 'Método de Pago', 'Estado', 'Tipo de Consulta', 'Monto Total']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor, fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
      },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Clínica Mesocruz © 2024', 105, pageHeight - 10, { align: 'center' });

    doc.save('Informe_Pagos.pdf');
  }
}
