import { Routes } from '@angular/router';
import { HabtsPage } from './features/habts-page/habts-page';

export const routes: Routes = [
  { path: '', redirectTo: 'Habits', pathMatch: 'full' },
  { path: 'Habits', component: HabtsPage },
];
