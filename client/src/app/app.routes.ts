import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from "./login";
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'login',      component: LoginComponent },
  { path: 'home',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];

