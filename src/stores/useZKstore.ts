import { defineStore } from 'pinia';
import type {list, messageController, song, songInPlay, song_lrc_item} from '../types'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import CollectDialog from '@/components/CollectDialog.vue';
import { shallowRef } from 'vue';
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
    dialog: {
      show: false,
      dialogEl: shallowRef(CollectDialog) as any,
    },
    dialogData: {
      waitCollect: <song>(null as any),
    },
    message: <messageController>{
      show: false,
      text: '',
      timer: <NodeJS.Timeout>(null as any),
    },
    resourceDir: '',
    showFullPlay: false,
    playlist: {
      listIndex: -1,
      songs: <song[]>[],
    },
    play: {
      playlist: <song[]>([] as any),
      indexInPlaylist: -1,
      song: <songInPlay>{
        pic: '',
        title: '',
        singer: '',
        type: '',
        url: '',
        lrc: {
          status: 'disabled',
          type: 'local',
          path: '',
          lrc: [],
        },
        translationLrc: {
          status: 'disabled',
          type: 'local',
          path: '',
          lrc: [],
        },
        origin: null as any
      },
      curTime: '',
      lang: 'origin',
      curTimeNum: 0,
      durationTime: '',
      duration: 0,
      status: 'pause',
      mode: 'list',
      activeLrc: -1,
      lrcConfig: <song_lrc_item[]>[],
      show_songface: false,
      volume: 1,
      progress: 0,
      highlightLrcIndex: -1,
    },
    wbi: {},
    histroy: []
  }),
  // 在这里可以定义 getters、mutations 和 actions
});
