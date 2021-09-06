import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-model',
  templateUrl: './price-model.component.html',
  styleUrls: ['../widgets.css']
})
export class PriceModelComponent implements OnInit {

  public ticker ?: string; 


  constructor() { }

  ngOnInit(): void {}

  public setTicker(ticker: string){ this.ticker = ticker; }

  public removeTicker() { this.ticker = undefined; }
}
