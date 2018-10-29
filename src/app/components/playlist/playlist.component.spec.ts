import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlaylistComponent} from './playlist.component';
import {SpotitubeAngularModule} from '../../modules/angular.module';
import {SpotitubeMaterialModule} from '../../modules/material.module';
import {TrackService} from '../../services/track/track.service';
import {LoggingService} from '../../services/logging/logging.service';
import {MinutesPipe} from '../../pipes/minutes.pipe';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlaylistComponent,
        MinutesPipe
      ],
      imports: [
        ApolloTestingModule,
        SpotitubeAngularModule,
        SpotitubeMaterialModule
      ],
      providers: [
        LoggingService,
        TrackService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
