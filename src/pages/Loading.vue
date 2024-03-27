<template>
<div class="partContainer">
    <div class="text">Loading</div>
    <div v-show="ZKStore.loading.text" class="tipMessage">{{ ZKStore.loading.text }}</div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '../stores/useZKstore';
let ZKStore = useZKStore();

</script>

<style scoped>
.partContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.partContainer .text {
    font-family: NovecentoWide;
    font-size: 42px;
}
.partContainer .tipMessage {
    font-family: SourceSansCNM;
    font-size: 24px;
    margin-top: 20px;
}
</style>