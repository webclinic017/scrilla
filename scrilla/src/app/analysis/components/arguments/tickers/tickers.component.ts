import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.css']
})
export class TickersComponent implements OnInit {

  @Output()
  public tickers : EventEmitter<string[]> = new EventEmitter<string[]>();

  public rawInput !: string;

  constructor() { }

  ngOnInit(): void { }

  public parseTickers(): void{
    let tickerArray = this.rawInput.toUpperCase().split(',')
    // remove white space from each element
    tickerArray.forEach((element, index, arr) => { 
      return arr[index] = element.trim();
    });
    // filter out duplicate values. Note: indexOf returns *first* element 
    // that equals its argument. 
    tickerArray = tickerArray.filter(function(element, index, arr){
      return index === arr.indexOf(element);
    });
    this.tickers.emit(tickerArray)
    this.rawInput = '';
  }

}
