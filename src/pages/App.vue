<template>
  <div class="colorSetter" :style="{
    '--ymk-color': ZKStore.colors.elColor,
    '--ymk-text-color': ZKStore.colors.textColor,
    '--ymk-progress-bg-color': ZKStore.colors.progressBgColor,
    '--ymk-progress-fill-color': ZKStore.colors.progressFillColor,
    '--ymk-progress-choose-fill-color': ZKStore.colors.progressChooseFillColor,
  }">
    <div class="backgroundFrame">
      <video autoplay muted loop src="@/assets/bg.mp4"></video>
    </div>
    <Transition name="uianim">
      <Dialog>
        <Component :is="ZKStore.dialog.dialogEl" />
      </Dialog>
    </Transition>
    <Transition name="uianim">
      <FullPlay v-show="ZKStore.showFullPlay"></FullPlay>
    </Transition>
    <div class="container">
      <div data-tauri-drag-region class="header forbidSelect">
        <div data-tauri-drag-region class="title">Yumuzk</div>
        <Transition appear name="playcontroller">
          <div v-show="!ZKStore.showFullPlay" class="tabs">
            <div @click="ZKStore.nowTab = 'Playlist'" :class="{tab: true, active: ZKStore.nowTab === 'Playlist'}">首页</div>
            <div @click="ZKStore.nowTab = 'PlaylistRecommend_netease'" :class="{tab: true, active: ZKStore.nowTab === 'PlaylistRecommend_netease'}">推荐</div>
            <div @click="turnToPlaylistDetail" :class="{tab: true, active: ZKStore.nowTab === 'PlaylistDetail'}">歌单</div>
            <div @click="ZKStore.nowTab = 'Search'" :class="{tab: true, active: ZKStore.nowTab === 'Search'}">搜索</div>
            <div @click="ZKStore.nowTab = 'BlankPage'" :class="{tab: true, active: ZKStore.nowTab === 'BlankPage'}">空白</div>
            <div @click="ZKStore.nowTab = 'UserCenter'" :class="{tab: true, active: ZKStore.nowTab === 'UserCenter'}">
              <div class="text">{{ ZKStore.neteaseUser.nickname || '用户' }}</div>
              <img v-if="ZKStore.neteaseUser.avatarUrl" style="border-radius: 50%;margin-left: 4px;margin-top:6px; height: 28px;" :src="ZKStore.neteaseUser.avatarUrl" alt="">
            </div>
            <div @click="ZKStore.nowTab = 'Settings'" :class="{tab: true, active: ZKStore.nowTab === 'Settings'}">设置</div>
          </div>
        </Transition>
        <div class="controlbtn">
          <button @click="appWindow.minimize()" class="btn minimize">-</button>
          <button @click="exit(1)" class="btn close">×</button>
        </div>
      </div>
      <div class="content">
        <div v-show="ZKStore.showFullPlay"></div>
        <Transition v-show="!ZKStore.showFullPlay" appear name="uianim">
          <Playlist key="Playlist" v-if="ZKStore.nowTab === 'Playlist'"></Playlist>
          <Playlist key="PlaylistRecommend_netease" v-else-if="ZKStore.nowTab === 'PlaylistRecommend_netease'"></Playlist>
          <PlaylistDetail key="PlaylistDetail" v-else-if="ZKStore.nowTab === 'PlaylistDetail'"></PlaylistDetail>
          <Loading key="Loading" v-else-if="ZKStore.nowTab === 'Loading'"></Loading>
          <Search key="Search" v-else-if="ZKStore.nowTab === 'Search'"></Search>
          <UserCenter key="UserCenter" v-else-if="ZKStore.nowTab === 'UserCenter'"></UserCenter>
          <Settings key="Settings" v-else-if="ZKStore.nowTab === 'Settings'"></Settings>
          <BlankPage key="BlankPage" v-else-if="ZKStore.nowTab === 'BlankPage'"></BlankPage>
        </Transition>
      </div>
      <Playbar></Playbar>
    </div>
    <Message />
  </div>
</template>

<script setup lang="ts">
import '@/assets/anim.css'
import { readDir, createDir, BaseDirectory, exists, readTextFile, FileEntry } from '@tauri-apps/api/fs';
import { exit } from '@tauri-apps/api/process';
import { appWindow } from '@tauri-apps/api/window';
import { useZKStore, saveConfig } from '@/stores/useZKstore'
import axios from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { clientInjectionKey, normalClientInjectionKey, song } from '@/types';
import { onMounted, onUnmounted, provide, shallowRef, watch } from 'vue';
import { WBI } from '@/WBI';
import Playlist from '@/pages/Playlist.vue';
import PlaylistDetail from '@/pages/PlaylistDetail.vue';
import Loading from '@/pages/Loading.vue'
import FullPlay from '@/pages/FullPlay.vue'
import Playbar from '@/pages/Playbar.vue'
import Search from '@/pages/Search.vue'
import UserCenter from '@/pages/UserCenter.vue';
import Message from '@/components/Message.vue';
import Dialog from '@/components/Dialog.vue'
import { minmax } from '@/utils/u';
import emitter from '@/emitter';
import { path } from '@tauri-apps/api';

