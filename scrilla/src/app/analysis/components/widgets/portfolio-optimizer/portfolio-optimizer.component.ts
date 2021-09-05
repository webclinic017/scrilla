import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}

@Component({
  selector: 'app-portfolio-optimizer',
  templateUrl: './portfolio-optimizer.component.html',
  styleUrls: ['./portfolio-optimizer.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.25),
    AnimationService.getFoldTrigger(foldAnimationProperties)
  ]
})
export class PortfolioOptimizerComponent implements OnInit {

  public optimizeBtnAnimationControl = this.animator.initAnimation()
  public clearBtnAnimationControl = this.animator.initAnimation();

  public tickers : string[] = [];
  public targetReturn ?: number;
  public totalInvestment ?: number;
  public dates ?: string[]
  public optionalArguments : FormGroup;

  constructor(public animator : AnimationService, public formBuilder : FormBuilder) { 
    this.optionalArguments = this.formBuilder.group({
      target: this.formBuilder.group({ enabled: false }),
      invest: this.formBuilder.group({ enabled: false }),
      date: this.formBuilder.group({ enabled: false })
    })
  }

  ngOnInit(): void { }

  public setTickers(tickers: string[]): void{ 
    this.tickers = [...this.tickers, ...tickers];
    this.tickers = this.tickers.filter(function(element, index, arr){
      return index == arr.indexOf(element);
    })
  }

  public removeTicker(ticker : string): void{ 
    this.tickers.splice(this.tickers.indexOf(ticker), 1); 
  }

  public setDates(dates : string []){ this.dates = dates; }
  
  public removeDates(){ this.dates = [] }

  public setTarget(target : number){ this.targetReturn = target; }

  public removeTarget(){ this.targetReturn = undefined; }

  public setInvestment(investment: number){ this.totalInvestment = investment; }

  public removeInvestment() { this.totalInvestment = undefined;}
}
