import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetRoutingModule } from './widget-routing.module';
import { RiskProfileComponent } from './components/risk-profile/risk-profile.component';
import { PriceModelComponent } from './components/price-model/price-model.component';
import { PortfolioOptimizerComponent } from './components/portfolio-optimizer/portfolio-optimizer.component';
import { TickersComponent } from './components/arguments/tickers/tickers.component';
import { ScalarComponent } from './components/arguments/scalar/scalar.component';
import { DateComponent } from './components/arguments/date/date.component';


@NgModule({
  declarations: [
    RiskProfileComponent,
    PriceModelComponent,
    PortfolioOptimizerComponent,
    TickersComponent,
    ScalarComponent,
    DateComponent
  ],
  imports: [
    CommonModule,
    WidgetRoutingModule
  ]
})
export class WidgetModule { }
