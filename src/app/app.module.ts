import { SnippetRoutingModule } from './snippet/snippet-routing.module';
import { SnippetModule } from './snippet/snippet.module';
import { IpcClientService } from './services/ipc.client.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from './shared/shared.module';
import { PageLoadService } from './services/page-load.service';
import { TagStoreService } from './services/store/tag-store.service';
import { AppStoreService } from './services/store/app-store.service';
import { SnippetStoreService } from './services/store/snippet-store.service';
import { Select2Module } from 'ng2-select2';
import {NgxPaginationModule} from "ngx-pagination";
import {ListComponent} from "./components/list/list.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SnippetModule,
    SharedModule,
    SnippetRoutingModule,
    Select2Module,
    NgxPaginationModule
  ],
  providers: [
    IpcClientService,
    PageLoadService,
    TagStoreService,
    AppStoreService,
    SnippetStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
