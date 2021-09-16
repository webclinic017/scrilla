import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnimationService } from 'src/app/services/animations.service';
import { ApiService } from 'src/app/services/api.service';
import { Widget } from '../widget';

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  animations: [
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
  ]
})
export class CorrelationMatrixComponent extends Widget implements OnInit {

  public correl_matrix ?: number[][];

  public loading : boolean = false;

  constructor(public animator : AnimationService, public api: ApiService,
    public formBuilder : FormBuilder) {
      super(animator, api, formBuilder);
     }

  ngOnInit(): void { }

  public calculate(): void {}

  public clear() : void {}
}
