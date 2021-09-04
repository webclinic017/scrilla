import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  @Output()
  public dates : EventEmitter<string[]> = new EventEmitter<string[]>();
  
  public range = new FormGroup({
    start: new FormControl(), end: new FormControl()
  });

  constructor() { }

  ngOnInit(): void {
  }

  public parseDates(): void{

  }
}
