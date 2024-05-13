import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./views/directory/pages/directory.routes')
      .then(r => r.routes)
  },
 
];
