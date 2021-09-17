import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from 'src/app/models/holding';
import { AnimationControl, animationControls, AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../widget';


@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
    AnimationService.getOpacityTrigger()
  ]
})
export class RiskProfileComponent extends Widget implements OnInit {

  public holdings ?: Holding[];

  public loading : boolean = false;

  constructor(public animator : AnimationService, public api: ApiService, 
              public formBuilder : FormBuilder, public router: Router, 
              public route: ActivatedRoute) {
                super(animator, api, formBuilder, router, route); 
    this.optionalArguments = this.formBuilder.group({
      date: this.formBuilder.group({ enabled: false })
    })
  }

  ngOnInit(): void { }

  public calculate() : void {
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
    }
    this.loading = true;
    this.api.risk_profile(params).subscribe( (data)=>{
      this.holdings = data;
      this.loading = false;
      super.animateCalculate();
    })
  }

  public clear() : void {
    this.holdings = undefined; this.tickers = []; this.dates = undefined;
    super.animiateClear();
  }

}
