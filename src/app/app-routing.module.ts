import { ElementRef, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
{ path: '', redirectTo: 'convocatorias', pathMatch: 'full' },
// {
//   path: 'convocatorias/llamado',
//   component: AppComponent,
// },
{
  path: 'convocatorias',
  component: AppComponent,
  children:[ 
  {
    path: 'llamado',
    component: AppComponent,
      // children:[
      //   {
      //     path: ':id',
      //     component: AppComponent,
      //   },
      // ]
  },
]
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', 
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
