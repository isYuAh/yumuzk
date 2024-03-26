import { defineStore } from 'pinia';
import type {list, song, song_lrc_item} from '../types'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

export let config = JSON.parse(await readTextFile("res/config.json", {dir: BaseDirectory.Resource}));
export function saveConfig() {
  writeTextFile('res/config.json', JSON.stringify(config), {dir: BaseDirectory.Resource})
}

export const useZKStore = defineStore('ZK', {
  state: () => ({
    lists: <list[]>[],
    nowTab: 'List',
    play: {
      songs: <song[]>([] as any),
      song: <song>({} as any),
      duration: 0,
      songIndex: -1,
      status: 'pause',
      mode: config.mode || 'list',
      activeLrc: -1,
      lrcConfig: <song_lrc_item[]>[],
      list: {
        pic: '',
        title: ''
      },
      volume: config.volume === undefined ? 100 : config.volume,
    },
    wbi: {},
  }),
  // 在这里可以定义 getters、mutations 和 actions
});
