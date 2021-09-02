import { Component, ViewChild } from '@angular/core';
import { SideNavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(SideNavComponent)
  public navDrawer !:SideNavComponent ;

  title = 'scrilla';

  constructor() { }
}
