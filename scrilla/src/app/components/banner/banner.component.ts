import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})

export class BannerComponent implements OnInit {

  @Output()
  public toggle : EventEmitter<string> = new EventEmitter<string>();

  public menuState : string = 'closed';

  ngOnInit(): void {

  }

  public toggleMenu(): void{
    if (this.menuState === 'closed'){ this.menuState = 'open'; }
    else { this.menuState = 'closed'}
    this.toggle.emit(this.menuState)
  }
}
