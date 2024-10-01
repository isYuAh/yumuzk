import { defineStore } from 'pinia';
import type {list, messageController, song, songInPlay, song_lrc_item, playlistPart} from '@/types'
import {BaseDirectory, readTextFile, writeTextFile} from '@tauri-apps/api/fs';
import CollectDialog from '@/components/Dialogs/CollectDialog.vue';
import { ref, shallowRef, watch} from 'vue';
import emitter from "@/emitter";
import {minmax} from "@/utils/u.ts";

export const useZKStore = defineStore('ZK', () => {
  const zks = ref({
    playlists: <list[]>[],
    playlistsParts: <playlistPart[]>[],
    nowTab: 'Playlist',
    loading: {
      text: '',
    },
    dialog: {
      show: false,
      dialogEl: <any>shallowRef(CollectDialog),
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
      playlist: <song[]>([]),
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
  });
  const config = ref<any>({});
  const colors = ref<any>({});
  const neteaseUser = ref<any>({});
  // const playlists = ref<list>([])
  // const playlistsParts = ref<playlistPart>([])
  // const nowTab = ref<any>('')
  // const loading = ref({
  //   text: ''
  // });
  // const dialogData = ref({
  //   waitCollect: <song>(null as any)
  // })
  // const dialog = ref({
  //   show: false,
  //   dialogEl: shallowRef(CollectDialog) as any,
  // })

  function saveConfig() {
    writeTextFile('res/config.json', JSON.stringify({config: config.value, neteaseUser: neteaseUser.value, colors: colors.value}), {dir: BaseDirectory.Resource})
  }

  // onMounted(() => {
    readTextFile("res/config.json", {dir: BaseDirectory.Resource}).then(res => {
      if (res) {
        let jp = JSON.parse(res);
        config.value = jp.config;
        neteaseUser.value = jp.neteaseUser;
        colors.value = jp.colors;
        if (config.value.volume != undefined) {
          emitter.emit('changeVolumeTo', minmax(config.value.volume, 0, 1));
        }
        if (config.value.mode) {
          zks.value.play.mode = config.value.mode;
        }
        console.log('###', config.value, jp.config)
      }
    })
    watch([() => zks.value.play.mode, colors, neteaseUser, config], () => {config.value.mode = zks.value.play.mode; saveConfig()}, {deep: true});
  // })
  return {zks, config, colors, neteaseUser, saveConfig};
});
