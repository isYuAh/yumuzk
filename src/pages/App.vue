<template>
  <div class="colorSetter" :style="{
    '--ymk-color': colors.elColor,
    '--ymk-text-color': colors.textColor,
    '--ymk-progress-bg-color': colors.progressBgColor,
    '--ymk-progress-fill-color': colors.progressFillColor,
    '--ymk-progress-choose-fill-color': colors.progressChooseFillColor,
  }">
    <div class="backgroundFrame">
      <video autoplay muted loop src="@/assets/bg.mp4"></video>
    </div>
    <Transition name="uianim">
      <Dialog>
        <Component :is="zks.dialog.dialogEl" />
      </Dialog>
    </Transition>
    <Transition name="uianim">
      <FullPlay v-show="zks.showFullPlay"></FullPlay>
    </Transition>
    <div class="container">
      <div data-tauri-drag-region class="header forbidSelect">
        <div data-tauri-drag-region class="title">Yumuzk</div>
        <Transition appear name="playcontroller">
          <div v-show="!zks.showFullPlay" class="tabs">
            <div @click="zks.nowTab = 'Playlist'" :class="{tab: true, active: zks.nowTab === 'Playlist'}">首页</div>
            <div @click="zks.nowTab = 'PlaylistRecommend_netease'" :class="{tab: true, active: zks.nowTab === 'PlaylistRecommend_netease'}">推荐</div>
            <div @click="turnToPlaylistDetail" :class="{tab: true, active: zks.nowTab === 'PlaylistDetail'}">歌单</div>
            <div @click="zks.nowTab = 'Search'" :class="{tab: true, active: zks.nowTab === 'Search'}">搜索</div>
            <div @click="zks.nowTab = 'BlankPage'" :class="{tab: true, active: zks.nowTab === 'BlankPage'}">空白</div>
            <div @click="zks.nowTab = 'UserCenter'" :class="{tab: true, active: zks.nowTab === 'UserCenter'}">
              <div class="text">{{ neteaseUser.nickname || '用户' }}</div>
              <img v-if="neteaseUser.avatarUrl" style="border-radius: 50%;margin-left: 4px;margin-top:6px; height: 28px;" :src="neteaseUser.avatarUrl" alt="">
            </div>
            <div @click="zks.nowTab = 'Settings'" :class="{tab: true, active: zks.nowTab === 'Settings'}">设置</div>
          </div>
        </Transition>
        <div class="controlbtn">
          <button @click="appWindow.minimize()" class="btn minimize">-</button>
          <button @click="exit(1)" class="btn close">×</button>
        </div>
      </div>
      <div class="content">
        <div v-show="zks.showFullPlay"></div>
        <Transition v-show="!zks.showFullPlay" appear name="uianim">
          <Playlist key="Playlist" v-if="zks.nowTab === 'Playlist'"></Playlist>
          <Playlist key="PlaylistRecommend_netease" v-else-if="zks.nowTab === 'PlaylistRecommend_netease'"></Playlist>
          <PlaylistDetail key="PlaylistDetail" v-else-if="zks.nowTab === 'PlaylistDetail'"></PlaylistDetail>
          <Loading key="Loading" v-else-if="zks.nowTab === 'Loading'"></Loading>
          <Search key="Search" v-else-if="zks.nowTab === 'Search'"></Search>
          <UserCenter key="UserCenter" v-else-if="zks.nowTab === 'UserCenter'"></UserCenter>
          <Settings key="Settings" v-else-if="zks.nowTab === 'Settings'"></Settings>
          <BlankPage key="BlankPage" v-else-if="zks.nowTab === 'BlankPage'"></BlankPage>
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
import { useZKStore } from '@/stores/useZKstore'
import axios from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { clientInjectionKey, normalClientInjectionKey, song } from '@/types';
import { onUnmounted, provide, shallowRef, watch } from 'vue';
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
import emitter from '@/emitter';
import { path } from '@tauri-apps/api';

