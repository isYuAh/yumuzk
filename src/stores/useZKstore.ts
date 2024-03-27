import { defineStore } from 'pinia';
import type {list, song, songInPlay, song_lrc_item} from '../types'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
export function saveConfig() {
  writeTextFile('res/config.json', JSON.stringify(useZKStore().config), {dir: BaseDirectory.Resource})
}

export const useZKStore = defineStore('ZK', {
  state: () => ({
    config: {} as any,
    playlists: <list[]>[],
    nowTab: 'Playlist',
    loading: {
      text: '',
    },
    showFullPlay: false,
    playlist: {
      listIndex: -1,
      songs: <song[]>[],
    },
    play: {
      playlist: <song[]>([] as any),
      indexInPlaylist: -1,
      song: <songInPlay>({} as any),
      curTime: '',
      durationTime: '',
      duration: 0,
      status: 'pause',
      mode: 'list',
      activeLrc: -1,
      lrcConfig: <song_lrc_item[]>[],
      show_songface: false,
      volume: 1,
      progress: 0,
    },
    wbi: {},
    histroy: []
  }),
  // 在这里可以定义 getters、mutations 和 actions
});
