import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BackendService } from 'src/services/backend.service';
import { ConfirmationComponent } from 'src/app/core/shared/components/confirmation/confirmation.component';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class RecetaComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef


  closeResult: string;
  doctorInfo:any;
  Form: any;
  allRecetas:any = [];
  allDoctores: any = [];
  allPacientes:any = [];
  allPagos:any = [];
  metodosPago:any =[];
  estadosVenta:any =[];
  errors: any = [];
  formError: any = {};
  tableColumns:[
    'Id',
    'Nombre del Doctor',
    'Nombre del Paciente',
    'Fecha',
    'Tratamiento',
    'medicamentos Recetados',
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
    this.loadDataDoctores();
    this.loadDataPacientes();
    this.setForm();
  }

  loadData(): void {
    this.backendService.getRecetas().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.allRecetas = data.map((receta: any) => ({
          ...receta,
          id: receta.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.allRecetas);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }

  loadDataDoctores(): void {
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
  loadDataPacientes(): void {
    this.backendService.getPacientes().subscribe({
      next: (data) => {
        // Asegurarte de que el id es tratado como cadena
        this.allPacientes = data.map((paciente: any) => ({
          ...paciente,
          id: paciente.id.toString()  // Convertir el id a cadena
        }));

        console.log(this.allPacientes);  // Verifica si el id se ha convertido correctamente
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }






  setForm() {

    this.Form = new FormGroup({
      id: new FormControl(null),
      doctor: new FormControl(null, [Validators.required]),
      paciente: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      tratamiento: new FormControl(null, [Validators.required]),
      medicamentosRecetados: new FormControl(null, [Validators.required]),
    });
  }



  create() {

    this.formSubmissionFlag  = true;
    const formData: any = new FormData();
    formData.append('doctor', this.Form.value.doctor);
    formData.append('paciente', this.Form.value.paciente);
    formData.append('fecha', this.Form.value.fecha);
    formData.append('tratamiento', this.Form.value.tratamiento);
    formData.append('medicamentosRecetados', this.Form.value.medicamentosRecetados);
    const Data= JSON.stringify({
      "doctor": this.Form.value.doctor,
      "paciente": this.Form.value.paciente,
      "fecha": this.Form.value.fecha,
      "tratamiento": this.Form.value.tratamiento,
      "medicamentosRecetados": this.Form.value.medicamentosRecetados
    });
     this.backendService.createReceta(Data)?.subscribe(async (res: any) => {

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
  read(receta: any): void {
    if (!receta) {
      console.error('El usuario no es válido:', receta);
      return;
    }


    this.Form.patchValue({
      id: receta.id,
      doctor: receta.doctor.nombre,
      paciente: receta.paciente.nombre,
      fecha: receta.fecha,
      tratamiento: receta.tratamiento,
      medicamentosRecetados: receta.medicamentosRecetados,
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
    formData.append('tratamiento', this.Form.value.tratamiento);
    formData.append('medicamentosRecetados', this.Form.value.medicamentosRecetados);




    const Data= JSON.stringify({
      "id":this.Form.value.id,
      "doctor": this.Form.value.doctor,
      "paciente": this.Form.value.paciente,
      "fecha": this.Form.value.fecha,
      "tratamiento": this.Form.value.tratamiento,
      "medicamentosRecetados": this.Form.value.medicamentosRecetados
    });
    console.log('Datos convertidos a JSON:', Data);

    // Enviar la solicitud con el JSON
    this.backendService.updateReceta(Data)?.subscribe((res: any) => {
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
         this.backendService.deleteReceta(i.id)?.subscribe((res: any) => {
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
  
    // Configuración de colores y estilos
    const headerColor: [number, number, number] = [41, 128, 185]; // Azul profesional
    const textColor: [number, number, number] = [0, 0, 0]; // Negro para el texto
    const tableBody = this.allRecetas.map(x => [
      x.id,
      x.doctor.nombre,
      x.paciente.nombre,
      x.fecha,
      x.tratamiento,
      x.medicamentosRecetados
    ]);
  
    // Encabezado del reporte
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, 210, 30, 'F'); // Rectángulo de fondo
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFontSize(18); // Ajustar el tamaño de la fuente
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Recetas Médicas', 105, 20, { align: 'center' });
  
    // Espacio después del encabezado
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10); // Ajustar tamaño de fuente
    doc.text(`Generado el: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`, 14, 40);
  
    // Tabla de datos
    autoTable(doc, {
      startY: 50,
      head: [['ID', 'Doctor', 'Paciente', 'Fecha', 'Tratamiento', 'Medicamentos Recetados']],
      body: tableBody,
      theme: 'striped', // Estilo moderno
      headStyles: {
        fillColor: headerColor, // Color del encabezado
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10, // Ajustar el tamaño de la fuente en el encabezado
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        fontSize: 9, // Ajustar tamaño de fuente de las celdas
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Color para filas alternas
      },
      margin: { top: 50, bottom: 30 }, // Ajustar márgenes
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' }, // Columna ID
        1: { cellWidth: 25 }, // Doctor
        2: { cellWidth: 25 }, // Paciente
        3: { cellWidth: 30, halign: 'center' }, // Fecha
        4: { cellWidth: 40 }, // Tratamiento
        5: { cellWidth: 40 }, // Medicamentos Recetados
      },
    });
  
    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8); // Ajustar tamaño de fuente para el pie de página
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Este informe fue generado automáticamente. Clínica Mesocruz © 2024',
      105,
      pageHeight - 10,
      { align: 'center' }
    );
  
    // Descargar el PDF
    doc.save('Informe_Recetas.pdf');
  }
  



   print(e: any) {
    const doc = new jsPDF('p', 'mm', 'a4');  // Formato A4, orientación vertical (p = portrait)
    
    // Configuración general
    const headerColor: [number, number, number] = [41, 128, 185]; // Azul profesional
    const textColor: [number, number, number] = [0, 0, 0]; // Negro
    const grayText: [number, number, number] = [128, 128, 128]; // Gris claro
    const accentColor: [number, number, number] = [34, 153, 153]; // Verde suave para acentos
    
    // LOGO de la clínica
    const logoPath = 'assets/images/descarga.png';
    doc.addImage(logoPath, 'PNG', 10, 10, 30, 30); // Ajusta la ruta y tamaño del logo
    
    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.text('Clínica Mesocruz', 105, 20, { align: 'center' });
  
    // Subtítulo con detalles de la clínica
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Dirección: satelite norte al frente de coliseo ignacio warnes, Santa Cruz', 105, 28, { align: 'center' });
    doc.text('Teléfono: +591 54552122 | Email: contacto@mesocruz.com', 105, 35, { align: 'center' });
  
    // Línea divisoria elegante
    doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);
  
    // Espaciado para el siguiente bloque
    let startY = 45;
  
    // Información del paciente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('Datos del Paciente', 14, startY);
  
    const patientInfo = [
      ['Nombre del Paciente', e.paciente.nombre || 'N/A'],
      ['Cédula', e.paciente.cedula || 'N/A'],
      ['Teléfono', e.paciente.celular || 'N/A'],
      ['Email', e.paciente.email || 'N/A'],
      ['Edad', e.paciente.edad || 'N/A'],
     
    ];
  
    // Tabla: Datos del paciente
    autoTable(doc, {
      startY: startY + 5,
      body: patientInfo,
      theme: 'grid',
      styles: { fontSize: 12, textColor: textColor },
      columnStyles: { 0: { fontStyle: 'bold', halign: 'left' }, 1: { halign: 'left' } },
      margin: { left: 14, right: 14 },
    });
  
    // Capturar la posición final después de la tabla
    let lastY = (doc as any).lastAutoTable.finalY;
  
    // Información de la receta
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('Detalles de la Receta Médica', 14, lastY + 10);
  
    const recetaInfo = [
      ['Especialidad', e.doctor.especialidad || 'N/A'],
      ['Doctor', e.doctor.nombre || 'N/A'],
      ['Medicamentos recetados y instrucciones', e.medicamentosRecetados|| 'N/A'],
      ['Fecha', new Date().toLocaleDateString()],
      ['Hora', new Date().toLocaleTimeString()],
    ];
  
    // Tabla: Detalles de la receta
    autoTable(doc, {
      startY: lastY + 15,
      body: recetaInfo,
      theme: 'plain',
      styles: { fontSize: 12, textColor: textColor },
      columnStyles: { 0: { fontStyle: 'bold', halign: 'left' }, 1: { halign: 'left' } },
      margin: { left: 14, right: 14 },
    });
  
    // Actualizar la posición final
    lastY = (doc as any).lastAutoTable.finalY;
  
    // Espacio para firma del médico
    doc.line(140, lastY + 20, 190, lastY + 20);
    doc.setFontSize(11);
    doc.text('Firma del Doctor', 165, lastY + 27, { align: 'center' });
  
    // Pie de página con texto en gris suave
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('Este documento es válido como receta médica emitida por Clínica Mesocruz.', 105, pageHeight - 15, { align: 'center' });
    doc.text(`Generado el: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`, 105, pageHeight - 10, { align: 'center' });
  
    // Guardar el archivo PDF
    doc.save(`Receta_${e.paciente.nombre || 'Paciente'}.pdf`);
  }
  
  

}
