import {inject, TestBed} from '@angular/core/testing';

import {LoginService} from './login.service';
import {LoggingService} from '../logging/logging.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PlaylistService} from '../playlist/playlist.service';
import {TrackService} from '../track/track.service';
import {Apollo} from 'apollo-angular';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ApolloTestingModule
      ],
      providers: [
        PlaylistService,
        TrackService,
        LoginService,
        LoggingService,
        Apollo
      ]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
