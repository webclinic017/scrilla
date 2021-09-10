import { FormBuilder, FormGroup } from "@angular/forms";
import { AnimationControl, AnimationProperties, AnimationService } from "src/app/services/animations.service";
import { ApiService } from "src/app/services/api.service";

export class Widget{

    public static foldAnimationProperties : AnimationProperties= {
        delay: '', duration: '250ms', easing: ''
      }
    public static toHeightDuration : number=350
    public static toHeightAnimationProperties: AnimationProperties = {
        delay: '', duration: `${Widget.toHeightDuration}ms`, easing: ''
    }
    public static scaleFactor : number=1.25;

    public tickers: string[] = [];
    public targetReturn ?: number;
    public totalInvestment ?: number;
    public dates ?: string[]
    public probability ?: number;
    public expiry ?: number;

    public inputCardAnimationControl : AnimationControl = this.animator.initAnimation();
    public outputCardAnimationControl : AnimationControl = this.animator.initAnimation();
  
    public optionalArguments : FormGroup;

    constructor(public animator : AnimationService, public api: ApiService,
              public formBuilder : FormBuilder) { 
        this.optionalArguments = this.formBuilder.group({
            target: this.formBuilder.group({ enabled: false }),
            invest: this.formBuilder.group({ enabled: false }),
            date: this.formBuilder.group({ enabled: false })
        })
    }

    public setTickers(tickers: string[]): void{ 
        this.tickers = [...this.tickers, ...tickers];
        this.tickers = this.tickers.filter(function(element, index, arr){
          return index == arr.indexOf(element);
        })
    }

    public removeTicker(ticker : string): void{  this.tickers.splice(this.tickers.indexOf(ticker), 1); }
    
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