<template>
<div class="partContainer">
    <div class="left">
        <div class="pic">
            <img :src="ZKStore.play.song.pic" alt="">
        </div>
    </div>
    <div class="right"></div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '../stores/useZKstore';
let ZKStore = useZKStore();
</script>

<style scoped>
.partContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 10;
    display: grid;
    grid-template-columns: 360px 1fr;
}
</style>