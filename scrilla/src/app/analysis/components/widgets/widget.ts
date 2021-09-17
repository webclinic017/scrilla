import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { AnimationControl, animationControls, AnimationProperties, AnimationService } from "src/app/services/animations.service";
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
    public dates?: string[];
    public probability ?: number;
    public expiry ?: number;

    public inputCardAnimationControl : AnimationControl = this.animator.initAnimation();
    public outputCardAnimationControl : AnimationControl = this.animator.initAnimation();
    public clearBtnAnimationControl = this.animator.initAnimation();
    public calcBtnAnimationControl = this.animator.initAnimation();

    public optionalArguments : FormGroup;

    constructor(public animator : AnimationService, public api: ApiService,
                public formBuilder : FormBuilder, public router : Router,
                public route : ActivatedRoute) { 
        this.optionalArguments = this.formBuilder.group({
            target: this.formBuilder.group({ enabled: false }),
            invest: this.formBuilder.group({ enabled: false }),
            date: this.formBuilder.group({ enabled: false })
        })
        
        let route_tickers = this.route.snapshot.queryParamMap.get('tickers');
        if(route_tickers){ this.tickers = JSON.parse(route_tickers);}
        let route_start = this.route.snapshot.queryParamMap.get('start')
        if(route_start) { 
            if(!this.dates){ this.dates = []}
            this.dates[0] = route_start; 
        }
        let route_end = this.route.snapshot.queryParamMap.get('end')
        if(route_end) { 
            if(!this.dates){ this.dates = []}
            this.dates[1] = route_end; 
        }
        let route_target = this.route.snapshot.queryParamMap.get('target')
        if(route_target){ this.targetReturn = parseFloat(route_target);}
        let route_invest = this.route.snapshot.queryParamMap.get('invest')
        if(route_invest){ this.totalInvestment = parseFloat(route_invest)}
        let route_probability = this.route.snapshot.queryParamMap.get('prob')
        if(route_probability){ this.probability = parseFloat(route_probability)}
        let route_expiry = this.route.snapshot.queryParamMap.get('expry')
        if(route_expiry){ this.expiry = parseFloat(route_expiry)}
    }

    public mergeParams(params: Params){
        this.router.navigate([], {
            relativeTo: this.route, queryParams: params,
            queryParamsHandling: 'merge'
        })
    }

    public removeParams(params: Params){
        let oldParams : Params= Object.assign({ }, this.route.snapshot.queryParams)
        Object.keys(params).forEach((key)=>{
            if(oldParams[key]){ 
                if(key === "tickers"){
                    let old_tickers : string[] = JSON.parse(oldParams[key])
                    old_tickers.splice(old_tickers.indexOf(params[key]), 1)
                    oldParams[key] = JSON.stringify(old_tickers)
                }
                else{ delete oldParams[key] }
            }
        })
        this.router.navigate([],{
            relativeTo: this.route, queryParams: oldParams,
        })
    }

    public clearParams(){
        let params: Params = {
            'tickers': null, 'start': null, 'end': null,
            'target': null, 'invest': null, 'prob': null,
            'expiry': null
        }
        this.router.navigate([], {
            relativeTo:this.route, queryParams: params
        })
    }

    public setTickers(tickers: string[]): void{ 
        this.tickers = [...this.tickers, ...tickers];
        this.tickers = this.tickers.filter(function(element, index, arr){
          return index == arr.indexOf(element);
        })
        let params : Params = { 'tickers': JSON.stringify(this.tickers) };
        this.mergeParams(params);
    }
    
    public setDates(dates : string []): void{ 
        this.dates = dates; 
        let params: Params = { 'start': dates[0], 'end': dates[1] }
        this.mergeParams(params);
    }

    public setTarget(target : number): void{ 
        this.targetReturn = target; 
        let params: Params = { 'target': target }
        this.mergeParams(params);
    }

    public setInvestment(investment: number): void{ 
        this.totalInvestment = investment; 
        let params: Params = { 'invest': investment }
        this.mergeParams(params);
    }

    public setProbability(prob : number): void{ 
        this.probability = prob;
        let params: Params = { 'prob' : prob };
        this.mergeParams(params);
    }

    public setExpiry(expiry : number): void{ 
        this.expiry = expiry; 
        let params: Params = { 'expiry': expiry }
        this.mergeParams(params);
    }

    public removeTicker(ticker : string): void{  
        this.tickers.splice(this.tickers.indexOf(ticker), 1);
        let params: Params = { 'tickers': ticker }
        this.removeParams(params);
    }

    public removeDates(): void{ 
        let params: Params = { 'start': this.dates![0], 'end': this.dates![1] }
        this.removeParams(params)
        this.dates = [];
    }

    public removeTarget(): void{ 
        let params : Params = { 'target': this.targetReturn };
        this.removeParams(params);
        this.targetReturn = undefined; 
    }

    public removeInvestment(): void { 
        let params : Params = { 'invest': this.totalInvestment }
        this.removeParams(params)
        this.totalInvestment = undefined;
    }

    public removeProbability(): void{ 
        let params : Params = { 'prob': this.probability }
        this.removeParams(params)
        this.probability = undefined;
    }

    public removeExpiry(): void{ 
        let params : Params = { 'expiry': this.expiry }
        this.removeParams(params);
        this.expiry = undefined; 
    }

    public animateCalculate(): void{
        this.optionalArguments.disable();
        this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.none);
        setTimeout(()=>{  this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.full);}, 
                    Widget.toHeightDuration);
    }

    public animiateClear(): void {
        this.optionalArguments.enable()
        this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.forty);
        setTimeout(()=>{ this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.sixty) }, 
                    Widget.toHeightDuration)
    }

}