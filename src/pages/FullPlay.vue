<template>
<div class="partContainer forbidSelect">
    <div class="left">
        <AroundTragetBorder>
            <div class="pic">
                <img :src="ZKStore.play.song.pic" alt="">
            </div>
            <div class="title">{{ ZKStore.play.song.title }}</div>
            <div class="singer">{{ ZKStore.play.song.singer }}</div>
            <div class="playProgressTip">
                <div class="cur">{{ ZKStore.play.curTime }}</div>
                <div class="total">{{ ZKStore.play.durationTime }}</div>
            </div>
            <div class="playProgress">
                <div class="fill" :style="{width: `${ZKStore.play.progress}%`}"></div>
            </div>
            <div class="volumeProgressTip">
                <div class="tip">Volume</div>
                <div class="total">{{ Math.round(ZKStore.play.volume * 100) }}</div>
            </div>
            <div class="volumeProgress">
                <div class="fill" :style="{width: `${ZKStore.play.volume * 100}%`}"></div>
            </div>
            <div class="controlButtons">
                <div @click="emitter.emit('playPrevSong')" class="playbutton play_last">
                    <svg t="1711336017191" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1537"><path d="M772.930954 40.644923L301.575877 512l471.355077 471.355077a23.809313 23.809313 0 0 1-33.671221 33.67122L251.069046 528.83561a23.809313 23.809313 0 0 1 0-33.67122L739.259733 6.973703a23.809313 23.809313 0 0 1 33.671221 33.67122z" p-id="1538" fill="currentColor"></path></svg>
                </div>
                <div class="playbutton play_pause">
                    <svg t="1711335223450" @click="ZKStore.play.status = 'pause'" class="icon playbutton_pause" v-show="ZKStore.play.status === 'play'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6684"><path d="M325.008696 0c-28.93913 0-51.2 22.26087-51.2 51.2l0 919.373913c0 28.93913 22.26087 51.2 51.2 51.2s51.2-22.26087 51.2-51.2L376.208696 53.426087C376.208696 24.486957 351.721739 0 325.008696 0zM698.991304 0c-28.93913 0-51.2 22.26087-51.2 51.2l0 919.373913c0 28.93913 22.26087 51.2 51.2 51.2s51.2-22.26087 51.2-51.2L750.191304 53.426087C752.417391 24.486957 727.930435 0 698.991304 0z" fill="currentColor" p-id="6685"></path></svg>
                    <svg t="1711335286889" @click="ZKStore.play.status = 'play'" class="icon playbutton_play" v-show="ZKStore.play.status === 'pause'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2003"><path d="M897.113042 467.478259 182.539132 8.904348C166.956523-2.226087 144.695654-2.226087 129.113045 6.678261c-15.582609 8.904348-26.713043 26.713043-26.713043 44.521739l0 919.373909c0 20.034783 11.130435 35.617391 26.713043 44.521739C138.017393 1021.773909 144.695654 1023.999996 153.600001 1023.999996c8.904348 0 20.034783-2.226087 28.93913-8.904348L897.113042 556.521737c15.582609-8.904348 24.486956-26.713043 24.486956-44.521739C921.599998 494.191302 912.695651 478.608694 897.113042 467.478259zM204.800001 877.078257 204.800001 146.921739 774.67826 511.999998 204.800001 877.078257z" fill="currentColor" p-id="2004"></path></svg>
                </div>
                <div @click="emitter.emit('playNextSong')" class="playbutton play_next">
                    <svg t="1711336037990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1699"><path d="M251.069046 983.355077l471.355077-471.355077L251.069046 40.644923A23.809313 23.809313 0 0 1 284.740267 6.973703l488.190687 488.190687a23.809313 23.809313 0 0 1 0 33.67122L284.740267 1017.026297A23.809313 23.809313 0 0 1 251.069046 983.355077z" fill="currentColor" p-id="1700"></path></svg>
                </div>
            </div>
        </AroundTragetBorder>
    </div>
    <div class="right"></div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '@/stores/useZKstore';
import AroundTragetBorder from '@/components/AroundTargetBorder.vue'
import emitter from '@/emitter';
let ZKStore = useZKStore();
</script>

<style scoped>
.partContainer {
    position: absolute;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 10;
    display: grid;
    grid-template-columns: 360px 1fr;
}
.partContainer .left {
    display: flex;
    margin: 0 20px 20px;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.partContainer .left .pic {
    margin-top: 20px;
    width: 240px;
    height: 240px;
}
.partContainer .left .pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.partContainer .left .title {
    margin-top: 15px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: bold;
    max-width: 300px;
    text-overflow: ellipsis;
    line-height: 42px;
    height: 42px;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
    color: #18191C;
}
.partContainer .left .singer {
    font-size: 14px;
    font-family: SourceSansCNM;
    max-width: 300px;
    text-overflow: ellipsis;
    line-height: 20px;
    height: 20px;
    color: #666;
    max-width: 280px;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
}
.partContainer .left .playProgress, .partContainer .left .volumeProgress {
    position: relative;
    height: 12px;
    border: 1px solid #61666D;
    width: 280px;
}
.partContainer .left .playProgress .fill, .partContainer .left .volumeProgress .fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #18191C;
}
.partContainer .left .playProgressTip, .partContainer .left .volumeProgressTip {
    font-size: 14px;
    font-family: Bender;
    letter-spacing: 1px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 280px;
}
.partContainer .left .controlButtons {
    margin-top: 20px;
    display: flex;
}
.partContainer .left .controlButtons .playbutton {
    width: 24px;
    height: 24px;
    color: #444;
    margin: 0 20px;
}
</style>