import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../results.css']
})
export class ProfileComponent implements OnInit {

  @Input()
  public tickers !: string[]
  @Input()
  public dates ?: string[];

  @Output()
  public removeTicker : EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public removeDates : EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public tickerRemoved(ticker : string){ this.removeTicker.emit(ticker); }

  public datesRemoved() { this.removeDates.emit(true); }
}
