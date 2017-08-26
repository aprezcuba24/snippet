import { SnippetModule } from './snippet/snippet.module';
import { IpcClientService } from './services/ipc.client.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as Store from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SnippetRoutingModule } from './snippet/snippet-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.provideStore(Store.metaReducer),
    EffectsModule.run(Store.ApplicationStore),
    EffectsModule.run(Store.TagStore),
    SnippetRoutingModule,
    SnippetModule
  ],
  providers: [
    Store.ApplicationStore,
    Store.TagStore,
    IpcClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
