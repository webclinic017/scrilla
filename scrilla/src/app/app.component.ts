import { Component } from '@angular/core';
import { StaticService } from './services/static.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scrilla';

  constructor(public staticData: StaticService) { }

  public toggle(){
    console.log('toggled')
  }
}
