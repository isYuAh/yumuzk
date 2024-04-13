<template>
<div class="partContainer forbidSelect">
  <simplebar class="simplebar">
    <Transition name="uianim">
      <div v-if="ZKStore.nowTab === 'Playlist'" class="playlistControllers">
        <button @click="importPlaylist" class="controllerButton import">导入</button>
        <button @click="emitter.emit('refreshPlaylists')" class="controllerButton import">刷新</button>
        <button @click="testFunc" class="controllerButton test">测试</button>
      </div>
    </Transition>
    <div
        v-show="PartVShow[index]"
        v-for="(p, index) in ZKStore.playlistsParts" class="playlistPart">
      <div class="divideTitle">{{p.title}}</div>
      <div class="lists">
        <div @click="checkDetail(index + p.begin)" v-for="(list, index) in ZKStore.playlists.slice(p.begin, p.begin + p.count)" class="item">
          <TargetBorder>
            <div class="img">
              <img referrerpolicy="no-referrer" :src="list.pic" alt="">
            </div>
          </TargetBorder>
          <div class="title">{{ list.title }}</div>
        </div>
      </div>
    </div>
  </simplebar>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '../stores/useZKstore';
import { clientInjectionKey, list_trace_bilibili_fav, playlistComponent } from '../types';
import {computed, inject} from 'vue';
import { normalClientInjectionKey } from '../types';
import { type song } from '../types';
import { ask, open } from '@tauri-apps/api/dialog';
import { copyFile, exists } from '@tauri-apps/api/fs'
import TargetBorder from '../components/TargetBorder.vue'
//@ts-ignore
import path from 'path-browserify';
import emitter from '@/emitter';
import simplebar from "simplebar-vue";
import 'simplebar-vue/dist/simplebar.min.css'
import { showMsg } from '@/utils/u';
import { WebviewWindow } from '@tauri-apps/api/window';
import { AxiosResponse } from 'axios';
let client = inject(clientInjectionKey)!;
let normalClient = inject(normalClientInjectionKey)!;
let ZKStore = useZKStore();
let PartVShow = computed(() => {
  let r = <boolean[]>[];
  if (ZKStore.nowTab === 'Playlist') {
    ZKStore.playlistsParts.forEach((p, index) => {
      if ('other' in p && 'showInMainPage' in p.other) {
        console.log(ZKStore.nowTab, p.other, p.other.showInMainPage)
        r[index] = p.other.showInMainPage
      }else {
        console.log(ZKStore.nowTab);
        r[index] = true;
      }
    })
  }else if (ZKStore.nowTab === 'PlaylistRecommend_netease') {
    ZKStore.playlistsParts.forEach((p, index) => {
      if ('other' in p && 'type' in p.other) {
        r[index] = p.other.type === 'recommend_netease'
      }else {
        r[index] = false;
      }
    })
  }
  return r;
})
function parseComponent(comIndex: number, components: playlistComponent[]) {
    // console.log(comIndex, components[comIndex], '$');
    let component = components[comIndex];
    if (comIndex >= components.length) {
        ZKStore.nowTab = 'PlaylistDetail';
        return;
    }
    if (component.type === 'data') {
        ZKStore.loading.text = `加载 Data 数据 ${comIndex + 1} / ${components.length}`;
        useZKStore().playlist.songs.push(...component.songs);
        comIndex++;
        parseComponent(comIndex, components);
    }else if (component.type === 'trace_bilibili_fav') {
        let pn = 0;
        let getNextPage = function() {
            ZKStore.loading.text = `Bilibili 已加载 ${Math.max(pn)} 页 ${comIndex + 1} / ${components.length}`;
            pn++;
            client.get('https://api.bilibili.com/x/v3/fav/resource/list', {
                params: {
                    media_id: (component as list_trace_bilibili_fav).favid,
                    pn: pn,
                    ps: 20,
                }
            }).then(res => {
                ZKStore.playlist.songs.push(...res.data.data.medias.map((m: any) => ({
                    type: 'bilibili', 
                    BV: m.bvid, 
                    title: m.title,
                    pic: m.cover,
                    singer: m.upper.name})))
                console.log(res.data.data.has_more, pn);
                if (res.data.data.has_more) {
                    getNextPage()
                }else {
                    comIndex++;
                    parseComponent(comIndex, components);
                }
            })
        }
        getNextPage()
    }else if (component.type === 'trace_siren') {
        let songsApi = 'https://monster-siren.hypergryph.com/api/songs';
        ZKStore.loading.text = `加载 塞壬唱片 ${comIndex + 1} / ${components.length}`;
        normalClient.get(songsApi).then(res => {
            ZKStore.playlist.songs.push(...res.data.data.list.map((s: any) => {
                return <song>{
                    title: s.name,
                    singer: s.artists.join(' / '),
                    type: 'siren',
                    cid: s.cid
                }
            }))
            comIndex++;
            parseComponent(comIndex, components);
        })
    }else if (component.type === 'trace_netease_playlist') {
        normalClient.get(ZKStore.config.neteaseApi.url + 'playlist/detail', {
            params: {
                id: component.id,
            }
        }).then(res => {
            if (res.data.playlist.tracks) {
                ZKStore.playlist.songs.push(...res.data.playlist.tracks.map((track: any) => {
                    return <song>{
                        pic: track.al.picUrl,
                        title: track.name,
                        type: 'netease',
                        singer: track.ar.map((ar: any) => (ar.name)).join(' & '),
                        id: track.id,
                    }
                }))
            }
            comIndex++;
            parseComponent(comIndex, components);
        })
    }else if (component.type === 'trace_qq_playlist') {
        if (!ZKStore.config.qqApi.enable) {
            comIndex++;
            parseComponent(comIndex, components);
            return;
        }
        normalClient.post(ZKStore.config.qqApi.url + 'api/y/get_playlistDetail', {
            type: "qq",
            id: component.id
        }).then((res: AxiosResponse) => {
            let result = res.data.data[0];
            ZKStore.playlist.songs.push(...result.songlist.map((r: any) => ({...r, type: 'qq'})));
            comIndex++;
            parseComponent(comIndex, components);
        })
    }
}
function checkDetail(index: number) {
    ZKStore.nowTab = 'Loading';
    ZKStore.loading.text = '';
    if (ZKStore.playlist.listIndex === index) {
        ZKStore.nowTab = 'PlaylistDetail';
    }else {
        let list = ZKStore.playlists[index];
        ZKStore.playlist.listIndex = index
        ZKStore.playlist.songs = [];
        let components = list.playlist;
        let comIndex = 0;
        parseComponent(comIndex, components);
    }
}
function importPlaylist() {
    open({
        filters: [{
            name: '歌单文件',
            extensions: ['json']
        },{
            name: '所有文件',
            extensions: ['*']
        }
        ]
    }).then((fn: any) => {
        if (ZKStore.resourceDir) {
            fn = fn.replaceAll('\\', '/')
            exists(ZKStore.resourceDir + 'res/lists/' + path.basename(fn)).then((val: boolean) => {
                if (val) {
                    ask('文件已存在，是否覆盖？').then((choice: boolean) => {
                        if (choice) {
                            copyFile(fn, ZKStore.resourceDir + 'res/lists/' + path.basename(fn)).catch((reason: any) => {
                                showMsg(ZKStore.message, 4000, reason);
                            })
                            emitter.emit('refreshPlaylists')
                        }
                    })
                }else {
                    copyFile(fn, ZKStore.resourceDir + 'res/lists/' + path.basename(fn)).catch((reason: any) => {
                        showMsg(ZKStore.message, 4000, reason);
                    })
                    emitter.emit('refreshPlaylists')
                }
            }).catch((reason: any) => {
                showMsg(ZKStore.message, 4000, reason);
            })
        }else {
            showMsg(ZKStore.message, 4000, '错误: resourceDir不存在');
        }
    })
}
function testFunc() {
    let confirm = new WebviewWindow('confirm', {
        decorations: false,
        resizable: false,
        url:'/dialog/confirm',
        transparent: true
    })
    confirm.show();
}
</script>

