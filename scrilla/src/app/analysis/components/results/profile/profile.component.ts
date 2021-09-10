import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { Holding } from 'src/app/models/holding';
import { AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}

const chartFontColor : string = 'rgb(232, 245, 233, 0.50)'
const chartBorderColor : string = 'rgb(185, 237, 237, 0.35)'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../results.css'],
  animations: [
    AnimationService.getFoldTrigger(foldAnimationProperties)
  ]
})
export class ProfileComponent implements OnInit {

  @Input() holdings !: Holding[];

  public displayedColumns : string[] = [];
  
  public chartOptions : ChartOptions={ 
    responsive: true,
    legend:{
      labels: { fontColor: [`${chartFontColor}`], }
    },
    scales: {
      xAxes:[{ 
        ticks:{
          stepSize: 0.1,
          beginAtZero: true,
          fontColor: `${chartFontColor}`
        },
        scaleLabel: { display: true, labelString: 'Volatility', fontColor:`${chartFontColor}`},   
        gridLines: { color: `${chartFontColor}` }  
      }],
      yAxes:[{ 
        ticks: {
          fontColor: `${chartFontColor}`,
          stepSize: 0.1,
          beginAtZero: true
        },
        scaleLabel: { display: true, labelString: 'Return', fontColor:`${chartFontColor}` },
        gridLines: { color:  `${chartFontColor}`},
      }],
    }
  };

  public chartData: ChartDataSets[] = [];
  public chartColors: Color[] = [
    { backgroundColor: '#a0439b', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#6da043', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#43a076', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#439ba0', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#4843a0', borderColor: `${chartBorderColor}`}, 
  ]

  constructor() { }

  ngOnInit(): void {
    console.log(this.holdings)
    if(this.holdings.length > 0){
      this.holdings.forEach(holding=>{
        this.chartData.push({
          data: [{ x: holding.annual_volatility, y: holding.annual_return }],
          label: holding.ticker,
          pointRadius: 5,
        })
      });
      this.displayedColumns = [ 'ticker']
      if(this.holdings[0].annual_return !== undefined){ this.displayedColumns.push('annual_return')}
      if(this.holdings[0].annual_volatility !== undefined){ this.displayedColumns.push('annual_volatility')}
      if(this.holdings[0].sharpe_ratio !== undefined){ this.displayedColumns.push('sharpe_ratio')}
      if(this.holdings[0].equity_cost !== undefined) { this.displayedColumns.push('equity_cost')}
      if(this.holdings[0].asset_beta !== undefined) { this.displayedColumns.push('asset_beta')}

    }
  }


}
