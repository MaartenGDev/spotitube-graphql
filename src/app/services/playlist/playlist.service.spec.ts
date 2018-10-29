import {inject, TestBed} from '@angular/core/testing';

import {PlaylistService} from './playlist.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggingService} from '../logging/logging.service';
import {Apollo} from 'apollo-angular';

describe('PlaylistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        LoggingService,
        PlaylistService,
        Apollo
      ]
    });
  });

  it('should be created', inject([PlaylistService], (service: PlaylistService) => {
    expect(service).toBeTruthy();
  }));
});
