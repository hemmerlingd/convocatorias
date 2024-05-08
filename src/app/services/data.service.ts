import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
URL:string;
Sheet_ID:string;

constructor(private http: HttpClient) { 
    //produccion
    this.Sheet_ID = '1xtC5wCysM1lRw9sL1rDmS8VXe6WaDCVdNlfREClHCgo'; 
   //pruebas
  // this.Sheet_ID ='1DA2UkYWi3L7QiEELrF3vOyWhCZ8HURtsVp1jIVQZB98';
  }


  Leer(sheet) {
    this.URL = `https://docs.google.com/spreadsheets/d/${sheet}/gviz/tq?tqx=out:json`;
   return this.http.get(this.URL,{ responseType: 'text' });
  }

  leerMas(sheet){
    this.URL = `https://docs.google.com/spreadsheets/d/${sheet}/gviz/tq?tqx=out:json`;
    return this.http.get(this.URL,{ responseType: 'text' });
  }
}
