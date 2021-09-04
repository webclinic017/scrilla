import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  { path: 'analysis', loadChildren: () => import('./analysis/analysis.module')
                                                .then(m => m.AnalysisModule) },
  { path: '', component: SplashComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
