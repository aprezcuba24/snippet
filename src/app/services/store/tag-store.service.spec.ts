import { TestBed, inject } from '@angular/core/testing';

import { TagStoreService } from './tag-store.service';

describe('TagStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagStoreService]
    });
  });

  it('should be created', inject([TagStoreService], (service: TagStoreService) => {
    expect(service).toBeTruthy();
  }));
});
