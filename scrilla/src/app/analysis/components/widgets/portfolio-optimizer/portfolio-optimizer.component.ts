import { Component, OnInit } from '@angular/core';
import { AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-portfolio-optimizer',
  templateUrl: './portfolio-optimizer.component.html',
  styleUrls: ['./portfolio-optimizer.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.25)
  ]
})
export class PortfolioOptimizerComponent implements OnInit {

  public optimizeBtnAnimationControl = this.animator.initAnimation()
  public clearBtnAnimationControl = this.animator.initAnimation();

  public tickers : string[] = [];
  public targetReturn ?: number;
  public totalInvestment ?: number;
  public startDate ?: Date;
  public endDate ?: Date;

  constructor(public animator : AnimationService) { }

  ngOnInit(): void { }

  public setTickers(tickers: string[]): void{ 
    this.tickers = [...this.tickers, ...tickers];
    this.tickers = this.tickers.filter(function(element, index, arr){
      return index == arr.indexOf(element);
    })
  }

  public removeTicker(ticker : string): void{ this.tickers.splice(this.tickers.indexOf(ticker), 1); }
}
