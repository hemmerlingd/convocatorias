import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { Convocatoria } from './models/convocatoria.models';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperOptions, Pagination, Navigation } from 'swiper';
import  { SwiperComponent } from 'swiper/angular';
import {Location} from '@angular/common';
import { environment } from './environments/environment';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  detalleActividad:boolean=false;
  actividadesList:Convocatoria[]=[];
  actividadesListHoy:Convocatoria[]=[];
  tiposList:any[]=[];
  tipos:any[]=[];
  sigue:boolean = false;
  sigueP:boolean = false;
  pageSize:number=6;
  actividadesPermanentesList:Convocatoria[]=[];
  actividadesPermanentesListO:Convocatoria[]=[];
  Actividad:Convocatoria[]=[];
  filtroActividades:Convocatoria[]=[];
  All:Convocatoria[]=[];
  strFiltro:string= "";
  tipo:string= "Categorías";
  BandCategoria:boolean =false;
  sheetID: string;
  sheet:string;
  bandPermanentes:boolean=false;
  bandSheet:string;
  error:boolean= true;
  UrlActual:string;
  spiner:boolean
  valEstado: number = 1;

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 1,
    modules: [ Navigation, Pagination ],
    autoHeight: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: { clickable: true, dynamicBullets: true },
    loop: true,
    breakpoints:{
      2000: {
        slidesPerView: 3,
        grid: {
            rows: 1,
            fill: 'row'
            }
        },
      1380: {
        slidesPerView: 3,
        grid: {
            rows: 1,
            fill: 'row'
            }
        },
        1036: {
          slidesPerView: 2,
          grid: {
              rows: 1,
              fill: 'row'
              }
          },
        748: {
          slidesPerView: 1,
          spaceBetween: 10,
          grid: {
              rows: 1,
              fill: 'row'
              }
          },      
  }

  };
  slideNext(){
    this.swiper.swiperRef.slideNext(100);
    
  }
  slidePrev(){
    this.swiper.swiperRef.slidePrev(100);
  }


  constructor(private doc: DataService, public route: Router, private elementRef:ElementRef,private _location: Location) {
    
    this.sheetID = this.elementRef.nativeElement.getAttribute('sheetID');
    if ( this.sheetID != "") {
      this.error = false
    }
    this.bandPermanentes = this.elementRef.nativeElement.getAttribute('permanentes');
   // console.log(this.bandPermanentes);

    

   }
   borrarFiltro(){
    this.tipo="Categorías";
    this.estado(this.valEstado);
    this.Filtro();
   }

   Filtro(){
   
    let band;
    this.categoria();
    this.filtroActividades=this.actividadesList.filter(obj => {
      if(this.route.routerState.snapshot.url == '/'){
        this.tipo="Categorías";
        band = true
        this.estado(this.valEstado)
       }else{
        obj.tipo.forEach(f =>{
          band = f.toLowerCase() == this.tipo.toLowerCase();
        }) 
        this.estado(this.valEstado)
     }
      const term = this.strFiltro.toLowerCase();
      this.spiner=false;
      if(term !=""){
        return band  && (obj.nombre?.toLowerCase().includes(term) || obj.descripcion?.toLowerCase().includes(term) ) && obj.estado == this.valEstado ;
      }else{
        return obj.estado == this.valEstado
      }
    });
 }

 categoria(){
  this.spin();
  this.filtroActividades=this.actividadesList.filter(obj => {
  if(this.tipo == "Categorías"){
    this.estado(this.valEstado)
    return this.filtroActividades
  }else{
    const term = this.tipo.toLowerCase();
    // console.log(this.tipo.toLowerCase());
    return obj.tipo.some(f => f.toLowerCase().includes(term) && obj.estado == this.valEstado);
  }
  });
}

estado(e){
  this.valEstado = e;
  this.spin();
  this.strFiltro ="";
  this.tipo="Categorías";
 // this.Filtro();
  this.filtroActividades=this.actividadesList.filter(obj => {
    return obj.estado == this.valEstado;
  });
}

  ngOnInit() {
    this.spin();
    this.bandPermanentes = this.elementRef.nativeElement.getAttribute('permanentes');
    this.bandSheet = this.elementRef.nativeElement.getAttribute('leermas');
    this.doc.Leer(this.sheetID).subscribe((respuesta)=>{      
      this.formatData(respuesta);
   })
// switch (this.bandSheet) {
//   case 'cultura':
//       this.sheet = '1EiJKCSHZ1X1S1kVrmdVj2cbnQqQc7SmXCRh-tLl_xc8'
//       this.doc.leerMas(this.sheet).subscribe((respuesta)=>{      
//         this.formatData(respuesta);
//      })
//     break;

//   default:
//     break;
// }
  
   this.spiner=false;

  }
