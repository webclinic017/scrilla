import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Portfolio } from 'src/app/models/holding';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { ScalarComponent } from '../../arguments/scalar/scalar.component';
import { TickersComponent } from '../../arguments/tickers/tickers.component';
import { Widget } from '../widget';

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

const flashOn = "#BA68C8"
const flashOff = "#7B1FA2"
const flashAnimationProperties : AnimationProperties = {
  delay: '', duration: '3000ms', easing: ''
}
@Component({
  selector: 'app-portfolio-optimizer',
  templateUrl: './portfolio-optimizer.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
    AnimationService.getFlashTrigger(flashOn, flashOff, flashAnimationProperties),
    AnimationService.getOpacityTrigger()
  ]
})
export class PortfolioOptimizerComponent extends Widget implements OnInit {
  
  @ViewChildren('tutorialTooltip')
  public tutorialTooltips !: QueryList<MatTooltip>;

  @ViewChild('targetInput')
  public targetComponent !: ScalarComponent;
  @ViewChild(TickersComponent)
  public tickerComponent !: TickersComponent;
  
  public modes : any = modes;

  public tutorialBtnAnimationControl = this.animator.initAnimation();

  public portfolio?: Portfolio;
  public whichStep?: number;

  public loading : boolean = false;
  public modeSelection : FormControl;

  constructor(public animator : AnimationService, public api: ApiService,
              public formBuilder : FormBuilder, public router: Router, 
              public route: ActivatedRoute) {
                super(animator, api, formBuilder, router, route);
    this.modeSelection = new FormControl(modes.minimizeVariance);
  }

  ngOnInit(): void { 
    
  }

  ngAfterViewInit(): void{
    setTimeout(()=>{
      if(this.route.snapshot.paramMap.get('tutorial')){
        this.stepTutorial();
        setTimeout(()=>{
          this.tutorialBtnAnimationControl = this.animator.animateFlash();
        }, 500)
      }
    }, 1000)
  }

    // yes, this is ugly
  public stepTutorial(){
    if(this.whichStep === undefined){ this.whichStep = 0;}
    else{ 
      this.whichStep++;
       // # of viewchildren + extra viewchilds
      if(this.whichStep > this.tutorialTooltips.toArray().length){
        this.whichStep = undefined!;
      } 
    }
    if(this.whichStep !== undefined){
      this.tutorialTooltips.forEach(element=>{ element.hide(); })
        // order of tutorialTooltips is determined by DOM insertion order;
        // the disconnect between the index and the state, as seen in the 
        // the following switch statement, is due to this fact. The last
        // tutorialTooltip, the optimize button, is inserted into the DOM,
        // ahead of the other tutorialTooltips, so the switch statement
        // has to be careful what element of the array it is modifying.

        // i rememebr having an idea on how to simplify this, but i forget what 
        // it was. i think it had something with ...nope, i forget. 
      switch(this.whichStep){
        case 0:
          this.tutorialTooltips.toArray()[1].disabled = false;
          this.tutorialTooltips.toArray()[1].show()
          break;
        case 1:
          this.tutorialTooltips.toArray()[1].disabled = true;
          this.tutorialTooltips.toArray()[2].disabled = false;
          this.tutorialTooltips.toArray()[2].show()
          this.optionalArguments.controls['target'].get('enabled')?.setValue(true)
          break;
        case 2: 
          this.tutorialTooltips.toArray()[2].disabled = true;
          this.tutorialTooltips.toArray()[3].disabled = false;
          this.tutorialTooltips.toArray()[3].show()
          this.tickerComponent.tickerControl.setValue('SPY, GLD, BTC')
          this.tickerComponent.tickerControl.markAsTouched();
          break;
        case 3:
          this.tutorialTooltips.toArray()[3].disabled = true;
          this.tickerComponent.tickerTutorial.disabled = false;
          this.tickerComponent.tickerTutorial.show();
          this.tickerComponent.addAnimationControl = this.animator.animateScale();          
          break;
        case 4:
          this.tickerComponent.parseTickers();
          this.tickerComponent.addAnimationControl = this.animator.initAnimation();
          this.tickerComponent.tickerTutorial.disabled = true;
          this.tutorialTooltips.toArray()[4].disabled = false;
          this.tutorialTooltips.toArray()[4].show()
          this.targetComponent.scalarControl.setValue(0.12)
          this.targetComponent.scalarControl.markAsTouched();
          this.targetComponent.addAnimationControl = this.animator.animateScale();
          break;
        case 5:
          this.targetComponent.parseScalar();
          this.targetComponent.addAnimationControl = this.animator.initAnimation();
          this.calcBtnAnimationControl = this.animator.animateScale();
          this.tutorialTooltips.toArray()[4].disabled = true;
          this.tutorialTooltips.toArray()[0].disabled = false;
          this.tutorialTooltips.toArray()[0].show()
          break;

      }
    }
    else{
      this.optionalArguments.controls['target'].get('enabled')?.setValue(false);
      this.tutorialTooltips.toArray()[0].disabled = true;
      this.tickerComponent.tickerControl.setValue('');
      this.targetComponent.scalarControl.setValue(undefined)
      this.calculate();
    }
  }

  public calculate(){
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
      target: this.targetReturn, invest: this.totalInvestment,
      mode: this.modeSelection.value.param,
      prob: this.probability, expiry: this.expiry
    }
    this.loading = true;
    this.api.optimize_portfolio(params).subscribe(
      data=>{ 
        this.portfolio = data;  
        this.modeSelection.disable();
        this.loading = false;
        super.animateCalculate();
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
    this.modeSelection.enable(); 
    super.animiateClear();
  }
  
}
