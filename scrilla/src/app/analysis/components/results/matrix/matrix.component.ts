import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['../results.css']
})
export class MatrixComponent implements OnInit {
  
  @Input() 
  public matrix !: string[][];

  @Input()
  public percent: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
