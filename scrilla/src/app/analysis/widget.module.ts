import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { WidgetRoutingModule } from './widget-routing.module';
import { RiskProfileComponent } from './components/risk-profile/risk-profile.component';
import { PriceModelComponent } from './components/price-model/price-model.component';
import { PortfolioOptimizerComponent } from './components/portfolio-optimizer/portfolio-optimizer.component';
import { TickersComponent } from './components/arguments/tickers/tickers.component';
import { ScalarComponent } from './components/arguments/scalar/scalar.component';
import { DateComponent } from './components/arguments/date/date.component';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';



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
    FormsModule,
    ReactiveFormsModule,
    WidgetRoutingModule,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule
  ]
})
export class WidgetModule { }
