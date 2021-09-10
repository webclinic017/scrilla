import { Component,Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import {Portfolio } from 'src/app/models/holding';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}

export interface PieArgs{
  name: string, value: number
}

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['../results.css'],
  animations:[
    AnimationService.getFoldTrigger(foldAnimationProperties)
  ]
})
export class AllocationComponent implements OnInit {

  @Input()
  public portfolio!: Portfolio;
  
  public chartOptions : ChartOptions={ 
    responsive: true,
    legend:{
      labels: { fontColor: ['#e8f5e9'] }
    } 
  };
  public chartLabels : Label[] = [];
  public chartData: SingleDataSet = [];
  public chartColors: any = [
    {
      // TODO: would really like to generate these from the theme palette somehow...
      backgroundColor: ['#a0439b','#6da043','#43a076','#439ba0','#4843a0']
    }
  ]

  public displayedColumns: string[] = [ ];

  constructor() { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  // comparisons are made against undefined instead of directly against variables, 
  // since some of the values can equal 0 (which is Falsy)
  ngOnInit(): void {
    if(this.portfolio.holdings.length > 0){
      this.portfolio.holdings.forEach(holding=>{
        if(holding.allocation !== undefined){
          this.chartLabels.push(holding.ticker)
          this.chartData.push(holding.allocation)
        }
      })
      this.displayedColumns = [ 'ticker']
      if(this.portfolio.holdings[0].allocation !== undefined){ this.displayedColumns.push('allocation')}
      if(this.portfolio.holdings[0].shares !== undefined) { this.displayedColumns.push('shares')}
      if(this.portfolio.holdings[0].annual_return !== undefined){ this.displayedColumns.push('annual_return')}
      if(this.portfolio.holdings[0].annual_volatility !== undefined){ this.displayedColumns.push('annual_volatility')}
    }
  }


}
