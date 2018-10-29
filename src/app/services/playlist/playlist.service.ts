import {Injectable} from '@angular/core';
import {Playlists} from '../../models/playlists/playlists.interface.model';
import {RestfulSpotitubeClientService} from '../restful-spotitube-client/restful-spotitube-client.service';
import {HttpClient} from '@angular/common/http';
import {LoggingService} from '../logging/logging.service';
import {AppConstants} from '../../app.constants';


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
   * @param {HttpClient} httpClient
   * @param {LoggingService} loggingService
   * @param apollo
   */
  constructor(private httpClient: HttpClient,
              loggingService: LoggingService, private apollo: Apollo) {

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
        query: gql`{
              playlists {
                id
                name
                owner
                tracks {
                  id
                  title
                  duration
                }
              }
            }`
      }).subscribe((response: ApolloQueryResult<{ playlists: Playlist[] }>) => {
        const playlists: Playlists = new PlaylistsImpl();
        playlists.playlists = response.data.playlists;
        playlists.length = playlists.playlists
          .reduce((totalLength, playlist) => totalLength +
            playlist.tracks.reduce((totalTrackDuration, track) => totalTrackDuration + track.duration, 0), 0);

        console.log(playlists.length)

        res(playlists);
      });
    })
  }

  /**
   * Create a new Playlist.
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async newPlaylist(playlist: Playlist): Promise<Playlists> {
    const endpointUrl = this.getPlaylistEndpoint(undefined);
    const params = this.createtokenParam();

    try {
      const data: Playlists = await this.httpClient.post<Playlists>(endpointUrl,
        JSON.stringify(playlist),
        {
          headers: this.headers,
          params: params
        }
      ).toPromise();
      return data;
    } catch (err) {
      this.handleErrors(err)
      return Promise.reject(err);
    }
  }

  /**
   * Update the given playlist.
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async updatePlaylist(playlist: Playlist): Promise<Playlists> {
    const endpointUrl = this.getPlaylistEndpoint(playlist);
    const params = this.createtokenParam();

    try {
      const data: Playlists = await this.httpClient.put<Playlists>(endpointUrl,
        JSON.stringify(playlist),
        {
          headers: this.headers,
          params: params
        }
      ).toPromise();
      return data;
    } catch (err) {
      this.handleErrors(err)
      return Promise.reject(err);
    }
  }

  /**
   * Delete the given playlist
   *
   * @param {Playlist} playlist
   * @return {Promise<Playlists>} The complete and updated list of playlists
   */
  public async deletePlaylist(playlist: Playlist): Promise<Playlists> {
    const endpointUrl = this.getPlaylistEndpoint(playlist);
    const params = this.createtokenParam();

    try {
      const data: Playlists = await this.httpClient.delete<Playlists>(endpointUrl,
        {params: params}).toPromise();
      return data;
    } catch (err) {
      this.handleErrors(err)
      return Promise.reject(err);
    }
  }

  private getPlaylistEndpoint(playlist: Playlist): string {
    const baseEndpointUrl = this.createEndpointUrl(AppConstants.API_PLAYLISTS);

    if (playlist) {
      return (baseEndpointUrl.concat('/')).concat(playlist.id.toString());
    } else {
      return baseEndpointUrl;
    }
  }
}
