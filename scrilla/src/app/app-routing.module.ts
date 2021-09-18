import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlanComponent } from './components/plan/plan.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  { path: 'analysis', loadChildren: () => import('./analysis/analysis.module')
                                                .then(m => m.AnalysisModule) },
  { path: 'plan', component: PlanComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent}, 
  { path: '', component: SplashComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
