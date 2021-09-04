import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['../arguments.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5)
  ]
})
export class TickersComponent implements OnInit {

  @Output()
  public tickers : EventEmitter<string[]> = new EventEmitter<string[]>();

  public addAnimationControl : AnimationControl = this.animator.initAnimation()
  public rawInput : string = '';

  constructor(public animator: AnimationService) { }

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
    // TODO: before emitting, call service to see if inputted tickers are valid tickers,
    //  i.e. are the tickers listed on the stock exchange? 
    //  If not, custom Validator needed.
    this.tickers.emit(tickerArray)
    this.rawInput = '';
  }

}
