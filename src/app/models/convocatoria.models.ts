 export class Convocatoria {
    id_llamado:number;
    fecha_ini:Date;
    hora_ini?:Date;
    fecha_fin?:Date;
    hora_fin?:Date;
    nombre:string;
    tipo:any[];
    descripcion?:string;
    bases:string;
    masInfo:string;
    inscripcion:string;
    precio?:string;
    estado:number;
    resultado?:string;
    imagen?:string;
}