import {Injectable} from '@angular/core';
import {Playlists} from '../../models/playlists/playlists.interface.model';
import {RestfulSpotitubeClientService} from '../restful-spotitube-client/restful-spotitube-client.service';
import {LoggingService} from '../logging/logging.service';


import {Playlist} from '../../models/playlist/playlist.interface.model';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {ApolloQueryResult} from 'apollo-client';
import {PlaylistsImpl} from '../../models/playlists/playlists.model';

@Injectable()
export class PlaylistService extends RestfulSpotitubeClientService {

  /**
   * Create a new PlaylistService
   *
   * @param {LoggingService} loggingService
   * @param apollo
   */
  constructor(loggingService: LoggingService, private apollo: Apollo) {

    super(loggingService);
  }

  /**
   * Return a complete list of playlists.
   *
   * @return {Promise<Playlists>} The complete list of playlists
   */
  public async getPlaylists(): Promise<Playlists> {
    return new Promise<Playlists>((res, rej) => {
      this.apollo.query({
        fetchPolicy: 'no-cache',
        query: gql`{
              playlists {
                id
                name
                owner
                tracks {
                  duration
                }
              }
            }`
      }).subscribe((response: ApolloQueryResult<{ playlists: Playlist[] }>) => {
        const playlists: Playlists = new PlaylistsImpl();
        playlists.playlists = response.data.playlists;
        playlists.length = this.calculateLengthOfPlaylist(playlists.playlists);
        res(playlists);
      });
    })
  }

  private calculateLengthOfPlaylist(playlists: Playlist[]): number {
    return playlists
      .reduce((totalLength, playlist) => totalLength +
        playlist.tracks.reduce((totalTrackDuration, track) => totalTrackDuration + track.duration, 0)
        , 0);
  }

  /**
   * Create a new Playlist.
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async newPlaylist(playlist: Playlist): Promise<Playlists> {
    return new Promise<Playlists>((res, rej) => {
      this.apollo.mutate({
        mutation: gql`mutation {
                    createPlaylist(input: {name: "${playlist.name}"}){
                      id
                      name
                      owner
                    }
          }`
      }).subscribe((response: ApolloQueryResult<{ createPlaylist: Playlist[] }>) => {
        const playlists = new PlaylistsImpl();
        playlists.playlists = response.data.createPlaylist;
        res(playlists);
      });
    });
  }

  /**
   * Update the given playlist.
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async updatePlaylist(playlist: Playlist): Promise<Playlists> {
    return new Promise<Playlists>((res, rej) => {
      this.apollo.mutate({
        mutation: gql`mutation {
                    updatePlaylist(id: ${playlist.id}, input: {name: "${playlist.name}"}){
                      id
                      name
                      owner
                    }
          }`
      }).subscribe((response: ApolloQueryResult<{ updatePlaylist: Playlist[] }>) => {
        const playlists = new PlaylistsImpl();
        playlists.playlists = response.data.updatePlaylist;
        res(playlists);
      });
    });
  }

  /**
   * Delete the given playlist
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async deletePlaylist(playlist: Playlist): Promise<Playlists> {
    return new Promise<Playlists>((res, rej) => {
      this.apollo.mutate({
        mutation: gql`mutation {
                    deletePlaylist(id: ${playlist.id}){
                      id
                      name
                      owner
                    }
          }`
      }).subscribe((response: ApolloQueryResult<{ deletePlaylist: Playlist[] }>) => {
        const playlists = new PlaylistsImpl();
        playlists.playlists = response.data.deletePlaylist;
        res(playlists);
      });
    });
  }
}
