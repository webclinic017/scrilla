import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  { path: 'widgets', loadChildren: () => import('./analysis/widget.module')
                                                .then(m => m.WidgetModule) },
  { path: '', component: SplashComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
