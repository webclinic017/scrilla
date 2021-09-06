import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-model',
  templateUrl: './price-model.component.html',
  styleUrls: ['../widgets.css']
})
export class PriceModelComponent implements OnInit {

  // will need to require tickers arg component to accept argument that limits tickers to 1.
  // since pricemodel will be applied to one ticker at a time!
  constructor() { }

  ngOnInit(): void {
  }

}
