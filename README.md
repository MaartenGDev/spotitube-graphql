# OOSE DEA EAI Client [![Build Status](https://travis-ci.org/meronbrouwer/oose-dea-eai-client.svg?branch=master)](https://travis-ci.org/meronbrouwer/oose-dea-eai-client) [![Coverage Status](https://coveralls.io/repos/github/meronbrouwer/oose-dea-eai-client/badge.svg?branch=master)](https://coveralls.io/github/meronbrouwer/oose-dea-eai-client?branch=master)

This repository contains a front-end for the final programming assignment 
of the course OOSE-DEA at the [HAN University of Applied Sciences](https://www.han.nl/).

## Enabling CORS headers in your JavaEE container

To use this Spotitube Client with your own Spotitube Server, you will need to enable CORS headers
in your JavaEE container. 

This is required because the Client is served from a different domain than the Server. Your browser will only allow this if the Server has the CORS Headers set in its HTTP response.

To enable this, follow the steps below.

* Ensure that you understand the _why_. For instance, read: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
* Figure out how to perform the _how_. There are enough resources available on the World Wide Web.
 
## API

The following endpoints are expected

### Login

```
url:    /login 
method: POST
```

It will perform a request with an object in the body of the form

```
{
  user:     "meron", 
  password: "MySuperSecretPassword12341"
}
```

It will expect a response containing an object of the form

```
{
  token:  "1234-1234-1234", 
  user:   "Meron Brouwer"
}
```

This token is then stored in LocalStorage and used for each following
request.

### Playlists

#### Get all Playlists

To acquire a list of all playlists:
```
url:              /playlists 
method:           GET
query parameter:  token
```

It will expect a response containing the complete list of playlists:

```
{
  playlists :[
               {
                  "id"    : 1,
                  "name"  : "Death metal",
                  "owner" : true,
                  "tracks": []
               },
               {
                  "id"    : 2,
                  "name"  : "Pop",
                  "owner" : false,
                  "tracks": []
               }
              ],
  "length"  :123445}
```

The property `length` should be in seconds. The client will convert this to hh:mm:ss.

#### Delete a Playlist

To delete a playlist:
```
url:              /playlists/:id
method:           DELETE
query parameter:  token
```
It will expect a response containing the complete and modified list of playlists:

```
{
  playlists :[
               {
                  "id"    : 1,
                  "name"  : "Heavy Metal",
                  "owner" : true,
                  "tracks": []
               }
              ],
  "length"  :6445}
```

#### Add a Playlist

To add a playlist:
```
url:              /playlists
method:           POST
query parameter:  token
```

The body should contain the new playlist:
```
{
  "id"    : -1,
  "name"  : "Progressive Rock",
  "owner" : true,
  "tracks": []
},
```

Note that the client will set the id to -1. The server is responsible for generating a unique id, which must be set on the response object.

It will expect a response containing the complete and modified list of playlists:

```
{
  playlists :[
               {
                  "id"    : 1,
                  "name"  : "Heavy Metal",
                  "owner" : true,
                  "tracks": []
               },
               {
                  "id"    : 2,
                  "name"  : "Pop",
                  "owner" : false,
                  "tracks": []
               },
               {
                 "id"    : 3,
                 "name"  : "Progressive Rock",
                 "owner" : true,
                 "tracks": []
               },
              ],
  "length"  :123445}
```
The property `length` should be in seconds. The client will convert this to hh:mm:ss.

#### Edit a Playlist

To edit the name of a playlist:
```
url:              /playlists/:id
method:           PUT
query parameter:  token
```

The body should contain the modified playlist:
```
{
  "id"    : 1,
  "name"  : "Heavy Metal",
  "owner" : true,
  "tracks": []
},
```

It will expect a response containing the complete and modified list of playlists:

```
{
  playlists :[
               {
                  "id"    : 1,
                  "name"  : "Heavy Metal",
                  "owner" : true,
                  "tracks": []
               },
               {
                  "id"    : 2,
                  "name"  : "Pop",
                  "owner" : false,
                  "tracks": []
               }
              ],
  "length"  :123445
}
```
The property `length` should be in seconds. The client will convert this to hh:mm:ss.
### Tracks

#### Get all tracks that belong to a Playlist

To receive all tracks from a given Playlist
```
url:              /playlists/:id/tracks
method:           GET
query parameter:  token
```

It will expect a response containing the complete list of tracks for the given:

```
{
  tracks: [
            {
              id: 1,
              title: 'Song for someone',
              performer: 'The Frames',
              duration: 350,
              album: 'The cost',
              playcount: undefined,
              publicationDate: undefined,
              description: undefined,
              onlineAvailable: false
            },
            {
              id: 2,
              title: 'The cost',
              performer: 'The Frames',
              duration: 423,
              album: undefined,
              playcount: 37,
              publicationDate: '10-01-2005',
              description: 'Title song from the Album The Cost ',
              offlineAvailable: true
            }
          ]
}
```
The property `duration` should be in seconds. The client will convert this to hh:mm:ss.
The property `publicationDate` should be a String representation of a Date, formatted as MM-dd-yyyy 

#### Remove a track from a Playlist

```
url:              /playlists/:id/tracks/:id
method:           DELETE
query parameter:  token
```
It will expect a response containing the complete and modified list of tracks:

```
{
  tracks: [
            {
              id: 1,
              title: 'Song for someone',
              performer: 'The Frames',
              duration: 350,
              album: 'The cost',
              playcount: undefined,
              publicationDate: undefined,
              description: undefined,
              onlineAvailable: false
            }
          ]
}
```

## For local installation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
