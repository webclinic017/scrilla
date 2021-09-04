import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5)
  ]
})
export class DateComponent implements OnInit {

  @Output()
  public dates : EventEmitter<string[]> = new EventEmitter<string[]>();

  public addAnimationControl : AnimationControl= this.animator.initAnimation()
  public range = new FormGroup({
    start: new FormControl(), end: new FormControl()
  });

  constructor(public animator : AnimationService) { }

  ngOnInit(): void {
  }

  public parseDates(): void{

  }
}
