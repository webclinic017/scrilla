import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import  { MatCurrencyFormatModule } from 'mat-currency-format';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AllocationComponent } from './components/results/allocation/allocation.component';

import { AnalysisRoutingModule } from './analysis-routing.module';
import { RiskProfileComponent } from './components/widgets/risk-profile/risk-profile.component';
import { PriceModelComponent } from './components/widgets/price-model/price-model.component';
import { PortfolioOptimizerComponent } from './components/widgets/portfolio-optimizer/portfolio-optimizer.component';
import { TickersComponent } from './components/arguments/tickers/tickers.component';
import { ScalarComponent } from './components/arguments/scalar/scalar.component';
import { DateComponent } from './components/arguments/date/date.component';
import { ProfileComponent } from './components/results/profile/profile.component';
import { CorrelationMatrixComponent } from './components/widgets/correlation-matrix/correlation-matrix.component';
import { ConstraintsComponent } from './components/results/constraints/constraints.component';

@NgModule({
  declarations: [
    RiskProfileComponent,
    PriceModelComponent,
    PortfolioOptimizerComponent,
    TickersComponent,
    ScalarComponent,
    DateComponent,
    AllocationComponent,
    ProfileComponent,
    CorrelationMatrixComponent,
    ConstraintsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalysisRoutingModule,

    MatCurrencyFormatModule,
    NgxChartsModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
  ],
  providers: [ DatePipe ]
})
export class AnalysisModule { }