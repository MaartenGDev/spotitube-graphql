import {inject, TestBed} from '@angular/core/testing';

import {TrackService} from './track.service';
import {LoggingService} from '../logging/logging.service';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('PlaylistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ],
      providers: [
        LoggingService,
        TrackService
      ]
    });
  });

  it('should be created', inject([TrackService], (service: TrackService) => {
    expect(service).toBeTruthy();
  }));
});
