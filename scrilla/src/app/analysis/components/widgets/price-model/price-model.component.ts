import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DiscountDividend } from 'src/app/models/pricing';
import { AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../widget';

interface modeType {
    title: string, param: string
}
export const modes : modeType[] =[
  {
      title: 'Discount Dividend Model',
      param: 'ddm'
  }
]
@Component({
  selector: 'app-price-model',
  templateUrl: './price-model.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
    AnimationService.getOpacityTrigger()
  ]
})
export class PriceModelComponent extends Widget implements OnInit {

  // pull constant into component so it can be used in template
  public modes = modes;

  public results : DiscountDividend[] | undefined;

  public loading : boolean = false;
  
  public modeSelection : FormControl;


  constructor(public animator : AnimationService,public api: ApiService,
              public formBuilder : FormBuilder) { 
    super(animator, api, formBuilder)
    this.modeSelection = new FormControl(this.modes[0])
  }
  
  ngOnInit(): void {  }

  // TODO: generalize to allow user to select pricing model and include model in params.
  //        posssibly. depends on how I implement other pricing models.
  public calculate(): void{
    let params : QueryParams={ tickers: this.tickers, }
    this.loading = true;
    this.api.dividend_model(params).subscribe((data)=>{
      this.loading = false;
      this.results = data;
      super.animateCalculate();
    })
  }

  public clear(): void{
    this.results = undefined; this.tickers = [];
    super.animiateClear();
  }
}
