import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-scalar',
  templateUrl: './scalar.component.html',
  styleUrls: ['./scalar.component.css']
})
export class ScalarComponent implements OnInit {

  @Input()
  public currency !: boolean;
  @Input()
  public title !: string;

  @Output()
  public scalar : EventEmitter<number> = new EventEmitter<number>()
  
  public rawInput : string = '';
  public invalidInput : boolean = true;

  constructor() { }

  ngOnInit(): void { }

  public parseScalar(): void{
    try{ 
      let parsedInput = parseFloat(this.rawInput.trim()) 
      this.scalar.emit(parsedInput);
      this.rawInput = '';
    }
    catch(error){
      console.log(error);
      this.invalidInput = true;
    }
  }
}
