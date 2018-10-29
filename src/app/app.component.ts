import {Component, OnInit} from '@angular/core';
import {LoginService} from './services/login/login.service';
import {MatSnackBar} from '@angular/material';
import {Settings} from './models/settings/settings.interface.model';
import {PlaylistService} from './services/playlist/playlist.service';
import {TrackService} from './services/track/track.service';
import {ApolloLink} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {GraphQLError} from 'graphql';
import {HttpHeaders} from '@angular/common/http';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public serverUrl: string;
  public user: string;

  constructor(private loginService: LoginService,
              private playlistService: PlaylistService,
              private trackService: TrackService,
              private apollo: Apollo,
              private httpLink: HttpLink,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.initSettings();
    this.initErrorSnackbar();
    this.initApollo();
  }

  /**
   * Logout of the application.
   */
  public logout(): void {
    this.loginService.logout();
  }

  private initErrorSnackbar(): void {
    this.loginService.restError$.subscribe(error => this.showError(error));
    this.playlistService.restError$.subscribe(error => this.showError(error));
    this.trackService.restError$.subscribe(error => this.showError(error));
  }

  private initSettings(): void {
    this.loginService.getSettings()
      .then(settings => this.setSettings(settings))
      .catch(any => this.setSettings(undefined));

    this.loginService.settingsChanged$.subscribe(settings => this.setSettings(settings));
  }

  private setSettings(settings: Settings): void {
    if (settings) {
      this.serverUrl = settings.server;
      this.user = settings.user;
    } else {
      this.serverUrl = undefined;
      this.user = undefined;
    }
  }

  private showError(error: number): void {
    this.snackBar.open('Http status code ' + error, 'close')
  }

  private showErrorMessage(error: string): void {
    this.snackBar.open(error, 'close')
  }

  private async initApollo() {
    const host = await this.loginService.getSettings();
    const http = this.httpLink.create({uri: host.server + '/graphql'});

    let token = '';
    this.loginService.settingsChanged$.subscribe(settings => token = settings.token);

    const authMiddleware = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      });

      return forward(operation);
    });

    const onErrorLink = onError(({forward, operation, response}) => {
      const errors = response === null
        ? []
        : (response.errors || []);

      for (const error of errors) {
        this.showErrorMessage((error as GraphQLError).message);
      }
    });

    const link = ApolloLink.from([
      onErrorLink,
      authMiddleware,
      http
    ]);

    this.apollo.create({
      link: link,
      cache: new InMemoryCache()
    });
  }
}
