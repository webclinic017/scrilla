import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../widget';

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrls: [ '../widgets.css' ],
  animations: [
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
  ]
})
export class CorrelationMatrixComponent extends Widget implements OnInit {

  public correl_matrix ?: string[][];

  public loading : boolean = false;

  constructor(public animator : AnimationService, public api: ApiService,
    public formBuilder : FormBuilder) {
      super(animator, api, formBuilder);
     }

  ngOnInit(): void { }

  public calculate(): void {
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
    }

    this.loading = true;
    
    this.api.correlation_matrix(params).subscribe((data)=>{
      this.loading = false; let took = 0; this.correl_matrix = [];
      this.correl_matrix.push([...["  "], ...this.tickers])
      for(let i = 1; i<this.correl_matrix[0].length+1; i++){
        this.correl_matrix[i] = [ this.tickers[i-1] ];
        for(let j = i; j< this.correl_matrix[0].length; j++){
          if(j == i){ this.correl_matrix[i][j] = "1" }
          else{ 
            this.correl_matrix[i][j] = String(Object.values(data[took])[0]); 
            took++
          }
        }     
      }
      for(let i = 1; i < this.correl_matrix[0].length; i++){
        for(let j = i; j < this.correl_matrix[0].length; j++){
          if(j != i){ this.correl_matrix[j][i] = this.correl_matrix[i][j]}
        }
      }
    })
    super.animateCalculate()
  }

  public clear() : void {
    this.correl_matrix = undefined; this.tickers = []; this.dates = undefined; 
    super.animiateClear();
  }
}
