import { Routes } from '@angular/router';
import { TradeLogComponent } from './components/trade-log/trade-log.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InformationComponent } from './components/information/information.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'log',
    component: TradeLogComponent,
    title: 'Trade Log',
  },
   {
    path: 'login',
    component: LoginComponent,
    title: 'login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'SignUp',
  },
  {
    path: 'info',
    component: InformationComponent,
    title: 'Landing Page',
  },
  {
    path: 'navbar',
    component: NavbarComponent,
    title: 'Trade Log',
  },
  {
    path: '**',
    component: LoginComponent,
  }, // wildcard for 404
];
