import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './events/event-list/event-list';
import { EventEditComponent } from './events/event-edit/event-edit';
import { RegistrationListComponent } from './registrations/registration-list/registration-list';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'events', component: EventListComponent },
      { path: 'events/add', component: EventEditComponent },
      { path: 'events/edit/:id', component: EventEditComponent },
      { path: 'registrations', component: RegistrationListComponent },
      { path: '', redirectTo: 'events', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }