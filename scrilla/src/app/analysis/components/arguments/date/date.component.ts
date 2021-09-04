import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['../arguments.css'],
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

  constructor(public animator : AnimationService, public datePipe : DatePipe) { }

  ngOnInit(): void {
  }

  public parseDates(): void{
    let startDate : string | null = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    let endDate : string | null = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
    if(startDate && endDate){ this.dates.emit([startDate, endDate]) }

  }
}
