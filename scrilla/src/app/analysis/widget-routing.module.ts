import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioOptimizerComponent } from './components/portfolio-optimizer/portfolio-optimizer.component';
import { PriceModelComponent } from './components/price-model/price-model.component';
import { RiskProfileComponent } from './components/risk-profile/risk-profile.component';

const routes: Routes = [
  { path: 'risk', component: RiskProfileComponent },
  { path: 'optimizer', component: PortfolioOptimizerComponent },
  { path: 'pricing', component: PriceModelComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetRoutingModule { }
