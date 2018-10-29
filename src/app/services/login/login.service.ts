import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {RestfulSpotitubeClientService} from '../restful-spotitube-client/restful-spotitube-client.service';
import {LoggingService} from '../logging/logging.service';
import {PlaylistService} from '../playlist/playlist.service';
import {TrackService} from '../track/track.service';
import gql from 'graphql-tag';
import {ApolloQueryResult} from 'apollo-client';
import {Apollo} from 'apollo-angular';

@Injectable()
export class LoginService extends RestfulSpotitubeClientService {

  /**
   * Create a new LoginService
   *
   * @param playlistService
   * @param trackService
   * @param apollo
   * @param {LoggingService} loggingService
   */
  constructor(private playlistService: PlaylistService,
              private trackService: TrackService,
              private apollo: Apollo,
              loggingService: LoggingService) {
    super(loggingService);

    this.initAuthorizationErrorHandling();
  }

  /**
   * Login to the application
   *
   * @param {string} user
   * @param {string} password
   * @param {string} serverUrl
   */
  public login(user: string, password: string, serverUrl: string) {

    this.setNewSettings(serverUrl);
    this.handleLoginRequest(user, password);
  }

  /**
   * Logout of the application
   */
  public logout(): void {
    this.clearStorage();
  }

  private handleLoginRequest(user: string, password: string): void {
      this.apollo.mutate({
        mutation: gql`mutation {
            login(input: {user: "${user}", password: "${password}"}){
              user
              token
            }
          }`
      }).subscribe((response: ApolloQueryResult<{ login: {user: string, token: string}}>) => {
        const {login} = response.data;
        this.updateSettings(login.user, login.token);
      }, err => {
        this.handleLoginErrors(err);
      });
  }

  private handleLoginErrors(error: HttpErrorResponse): void {
    this.handleErrors(error);
    this.loggingService.error('Something wrong happened with the server response. Did your server respond with valid json?');
    this.clearStorage();
  }

  private initAuthorizationErrorHandling() {
    this.trackService.restError$.subscribe(error => this.handleAuthorizationError(error));
    this.playlistService.restError$.subscribe(error => this.handleAuthorizationError(error));
    this.restError$.subscribe(error => this.handleAuthorizationError(error));
  }

  private handleAuthorizationError(error: number) {
    if (error === 403 || error === 401) {
      this.loggingService.info('An authorization or Authentication error has occured. User is logged out.');
      this.logout();
    }
  }
}
