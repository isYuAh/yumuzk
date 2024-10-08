import { defineStore } from 'pinia';
import type {list, messageController, song, songInPlay, song_lrc_item, playlistPart} from '@/types'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import CollectDialog from '@/components/Dialogs/CollectDialog.vue';
import { shallowRef } from 'vue';
export function saveConfig() {
  writeTextFile('res/config.json', JSON.stringify({config: useZKStore().config, neteaseUser: useZKStore().neteaseUser, colors: useZKStore().colors}), {dir: BaseDirectory.Resource})
}

export const useZKStore = defineStore('ZK', {
  state: () => ({
    config: {} as any,
    colors: {} as any,
    playlists: <list[]>[],
    playlistsParts: <playlistPart[]>[],
    nowTab: 'Playlist',
    loading: {
      text: '',
    },
    dialog: {
      show: false,
      dialogEl: shallowRef(CollectDialog) as any,
    },
    dialogData: {
      waitCollect: <song>(null as any)
    },
    message: <messageController>{
      show: false,
      text: '',
      timer: <NodeJS.Timeout>(null as any),
    },
    resourceDir: '',
    showFullPlay: false,
    showPlaylistSonglist: false,
    playlist: {
      listIndex: -1,
      raw: <list>{},
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
    histroy: [],
    neteaseUser: {
      nickname: '',
      avatarUrl: '',
      vipType: '0',
      uid: '',
      cookie: '',
      signature: '',
    },
  }),
});
