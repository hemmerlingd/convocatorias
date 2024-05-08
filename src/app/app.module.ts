import { ElementRef, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es-Ar');
import {SwiperModule} from 'swiper/angular'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SwiperModule
  ],
  providers: [
    // { provide: APP_BASE_HREF, useValue: '/convocatorias/'},
    { provide: LOCALE_ID, useValue: "es-AR",},
],
  bootstrap: [AppComponent]
})
export class AppModule { }
