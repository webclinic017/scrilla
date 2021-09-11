import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { DiscountDividend } from 'src/app/models/pricing';
import { pricingModels } from '../../widgets/price-model/price-model.component';

const chartFontColor : string = 'rgb(232, 245, 233, 0.50)'
const chartBorderColor : string = 'rgb(185, 237, 237, 0.35)'

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['../results.css']
})
export class ModelComponent implements OnInit {
  @Input() model!: string;

  @Input() results : DiscountDividend[] | undefined; // | otherModel

  public title !: string;
  
  public chartOptions : ChartOptions={ 
    responsive: true,
    legend: { labels: { fontColor: [`${chartFontColor}`], } },
    scales: {
      xAxes:[{ 
        //ticks:{ stepSize: 15, beginAtZero: true, fontColor: `${chartFontColor}` },
        scaleLabel: { display: true, labelString: 'Payment Date', fontColor:`${chartFontColor}`},   
        gridLines: { color: `${chartFontColor}` }  
      }],
      yAxes:[{ 
        //ticks: { fontColor: `${chartFontColor}`, stepSize: 15, beginAtZero: true },
        scaleLabel: { display: true, labelString: 'Amount', fontColor:`${chartFontColor}` },
        gridLines: { color:  `${chartFontColor}`},
      }],
    }
  };
  public chartData: ChartDataSets[][] = [];
  public chartColors: Color[] = [
    { backgroundColor: '#a0439b', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#6da043', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#43a076', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#439ba0', borderColor: `${chartBorderColor}`}, 
    { backgroundColor: '#4843a0', borderColor: `${chartBorderColor}`}, 
  ]

  constructor() { }

  ngOnInit(): void {
    switch(this.model){
      case pricingModels.ddm:
        this.title = "Discount Dividend Model";
        break;
      default:
        this.title = "Pricing Model";
        break;
    }
  }

  public isDDM(){ return this.model === pricingModels.ddm;}

}
