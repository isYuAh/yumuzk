<template>
<div class="transitionContainer">
    <div @click="ZKStore.nowTab = 'Playlist';" class="returnBtn">
        <svg t="1711457272465" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4244" width="48" height="48"><path d="M963.2 0L1024 67.2 512 614.4 0 67.2 60.8 0 512 480 963.2 0z" fill="currentColor" p-id="4245"></path></svg>
    </div>
    <div class="partContainer">
        <div class="listInfo">
            <div class="faceImg">
                <img :src="ZKStore.playlists[ZKStore.playlist.listIndex].pic" alt="">
            </div>
            <div class="info forbidSelect">
                <div class="title">{{ ZKStore.playlists[ZKStore.playlist.listIndex].title }}</div>
                <div class="bottom">
                    <div class="total">TOTAL {{ ZKStore.playlist.songs.length }}</div>
                    <div class="total">AN ALBUM CREATED</div>
                    <button @click="playAll" class="PlayAll">
                        <div class="svgIcon">
                            <svg t="1711448701001" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3437"><path d="M73.142857 0 910.957714 512 73.142857 1024Z" fill="#18191C" p-id="3438"></path></svg>
                        </div>
                        <div class="text">播放全部</div>
                        <div class="fill"></div>
                    </button>
                </div>
            </div>
        </div>
        <div class="divider forbidSelect">
            <div class="dividerTip">歌曲列表</div>
            <div class="divideLine"></div>
            <input v-model="filter" class="search" placeholder="搜索" />
        </div>
        <div class="songs">
            <div class="right">
                <simplebar data-auto-hide class="simplebar">
                    <div class="songTable forbidSelect">
                        <div 
                            v-show="song.title.includes(filter) || song.singer.includes(filter)" 
                            @dblclick="playSong_withCheck(song)" 
                            class="song" 
                            v-for="song in ZKStore.playlist.songs">
                            <div class="songInfo title">{{ song.title }}<sub>{{ song.type }}</sub></div>
                            <div class="songInfo author">{{ song.singer }}</div>
                        </div>
                    </div>
                </simplebar>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang='ts'>
import { type song } from '../types'
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css'
import { ref, toRaw } from 'vue';
import { useZKStore } from '../stores/useZKstore';
import emitter from '@/emitter';
let ZKStore = useZKStore();
let filter = ref('');
function playAll() {
    ZKStore.play.mode = 'list';
    ZKStore.play.playlist = structuredClone(toRaw(ZKStore.playlist.songs))
    if (ZKStore.play.playlist[0]) {
        emitter.emit('playSong',ZKStore.play.playlist[0])
    }
}
function playSong_withCheck(song: song) {
    if (ZKStore.play.playlist.length) {
        emitter.emit('playSong',song)
    }else {
        ZKStore.play.playlist = structuredClone(toRaw(ZKStore.playlist.songs))
        emitter.emit('playSong',song)
    }
}
</script>


<style scoped>
.returnBtn {
    width: 24px;
    color: #18191C;
    height: 24px;
    position: absolute;
    top:15px;
    right:30px;
    transition: all .25s;
}
.returnBtn:hover {
    color: #666;
}
.returnBtn svg {
    height: 100%;
    width: 100%;
}
.partContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.songs {
    flex: 1;
    min-height: 0;
    display: flex;
}
.songs .right {
    flex: 1;
}
.simplebar {
    height: 100%;
}
.songTable {
    font-family: PingFang SC;
    width: 100%;
    display: grid;
    grid-auto-rows: 38px;
    color: #18191C;
}
.songTable .song {
    padding: 7px 20px;
    display: grid;
    column-gap: 20px;
    grid-template-columns: 12fr 10fr;
    transition: background .15s;
}
.songTable .song:hover, .songTable .song.active {
    background-color: #38393C;
    /* background-color: #18191C; */
    color: #fff;
}
.songTable .songInfo {
    font-size: 15px;
    display: inline-block;
    line-height: 24px;
    height: 24px;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
}

.listInfo {
    display: flex;
    padding: 15px;
}
.listInfo .faceImg {
    width: 200px;
    height: 200px;
    margin-right: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .5)
}
.listInfo .faceImg img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.listInfo .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
}
.listInfo .info .title {
    font-family: SourceSansCNM;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
    color: #18191C;
    text-shadow: 0 0 5px rgba(0, 0, 0, .2);
    /* letter-spacing: 1px; */
}
.listInfo .info .total {
    margin-top: 2px;
    /* margin-left: 5px; */
    color: #333;
    font-size: 18px;
    font-weight: bold;
    font-family: NovecentoWide;
}
.listInfo .info .bottom .PlayAll {
    position: relative;
    display: flex;
    outline: none;
    border: none;
    width: 100%;
    background-color: transparent;
    padding: 0;
    margin-top: 10px;
    font-family: SourceHanSansCNM;
    font-weight: bold;
    height: 32px;
    text-align: left;
    transition: all .15s;
    color: #18191C;
}
.listInfo .info .bottom .PlayAll .text {
    line-height: 32px;
    font-size: 18px;
    margin-left: 10px;
}
.listInfo .info .bottom .PlayAll .svgIcon, .listInfo .info .bottom .PlayAll .svgIcon svg {
    height: 32px;
    width: 32px
}
.listInfo .info .bottom .PlayAll .fill {
    transition: all .3s ease-in-out;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    width: 0;
    background-color: #18191C;
}
.listInfo .info .bottom .PlayAll:hover {
    color: #fff;
}
.listInfo .info .bottom .PlayAll:hover .fill {
    width: calc(100% - 20px);
}
.divider {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 15px;
}
.divider .dividerTip {
    margin-right: 10px;
    font-family: HarmonyOS SC;
    font-weight: bold;
    color: #333;
}
.divider .search {
    margin: 0 5px;
    font-family: SourceSansCNM;
    border: none;
    border-bottom: 2px solid #18191C;
    padding-bottom: 5px;
}
.divideLine {
    height: 0.5px;
    flex: 1;
    background-color: #e2e3e5;
}
.transitionContainer {
    width: 100%;
    height: 100%;
}
.songInfo sub {
    margin-left: 4px;
    color: #666;
    font-family: NovecentoWide;
}
</style>
<!-- playBar -->
<!-- <style scoped>
.play {
    box-shadow: 0 0 4px rgba(0, 0, 0, .1);
    height: 64px;
}
.play {
    position: relative;
    user-select: none;
    display: flex;
    align-items: center;
    display: none;
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
    background-color: #ec452c;
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
    width: 100px;
}
.play .durationInfo .infoItem {
    font-family: HarmonyOS SC;
    font-weight: bold;
    color: #444;
    font-size: 12px;
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
    transition: alls .1s;
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
</style> -->