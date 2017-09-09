import { TestBed, inject } from '@angular/core/testing';

import { SnippetStoreService } from './snippet-store.service';

describe('SnippetStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnippetStoreService]
    });
  });

  it('should be created', inject([SnippetStoreService], (service: SnippetStoreService) => {
    expect(service).toBeTruthy();
  }));
});
