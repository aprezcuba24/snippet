import { TestBed, inject } from '@angular/core/testing';

import { PageLoadService } from './page-load.service';

describe('PageLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageLoadService]
    });
  });

  it('should be created', inject([PageLoadService], (service: PageLoadService) => {
    expect(service).toBeTruthy();
  }));
});
