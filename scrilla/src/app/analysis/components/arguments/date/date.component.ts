import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  public range : FormGroup;

  constructor(public animator : AnimationService, public datePipe : DatePipe,
              public formBuilder: FormBuilder) { 
    this.range = this.formBuilder.group({
                  start: new FormControl('', [ this.futureDatesValidator()]), 
                  end: new FormControl('', [ this.futureDatesValidator()])
    });

  }

  ngOnInit(): void {
  }

  public parseDates(): void{
    let startDate : string | null = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    let endDate : string | null = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
    if(startDate && endDate){ this.dates.emit([startDate, endDate]) }

  }

  public futureDatesValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value){
        let controlDate : Date = control.value
        controlDate.setHours(0,0,0,0);
        let todaysDate : Date = new Date()
        todaysDate.setHours(0,0,0,0)
        if (controlDate > todaysDate){ return { futureDates: { value: control.value }} } 
      }
      return null;
    }
  }
}