const axiosController = new AbortController();
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Unforgettable",
    artist: "Nat King Cole"
  });
  navigator.mediaSession.setActionHandler("play", () => zks.value.play.status = 'play');
  navigator.mediaSession.setActionHandler("pause", () => zks.value.play.status = 'pause');
  navigator.mediaSession.setActionHandler("seekbackward", (e) => console.log('$seekB', e));
  navigator.mediaSession.setActionHandler("seekforward", (e) => console.log('$seekF', e));
  navigator.mediaSession.setActionHandler("previoustrack", () => emitter.emit('playPrevSong'));
  navigator.mediaSession.setActionHandler("nexttrack", () => emitter.emit('playNextSong'))
}
const {zks, neteaseUser, config, colors} = storeToRefs(useZKStore());
//监听cookie
watch(() => neteaseUser.value.cookie, (nv) => {
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
import {storeToRefs} from "pinia";
zks.value.dialog.dialogEl = shallowRef(CollectDialog);
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
  if ('title' in zks.value.playlist.raw) {
    zks.value.nowTab = 'PlaylistDetail'
  }
}
client.get('https://api.bilibili.com/x/web-interface/nav').then(res => {
  const {data: {data: { wbi_img: { img_url, sub_url } } } } = res;
  zks.value.wbi = {
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
    let WB = WBI(zks.value.wbi, config.params)
      config.params = WB;
      return config;
    })
}).catch(err => {console.log(err);})

provide(clientInjectionKey, client);
provide(normalClientInjectionKey, normalClient);
(async ()=> {
  async function refreshPlaylists({notReset}: {notReset: boolean}) {
    zks.value.playlists = [];
    zks.value.playlistsParts = [];
    zks.value.playlist.listIndex = -1;
    if (!notReset) {
      Object.assign(zks.value.playlist, {
        songs: <song[]>[],
        raw: {}
      })
    }
    await readDir(`res/lists`, {dir: BaseDirectory.Resource}).then(res => {
      {
        loadLocalPlaylists(res)
      }
    });
    if (neteaseUser.value.cookie) {
      let res = await normalClient.post(`${config.value.neteaseApi.url}user/playlist?uid=${neteaseUser.value.uid}`, {
        cookie: neteaseUser.value.cookie,
      })
      let c = res.data.playlist.length;
      console.log(c, zks.value.playlistsParts[zks.value.playlistsParts.length - 1].count);
      zks.value.playlists.push(...res.data.playlist.map((playlist: any) => ({
        title: playlist.name,
        pic: playlist.coverImgUrl,
        intro: 'FROM NETEASE',
        originFilename: 'REMOTE',
        playlist: [{
          type: 'trace_netease_playlist',
          id: playlist.id
        }]
      })))
      zks.value.playlistsParts.push({
        title: '网易云',
        begin: zks.value.playlistsParts[zks.value.playlistsParts.length - 1].begin + zks.value.playlistsParts[zks.value.playlistsParts.length - 1].count,
        count: c,
      })
    }
    {
      console.log(config)
      let res = await normalClient.get(`${config.value.neteaseApi.url}personalized`);
      let c = res.data.result.length;
      zks.value.playlists.push(...res.data.result.map((playlist: any) => ({
        title: playlist.name,
        pic: playlist.picUrl,
        intro: 'NETEASE RECOMMEND',
        originFilename: 'REMOTE',
        playlist: [{
          type: 'trace_netease_playlist',
          id: playlist.id
        }]
      })))
      zks.value.playlistsParts.push({
        title: '网易云推荐',
        begin: zks.value.playlistsParts[zks.value.playlistsParts.length - 1].begin + zks.value.playlistsParts[zks.value.playlistsParts.length - 1].count,
        count: c,
        other: {
          type: 'recommend_netease',
          showInMainPage: false
        }
      })
    }
  }
  zks.value.resourceDir = (await path.resourceDir()).substring(4).replaceAll('\\', '/');
    if (!await exists('res/lists', {dir: BaseDirectory.Resource})) {
        createDir("res/lists", {dir: BaseDirectory.Resource})
    }
    // 自动运行api服务
    // let neteaseapi = new Command('node', ['./res/neteaseapi/app.js'], {cwd: await resourceDir()});
    // neteaseapi.spawn();
  async function loadLocalPlaylists(files: FileEntry[]) {  
    let c = 0;
    zks.value.playlists.push(...(await Promise.all(
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
    zks.value.playlistsParts.push({
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