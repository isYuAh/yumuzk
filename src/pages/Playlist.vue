<template>
<div class="partContainer forbidSelect">
    <div @click="checkDetail(index)" v-for="list, index in useZKStore().playlists" class="item">
        <TargetBorder>
            <div class="img">
                <img referrerpolicy="no-referrer" :src="list.pic" alt="">
            </div>
        </TargetBorder>
        <div class="title">{{ list.title }}</div>
    </div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '../stores/useZKstore';
import { clientInjectionKey, list_trace_bilibili_fav } from '../types';
import { inject } from 'vue';
import { normalClientInjectionKey } from '../types';
import { type song } from '../types';
import TargetBorder from '../components/TargetBorder.vue'
let client = inject(clientInjectionKey)!;
let normalClient = inject(normalClientInjectionKey)!;
let ZKStore = useZKStore();
function checkDetail(index: number) {
    ZKStore.nowTab = 'Loading';
    ZKStore.loading.text = '';
    if (ZKStore.playlist.listIndex === index) {
        ZKStore.nowTab = 'PlaylistDetail';
    }else {
        let list = ZKStore.playlists[index];
        ZKStore.playlist.listIndex = index
        ZKStore.playlist.songs = [];
        if (list.type === 'data') {
            useZKStore().playlist.songs = list.songs;
            ZKStore.nowTab = 'PlaylistDetail';
        }else if (list.type === 'trace_bilibili_fav') {
            let pn = 0;
            let getNextPage = function() {
                ZKStore.loading.text = `已加载 ${Math.max(pn)} 页`;
                pn++;
                client.get('https://api.bilibili.com/x/v3/fav/resource/list', {
                    params: {
                        media_id: (list as list_trace_bilibili_fav).favid,
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
                    if (res.data.data.has_more) {
                        getNextPage()
                    }else {
                        ZKStore.nowTab = 'PlaylistDetail';
                    }
                })
            }
            getNextPage()
        }else if (list.type === 'trace_siren') {
            let songsApi = 'https://monster-siren.hypergryph.com/api/songs';
            normalClient.get(songsApi).then(res => {
                ZKStore.playlist.songs = res.data.data.list.map((s: any) => {
                    return <song>{
                        title: s.name,
                        singer: s.artists.join(' / '),
                        type: 'siren',
                        cid: s.cid
                    }
                })
                ZKStore.nowTab = 'PlaylistDetail';
            })
        }
    }
}
</script>

<style scoped>
.partContainer {
    display: grid;
    padding: 20px;
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
</style>