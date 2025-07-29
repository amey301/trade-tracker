import { Routes } from '@angular/router';
import { TradeLogComponent } from './components/trade-log/trade-log.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'trade-log',
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
    path: 'homepage',
    component: LandingPageComponent,
    title: 'Landing Page',
  },
  {
    path: '**',
    component: LoginComponent,
  }, // wildcard for 404
];
