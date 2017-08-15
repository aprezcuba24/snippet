import { TestBed, inject } from '@angular/core/testing';

import { IpcClientService } from './ipc.client.service';

describe('IpcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpcClientService]
    });
  });

  it('should be created', inject([IpcClientService], (service: IpcClientService) => {
    expect(service).toBeTruthy();
  }));
});
