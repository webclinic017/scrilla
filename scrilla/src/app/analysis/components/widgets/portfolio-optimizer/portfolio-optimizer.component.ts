import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}

const modes : any = {
  minimizeVariance: 'Minimize Portfolio Volatility',
  minimizeConditionalValueAtRisk: 'Minimize Portfolio Conditional Value At Risk',
  maximizeSharpeRatio: 'Maximize Portfolio Sharpe Ratio'
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

  public modes : any = modes;

  public optimizeBtnAnimationControl = this.animator.initAnimation()
  public clearBtnAnimationControl = this.animator.initAnimation();

  public tickers: string[] = [];
  public targetReturn ?: number;
  public totalInvestment ?: number;
  public dates ?: string[]
  public probability ?: number;
  public expiry ?: number;

  public optionalArguments : FormGroup;
  public modeSelection : FormControl;

  constructor(public animator : AnimationService, public formBuilder : FormBuilder) { 
    this.optionalArguments = this.formBuilder.group({
      target: this.formBuilder.group({ enabled: false }),
      invest: this.formBuilder.group({ enabled: false }),
      date: this.formBuilder.group({ enabled: false })
    })
    this.modeSelection = new FormControl(modes.minimizeVariance);
    this.modeSelection.valueChanges.subscribe(__=>{
      this.tickers = []; this.targetReturn = undefined;
      this.totalInvestment = undefined; this.dates = undefined;
      this.expiry = undefined; this.probability = undefined;
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

  public setDates(dates : string []): void{ this.dates = dates; }
  
  public removeDates(): void{ this.dates = [] }

  public setTarget(target : number): void{ this.targetReturn = target; }

  public removeTarget(): void{ this.targetReturn = undefined; }

  public setInvestment(investment: number): void{ this.totalInvestment = investment; }

  public removeInvestment(): void { this.totalInvestment = undefined;}

  public setProbability(prob : number): void{ this.probability = prob;}

  public removeProbability(){ this.probability = undefined; }

  public setExpiry(expiry : number){ this.expiry = expiry; }

  public removeExpiry(){ this.expiry = undefined; }
}
