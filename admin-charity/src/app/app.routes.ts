import { Routes } from '@angular/router';

export const routes: Routes = [


  {
    path: 'admin',
    children: [
      {
        path: 'events',
        loadComponent: () => import('./admin/events/event-list/event-list')
          .then(m => m.EventListComponent)
      },
      {
        path: 'events/add',
        loadComponent: () => import('./admin/events/event-edit/event-edit')
          .then(m => m.EventEditComponent)
      },
      {
        path: 'events/edit/:id',
        loadComponent: () => import('./admin/events/event-edit/event-edit')
          .then(m => m.EventEditComponent)
      },
      { path: '', redirectTo: 'events', pathMatch: 'full' }
    ]
  },
  // 3. 根路径直接重定向到管理页（而非登录页）
  { path: '', redirectTo: 'admin', pathMatch: 'full' }
];