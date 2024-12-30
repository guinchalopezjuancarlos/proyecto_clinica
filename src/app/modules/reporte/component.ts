import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})

export class ReporteComponent implements OnInit {
  consultaSeleccionada: string = 'citasDoctor';
  ventas: any[] = [];
  doctores: any[] = [];
  doctorCitas: any[] = [];
  citasMedicas: any[] = [];  // Cambio el nombre a citasMedicas
  medicamentos: any[] = [];
  ventasPorDia: any[] = [];
  ventasPorRango: any[] = [];
  citasPorRango: any[] = [];
  citasPorProducto: any[] = [];
  citasPorPaciente: any[] = [];
  ventasPorCliente: any[] = [];
  citasPorEstado: any[] = [];
  citasPorDoctorYFecha: any[] = [];
  citaSeleccionada: any = {};
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaInicioCita: string = '';
  fechaFinCita: string = '';
  fechaInicioProducto: string = '';
  fechaFinProducto: string = '';
  fechaInicioCliente: string = '';
  fechaFinCliente: string = '';
  fechaInicioDoctor: string = '';
  fechaFinDoctor: string = '';
  doctorSeleccionado: string = '';
  pacienteSeleccionado: string = '';
  productoSeleccionado: string = '';
  clienteSeleccionado: string = '';
  estadoCitaSeleccionado: string = '';
  openSections: { [key: string]: boolean } = {
    citasDoctor: false,
    ventasRango: false,
    citasRango: false,
    ventasProducto: false,
    citasPaciente: false,
    ventasCliente: false,
    citasEstado: false,
    citasDoctorFecha: false
  };

  constructor(private backendService: BackendService) { }

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  ngOnInit(): void {
    this.loadDataVentas();
    this.loadDataDoctores();
    this.loadDataCitasMedicas();
    this.loadDataMedicamentos();
  }

  // Verificación para obtener citas por doctor
  getCitasPorDoctor(): void {
    if (this.doctorSeleccionado) {
      this.doctorCitas = this.citasMedicas.filter(cita => cita.doctor.id === this.doctorSeleccionado);
    }
  }

  // Función corregida para obtener citas por producto en un rango de fechas
  getVentasPorProducto(fechaInicio: string, fechaFin: string, productoSeleccionado: string): void {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    this.citasPorProducto = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return venta.producto.id === productoSeleccionado && fechaVenta >= fechaInicioDate && fechaVenta <= fechaFinDate;
    });
  }

  // Función corregida para obtener citas por paciente
  getCitasPorPaciente(): void {
    if (this.pacienteSeleccionado) {
      this.citasPorPaciente = this.citasMedicas.filter(cita => cita.paciente.id === this.pacienteSeleccionado);
    }
  }

  // Función corregida para obtener ventas por cliente en un rango de fechas
  getVentasPorCliente(fechaInicio: string, fechaFin: string, clienteSeleccionado: string): void {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    this.ventasPorCliente = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return venta.cliente.id === clienteSeleccionado && fechaVenta >= fechaInicioDate && fechaVenta <= fechaFinDate;
    });
  }

  // Corregido para obtener citas por estado
  getCitasPorEstado(): void {
    if (this.estadoCitaSeleccionado) {
      this.citasPorEstado = this.citasMedicas.filter(cita => cita.estado === this.estadoCitaSeleccionado);
    }
  }

  // Corregido para obtener citas por doctor y fecha
  getCitasPorDoctorYFecha(): void {
    const fechaInicioDate = new Date(this.fechaInicioDoctor);
    const fechaFinDate = new Date(this.fechaFinDoctor);
    if (this.doctorSeleccionado) {
      this.citasPorDoctorYFecha = this.citasMedicas.filter((cita) => {
        const fechaCita = new Date(cita.fecha);
        return cita.doctor.id === this.doctorSeleccionado && fechaCita >= fechaInicioDate && fechaCita <= fechaFinDate;
      });
    }
  }

  seleccionarCita(cita: any): void {
    this.citaSeleccionada = { ...cita };
  }

  // Carga de datos y validación de errores
  loadDataMedicamentos(): void {
    this.backendService.getMedicamentos().pipe(
      catchError(error => {
        console.error('Error al obtener medicamentos', error);
        return of([]);  // Retorna un array vacío en caso de error
      })
    ).subscribe(data => {
      this.medicamentos = data.map((medicamento: any) => ({
        ...medicamento,
        id: medicamento.id.toString()
      }));
      console.log(this.medicamentos);
    });
  }

  loadDataDoctores(): void {
    this.backendService.getDoctores().pipe(
      catchError(error => {
        console.error('Error al obtener doctores', error);
        return of([]);  // Retorna un array vacío en caso de error
      })
    ).subscribe(data => {
      this.doctores = data.map((doctor: any) => ({
        ...doctor,
        id: doctor.id.toString()
      }));
      console.log(this.doctores);
    });
  }

  loadDataVentas(): void {
    this.backendService.getVentas().pipe(
      catchError(error => {
        console.error('Error al obtener ventas', error);
        return of([]);  // Retorna un array vacío en caso de error
      })
    ).subscribe(data => {
      this.ventas = data.map((venta: any) => ({
        ...venta,
        id: venta.id.toString()
      }));
      console.log(this.ventas);
    });
  }

  loadDataCitasMedicas(): void {
    this.backendService.getCitasMedicas().pipe(
      catchError(error => {
        console.error('Error al obtener citas médicas', error);
        return of([]);  // Retorna un array vacío en caso de error
      })
    ).subscribe(data => {
      this.citasMedicas = data.map((citamedica: any) => ({
        ...citamedica,
        id: citamedica.id.toString()
      }));
      console.log(this.citasMedicas);
    });
  }

  getVentasPorRangoFecha(fechaInicio: string, fechaFin: string): void {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    this.ventasPorRango = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta >= fechaInicioDate && fechaVenta <= fechaFinDate;
    });
  }

  getCitasPorRangoFecha(fechaInicio: string, fechaFin: string): void {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    this.citasPorRango = this.citasMedicas.filter((cita) => {
      const fechaCita = new Date(cita.fecha);
      return fechaCita >= fechaInicioDate && fechaCita <= fechaFinDate;
    });
  }
}