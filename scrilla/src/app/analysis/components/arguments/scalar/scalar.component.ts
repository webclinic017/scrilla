import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-scalar',
  templateUrl: './scalar.component.html',
  styleUrls: [ '../arguments.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5)
  ]
})
/**
 * Input
 * 1. currency | boolean
 * 2. title | string
 * 3. bounds: number[]. bounds[0] => lower bound, bounds[1] => upper bound
 */
export class ScalarComponent implements OnInit {

  @Input()
  public currency !: boolean;
  @Input()
  public title !: string;
  @Input()
  public bounds !: number[];

  @Output()
  public scalar : EventEmitter<number> = new EventEmitter<number>()
  
  public addAnimationControl : AnimationControl = this.animator.initAnimation()
  public scalarControl !: FormControl;

  constructor(public animator : AnimationService) { 
    
  }

  // @Input doesn't exist until after the constructor is called, so 
  // FormControl must be created here instead of constructor
  ngOnInit(): void { 
    if(this.bounds){
      this.scalarControl = new FormControl('', [
        Validators.min(this.bounds[0]), Validators.max(this.bounds[1])
      ])
    }
    else{ this.scalarControl = new FormControl('', []) }
  }

  public parseScalar(): void{
      this.scalar.emit(this.scalarControl.value);
      this.scalarControl.reset()
  }
}