const axiosController = new AbortController();
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Unforgettable",
    artist: "Nat King Cole"
  });
  navigator.mediaSession.setActionHandler("play", () => ZKStore.play.status = 'play');
  navigator.mediaSession.setActionHandler("pause", () => ZKStore.play.status = 'pause');
  navigator.mediaSession.setActionHandler("seekbackward", (e) => console.log('$seekB', e));
  navigator.mediaSession.setActionHandler("seekforward", (e) => console.log('$seekF', e));
  navigator.mediaSession.setActionHandler("previoustrack", () => emitter.emit('playPrevSong'));
  navigator.mediaSession.setActionHandler("nexttrack", () => emitter.emit('playNextSong'))
}
const ZKStore = useZKStore();
//监听cookie
watch(() => ZKStore.neteaseUser.cookie, (nv) => {
  document.cookie = nv;
})
const client = axios.create({
  adapter: axiosTauriApiAdapter,
  headers: {
    "User-Agent": 'Mozilla',
    referer: 'https://www.bilibili.com',
  },
  signal: axiosController.signal
});
const normalClient = axios.create({
  adapter: axiosTauriApiAdapter,
  headers: {
    "User-Agent": 'Mozilla',
  },
  signal: axiosController.signal
});
import CollectDialog from '@/components/Dialogs/CollectDialog.vue'
import Settings from "@/pages/Settings.vue";
import BlankPage from "@/pages/BlankPage.vue";
ZKStore.dialog.dialogEl = shallowRef(CollectDialog);
// normalClient.interceptors.response.use(function (response) {
//     return response;
//   }, function (error) {
//     console.log(error);
//     showMsg(ZKStore.message, 4000, error);
//     return Promise.reject(error);
//   });
// client.interceptors.response.use(function (response) {
//   return response;
// }, function (error) {
//   console.log(error);
//   showMsg(ZKStore.message, 4000, error);
//   return Promise.reject(error);
// });
function turnToPlaylistDetail() {
  if ('title' in ZKStore.playlist.raw) {
    ZKStore.nowTab = 'PlaylistDetail'
  }
}
client.get('https://api.bilibili.com/x/web-interface/nav').then(res => {
  const {data: {data: { wbi_img: { img_url, sub_url } } } } = res;
  ZKStore.wbi = {
    img_key: img_url.slice(
      img_url.lastIndexOf('/') + 1,
      img_url.lastIndexOf('.')
    ),
    sub_key: sub_url.slice(
      sub_url.lastIndexOf('/') + 1,
      sub_url.lastIndexOf('.')
    )
  }
  client.interceptors.request.use((config) => {
    let WB = WBI(ZKStore.wbi, config.params)
      config.params = WB;
      return config;
    })
}).catch(err => {console.log(err);})

