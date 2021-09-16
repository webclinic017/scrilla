import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Correlation } from 'src/app/models/statistics';
import { AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../widget';

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrls: [ '../widgets.css' ],
  animations: [
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
    AnimationService.getOpacityTrigger()
  ]
})
export class CorrelationMatrixComponent extends Widget implements OnInit {

  public correl_matrix ?: Correlation[];

  public loading : boolean = false;

  constructor(public animator : AnimationService, public api: ApiService,
    public formBuilder : FormBuilder) {
      super(animator, api, formBuilder);
     }

  ngOnInit(): void { }

  public calculate(): void {
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
    }

    this.loading = true;
    
    this.api.correlation_matrix(params).subscribe((data)=>{
      this.loading = false;
      this.correl_matrix = data;
    })
    super.animateCalculate()
  }

  public clear() : void {
    this.correl_matrix = undefined; this.tickers = []; this.dates = undefined; 
    super.animiateClear();
  }
}
