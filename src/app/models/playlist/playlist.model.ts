import {Playlist} from './playlist.interface.model';
import {Track} from '../track/track.interface';

export class PlaylistImpl implements Playlist {
  id: number;
  name: string;
  owner: boolean;
  tracks: Track[] = [];

  constructor(name: string) {
    this.id = -1;
    this.name = name;
    this.owner = false;
  }
}
