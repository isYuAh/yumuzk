<template>
<div class="partContainer forbidSelect">
    <div class="left">
        <AroundTragetBorder>
            <div class="pic">
                <Transition name="uianim">
                    <img v-if="ZKStore.play.song.pic" :src="ZKStore.play.song.pic" alt="">
                    <div v-else class="nonePic">
                        <AroundTragetBorder>
                            None
                        </AroundTragetBorder>
                    </div>
                </Transition>
            </div>
                <div class="singleLineTextEl title">{{ ZKStore.play.song.title }}</div>
            <div class="singleLineTextEl singer">{{ ZKStore.play.song.singer }}</div>
            <div class="singleLineTextEl type">{{ ZKStore.play.song.type }}</div>
            <div class="playProgressTip">
                <div class="cur">{{ ZKStore.play.curTime }}</div>
                <div class="total">{{ ZKStore.play.durationTime }}</div>
            </div>
            <div ref="playProgress" @click="changePlayProgress" class="playProgress">
                <div class="fill" :style="{width: `${ZKStore.play.progress}%`}"></div>
            </div>
            <div class="volumeProgressTip">
                <div class="tip">Volume</div>
                <div class="total">{{ Math.round(ZKStore.play.volume * 100) }}</div>
            </div>
            <div ref="volumeProgress" @click="changeVolumeProgress" class="volumeProgress">
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
        </AroundTragetBorder>
    </div>
    <div class="right">
        <Transition name="uianim">
            <div v-if="ZKStore.play.song.lrc.status === 'parsed'" ref="lrcContentEl" class="lrcContent">
                <div ref="lrcContainerEl" class="lrcContainer">
                    <div v-for="l, i in ZKStore.play.song.lrc.lrc" :class="{lrcItem: true, active: i === ZKStore.play.highlightLrcIndex}">{{ l.text }}</div>
                </div>
            </div>
            <div v-else-if="ZKStore.play.song.lrc.status !== 'parsed'" class="lrcStatus">
                <div class="status">None</div>
            </div>
        </Transition>
    </div>
    <div class="fullPlayBtn">
        <div @click="ZKStore.showFullPlay = false" class="fullPlayBtn">
            <svg t="1711336037990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1699"><path d="M251.069046 983.355077l471.355077-471.355077L251.069046 40.644923A23.809313 23.809313 0 0 1 284.740267 6.973703l488.190687 488.190687a23.809313 23.809313 0 0 1 0 33.67122L284.740267 1017.026297A23.809313 23.809313 0 0 1 251.069046 983.355077z" fill="currentColor" p-id="1700"></path></svg>
        </div>
    </div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '@/stores/useZKstore';
import AroundTragetBorder from '@/components/AroundTargetBorder.vue'
import emitter from '@/emitter';
import { inject, nextTick, ref, watch } from 'vue';
import { minmax } from '@/utils/u';
import { song_lrcConfig } from '@/types';
import { tauri } from '@tauri-apps/api';
import { AxiosResponse } from 'axios';
import { normalClientInjectionKey } from '@/types';
let ZKStore = useZKStore();
let playProgress = ref<HTMLDivElement>();
let volumeProgress = ref<HTMLDivElement>();
let lrcContentEl = ref<HTMLDivElement>();
let lrcContainerEl = ref<HTMLDivElement>();

let normalClient = inject(normalClientInjectionKey)!;

function changePlayProgress(e: any) {
    if (playProgress.value) {
        emitter.emit('changeCurTimeTo',minmax(ZKStore.play.duration * e.layerX / playProgress.value.clientWidth, 0, ZKStore.play.duration));
    }
}
function changeVolumeProgress(e: any) {
    if (volumeProgress.value) {
        emitter.emit('changeVolumeTo',minmax(e.layerX / volumeProgress.value.clientWidth, 0, 1));
    }
}

function updateHighlightedIndex() {
    // 遍历解析后的歌词数组
    for (let i = 0; i < ZKStore.play.song.lrc.lrc.length; i++) {
        // 如果当前时间小于当前歌词的时间，说明当前播放到了下一句歌词
        if (ZKStore.play.curTimeNum < ZKStore.play.song.lrc.lrc[i].time) {
            // 返回当前歌词的索引
            ZKStore.play.highlightLrcIndex = i - 1 >= 0 ? i - 1 : 0;
            return;
        }
    }
    // 如果当前时间大于最后一句歌词的时间，则返回最后一句歌词的索引
    ZKStore.play.highlightLrcIndex = ZKStore.play.song.lrc.lrc.length - 1;
    return;
}
emitter.on('updateActiveLrcIndex', updateHighlightedIndex)
watch([() => ZKStore.play.highlightLrcIndex, () => ZKStore.play.song.lrc, () => ZKStore.showFullPlay], () => {
    nextTick(() => {
        if (ZKStore.play.song.lrc.status === 'parsed') {
            // console.log('$', lrcContainerEl.value, lrcContentEl.value, lrcContainerEl.value!.querySelector('.lrcItem.active'));
            if (lrcContainerEl.value && lrcContentEl.value) {
                let activeLrcItem = <HTMLDivElement>lrcContainerEl.value.querySelector('.lrcItem.active')
                if (activeLrcItem) {
                    let targetOffset = activeLrcItem.offsetTop -
                                        lrcContentEl.value.clientHeight / 2 +
                                        activeLrcItem.clientHeight / 2;
                    lrcContainerEl.value.style.top = `${-targetOffset}px`
                }
            }
        }
    })
}, {deep: true})

