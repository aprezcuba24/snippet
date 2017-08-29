import { AppStoreService } from './store/app-store.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class PageLoadService implements CanActivate {

  constructor(
    private appStore: AppStoreService,
  ) { }

  canActivate() {
    this.appStore.setPageReady(false);
    return true;
  }
}