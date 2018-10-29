import {inject, TestBed} from '@angular/core/testing';

import {PlaylistService} from './playlist.service';
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
        PlaylistService,
      ]
    });
  });

  it('should be created', inject([PlaylistService], (service: PlaylistService) => {
    expect(service).toBeTruthy();
  }));
});
