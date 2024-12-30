import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-cita-medica',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class CitaMedicaComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('formulario') formulario: ElementRef;

  closeResult: string;
  doctorInfo: any;
  Form: FormGroup;
  allCitasMedicas: any = [];
  allDoctores: any = [];
  allPacientes: any = [];
  errors: any = [];
  formError: any = {};
  tableColumns: string[] = [
    'Id',
    'Nombre del Doctor',
    'Nombre del Paciente',
    'Fecha',
    'Estado',
    'Horario',
    'Acciones'
  ];
  message: string;
  serverError: boolean;
  popUpShowHideFlag: boolean;
  editPopup: boolean;
  formSubmissionFlag: boolean = false;

  constructor(
    private backendService: BackendService,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setForm();
  }

  loadData(): void {
    // Llamada a la API para obtener todas las citas médicas, doctores y pacientes en paralelo
    this.backendService.getCitasMedicas().subscribe({
      next: (data) => {
        this.allCitasMedicas = data.map((citamedica: any) => ({
          ...citamedica,
          id: citamedica.id.toString()
        }));
        console.log(this.allCitasMedicas);
      },
      error: (error) => {
        console.error('Error al obtener citas médicas', error);
        Swal.fire('Error', 'Hubo un problema al obtener las citas médicas.', 'error');
      }
    });

    this.backendService.getDoctores().subscribe({
      next: (data) => {
        this.allDoctores = data.map((doctor: any) => ({
          ...doctor,
          id: doctor.id.toString()
        }));
        console.log(this.allDoctores);
      },
      error: (error) => {
        console.error('Error al obtener doctores', error);
        Swal.fire('Error', 'Hubo un problema al obtener los doctores.', 'error');
      }
    });

    this.backendService.getPacientes().subscribe({
      next: (data) => {
        this.allPacientes = data.map((paciente: any) => ({
          ...paciente,
          id: paciente.id.toString()
        }));
        console.log(this.allPacientes);
      },
      error: (error) => {
        console.error('Error al obtener pacientes', error);
        Swal.fire('Error', 'Hubo un problema al obtener los pacientes.', 'error');
      }
    });
  }

  setForm(): void {
    this.Form = new FormGroup({
      id: new FormControl(null),
      doctor: new FormControl(null, [Validators.required]),
      paciente: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [
        Validators.required,
        this.estadoValidator
      ]),
      horario: new FormControl(null, [Validators.required])
    });
  }

  estadoValidator(control: FormControl) {
    const validStates = ['PENDIENTE', 'DISPONIBLE', 'ATENDIDO'];
    if (!validStates.includes(control.value)) {
      return { invalidState: true };
    }
    return null;
  }

  tomarScreenshot(): void {
    if (this.formulario) {
      html2canvas(this.formulario.nativeElement).then((canvas) => {
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'reporte de citas medicas';
        link.click();
      });
    } else {
      console.error('Formulario no encontrado.');
    }
  }

  create() {
    this.formSubmissionFlag = true;

    const data = JSON.stringify({
      doctor: this.Form.value.doctor,
      paciente: this.Form.value.paciente,
      fecha: this.Form.value.fecha,
      estado: this.Form.value.estado,
      horario: this.Form.value.horario
    });

    this.backendService.createCitaMedica(data).subscribe(
      (res: any) => {
        this.Form.reset();
        this.closeModal.nativeElement.click();
        this.formSubmissionFlag = false;
        Swal.fire({
          title: '',
          text: 'Cita creada con éxito',
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        this.loadData(); // Recargar los datos después de la creación
      },
      (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un error desde el backend.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
        this.formSubmissionFlag = false;
      }
    );
  }

  read(citamedica: any): void {
    if (!citamedica) {
      console.error('Cita médica no válida:', citamedica);
      return;
    }
  
    // Cargar los datos correctamente con los objetos completos
    this.Form.patchValue({
      id: citamedica.id,
      doctor: citamedica.doctor.id,  // Usar solo el ID si el backend no envía el objeto completo
      paciente: citamedica.paciente.id, // Id de paciente
      fecha: citamedica.fecha,
      estado: citamedica.estado,
      horario: citamedica.horario
    });
  
    this.editPopup = true;  // Mostrar el popup para editar
  }
  
  

  update() {
    this.formSubmissionFlag = true;
  
    const data = {
      id: this.Form.value.id,
      doctor: { id: this.Form.value.doctor },  // Usar solo el ID del doctor si es lo que el backend espera
      paciente: { id: this.Form.value.paciente },  // Usar solo el ID del paciente
      fecha: this.Form.value.fecha,
      estado: this.Form.value.estado,
      horario: this.Form.value.horario
    };
  
    console.log('Datos a enviar:', data); // Verifica los datos antes de enviar
  
    this.backendService.updateCitaMedica(data).subscribe(
      (res: any) => {
        this.formSubmissionFlag = false;
        this.closeModal.nativeElement.click();
        Swal.fire({
          title: '',
          text: 'Cita actualizada con éxito',
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        this.loadData(); // Recargar los datos después de la actualización
      },
      (err) => {
        console.error('Error al actualizar la cita:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un error desde el backend.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
        this.formSubmissionFlag = false;
      }
    );
  }
  
  

  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent);
    dialogRef.instance.visible = true;

    dialogRef.instance.action.subscribe((x) => {
      if (x) {
        this.backendService.deleteCitaMedica(i.id).subscribe(
          (res: any) => {
            dialogRef.instance.visible = false;
            Swal.fire({
              title: '',
              text: 'Cita eliminada con éxito',
              icon: 'success',
              confirmButtonText: 'Cerrar'
            });
            this.loadData(); // Recargar los datos después de la eliminación
          },
          (err) => {
            dialogRef.instance.visible = false;
            console.error(err);
            Swal.fire({
              title: 'Error!',
              text: 'Hubo un error al eliminar la cita.',
              icon: 'error',
              confirmButtonText: 'Cerrar'
            });
          }
        );
      } else {
        dialogRef.instance.visible = false;
      }
    });
  }


  
  


  downloadPDF() {
    const doc = new jsPDF();
    const tableBody = this.allCitasMedicas.map(x => [
      x.id,
      x.doctor.nombre,
      x.paciente.nombre,
      x.fecha,
      x.estado,
      x.horario,
    ]);

    doc.text('Citas Medicas', 14, 10); // Título del documento
    autoTable(doc, {
      head: [['Id', 'Nombre de Doctor', 'Nombre del Paciente', 'Fecha', 'estado','horario']],
      body: tableBody,
    });

    doc.save('citas_medicas.pdf'); // Descargar el PDF
  }


}
