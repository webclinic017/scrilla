import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';
import { Holding } from 'src/app/models/holding';
import { AnimationControl, animationControls, AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { Result } from '../result';

const toDimensionsDuration = 500
const toDimensionsAnimationProperties : AnimationProperties= {
  delay: '', duration: `${toDimensionsDuration}ms`, easing: 'ease-in'
}

const chartFontColor : string = 'rgb(232, 245, 233, 0.50)'
const chartBorderColor : string = 'rgb(185, 237, 237, 0.35)'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../results.css'],
  animations: [
    AnimationService.getToDimensionsTrigger(toDimensionsAnimationProperties),
    AnimationService.getFoldTrigger(Result.foldAnimationProperties),
    AnimationService.getScaleTrigger(1.25),
    AnimationService.getHighlightTrigger('#E0E0E0')

  ]
})
export class ProfileComponent extends Result implements OnInit {
  @ViewChild(BaseChartDirective) public chart!: BaseChartDirective;

  @Input() holdings !: Holding[];

  public displayedColumns : string[] = [];

  public tableAnimationControl : AnimationControl = this.animator.initAnimation();
  public chartAnimationControl : AnimationControl = this.animator.initAnimation();
  public graphToggleAnimationControl : AnimationControl = this.animator.initAnimation();
  

  public chartDataUrl: any;
  public chartExpanded : boolean = false;
  public chartOptions : ChartOptions={ 
    responsive: true,
    legend: { labels: { fontColor: [`${chartFontColor}`], } },
    scales: {
      xAxes:[{ 
        ticks:{ stepSize: 15, beginAtZero: true, fontColor: `${chartFontColor}` },
        scaleLabel: { display: true, labelString: 'Volatility %', fontColor:`${chartFontColor}`},   
        gridLines: { color: `${chartFontColor}` }  
      }],
      yAxes:[{ 
        ticks: { fontColor: `${chartFontColor}`, stepSize: 15, beginAtZero: true },
        scaleLabel: { display: true, labelString: 'Return %', fontColor:`${chartFontColor}` },
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

  constructor(public animator : AnimationService, public sanitizer : DomSanitizer) { 
    super(animator, sanitizer)
  }

  ngOnInit(): void {
    if(this.holdings.length > 0){
      this.holdings.forEach(holding=>{
        if(holding.annual_volatility && holding.annual_return){
          this.chartData.push({
            data: [{ x: Math.round(holding.annual_volatility*10000)/100, 
                      y: Math.round(holding.annual_return*10000)/100 }],
            label: holding.ticker,
            pointRadius: 5,
          })
        }
      });
      this.displayedColumns = [ 'ticker']
      if(this.holdings[0].annual_return !== undefined){ this.displayedColumns.push('annual_return')}
      if(this.holdings[0].annual_volatility !== undefined){ this.displayedColumns.push('annual_volatility')}
      if(this.holdings[0].sharpe_ratio !== undefined){ this.displayedColumns.push('sharpe_ratio')}
      if(this.holdings[0].equity_cost !== undefined) { this.displayedColumns.push('equity_cost')}
      if(this.holdings[0].asset_beta !== undefined) { this.displayedColumns.push('asset_beta')}

    }
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.chartDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chart.toBase64Image())
    }, 1000)
  }

  public expand(){
    this.chartExpanded = true;
    this.tableAnimationControl = this.animator.animateToDimensions(animationControls.to.states.none);
    setTimeout(()=>{
      this.chartAnimationControl = this.animator.animateToDimensions(animationControls.to.states.seventyfive);
      setTimeout(()=>{
        this.chart.chart.resize();
      }, toDimensionsDuration+10)
    }, toDimensionsDuration+10);
  }

  public collapse(){
    this.chartExpanded = false;
    this.chartAnimationControl = this.animator.animateToDimensions(animationControls.to.states.thirtyfive);
    setTimeout(()=>{
      this.tableAnimationControl = this.animator.animateToDimensions(animationControls.to.states.sixty);
      setTimeout(()=>{
        this.chart.chart.resize();
      }, toDimensionsDuration+10)
    }, toDimensionsDuration+10)
  }

  public getProfileJsonUri(){
    return super.formatResultJsonUri(this.holdings)
  }
  public getProfileFileName(ext: string){
    let filename : string = "";
    this.holdings.forEach(holding=>{ filename = filename.concat(holding.ticker).concat('_')});
    return filename.concat('_profile.').concat(ext)
  }
}
