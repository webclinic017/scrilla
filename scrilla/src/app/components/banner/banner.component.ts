import { Component, OnInit } from '@angular/core';
import { animations } from '../../app.animations';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    animations.getOpenCloseTrigger(100, 0)
  ]
})

export class BannerComponent implements OnInit {

  public menuState : string = 'closed';

  constructor() { }

  ngOnInit(): void {
  }

  public toggleMenu(): void{
    if (this.menuState === 'closed'){ this.menuState = 'open' }
    else { this.menuState = 'closed'}
  }
}