formatData(respuesta){
  let data = JSON.parse(respuesta.toString().substring(47, respuesta.length - 2));
  data.table.rows.forEach((actividad, index)=> {
  //  console.log(actividad);
    if (!actividad.c[0]) {
      return
    }

    let fechafin = this.process(actividad.c[2]?.f).toJSON().split("T");
    let hoy =new Date().toJSON();
    let compare = hoy.split("T");
    if(  actividad.c[11]?.v.split("-")[0].trim() >0){
        this.tipos =[];
        let temp= actividad.c[5]?.v.split(",");
        temp.forEach(tipo => {
          this.tipos.push(tipo.trim());
        });
        const actividades: Convocatoria= {
           id_llamado: index,
           fecha_ini : actividad.c[0]?.f,
           hora_ini: actividad.c[1]?.f,
           fecha_fin: actividad.c[2]?.f,
           hora_fin: actividad.c[3]?.f,
           nombre: actividad.c[4]?.v,             
           tipo: this.tipos,
           descripcion: actividad.c[6]?.v,
           bases: actividad.c[7]?.v,
           masInfo: actividad.c[8]?.v,
           inscripcion: actividad.c[9]?.v,
           precio: actividad.c[10]?.v,
           estado: actividad.c[11]?.v.split(" - ")[0].trim(),
           resultado: actividad.c[12]?.v,
           imagen: actividad.c[13]?.v
          };
         this.All.push(actividades);
        if(actividades.estado != 0){
            if( fechafin[0] == compare[0] ){
            this.actividadesListHoy.push(actividades)
            }else{
              this.actividadesList.push(actividades)
            }
            actividades.tipo.forEach(tl =>{
              if( !this.tiposList?.includes(tl)){
                this.tiposList.push(tl);   
              }
            })
          }
      }
  });


  let ordenadas = this.actividadesList.sort(
    (p1, p2) => (this.process(p1.fecha_ini) > this.process(p2.fecha_ini)) ? 1 : (this.process(p1.fecha_ini) < this.process(p2.fecha_ini)) ? -1 : 0);

    let HoyPrimero = this.actividadesListHoy.concat(ordenadas)
// console.log(this.actividadesListHoy, ordenadas, this.actividadesList);
 
    this.filtroActividades=HoyPrimero;
   // console.log(this.filtroActividades);
   this.actividadesList =this.filtroActividades;
this.estado(1);
    //URL CATEGORIA ESPECIFICA
    if(this.route.routerState.snapshot.url != '/'){
      if (this.route.routerState.snapshot.url?.includes("/?")) {
        this.tipo= decodeURIComponent(this.route.routerState.snapshot.url?.split("/?")[1].slice(0,-1));
        
        console.log(this.tiposList);
        var url = this.tiposList.filter(obj => {
          const term =  decodeURIComponent(this.tipo.toLowerCase());              
         // console.log(obj.toLowerCase().includes(term), decodeURIComponent(term), obj);
          return obj.toLowerCase().includes(term);
        });
        console.log(url[0],this.tipo.toLowerCase(),url[0].toLowerCase() == this.tipo.toLowerCase());
        
        if(url[0].toLowerCase() == this.tipo.toLowerCase()){
          this.categoria();
          this.BandCategoria = true;
          this.bandPermanentes =false;
        }else{
          this.tipo = "Categorías";
        }
      }else if(this.route.routerState.snapshot.url?.includes("/llamado")){
      console.log(this.route.routerState.snapshot.url);

   //     console.log('es evento',this.route.routerState.snapshot.url.split('/evento')[1]);
        this.detalleActividad=true;
        this.abrirDetalle(this.route.routerState.snapshot.url.split('/llamado?id=')[1]) 
              
      }  
  }
}

spin(){
  setTimeout(() => {
    this.spiner = true;
  }, 2000);
}
mas(){
  this.pageSize = this.pageSize+6;
}

 

   process(date){
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  esHoy(fecha_evento){
    let fecha = this.process(fecha_evento).toJSON().split("T");
    let hoy =new Date().toJSON();
    let compare = hoy.split("T");
    
    return fecha[0] == compare[0];
  
  }

  volver(){
    this.detalleActividad = false;
    this._location.back();
  }
  
  abrirDetalle(id) {
    this.route.navigate(['convocatorias/llamado'], { queryParams: { id: id } });
    this.detalleActividad = true;
    this.Actividad = this.All.filter(act => act.id_llamado == id);
    let u = document.location.href.split('llamado')
    
    if (u.length >1) {
      this.UrlActual= document.location.href
    }else{
    this.UrlActual= document.location.href + 'llamado?id='+id;
    }
  }
 

copiarAlPortapapeles(url) {
  var aux = document.createElement("input");
  aux.setAttribute("value", url);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}


}
