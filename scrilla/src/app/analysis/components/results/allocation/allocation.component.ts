import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit {

  public testAllocation = [
    { 'name': 'allocation 1',
      'value': 0.3 },
    { 'name': 'allocation 2',
      'value': 0.5 },
    { 'name': 'allocation 3',
      'value': 0.2 }
  ]

  @Output()
  public removeTicker : EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public removeTarget : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public removeInvest: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public removeDates : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public removeLossProbability : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public removeLossExpiry : EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public tickers: string[] = [];
  @Input()
  public target ?: number;
  @Input()
  public invest ?: number;
  @Input()
  public dates ?: string[];
  @Input() 
  public probability ?: number;
  @Input()
  public expiry ?: number;
  
  constructor() { }

  ngOnInit(): void {
  }

  public tickerRemoved(ticker : string) : void { this.removeTicker.emit(ticker) }

  public targetRemoved(): void { this.removeTarget.emit(true); }

  public investRemoved(): void { this.removeInvest.emit(true); }

  public datesRemoved(): void { this.removeDates.emit(true); }

  public probabilityRemoved(): void { this.removeLossProbability.emit(true); }

  public expiryRemoved(): void{ this.removeLossExpiry.emit(true); }

}
