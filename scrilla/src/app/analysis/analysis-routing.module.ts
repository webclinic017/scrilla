import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrelationMatrixComponent } from './components/widgets/correlation-matrix/correlation-matrix.component';
import { PortfolioOptimizerComponent } from './components/widgets/portfolio-optimizer/portfolio-optimizer.component';
import { PriceModelComponent } from './components/widgets/price-model/price-model.component';
import { RiskProfileComponent } from './components/widgets/risk-profile/risk-profile.component';

const routes: Routes = [
  { path: 'risk', component: RiskProfileComponent },
  { path: 'optimizer', component: PortfolioOptimizerComponent },
  { path: 'optimizer/:tutorial', component: PortfolioOptimizerComponent },
  { path: 'pricing', component: PriceModelComponent },
  { path: 'correlation', component: CorrelationMatrixComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
