import { ApplicationStore } from './../../store/ApplicationStore';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.store.dispatch({
      type: ApplicationStore.PAGE_READY,
      payload: true,
    });
  }
}
