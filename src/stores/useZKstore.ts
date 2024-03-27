import { defineStore } from 'pinia';
import type {list, song, songInPlay, song_lrc_item} from '../types'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
export let config: any = {};
readTextFile("res/config.json", {dir: BaseDirectory.Resource}).then(res => {
  if (res) {
    config = JSON.parse(res);
  }
})
export function saveConfig() {
  writeTextFile('res/config.json', JSON.stringify(config), {dir: BaseDirectory.Resource})
}

export const useZKStore = defineStore('ZK', {
  state: () => ({
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
    },
    wbi: {},
    histroy: []
  }),
  // 在这里可以定义 getters、mutations 和 actions
});
