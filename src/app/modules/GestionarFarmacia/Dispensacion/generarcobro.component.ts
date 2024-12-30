import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from 'src/services/backend.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-generarcobro',
  templateUrl: './generarcobro.component.html',
  styleUrls: ['./component.css'],
})
export class GenerarCobroComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  cobroForm: FormGroup;
  requestData = {
    nombre: '',
    direccion: '',
    tnTelefono: '',
    tcRazonSocial: '',
    tcCiNit: '',
    tnMonto: 0.01,
    tcCorreo: '',
    tnTipoServicio: 1,
    taPedidoDetalle: [],
  };
  cliente : any;
  allServicios = [
    { "value": 1, "nombre": "PAGO QR" }
  ];
  qrImage: string;
  carrito: any[] = [];
  total: number = 0;

  constructor( private backendService: BackendService,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cobroForm = new FormGroup({
      nombre: new FormControl(''),
      direccion: new FormControl(''),
      tnTelefono: new FormControl('', [Validators.required]),
      tcRazonSocial: new FormControl('', [Validators.required]),
      tcCiNit: new FormControl('', [Validators.required]),
      tnMonto: new FormControl('', [Validators.required]),
      tcCorreo: new FormControl('', [Validators.required, Validators.email]),
      tnTipoServicio: new FormControl('', [Validators.required]),

    });
  }


  public async generarCobro(): Promise<any> {
    try {
      const nroPago = Math.floor(100000 + Math.random() * 900000);
      const lcComerceID = 'd029fa3a95e174a19934857f535eb9427d967218a36ea014b70ad704bc6c8d1c';
      const lnMoneda = 1;
      const { tnTelefono, tcRazonSocial, tcCiNit, tnMonto, tcCorreo, tnTipoServicio} = this.requestData;
      const lcNroPago = nroPago;
      const lcUrlCallBack = `/admin/pagos/callback`;
      const lcUrlReturn = '';

      let lcUrl = '';
      if (tnTipoServicio == 1) {
        lcUrl = 'https://serviciostigomoney.pagofacil.com.bo/api/servicio/generarqrv2';
      } else if (tnTipoServicio === 2) {
        lcUrl = 'https://serviciostigomoney.pagofacil.com.bo/api/servicio/realizarpagotigomoneyv2';
      } else {
        throw new Error('Tipo de servicio no válido');
      }

      const laBody = {
        tcCommerceID: lcComerceID,
        tnMoneda: lnMoneda,
        tnTelefono,
        tcNombreUsuario: tcRazonSocial,
        tnCiNit: tcCiNit,
        tcNroPago: lcNroPago,
        tnMontoClienteEmpresa: tnMonto,
        tcCorreo,
        tcUrlCallBack: lcUrlCallBack,
        tcUrlReturn: lcUrlReturn,
      };

      const response = await axios.post(lcUrl, laBody, {
        headers: { Accept: 'application/json' },
      });

      const laResult = response.data;

      if (!laResult || !laResult.values) {
        return { error: 'Error en la respuesta de la API externa' };
      }

      if (tnTipoServicio == 1) {

        const laValues = laResult.values.split(';');
        const nroTransaccion = laValues[0];
        const qrImageBase64 = JSON.parse(laValues[1]).qrImage;
        console.log(nroTransaccion);
        this.qrImage = "data:image/png;base64," + qrImageBase64;
       await this.crearCliente();
        this.crearVenta(nroTransaccion);
        this.crearPago(nroTransaccion);
        Swal.fire({
          title: 'Código QR',
          html: `<div style="text-align: center;">
                   <p>¡Cobro creado exitosamente!</p>
                   <img src="${this.qrImage}" alt="Código QR" style="width: 300px; height: 300px;" />
                 </div>`,
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        this.consultar(nroTransaccion);
      } else if (tnTipoServicio === 2) {
        const nroTransaccion = laResult.values;
        return {
          success: true,
          nroTransaccion,
        };
      }

    } catch (error: any) {
      console.error('Error al generar cobro:', error);
      return { error: 'Error en el proceso de cobro', details: error.message };
    }
  }



consultar = (nroTransaccion: string) => {
  const intervalID = setInterval(async () => {
    try {
      console.log('Consultando el estado de la transacción:', nroTransaccion);
      const response = await this.consultartransaccion(nroTransaccion);
      console.log('Response:', response.trim());
      if (response.trim() == "COMPLETADO-PROCESADO") {
        clearInterval(intervalID);
        this.updateVenta(nroTransaccion);
        Swal.fire({
          title: '',
          text: '¡La transacción se ha completado con éxito!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
      }
    } catch (error) {
      console.error('Error al consultar la transacción:', error);
      clearInterval(intervalID);
    }
  }, 10000);
};


updateVenta(numerotransaccion:any) {
  const Data= JSON.stringify({
    "id":numerotransaccion,
    "estado":"2",
  });
  console.log('Datos convertidos a JSON:', Data);
  this.backendService.updateVenta(Data)?.subscribe((res: any) => {
    console.log('status:', res);
  });
}

  crearCliente(): Promise<any> {
    return new Promise((resolve, reject) => {
      const Data = JSON.stringify({
        "nombre": this.requestData.nombre,
        "cedula": this.requestData.tcCiNit,
        "email": this.requestData.tcCorreo,
        "celular": this.requestData.tnTelefono,
        "direccion": this.requestData.direccion
      });

      this.backendService.createCliente(Data)?.subscribe(
        async (res: any) => {
          this.cliente = res;
          console.log("Cliente creado:", this.cliente);
          resolve(this.cliente);
        },
        (err) => {
          console.error("Error al crear cliente:", err);
          reject(err);
        }
      );
    });
  }


  crearPago(numerotransaccion:string) {
    const fechaActual = new Date().toISOString();
    const Data = JSON.stringify({
      "id": numerotransaccion,
      "metodopago": "1", // Qr
      "fecha": fechaActual,
      "estado": "1" //1 = no cancelado . 2 = cancelado
    });
    this.backendService.createPago(Data)?.subscribe(async (res: any) => {
      console.log(res);
      return res;
   }, err => {
     console.log(err);

   })
  }

  async crearVenta(numerotransaccion) {
    try {
      const cliente = await this.crearCliente();

      const fechaActual = new Date().toISOString();
      const Data = JSON.stringify({
        "id": numerotransaccion,
        "cliente": cliente,
        "metodopago": "1", // Qr
        "fecha": fechaActual,
        "total": this.requestData.tnMonto,
        "estado": "1", // 1 = no cancelado , 2 = cancelado
      });

      this.backendService.createVenta(Data)?.subscribe(
        (res: any) => {
          console.log("Venta creada:", res);
        },
        (err) => {
          console.error("Error al crear venta:", err);
        }
      );
    } catch (error) {
      console.error("Error en el proceso de creación de cliente o venta:", error);
    }
  }


  async consultartransaccion(numerotransaccion: any): Promise<string> {
    if (!numerotransaccion) {
        throw new Error('venta_id no proporcionado');
    }

    const urlEstadoTransaccion = 'https://serviciostigomoney.pagofacil.com.bo/api/servicio/consultartransaccion';
    const headersEstadoTransaccion = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const bodyEstadoTransaccion = {
        TransaccionDePago: numerotransaccion
    };

    try {
        const response = await fetch(urlEstadoTransaccion, {
            method: 'POST',
            headers: headersEstadoTransaccion,
            body: JSON.stringify(bodyEstadoTransaccion)
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const resultEstadoTransaccion = await response.json();
        console.debug('Respuesta de la API:', resultEstadoTransaccion);
        if (
            resultEstadoTransaccion &&
            resultEstadoTransaccion.values &&
            resultEstadoTransaccion.values.messageEstado
        ) {
            const cadenaCompleta = resultEstadoTransaccion.values.messageEstado;
            const elementos = cadenaCompleta.split(' - ');

            if (elementos.length >= 2) {
                const textoExtraido = `${elementos[0]}-${elementos[1]}`;
                return textoExtraido;
            } else {
                console.warn('Formato inesperado en messageEstado:', cadenaCompleta);
                return 'Error: Formato inesperado';
            }
        }
        console.warn('Estructura de respuesta inesperada:', resultEstadoTransaccion);
        return 'Error: Respuesta inválida de la API';
    } catch (error) {
        console.error('Error procesando la solicitud:', error);
        return `Error al procesar la solicitud: ${error.message}`;
    }
}
}
