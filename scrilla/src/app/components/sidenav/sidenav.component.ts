import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { StaticService } from 'src/app/services/static.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SideNavComponent implements OnInit {

  @ViewChild('navigationDrawer') public drawer!: MatDrawer;
  constructor(public staticData: StaticService) { }

  ngOnInit(): void {
  }

  public toggle(): void{ this.drawer.toggle(); }
}
