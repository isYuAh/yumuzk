<template>
  <div class="songEl">
      <video
      @ended="playEnded"
      @timeupdate="updateProgress"
      @volumechange="changeVolumeInfo"
      
      autoplay ref="songSource"></video>
  </div>
  <div class="container">
    <div data-tauri-drag-region class="header forbidSelect">
      <div data-tauri-drag-region class="title">Yumuzk</div>
      <div class="tabs">
        <div @click="ZKStore.nowTab = 'List'" :class="{tab: true, active: ZKStore.nowTab === 'List'}">首页</div>
        <div @click="ZKStore.nowTab = 'songList'" :class="{tab: true, active: ZKStore.nowTab === 'songList'}">歌单</div>
      </div>
      <div class="controlbtn">
        <button @click="appWindow.minimize()" class="btn minimize">-</button>
        <button @click="exit(1)" class="btn close">×</button>
      </div>
    </div>
    <div class="content">
        <Transition appear name="uianim">
            <List key="list" v-if="ZKStore.nowTab === 'List'"></List>
            <songList key="songlist" v-else-if="ZKStore.nowTab === 'songList'"></songList>
            <Loading key="Loading" v-else-if="ZKStore.nowTab === 'Loading'"</Loading>
        </Transition>
    </div>
    <div class="play forbidSelect">
        <div v-show="show_songface" class="songface">
            <img ref="songfaceImg" referrerpolicy="no-referrer" src="" alt="">
        </div>
        <div ref="progress_tooltip" style="display: none" class="progress-tooltip">00:00</div>
        <div @click="changeProgress" @mousemove="changeProgressTip"  @mouseleave="closeProgressTip" class="progress">
            <div ref="progressChooseFill" class="chooseFill"></div>
            <div ref="progressFill" class="fill"></div>
        </div>
        <div ref="songInformation" class="songInformation">
            <div class="title">{{ ZKStore.play.song.title }}</div>
            <div class="singer">{{ ZKStore.play.song.singer }}</div>
        </div>
        <div class="controlButtons">
            <div class="playbutton play_last">
                <svg @click="playPrevSong" t="1711336017191" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1537"><path d="M772.930954 40.644923L301.575877 512l471.355077 471.355077a23.809313 23.809313 0 0 1-33.671221 33.67122L251.069046 528.83561a23.809313 23.809313 0 0 1 0-33.67122L739.259733 6.973703a23.809313 23.809313 0 0 1 33.671221 33.67122z" p-id="1538" fill="currentColor"></path></svg>
            </div>
            <div class="playbutton play_pause">
                <svg t="1711335223450" @click="ZKStore.play.status = 'pause'" class="icon playbutton_pause" v-show="ZKStore.play.status === 'play'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6684"><path d="M325.008696 0c-28.93913 0-51.2 22.26087-51.2 51.2l0 919.373913c0 28.93913 22.26087 51.2 51.2 51.2s51.2-22.26087 51.2-51.2L376.208696 53.426087C376.208696 24.486957 351.721739 0 325.008696 0zM698.991304 0c-28.93913 0-51.2 22.26087-51.2 51.2l0 919.373913c0 28.93913 22.26087 51.2 51.2 51.2s51.2-22.26087 51.2-51.2L750.191304 53.426087C752.417391 24.486957 727.930435 0 698.991304 0z" fill="currentColor" p-id="6685"></path></svg>
                <svg t="1711335286889" @click="ZKStore.play.status = 'play'" class="icon playbutton_play" v-show="ZKStore.play.status === 'pause'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2003"><path d="M897.113042 467.478259 182.539132 8.904348C166.956523-2.226087 144.695654-2.226087 129.113045 6.678261c-15.582609 8.904348-26.713043 26.713043-26.713043 44.521739l0 919.373909c0 20.034783 11.130435 35.617391 26.713043 44.521739C138.017393 1021.773909 144.695654 1023.999996 153.600001 1023.999996c8.904348 0 20.034783-2.226087 28.93913-8.904348L897.113042 556.521737c15.582609-8.904348 24.486956-26.713043 24.486956-44.521739C921.599998 494.191302 912.695651 478.608694 897.113042 467.478259zM204.800001 877.078257 204.800001 146.921739 774.67826 511.999998 204.800001 877.078257z" fill="currentColor" p-id="2004"></path></svg>
            </div>
            <div class="playbutton play_next">
                <svg @click="playNextSong" t="1711336037990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1699"><path d="M251.069046 983.355077l471.355077-471.355077L251.069046 40.644923A23.809313 23.809313 0 0 1 284.740267 6.973703l488.190687 488.190687a23.809313 23.809313 0 0 1 0 33.67122L284.740267 1017.026297A23.809313 23.809313 0 0 1 251.069046 983.355077z" fill="currentColor" p-id="1700"></path></svg>
            </div>
        </div>
        <div class="durationInfo">
            <div class="infoItem">{{ songCurTime }} / {{ songDuration }}</div>
        </div>
        <div class="volumeController">
            <div class="volumeTip">VOLUME {{ Math.round(100*ZKStore.play.volume) }}</div>
            <div @click="changeVolume" class="volumeProgress">
                <div ref="volumeProgressFill" class="volumeProgressFill"></div>
            </div>
        </div>
        <div class="playmodeController">
            <Transition mode="out-in" name="playcontroller">
                <div @click="ZKStore.play.mode = 'loop'" v-if="ZKStore.play.mode === 'list'" class="modeitem mode_list">
                    <svg t="1711356036016" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3533"><path d="M1015.095652 166.956522c0 36.730435-30.052174 66.782609-66.782609 66.782608H335.026087c-36.730435 0-66.782609-30.052174-66.782609-66.782608s30.052174-66.782609 66.782609-66.782609h613.286956c36.730435 0 66.782609 30.052174 66.782609 66.782609zM335.026087 578.782609h348.382609c36.730435 0 66.782609-30.052174 66.782608-66.782609s-30.052174-66.782609-66.782608-66.782609H335.026087c-36.730435 0-66.782609 30.052174-66.782609 66.782609s30.052174 66.782609 66.782609 66.782609z m491.965217 211.478261H335.026087c-36.730435 0-66.782609 30.052174-66.782609 66.782608s30.052174 66.782609 66.782609 66.782609h491.965217c36.730435 0 66.782609-30.052174 66.782609-66.782609s-28.93913-66.782609-66.782609-66.782608zM75.686957 94.608696c-18.921739 0-37.843478 7.791304-51.2 21.147826s-22.26087 32.278261-22.26087 51.2 7.791304 37.843478 21.147826 51.2c13.356522 13.356522 32.278261 21.147826 51.2 21.147826s37.843478-7.791304 51.2-21.147826c13.356522-13.356522 21.147826-32.278261 21.147826-51.2s-7.791304-37.843478-21.147826-51.2c-12.243478-13.356522-31.165217-21.147826-50.086956-21.147826z m0 345.043478c-18.921739 0-37.843478 7.791304-51.2 21.147826s-22.26087 32.278261-22.26087 51.2 7.791304 37.843478 21.147826 51.2c13.356522 13.356522 32.278261 21.147826 51.2 21.147826s37.843478-7.791304 51.2-21.147826c13.356522-13.356522 21.147826-32.278261 21.147826-51.2s-7.791304-37.843478-21.147826-51.2c-12.243478-13.356522-31.165217-21.147826-50.086956-21.147826z m0 345.043478c-18.921739 0-37.843478 7.791304-51.2 21.147826s-22.26087 32.278261-22.26087 51.2 7.791304 37.843478 21.147826 51.2c13.356522 13.356522 32.278261 21.147826 51.2 21.147826s37.843478-7.791304 51.2-21.147826c13.356522-13.356522 21.147826-32.278261 21.147826-51.2s-7.791304-37.843478-21.147826-51.2c-12.243478-13.356522-31.165217-21.147826-50.086956-21.147826z" p-id="3534" fill="currentColor"></path></svg>
                </div>
                <div @click="ZKStore.play.mode = 'rand'" v-else-if="ZKStore.play.mode === 'loop'" class="modeitem mode_loop">
                    <svg t="1711355991685" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3367"><path d="M912.695652 359.513043V801.391304c0 24.486957-20.034783 44.521739-44.521739 44.521739H212.591304c-24.486957 0-44.521739-20.034783-44.521739-44.521739s20.034783-44.521739 44.521739-44.521739H823.652174V400.695652H263.791304l61.217392 62.330435c17.808696 17.808696 17.808696 46.747826 0 64.556522-8.904348 8.904348-20.034783 13.356522-31.165218 13.356521-11.130435 0-22.26087-4.452174-31.165217-13.356521L124.66087 390.678261c-8.904348-8.904348-13.356522-20.034783-13.356522-31.165218 0-12.243478 4.452174-23.373913 13.356522-31.165217l138.017391-136.904348c17.808696-17.808696 45.634783-17.808696 63.443478 0s16.695652 44.521739 0 62.330435L263.791304 311.652174H868.173913c24.486957 0 44.521739 23.373913 44.521739 47.860869z" p-id="3368" fill="currentColor"></path></svg>
                </div>
                <div @click="ZKStore.play.mode = 'list'" v-else-if="ZKStore.play.mode === 'rand'" class="modeitem mode_rand">
                    <svg t="1711355957905" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201"><path d="M759.095652 333.913043C712.347826 333.913043 595.478261 449.669565 509.773913 533.147826 380.66087 657.808696 258.226087 779.130435 160.278261 779.130435H100.173913c-24.486957 0-44.521739-20.034783-44.521739-44.521739s20.034783-44.521739 44.521739-44.521739h60.104348c62.330435 0 186.991304-124.66087 287.165217-221.495653 122.434783-117.982609 228.173913-223.721739 311.652174-223.721739h57.878261l-61.217391-58.991304c-17.808696-17.808696-17.808696-43.408696 0-61.217391s45.634783-17.808696 63.443478 0l136.904348 136.904347c8.904348 8.904348 13.356522 20.034783 13.356522 31.165218 0 12.243478-4.452174 23.373913-13.356522 31.165217L818.086957 460.8c-8.904348 8.904348-20.034783 12.243478-31.165218 12.243478-11.130435 0-22.26087-4.452174-31.165217-13.356521-17.808696-17.808696-17.808696-46.747826 0-63.443479l61.217391-62.330435h-57.878261z m58.991305 229.286957c-17.808696-17.808696-45.634783-17.808696-63.443479 0-17.808696 17.808696-17.808696 46.747826 0 64.556522l61.217392 62.330435h-57.878261c-36.730435 0-97.947826-54.53913-158.052174-110.191305-17.808696-16.695652-45.634783-16.695652-63.443478 1.113044-16.695652 17.808696-15.582609 47.86087 2.226086 64.556521 93.495652 85.704348 155.826087 133.565217 220.382609 133.565218h57.878261l-61.217391 58.991304c-17.808696 17.808696-17.808696 44.521739 0 62.330435 8.904348 8.904348 20.034783 12.243478 31.165217 12.243478 11.130435 0 22.26087-4.452174 31.165218-13.356522l136.904347-136.904347c8.904348-8.904348 13.356522-20.034783 13.356522-31.165218 0-12.243478-4.452174-23.373913-13.356522-31.165217L818.086957 563.2zM100.173913 333.913043h60.104348c46.747826 0 116.869565 60.104348 172.521739 110.191305 8.904348 7.791304 18.921739 12.243478 30.052174 12.243478 12.243478 0 24.486957-4.452174 33.391304-14.469565 16.695652-17.808696 15.582609-47.86087-3.33913-64.556522-86.817391-79.026087-160.278261-133.565217-232.626087-133.565217H100.173913c-24.486957 0-44.521739 20.034783-44.521739 44.521739S75.686957 333.913043 100.173913 333.913043z" p-id="3202" fill="currentColor"></path></svg>
                </div>
            </Transition>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readDir, createDir, BaseDirectory, exists, readTextFile, FileEntry } from '@tauri-apps/api/fs';
