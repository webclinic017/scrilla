import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { Portfolio } from 'src/app/models/holding';
import { AnimationProperties, AnimationService, animationControls } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { TickersComponent } from '../../arguments/tickers/tickers.component';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}
const toHeightDuration=350
const toHeightAnimationProperties: AnimationProperties = {
  delay: '', duration: `${toHeightDuration}ms`, easing: ''
}
const modes : any = {
  minimizeVariance: {
    title: 'Minimize Portfolio Volatility',
    param: 'vol'
  },
  minimizeConditionalValueAtRisk: {
    title: 'Minimize Portfolio Conditional Value At Risk',
    param: 'cvar'
  },
  maximizeSharpeRatio: {
    title: 'Maximize Portfolio Sharpe Ratio',
    param: 'sharpe'
  }
}

@Component({
  selector: 'app-portfolio-optimizer',
  templateUrl: './portfolio-optimizer.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getScaleTrigger(1.25),
    AnimationService.getFoldTrigger(foldAnimationProperties),
    AnimationService.getToHeightTrigger(toHeightAnimationProperties),
  ]
})
export class PortfolioOptimizerComponent implements OnInit {
  @ViewChildren('tutorialTooltip')
  public tutorialTooltips !: QueryList<MatTooltip>;
  @ViewChild(TickersComponent)
  public tickerComponent !: TickersComponent;
  
  public modes : any = modes;

  public optimizeBtnAnimationControl = this.animator.initAnimation();
  public tutorialBtnAnimationControl = this.animator.initAnimation();
  public clearBtnAnimationControl = this.animator.initAnimation();
  public inputCardAnimationControl = this.animator.initAnimation();
  public outputCardAnimationControl = this.animator.initAnimation();

  public tickers: string[] = [];
  public targetReturn ?: number;
  public totalInvestment ?: number;
  public dates ?: string[]
  public probability ?: number;
  public expiry ?: number;

  public portfolio?: Portfolio;
  public whichStep?: number;

  public optionalArguments : FormGroup;
  public modeSelection : FormControl;

  constructor(public animator : AnimationService, public api: ApiService,
              public formBuilder : FormBuilder) { 
    this.optionalArguments = this.formBuilder.group({
      target: this.formBuilder.group({ enabled: false }),
      invest: this.formBuilder.group({ enabled: false }),
      date: this.formBuilder.group({ enabled: false })
    })
    this.modeSelection = new FormControl(modes.minimizeVariance);
    this.modeSelection.valueChanges.subscribe( data=>{
      console.log('here is where you would do data stuff when mode changes')
      console.log(data);
    })
  }

  ngOnInit(): void { }

  public step(){
    if(this.whichStep === undefined){ this.whichStep = 0;}
    else{ 
      this.whichStep++;
      if(this.whichStep > this.tutorialTooltips.toArray().length - 1){
        this.whichStep = undefined!;
      } 
    }
    console.log(this.whichStep)
    if(this.whichStep !== undefined){
      this.tutorialTooltips.forEach(element=>{ element.hide(); })
      this.tutorialTooltips.toArray()[this.whichStep].show()
      switch(this.whichStep){
        case 1:
          this.optionalArguments.controls['target'].get('enabled')?.setValue(true)
          break;
        case 2: 
          this.tickerComponent.tickerControl.setValue('ALLY, BX')
      }
    }
    else{
      this.optionalArguments.controls['target'].get('enabled')?.setValue(false);
      this.tickerComponent.tickerControl.setValue('');

    }
  }

  public optimize(){
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
      target: this.targetReturn, invest: this.totalInvestment,
      mode: this.modeSelection.value.param,
      prob: this.probability, expiry: this.expiry
    }
    this.api.optimize(params).subscribe(
      data=>{ 
        this.portfolio = data;  
        this.modeSelection.disable(); this.optionalArguments.disable();
        this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.none);
        setTimeout(()=>{
          this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.full);
        }, toHeightDuration)
      },
      err =>{
        console.log(err);
        // TODO: display error
    })
  }

  public clear(){
    this.portfolio = undefined;
    this.tickers = []; this.targetReturn = undefined;
    this.totalInvestment = undefined; this.dates = undefined;
    this.expiry = undefined; this.probability = undefined;
    this.modeSelection.enable(); this.optionalArguments.enable();
    this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.forty);
    setTimeout(()=>{
      this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.sixty)
    }, toHeightDuration)
  }

  public setTickers(tickers: string[]): void{ 
    console.log('setting tickerss')
    this.tickers = [...this.tickers, ...tickers];
    this.tickers = this.tickers.filter(function(element, index, arr){
      return index == arr.indexOf(element);
    })
  }

  public removeTicker(ticker : string): void{  
    console.log('removing ticker')
    this.tickers.splice(this.tickers.indexOf(ticker), 1); }

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
