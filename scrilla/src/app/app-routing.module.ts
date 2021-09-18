import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { PlanComponent } from './user/components/plan/plan.component';
import { CheckoutComponent } from './user/components/checkout/checkout.component';
import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  { path: 'analysis', loadChildren: () => import('./analysis/analysis.module')
                                                .then(m => m.AnalysisModule) },
  { path: '', component: SplashComponent},
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
