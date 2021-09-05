import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-scalar',
  templateUrl: './scalar.component.html',
  styleUrls: [ '../arguments.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5)
  ]
})
export class ScalarComponent implements OnInit {

  @Input()
  public currency !: boolean;
  @Input()
  public title !: string;

  @Output()
  public scalar : EventEmitter<number> = new EventEmitter<number>()
  
  public addAnimationControl : AnimationControl = this.animator.initAnimation()
  public rawInput ?: number = undefined;

  constructor(public animator : AnimationService) { }

  ngOnInit(): void { }

  public parseScalar(): void{
      this.scalar.emit(this.rawInput);
      this.rawInput = undefined;
  }
}
