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
        scaleLabel:{ labelString: 'Payment Date', fontColor:`${chartFontColor}`},
        gridLines: { color: `${chartFontColor}`}
      }],
      yAxes:[{ 
        ticks: { fontColor: `${chartFontColor}`},
        scaleLabel: { display: true, labelString: 'Amount', fontColor:`${chartFontColor}` },
        gridLines: { color:  `${chartFontColor}`},
      }],
    }
  };
  public chartLabels : Label[][] = [];
  // [ticker][date][actual or model]
  public chartData: ChartDataSets[][] = [];

  public chartColors: Color[] = [
    { backgroundColor: 'rgba(160, 67, 155, 0.35)', borderColor: `transparent`, pointBackgroundColor: '#a0439b'}, 
    { backgroundColor: 'transparent', borderColor: '#6da043', pointBackgroundColor: '#6da043'},  
  ]

  constructor() { }

  ngOnInit(): void {
    // initialize component title based on input
    switch(this.model){
      case pricingModels.ddm:
        this.title = "Discount Dividend Model";
        break;
      default:
        this.title = "Pricing Model";
        break;
    }
    // initialize chart data structure based on API results
    if(this.results && this.results.length>0){
      this.results.forEach((result,index, arr)=>{
        result.ticker
        this.chartData[index] = []
        this.chartLabels[index] = []

        let actual_prices : number[] = []
        let model_prices : number[] = []

        result.model_data.forEach( (dataPoint) =>{
          actual_prices.push(dataPoint.actual_price)
          model_prices.push(Math.round(dataPoint.model_price*10000)/10000)
          this.chartLabels[index].push(dataPoint.date)
        })
      
        // restults are returned latest to earliest, want to put in the reverse order,
        // i.e. start with x = 0 => earliest 
        actual_prices = actual_prices.reverse()
        model_prices = model_prices.reverse()
        this.chartLabels[index] = this.chartLabels[index].reverse()

        this.chartData[index].push({ data: actual_prices, label: `${result.ticker} Actual`})
        this.chartData[index].push({ data: model_prices, label: `${result.ticker} Model`})
        console.log(this.chartData[index])
    })
  }
}

  public isDDM(){ return this.model === pricingModels.ddm;}

}
