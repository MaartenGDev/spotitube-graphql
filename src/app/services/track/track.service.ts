import {Injectable} from '@angular/core';
import {RestfulSpotitubeClientService} from '../restful-spotitube-client/restful-spotitube-client.service';
import {LoggingService} from '../logging/logging.service';

import {Track} from '../../models/track/track.interface';
import {Playlist} from '../../models/playlist/playlist.interface.model';
import {Tracks} from '../../models/tracks/tracks.interface.model';
import {Subject} from 'rxjs';
import {Playlists} from '../../models/playlists/playlists.interface.model';
import gql from 'graphql-tag';
import {ApolloQueryResult} from 'apollo-client';
import {TracksImpl} from '../../models/tracks/tracks.model';
import {Apollo} from 'apollo-angular';

@Injectable()
export class TrackService extends RestfulSpotitubeClientService {

  private tracksUpdated = new Subject<Tracks>();

  /**
   * Register to this observable to be notified when the tracks have changed.
   *
   * @type {Observable<Tracks>}
   */
  public tracksUpdated$ = this.tracksUpdated.asObservable();

  /**
   * Create a new TrackService
   *
   * @param {LoggingService} loggingService
   * @param apollo
   */
  constructor(loggingService: LoggingService, private apollo: Apollo) {
    super(loggingService);
  }

  /**
   * Add a Track to a Playlist
   *
   * @param {Playlist} playlist
   * @param {Track} track
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async addTrackToPlaylist(playlist: Playlist, track: Track): Promise<Tracks> {
    return new Promise<Tracks>((res, rej) => {
      this.apollo.mutate({
        mutation: gql`mutation {
                    addTrackToPlaylist(playlistId: ${playlist.id},trackId: ${track.id},offlineAvailable: ${track.offlineAvailable}){
                      id
                      title
                      performer
                      duration
                      album
                      playcount
                      publicationDate
                      description
                      offlineAvailable
                    }
          }`
      }).subscribe((response: ApolloQueryResult<{ tracks: Track[] }>) => {
        const tracks: Tracks = new TracksImpl();
        tracks.tracks = response.data.tracks;
        this.tracksUpdated.next();
        res(tracks);
      });
    });
  }

  /**
   * Remove a track from the playlist.
   *
   * @param {Playlist} playlist
   * @param {Track} track
   * @return {Promise<Track[]>} The complete and updated list of tracks belonging to the given playlist
   */
  public async removeTracksFromPlaylist(playlist: Playlist, track: Track): Promise<Tracks> {
    return new Promise<Tracks>((res, rej) => {
      this.apollo.mutate({
        mutation: gql`mutation {
                    removeTrackFromPlaylist(playlistId: ${playlist.id}, trackId: ${track.id}){
                      id
                      title
                      performer
                      duration
                      album
                      playcount
                      publicationDate
                      description
                      offlineAvailable
                    }
          }`
      }).subscribe((response: ApolloQueryResult<{ tracks: Track[] }>) => {
        const tracks: Tracks = new TracksImpl();
        tracks.tracks = response.data.tracks;
        this.tracksUpdated.next(tracks);
        res(tracks);
      });
    });
  }

  /**
   * Return all Tracks
   *
   * @return {Promise<Track[]>} An array of Tracks.
   */
  public async getAllTracks(playlist?: Playlist, onlyNotInPlaylist = true): Promise<Tracks> {
    const inclusiveOrExclusiveFilter = onlyNotInPlaylist ? 'notInPlaylistId' : 'inPlaylistId';
    const forPlaylistFilter = playlist !== null ? `(${inclusiveOrExclusiveFilter}: ${playlist.id })` : '';
    return new Promise<Tracks>((res, rej) => {
      this.apollo.query({
        query: gql`{
                  tracks${forPlaylistFilter} {
                    id
                    title
                    performer
                    duration
                    album
                    playcount
                    publicationDate
                    description
                    offlineAvailable
                  }
                }`
      }).subscribe((response: ApolloQueryResult<{ tracks: Track[] }>) => {
        const tracks: Tracks = new TracksImpl();
        tracks.tracks = response.data.tracks;
        res(tracks);
      });
    })
  }

  /**
   * Return all Tracks for the given playlist.
   *
   * @return {Promise<Track[]>} An array of Tracks.
   */
  public async getTracksForPlaylist(playlist: Playlist): Promise<Tracks> {
    return this.getAllTracks(playlist, false);
  }
}
