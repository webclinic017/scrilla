import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  { path: 'analysis', loadChildren: () => import('./analysis/analysis.module')
                                                .then(m => m.AnalysisModule) },
  { path: 'register', component: RegisterComponent },
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