onMounted(() => {
  readTextFile("res/config.json", {dir: BaseDirectory.Resource}).then(res => {
    if (res) {
      let jp = JSON.parse(res);
      ZKStore.config = jp.config;
      ZKStore.neteaseUser = jp.neteaseUser;
      ZKStore.colors = jp.colors;
      if (ZKStore.config.volume != undefined) {
        emitter.emit('changeVolumeTo', minmax(ZKStore.config.volume, 0, 1));
      }
      if (ZKStore.config.mode) {
        ZKStore.play.mode = ZKStore.config.mode;
      }
    }
  })
  watch(() => ZKStore.play.mode, () => {ZKStore.config.mode = ZKStore.play.mode; saveConfig()});
})
provide(clientInjectionKey, client);
provide(normalClientInjectionKey, normalClient);
(async ()=> {
  async function refreshPlaylists({notReset}: {notReset: boolean}) {
    ZKStore.playlists = [];
    ZKStore.playlistsParts = [];
    ZKStore.playlist.listIndex = -1;
    if (!notReset) {
      Object.assign(ZKStore.playlist, {
        songs: <song[]>[],
        raw: {}
      })
    }
    await readDir(`res/lists`, {dir: BaseDirectory.Resource}).then(res => {
      {
        loadLocalPlaylists(res)
      }
    });
    if (ZKStore.neteaseUser.cookie) {
      let res = await normalClient.post(`${ZKStore.config.neteaseApi.url}user/playlist?uid=${ZKStore.neteaseUser.uid}`, {
        cookie: ZKStore.neteaseUser.cookie,
      })
      let c = res.data.playlist.length;
      console.log(c, ZKStore.playlistsParts[ZKStore.playlistsParts.length - 1].count);
      ZKStore.playlists.push(...res.data.playlist.map((playlist: any) => ({
        title: playlist.name,
        pic: playlist.coverImgUrl,
        intro: 'FROM NETEASE',
        originFilename: 'REMOTE',
        playlist: [{
          type: 'trace_netease_playlist',
          id: playlist.id
        }]
      })))
      ZKStore.playlistsParts.push({
        title: '网易云',
        begin: ZKStore.playlistsParts[ZKStore.playlistsParts.length - 1].begin + ZKStore.playlistsParts[ZKStore.playlistsParts.length - 1].count,
        count: c,
      })
    }
    {
      let res = await normalClient.get(`${ZKStore.config.neteaseApi.url}personalized`);
      let c = res.data.result.length;
      ZKStore.playlists.push(...res.data.result.map((playlist: any) => ({
        title: playlist.name,
        pic: playlist.picUrl,
        intro: 'NETEASE RECOMMEND',
        originFilename: 'REMOTE',
        playlist: [{
          type: 'trace_netease_playlist',
          id: playlist.id
        }]
      })))
      ZKStore.playlistsParts.push({
        title: '网易云推荐',
        begin: ZKStore.playlistsParts[ZKStore.playlistsParts.length - 1].begin + ZKStore.playlistsParts[ZKStore.playlistsParts.length - 1].count,
        count: c,
        other: {
          type: 'recommend_netease',
          showInMainPage: false
        }
      })
    }
  }
  ZKStore.resourceDir = (await path.resourceDir()).substring(4).replaceAll('\\', '/');
    if (!await exists('res/lists', {dir: BaseDirectory.Resource})) {
        createDir("res/lists", {dir: BaseDirectory.Resource})
    }
    // 自动运行api服务
    // let neteaseapi = new Command('node', ['./res/neteaseapi/app.js'], {cwd: await resourceDir()});
    // neteaseapi.spawn();
  async function loadLocalPlaylists(files: FileEntry[]) {  
    let c = 0;
    ZKStore.playlists.push(...(await Promise.all(
      files.filter(f => {
        if (f.path.substring(f.path.lastIndexOf('.')) === '.json') {
          c++;
          return true;
        }else {
          return false;
        }
      }).map(
          async (file: FileEntry) => ({
            ...JSON.parse(await readTextFile(file.path)),
            originFilename: file.path.substring(file.path.lastIndexOf('\\') + 1)
          })))))
    ZKStore.playlistsParts.push({
      title: '本地',
      begin: 0,
      count: c
    })
  }
  refreshPlaylists({notReset: false});
  emitter.on('refreshPlaylists', (conf) => {
    refreshPlaylists(conf);
  });
})();
onUnmounted(() => {
  emitter.off('refreshPlaylists')
})
</script>

<style>
body {
    background: rgb(255,255,255);
}
</style>

<style scoped>

.backgroundFrame {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
.backgroundFrame video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.container {
  display: grid;
  grid-template-rows: 64px 1fr 64px;
  flex-direction: column;
  font-family: HarmonyOS Sans;
  /* border-radius: 4px; */
  width: 100vw;
  height: 100vh;
}
.header {
  position: relative;
  display: flex;
  align-items: center;
  height: 64px;
  /* border-bottom: 1px solid #e2e3e5; */
}
.header .title {
  font-family: NovecentoWide;
  font-size: 22px;
  margin-left: 24px;
  line-height: 32px;
  color: rgba(0,0,0,.9);
}
.header .controlbtn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 20px;
  z-index: 100;
}
.header .controlbtn .btn {
  width: 32px;
  height: 32px;
  line-height: 1;
  border: none;
  background-color: transparent;
  transition: background-color .2s;
}
.header .controlbtn .btn:hover {
  background-color: #eee;
}
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.header .tabs {
    margin-left: 50px;
    display: flex;
}
.header .tab {
  font-family: SourceSansCNM;
  /* font-weight: bold; */
  display: flex;
  font-size: 18px;
  margin: 0 8px;
  padding: 5px 0;
  height: 48px;
  line-height: 40px;
  transition: all .2s;
}
.header .tab img {
  display: inline-block;
}
.header .tab.active {
    border-bottom: 4px solid #18191C
}
</style>