function proceedLrc(lrc: song_lrcConfig) {
    let url = '';
    if (lrc.type === 'web') {
        url = lrc.path
    }else if (lrc.type === 'local') {
        url = tauri.convertFileSrc(lrc.path);
    }else if (lrc.type === 'content') {
        let lines = lrc.content.split(/\r?\n/);
        lrc.lrc = [];
        lines.forEach((line: string) => {
            const match = /\[(\d{2}):(\d{2}\.\d{2})\](.*)/.exec(line);
            if (match) {
                // 提取时间和文字
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                const timeInSeconds = minutes * 60 + seconds;
                const text = match[3].trim();
                lrc.lrc.push({
                    time: timeInSeconds,
                    text: text,
                })
            }
        })
        lrc.status = 'parsed';
        return;
    }
    normalClient.get(url, {
        responseType: 'text',
    }).then((res: AxiosResponse) => {
        let lines = res.data.split(/\r?\n/);
        lrc.lrc = [];
        lines.forEach((line: string) => {
            const match = /\[(\d{2}):(\d{2}\.\d{2})\](.*)/.exec(line);
            if (match) {
                // 提取时间和文字
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                const timeInSeconds = minutes * 60 + seconds;
                const text = match[3].trim();
                lrc.lrc.push({
                    time: timeInSeconds,
                    text: text,
                })
            }
        })
        lrc.status = 'parsed';
    })
}
watch(() => ZKStore.play.song.lrc, (nv) => {
    if (nv.status === 'enable') {
        proceedLrc(nv)
    }
})

</script>

<style scoped>
.partContainer .fullPlayBtn {
    position: absolute;
    /* margin-left: 20px; */
    right: 10px;
    width: 24px;
    height: 24px;
}
.partContainer .fullPlayBtn svg {
    transform: rotate(90deg);
}
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
    overflow: hidden
}
.partContainer .left {
    display: flex;
    margin: 0 20px 20px;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.partContainer .left .pic, .partContainer .left .nonePic {
    position: relative;
    margin-top: 20px;
    width: 240px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.partContainer .left .nonePic {
    /* border: 1px solid #18191C; */
    font-family: NovecentoWide;
    font-size: 30px;
}
.partContainer .left .pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.partContainer .left .singleLineTextEl {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
}
.partContainer .left .title {
    margin-top: 15px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: bold;
    max-width: 300px;
    line-height: 42px;
    height: 42px;
    color: #18191C;
}
.partContainer .left .singer {
    font-size: 14px;
    font-family: SourceSansCNM;
    max-width: 300px;
    line-height: 20px;
    height: 20px;
    color: #666;
    max-width: 280px;
}
.partContainer .left .type {
    font-size: 12px;
    font-family: NovecentoWide;
    font-weight: bold;
    max-width: 300px;
    line-height: 24px;
    height: 24px;
    color: #18191C;
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
    transition: all .15s;
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

.lrcContent, .partContainer .right .lrcStatus {
    height: calc(100% - 20px);
    overflow: hidden;
    position: relative;
}
.lrcContainer {
    position: absolute;
    top: 0;
    transition: all .2s;
    left: 10px;
    right: 20px;
}
.lrcContainer .lrcItem {
    line-height: 32px;
    font-family: SourceSansCNM;
    margin: 5px 0;
    font-size: 16px;
    text-align: center;
    word-break: break-all;
    transition: all .2s;
}
.lrcContainer .lrcItem.active {
    background-color: #18191C;
    color: #fff;
}
.partContainer .playmodeController {
    height: 24px;
    margin: 0 20px;
}
.partContainer .playmodeController .modeitem {
    cursor: pointer;
    color: #61666D;
    width: 24px;
    height: 24px;
}
.partContainer .playmodeController .modeitem:hover {
    color: #18191C;
}
.partContainer .right .lrcStatus {
    display: flex;
    align-items: center;
    justify-content: center;
}
.partContainer .right .lrcStatus .status {
    font-family: NovecentoWide, SourceSansCNM;
    font-size: 44px;
    color: #38393C;
}
</style>