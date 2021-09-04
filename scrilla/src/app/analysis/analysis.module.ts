import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AnalysisRoutingModule } from './analysis-routing.module';
import { RiskProfileComponent } from './components/widgets/risk-profile/risk-profile.component';
import { PriceModelComponent } from './components/widgets/price-model/price-model.component';
import { PortfolioOptimizerComponent } from './components/widgets/portfolio-optimizer/portfolio-optimizer.component';
import { TickersComponent } from './components/arguments/tickers/tickers.component';
import { ScalarComponent } from './components/arguments/scalar/scalar.component';
import { DateComponent } from './components/arguments/date/date.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AllocationComponent } from './components/results/allocation/allocation.component';



@NgModule({
  declarations: [
    RiskProfileComponent,
    PriceModelComponent,
    PortfolioOptimizerComponent,
    TickersComponent,
    ScalarComponent,
    DateComponent,
    AllocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalysisRoutingModule,

    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatTooltipModule,
  ]
})
export class AnalysisModule { }
