import { Component, OnInit } from '@angular/core';

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

  public testChips = [
    'ALLY', 'BX', 'SONY', 'DE', 'DIS'
  ]

  constructor() { }

  ngOnInit(): void {
  }

  public removeTickerSymbol() : void {
    
  }

}
