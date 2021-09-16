import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Correlation } from 'src/app/models/statistics';
import { AnimationService } from 'src/app/services/animations.service';
import { Result } from '../result';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['../results.css']
})
export class MatrixComponent extends Result implements OnInit {
  
  @Input() 
  public matrix !: Correlation[];

  @Input()
  public tickers !: string[];

  @Input()
  public percent: boolean = true;
  
  public format_matrix !: string[][];

  constructor(public animator: AnimationService, public sanitizer : DomSanitizer) { 
    super(animator, sanitizer)
  }

  ngOnInit(): void {
    let took = 0; this.format_matrix = [];
    this.format_matrix.push([...["  "], ...this.tickers])
      for(let i = 1; i<this.format_matrix[0].length+1; i++){
        this.format_matrix[i] = [ this.tickers[i-1] ];
        for(let j = i; j< this.format_matrix[0].length; j++){
          if(j == i){ this.format_matrix[i][j] = "1" }
          else{ 
            this.format_matrix[i][j] = String(Object.values(this.matrix[took])[0]); 
            took++
          }
        }     
      }
      for(let i = 1; i < this.format_matrix[0].length; i++){
        for(let j = i; j < this.format_matrix[0].length; j++){
          if(j != i){ this.format_matrix[j][i] = this.format_matrix[i][j]}
        }
      }
  }

  public getMatrixJsonUri(): SafeResourceUrl {
    let jsonFormat = JSON.stringify(this.matrix)
    return this.sanitizer.bypassSecurityTrustResourceUrl("data:text/json;charset=UTF-8," + encodeURIComponent(jsonFormat));
  }

  public getMatrixFileName() : string{
    let filename = ""
    this.tickers.forEach((ticker, index, array)=>{
      filename = filename.concat(ticker);
      if(index != array.length-1){ filename = filename.concat('_'); }
    })
    return filename.concat('.json')
  }

}
