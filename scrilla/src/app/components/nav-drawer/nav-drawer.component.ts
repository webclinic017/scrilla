import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { StaticService } from 'src/app/services/static.service';

@Component({
  selector: 'app-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.css']
})
export class NavDrawerComponent implements OnInit {

  @ViewChild('navigationDrawer') public drawer!: MatDrawer;
  constructor(public staticData: StaticService) { }

  ngOnInit(): void {
  }

  public toggle(): void{ 
    console.log(this.drawer)
    this.drawer.toggle();
  }
}
