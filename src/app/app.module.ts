import { IpcClientService } from './services/ipc.client.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as Store from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore(Store.metaReducer),
    EffectsModule.run(Store.ApplicationStore),
  ],
  providers: [
    Store.ApplicationStore,
    IpcClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
