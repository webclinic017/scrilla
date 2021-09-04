import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioOptimizerComponent } from './components/widgets/portfolio-optimizer/portfolio-optimizer.component';
import { PriceModelComponent } from './components/widgets/price-model/price-model.component';
import { RiskProfileComponent } from './components/widgets/risk-profile/risk-profile.component';

const routes: Routes = [
  { path: 'risk', component: RiskProfileComponent },
  { path: 'optimizer', component: PortfolioOptimizerComponent },
  { path: 'pricing', component: PriceModelComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
