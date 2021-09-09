import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  @Input()
  public single : boolean = false;
  @Input()
  public disabled : boolean = false;

  @Output()
  public tickers : EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output()
  public ticker : EventEmitter<string> = new EventEmitter<string>();

  public addAnimationControl : AnimationControl = this.animator.initAnimation()
  public tickerControl !: FormControl;

  constructor(public animator: AnimationService) { 
  }

  ngOnInit(): void { 
    let validators = [Validators.required]
    if(this.single){ validators.push(this.multipleTickersValidator())}
    this.tickerControl = new FormControl('', validators)
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.disabled){ 
      if(this.tickerControl){
        if(changes.disabled.currentValue) { this.tickerControl.disable()}
        else{ this.tickerControl.enable(); }
      }
    }
  }

  public parseTickers(): void{
    let tickerArray = this.tickerControl.value.toUpperCase().split(',')
    // remove white space from each element
    tickerArray.forEach((element : any, index: any, arr: any) => { 
      return arr[index] = element.trim();
    });
    // filter out duplicate values. Note: indexOf returns *first* element 
    // that equals its argument. 
    tickerArray = tickerArray.filter(function(element: any, index: any, arr: any){
      return index === arr.indexOf(element);
    });
    // TODO: before emitting, call service to see if inputted tickers are valid tickers,
    //  i.e. are the tickers listed on the stock exchange? 
    //  If not, custom Validator needed.
    if(this.single){ this.ticker.emit(tickerArray[0])}
    else{ this.tickers.emit(tickerArray)}
    this.tickerControl.reset()
  }

  public multipleTickersValidator(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null =>{
      if(control.value){
        let ticker_string : string = control.value;
        if(ticker_string.includes(',')){
          return { multipleTickers: { value: control.value } }
        }
      }
      return null;
    }
  }

}
