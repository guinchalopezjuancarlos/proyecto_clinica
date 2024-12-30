export class Reminder {
    id?: string;
    fecha: Date;
  horario: string;
  paciente: any;
    creationDate: Date;

    constructor(
        date: string | Date = new Date(),
        horario: string = '',

    ) {
        this.fecha = typeof (date) === 'string' ? new Date(date) : date;
        if (horario) {
            this.horario = horario;
            this.creationDate = new Date();
        }
    }

}


