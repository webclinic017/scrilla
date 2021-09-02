import { Component, ViewChild } from '@angular/core';
import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(NavDrawerComponent)
  public navDrawer !:NavDrawerComponent ;

  title = 'scrilla';

  constructor() { }
}
