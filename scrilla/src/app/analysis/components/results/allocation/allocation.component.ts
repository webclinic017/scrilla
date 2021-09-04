import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit {

  @Output()
  public removeTicker : EventEmitter<string> = new EventEmitter<string>();

  public testAllocation = [
    { 'name': 'allocation 1',
      'value': 0.3 },
    { 'name': 'allocation 2',
      'value': 0.5 },
    { 'name': 'allocation 3',
      'value': 0.2 }
  ]

  @Input()
  public tickers: string[] = [];

  @Input()
  public target ?: number;

  @Input()
  public invest ?: number;

  @Input()
  public dates ?: string[];
  
  constructor() { }

  ngOnInit(): void {
  }

  public tickerRemoved(ticker : string) : void { this.removeTicker.emit(ticker) }

}
