import { IpcClientService } from './services/ipc.client.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'environment.db_connection';
  constructor(
    private ipc: IpcClientService
  ) {
    this.ipc.send('init');
    this.ipc.on('ready', this.test.bind(this))
  }
  test(event, arg: any) {
    console.log(arg)
  }
}
