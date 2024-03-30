<template>
  <Transition name="uianim">
    <FullPlay v-show="ZKStore.showFullPlay"></FullPlay>
  </Transition>
  <div class="container">
    <div data-tauri-drag-region class="header forbidSelect">
      <div data-tauri-drag-region class="title">Yumuzk</div>
      <Transition appear name="playcontroller">
        <div v-show="!ZKStore.showFullPlay" class="tabs">
            <div @click="ZKStore.nowTab = 'Playlist'" :class="{tab: true, active: ZKStore.nowTab === 'Playlist'}">首页</div>
            <div @click="turnToPlaylistDetail" :class="{tab: true, active: ZKStore.nowTab === 'PlaylistDetail'}">歌单</div>
            <div @click="ZKStore.nowTab = 'Search'" :class="{tab: true, active: ZKStore.nowTab === 'Search'}">搜索</div>
        </div>
      </Transition>
      <div class="controlbtn">
        <button @click="appWindow.minimize()" class="btn minimize">-</button>
        <button @click="exit(1)" class="btn close">×</button>
      </div>
    </div>
    <div class="content">
        <Transition appear name="uianim">
            <Playlist key="Playlist" v-if="ZKStore.nowTab === 'Playlist'"></Playlist>
            <PlaylistDetail key="PlaylistDetail" v-else-if="ZKStore.nowTab === 'PlaylistDetail'"></PlaylistDetail>
            <Loading key="Loading" v-else-if="ZKStore.nowTab === 'Loading'"</Loading>
            <Search key="Search" v-else-if="ZKStore.nowTab === 'Search'"</Search>
        </Transition>
    </div>
    <Playbar></Playbar>
  </div>
</template>

<script setup lang="ts">
import { Command } from '@tauri-apps/api/shell';

import { readDir, createDir, BaseDirectory, exists, readTextFile, FileEntry } from '@tauri-apps/api/fs';
import { exit } from '@tauri-apps/api/process';
import { appWindow } from '@tauri-apps/api/window';
import { useZKStore, saveConfig } from '@/stores/useZKstore'
import axios from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { clientInjectionKey, normalClientInjectionKey } from './types';
import { onMounted, provide, watch } from 'vue';
import { WBI } from './WBI';
import Playlist from '@/pages/Playlist.vue';
import PlaylistDetail from './pages/PlaylistDetail.vue';
import Loading from '@/pages/Loading.vue'
import FullPlay from '@/pages/FullPlay.vue'
import Playbar from '@/pages/Playbar.vue'
import Search from '@/pages/Search.vue'
import { resourceDir } from '@tauri-apps/api/path';
import { minmax } from './utils/u';
import emitter from './emitter';

const ZKStore = useZKStore();
const client = axios.create({
  adapter: axiosTauriApiAdapter,
  headers: {
    "User-Agent": 'Mozilla',
    referer: 'https://www.bilibili.com',
  }
});
const normalClient = axios.create({
  adapter: axiosTauriApiAdapter,
  headers: {
    "User-Agent": 'Mozilla',
  }
});
function turnToPlaylistDetail() {
  if (ZKStore.playlist.listIndex >= 0) {
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
      ZKStore.config = JSON.parse(res);
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
    if (!await exists('res/lists', {dir: BaseDirectory.Resource})) {
        createDir("res/lists", {dir: BaseDirectory.Resource})
    }
    let neteaseapi = new Command('node', ['./res/neteaseapi/app.js'], {cwd: await resourceDir()});
    neteaseapi.spawn();
  async function loadLists(files: FileEntry[]) {
    ZKStore.playlists = await Promise.all(files.filter(f => {return f.path.substring(f.path.lastIndexOf('.')) === '.json'}).map(async (file: FileEntry) => {
      return JSON.parse(await readTextFile(file.path))
    }))
  }
  readDir(`res/lists`, {dir: BaseDirectory.Resource}).then(res => {
    {
      loadLists(res);
    }
  });
  appWindow.setResizable(false);
})();
</script>

<style>
body {
    background: rgb(255,255,255);
}
.uianim-enter-active,
.uianim-leave-active {
    transition: all .2s;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.uianim-enter-from,
.uianim-leave-to {
    margin-top: 0;
}
.uianim-leave-to {
    margin-top: -5px;
    opacity: 0;
}
.uianim-enter-from {
    margin-top: 5px;
    opacity: 0;
}
.playcontroller-enter-active,
.playcontroller-leave-active {
    transition: all .2s;
}
.playcontroller-enter-from,
.playcontroller-leave-to {
    margin-top: 0;
}
.playcontroller-leave-to {
    margin-top: -5px;
    opacity: 0;
}
.playcontroller-enter-from {
    margin-top: 5px;
    opacity: 0;
}
</style>

<style scoped>
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
  color: #323233;
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
    font-size: 18px;
    margin: 0 8px;
    padding: 5px 0;
    height: 48px;
    line-height: 40px;
    transition: all .2s;
}
.header .tab.active {
    border-bottom: 4px solid #18191C
}
</style>