import { tauri } from '@tauri-apps/api';
import { exit } from '@tauri-apps/api/process';
import { appWindow } from '@tauri-apps/api/window';
import { config, saveConfig, useZKStore } from './stores/useZKstore'
import axios, { AxiosResponse } from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { clientInjectionKey, normalClientInjectionKey, playSongInjectionKey, type song } from './types';
import { onMounted, provide, watch } from 'vue';
import { WBI } from './WBI';
import { ref } from 'vue';
import { minmax, secondsToMmss } from './utils/u';

//@ts-ignore
import Netease from './utils/netease/netease.js'
import List from './pages/List.vue';
import songList from './pages/songList.vue';
import Loading from './pages/Loading.vue'

const ZKstore = useZKStore();
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
client.get('https://api.bilibili.com/x/web-interface/nav').then(res => {
  const {data: {data: { wbi_img: { img_url, sub_url } } } } = res;
  ZKstore.wbi = {
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
    let WB = WBI(ZKstore.wbi, config.params)
      config.params = WB;
      return config;
    })
}).catch(err => {console.log(err);})


provide(clientInjectionKey, client);
provide(normalClientInjectionKey, normalClient);
(async ()=> {
  if (!await exists('res/lists', {dir: BaseDirectory.Resource})) {
    createDir("res/lists", {dir: BaseDirectory.Resource})
  }
  async function loadLists(files: FileEntry[]) {
    ZKstore.lists = await Promise.all(files.filter(f => {return f.path.substring(f.path.lastIndexOf('.')) === '.json'}).map(async (file: FileEntry) => {
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
let songSource = ref<HTMLVideoElement>();
let progressFill = ref<HTMLDivElement>();
let progressChooseFill = ref<HTMLDivElement>();
let progress_tooltip = ref<HTMLDivElement>();
let volumeProgressFill = ref<HTMLDivElement>();
let ZKStore = useZKStore();
let songCurTime = ref('');
let songDuration = ref('');
let songfaceImg = ref<HTMLImageElement>();
let songInformation = ref<HTMLDivElement>();
let show_songface = ref(false);
// let lrcConfig = ref<song_lrc_item[]>([])

function changeVolumeInfo() {
    if (songSource.value) {
        if (volumeProgressFill.value) {
            volumeProgressFill.value.style.width = `${100*songSource.value.volume}%`
            ZKStore.play.volume = songSource.value.volume;
            config.volume = songSource.value.volume;
            saveConfig();
        }
    }
}
//初始化
onMounted(() => {songSource.value!.volume = ZKStore.play.volume})
watch(() => ZKStore.play.mode, () => {
    config.mode = ZKStore.play.mode;
    saveConfig();
})
function playEnded() {
    if (ZKStore.play.mode === 'pause') {
        
    }else if (ZKStore.play.mode === 'list') {
        let si = ZKStore.play.songIndex;
        if (si === ZKStore.play.songs.length - 1) {
            playSong(ZKStore.play.songs[0])
        }else {
            playSong(ZKStore.play.songs[si + 1]);
        }
    }else if (ZKStore.play.mode === 'rand') {
        playSong(ZKStore.play.songs[Math.floor(Math.random() * (ZKStore.play.songs.length))])
    }else if (ZKStore.play.mode === 'loop') {
        songSource.value!.currentTime = 0;
        songSource.value!.play();
    }
}
// function getHighlightedIndex(currentTime: number, lrcArray: any) {
//     // 遍历解析后的歌词数组
//     for (let i = 0; i < lrcArray.length; i++) {
//         // 如果当前时间小于当前歌词的时间，说明当前播放到了下一句歌词
//         if (currentTime < lrcArray[i].time) {
//             // 返回当前歌词的索引
//             return i - 1 >= 0 ? i - 1 : 0;
//         }
//     }
//     // 如果当前时间大于最后一句歌词的时间，则返回最后一句歌词的索引
//     return lrcArray.length - 1;
// }
function updateProgress() {
    if (songSource.value && progressFill.value) {
        progressFill.value.style.width = `${minmax(songSource.value.currentTime / ZKStore.play.duration * 100, 0, 100)}%` 
        songCurTime.value = secondsToMmss(songSource.value.currentTime)
        // ZKStore.play.activeLrc = getHighlightedIndex(songSource.value.currentTime, lrcConfig.value);
        // let offset = minmax(document.querySelector('.lrcItem.active').offsetTop - document.querySelector('.lrcContent')?.clientHeight / 2 + document.querySelector('.lrcItem.active')?.clientHeight, 0, document.querySelector('.lrcContainer')?.clientHeight - document.querySelector('.lrcContent')?.clientHeight / 2);
        // document.querySelector(".lrcContainer").style.top = `${-offset}px`
    }
}
function changeProgress(e: MouseEvent) {
    if (songSource.value) {
        songSource.value.currentTime = minmax(Math.round(ZKStore.play.duration * e.clientX / document.body.clientWidth), 0, ZKStore.play.duration);
    }
}
function changeProgressTip(e: MouseEvent) {
    if (!progressChooseFill.value || !progress_tooltip.value) {
        return;
    }
    progressChooseFill.value.style.display = "block";
    progress_tooltip.value.style.display = "block"
    progress_tooltip.value.innerText = secondsToMmss(minmax(Math.round(ZKStore.play.duration * e.clientX / document.body.clientWidth), 0, ZKStore.play.duration));
    progress_tooltip.value.style.left = minmax(e.clientX - progress_tooltip.value.clientWidth / 2, 2, document.body.clientWidth - progress_tooltip.value.clientWidth - 2) + "px";
    progressChooseFill.value.style.width = minmax(e.clientX / document.body.clientWidth * 100, 0, 100) + "%"
}
function closeProgressTip() {
    if (!progressChooseFill.value || !progress_tooltip.value) {
        return;
    }
    progressChooseFill.value.style.display = "none";
    progress_tooltip.value.style.display = "none";
}
function changeVolume(e: any) {
    let toVolume = e.layerX / (document.querySelector('.play .volumeProgress') as HTMLDivElement).offsetWidth;
    if (songSource.value) {
        songSource.value.volume = toVolume;
    }
}
function playSong(song: song){
    Object.assign(ZKStore.play.song,song);
    ZKStore.play.songIndex = ZKStore.play.songs.lastIndexOf(song);
    if (song.type === 'bilibili') {
        client.get('https://api.bilibili.com/x/web-interface/view', {
            params: {
                bvid: song.BV,
            }
        }).then(res => {
            if (songfaceImg.value) {
                if (ZKStore.play.song.pic) {
                    show_songface.value = true;
                    songfaceImg.value.src = ZKStore.play.song.pic;
                }else if(res.data.data.pic) {
                    show_songface.value = true;
                    songfaceImg.value.src = res.data.data.pic;
                }else {
                    show_songface.value = false;

                }
            }
            song.title = song.title || res.data.data.title;
            song.singer = song.singer || res.data.data.owner.name;
            let cid = res.data.data.cid;
            client.get('https://api.bilibili.com/x/player/wbi/playurl', {
                params: {
                    bvid: song.BV,
                    cid,
                    platform: "html5"
                }
            }).then(res => {
                console.log(res);
                if (songSource.value) {
                    songSource.value.src = res.data.data.durl[0].url;
                }
            })
        });
    }else if (song.type === 'local') {
        if (songfaceImg.value) {
            if (song.pic) {
                show_songface.value = true;
                songfaceImg.value.src = song.pic;
            }else {
                show_songface.value = false;
            }
        }
        if (songSource.value) {
            songSource.value.src = tauri.convertFileSrc(song.path);
        }
    }else if (song.type === 'web') {
        if (songfaceImg.value) {
            if (song.pic) {
                show_songface.value = true;
                songfaceImg.value.src = song.pic;
            }else {
                show_songface.value = false;
            }
        }
        if (songSource.value) {
            songSource.value.src = song.url;
        }
    }else if (song.type === 'netease_outer') {
        if (songfaceImg.value) {
            if (song.pic) {
                show_songface.value = true;
                songfaceImg.value.src = song.pic;
            }else {
                show_songface.value = false;
            }
        }
        if (songSource.value) {
            songSource.value.src = `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
        }
    }else if (song.type === 'netease_other') {
        normalClient.post("https://music.liuzhijin.cn/", {
            input: song.id,
            filter:'id',
            type:'netease',
            page: 1,
        }, {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
        }
        }).then(res => {
            if (res.data.data[0]) {
                if (songfaceImg.value) {
                    if (song.pic) {
                        show_songface.value = true;
                        songfaceImg.value.src = song.pic;
                    }else if(res.data.data[0].pic) {
                        show_songface.value = true;
                        songfaceImg.value.src = res.data.data[0].pic;
                    }else {
                        show_songface.value = false;
                    }
                }
                if (songSource.value) {
                    songSource.value.src = res.data.data[0].url;
                }
            }
        })
    }else if (song.type === 'siren') {
        normalClient.get(`https://monster-siren.hypergryph.com/api/song/${song.cid}`).then(res => {
            console.log(res.data.data.lyricUrl, res.data.data);
            if (res.data.data.lyricUrl) {
                ZKStore.play.song.lrc = {
                    type: 'web',
                    path: res.data.data.lyricUrl,
                }
                // proceedLrc(ZKStore.play.song.lrc);
            }
            if (songSource.value) {
                songSource.value.src = res.data.data.sourceUrl;
            }
            if (songfaceImg.value) {
                show_songface.value = true;
                normalClient.get(`https://monster-siren.hypergryph.com/api/album/${res.data.data.albumCid}/detail`).then(res => {
                    songfaceImg.value!.src = res.data.data.coverUrl;
                })
            }
        })
    }else if (song.type === 'netease') {
        Netease.getSongUrl (normalClient, [song.id]).then((res: AxiosResponse) => {
            if (res.data.data[0]) {
                if (songSource.value) {
                    songSource.value.src = res.data.data[0].url;
                }
                if (songfaceImg.value) {
                    if (song.pic) {
                        show_songface.value = true;
                        songfaceImg.value.src = song.pic
                    }else {
                        Netease.getSongDetail(normalClient, song.id).then((res: AxiosResponse) => {
                            if (res.data.songs[0].al.picUrl) {
                                show_songface.value = true;
                                songfaceImg.value!.src = res.data.songs[0].al.picUrl
                            }else {
                                show_songface.value = false;
                            }
                        })
                    }
                }
            }
        })
    }
    if (songSource.value) {
        songSource.value.addEventListener('loadedmetadata', () => {
            if (songSource.value) {
                ZKStore.play.duration = songSource.value.duration;
                songDuration.value = secondsToMmss(songSource.value.duration)
                ZKStore.play.status = 'play';
            }
        })
    }
};
// function proceedLrc(lrc: song_lrc) {
//     let url = '';
//     if (lrc.type === 'web') {
//         url = lrc.path
//     }else {
//         url = tauri.convertFileSrc(lrc.path);
//     }
//     normalClient.get(url, {
//         responseType: 'text',
//     }).then(res => {
//         let lines = res.data.split(/\r?\n/);
//         lrcConfig.value = [] as any;
//         lines.forEach((line: string) => {
//             const match = /\[(\d{2}):(\d{2}\.\d{2})\](.*)/.exec(line);
//             if (match) {
//                 // 提取时间和文字
//                 const minutes = parseInt(match[1], 10);
//                 const seconds = parseFloat(match[2]);
//                 const timeInSeconds = minutes * 60 + seconds;
//                 const text = match[3].trim();
//                 lrcConfig.value.push({
//                     time: timeInSeconds,
//                     text: text,
//                 })
//             }
//         })
//         console.log(lrcConfig);
//     })
// }
function playPrevSong() {
    let si = ZKStore.play.songIndex;
    if (si === 0) {
        playSong(ZKStore.play.songs[0])
    }else {
        playSong(ZKStore.play.songs[si - 1]);
    }
}
function playNextSong() {
    let si = ZKStore.play.songIndex;
    if (si === ZKStore.play.songs.length - 1) {
        playSong(ZKStore.play.songs[0])
    }else {
        playSong(ZKStore.play.songs[si + 1]);
    }
}
watch(() => ZKStore.play.status, (nv) => {
    if (!songSource.value) return;
    if (nv === 'play') {
        songSource.value.play();
    }else if (nv === 'pause') {
        songSource.value.pause();
    }
})
watch(show_songface, (nv) => {
    console.log(nv);
    if (!songInformation.value) {
        return;
    }
    if (nv) {
        songInformation.value.style.width = "300px";
    }else {
        songInformation.value.style.width = "358px";
    }
}, {immediate: true})
provide(playSongInjectionKey, playSong)
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
</style>

<style scoped>
.songEl {
    display: none;
}
.container {
  display: flex;
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
  margin-left: 12px;
  line-height: 32px;
  color: #323233;
}
.header .controlbtn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 20px;
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
  height: calc(100% - 32px);
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

<style scoped>
.play {
    /* box-shadow: 0 0 4px rgba(0, 0, 0, .1); */
    height: 73px;
}
.play {
    position: relative;
    display: flex;
    align-items: center;
}
.play .progress-tooltip {
    font-family: PingFang SC;
    position: absolute;
    top: -29px;
    background-color: rgba(0, 0, 0);
    padding: 2px 5px;
    line-height: 20px;
    color: #fff;
    z-index: 1;
}
.play .progress {
    cursor: pointer;
    height: 4px;
    left: 0;
    right: 0;
    background-color: #f2f3f4;
    position: absolute;
    top: 0;
    transition: all .1s;
}
.play .progress .fill {
    position: absolute;
    height: 4px;
    top: 0;
    width: 0%;
    /* background-color: #ec452c; */
    background-color: #18191C;
    transition: alls .1s;
}
.play .progress .chooseFill {
    position: absolute;
    height: 4px;
    top: 0;
    width: 0%;
    background-color: #d2d3d4;
}
.play .songface {
    margin-left: 10px;
    width: 48px;
    height: 48px;
    margin-top: 2px;
}
.play .songface img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.play .songInformation {
    width: 358px;
    padding-left: 10px;
    padding-right: 20px;
}
.play .songInformation .title {
    font-family: PingFang SC;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    line-height: 16px;
    height: 16px;
}
.play .songInformation .singer {
    margin-top: 5px;
    padding-left: 7px;
    color: #61666D;
    font-size: 14px;
}
.play .controlButtons {
    display: flex;
}
.play .controlButtons .playbutton {
    width: 24px;
    height: 24px;
    color: #444;
    margin: 0 20px;
}
.play .durationInfo {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    width: 150px;
}
.play .durationInfo .infoItem {
    font-family: Bender;
    font-weight: bold;
    color: #444;
    font-size: 14px;
    letter-spacing: 1px;
    margin: 2px 10px;
}
.play .volumeController {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}
.play .volumeController .volumeTip {
    font-size: 12px;
    font-weight: bold;
}
.play .volumeController .volumeProgress {
    position: relative;
    border: 1.5px solid #61666D;
    width: 150px;
    height: 14px;
}
.play .volumeController .volumeProgress .volumeProgressFill {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #61666D;
    transition: all .1s;
}
.play .playmodeController {
    height: 24px;
    margin-left: 20px;
}
.play .playmodeController .modeitem {
    cursor: pointer;
    color: #61666D;
    width: 24px;
    height: 24px;
}
.play .playmodeController .modeitem:hover {
    color: #18191C;
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