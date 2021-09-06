import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(foldAnimationProperties)
  ]
})
export class RiskProfileComponent implements OnInit {

  public tickers ?: string[];
  public dates ?: string[]

  public optionalArguments : FormGroup;
  
  constructor(public formBuilder : FormBuilder) { 
    this.optionalArguments = this.formBuilder.group({
      date: this.formBuilder.group({ enabled: false })
    })
  }

  ngOnInit(): void {
  }

  public setTickers(tickers: string[]){ this.tickers = tickers; }
  
  public removeTickers(){ this.tickers = []}

  public setDates(dates : string[]){ this.dates = dates}

  public removeDates(){ this.dates = undefined; }
}