<style scoped>
.partContainer {
  height: 100%;
    display: flex;
    flex-direction: column;
}
.partContainer .playlistControllers {
    padding: 10px 20px 0;
}
.partContainer .lists {
    flex: 1;
    display: grid;
    padding: 0 20px;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(182px, 1fr));
    justify-content: center;
    grid-auto-rows: 1fr;
}
.item {
    width: 100%;
    cursor: pointer;
}
.item .img {
    border-radius: 2px;
    overflow: hidden;
    width: 162px;
    height: 162px;
    /* box-shadow: 0 0 5px rgba(0, 0, 0, .5) */
}
.item .img img {
    width: 162px;
    height: 162px;
    object-fit: cover;
    box-shadow: 0 0 4px rgba(0, 0, 0, .4);
    transition: transform .2s ease-in-out;
}
.item .title {
    font-family: SourceSansCNM;
    letter-spacing: 1px;
    /* color: #333;
    text-shadow: 0 0 5px rgba(0, 0, 0, .2); */
    margin-top: 5px;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    line-height: 32px;
}
.item:hover .img img {
    transform: scale(1.03);
}

.controllerButton {
    cursor: pointer;
    font-family: FZTYSJ;
    font-size: 22px;
    background-color: rgba(0, 0, 0, .9);
    box-shadow: 0 0 7px rgba(0, 0, 0, .3);
    border: none;
    color: #fff;
    padding: 5px 10px;
    margin: 0 10px;
    transition: all .25s;
}
.controllerButton:hover {
    box-shadow: 0 0 7px rgba(0, 0, 0, .6);
}
.divideTitle {
  margin: 20px;
  font-size: 24px;
  font-family: PingFang SC;

}
.simplebar {
  height: 100%;
}
</style>