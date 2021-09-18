import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { UserRoutingModule } from './user-routing.module';
import { PlanComponent } from './components/plan/plan.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../shared.module';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    PlanComponent,
    LoginComponent,
    CheckoutComponent,
    AccountComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
    
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
  ]
})
export class UserModule { }
