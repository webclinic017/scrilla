import { Component,Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import {Portfolio } from 'src/app/models/holding';
import { AnimationControl, AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { Result } from '../result';

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
    AnimationService.getFoldTrigger(foldAnimationProperties),
    AnimationService.getScaleTrigger(1.25),
    AnimationService.getHighlightTrigger('#E0E0E0')
  ]
})
export class AllocationComponent extends Result implements OnInit {

  @Input()
  public portfolio!: Portfolio;
  
  @ViewChild('chart')
  public chartElement !: BaseChartDirective;
  
  public chartDataUrl : any;
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

  constructor(public animator: AnimationService, public sanitizer: DomSanitizer) { 
    super(animator, sanitizer)
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

  ngAfterViewInit(){
    // sort of hacky, but chart needs to be initialized before dataURL is constructed or else canvas is blank
    setTimeout(()=>{
      this.chartDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chartElement.toBase64Image())
    }, 1000)
  }

  public getPortfolioJsonUri(): SafeResourceUrl{
    return super.formatResultJsonUri(this.portfolio);
  }

  public getPortfolioFileName(ext: string): string{
    let filename : string = '';
    this.portfolio.holdings.forEach((holding)=>{
      filename = filename.concat(holding.ticker, '_');
    })
    return filename.concat(`portfolio.${ext}`)
  }

}
