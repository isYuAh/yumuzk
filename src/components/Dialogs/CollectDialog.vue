<template>
<div class="dialogPreviewContainer">
    <div class="header">收藏</div>
    <div class="content">
        <select ref="selectComponent" style="width: 400px" name="" id="">
            <option v-show="index < ZKStore.playlistsParts[0].count" v-for="(list, index) in ZKStore.playlists" :value="list.title">{{ list.title }}</option>
        </select>
    </div>
    <div class="footer">
        <button @click="collect" class="dialogBtn confirm">收藏</button>
        <button @click="cancel" class="dialogBtn cancel">取消</button>
    </div>
</div>
</template>

<script setup lang='ts'>
import { useZKStore } from '@/stores/useZKstore.ts';
import { showMsg } from '@/utils/u.ts';
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { ref, toRaw } from 'vue';
let ZKStore = useZKStore();
let selectComponent = ref<HTMLSelectElement>();
function collect() {
    if (selectComponent.value && selectComponent.value.selectedIndex > -1) {
        let components = ZKStore.playlists[selectComponent.value.selectedIndex].playlist;
        let first = components[0];
        let originFn = ZKStore.playlists[selectComponent.value.selectedIndex].originFilename;
        if (first.type === 'data') {
            first.songs.unshift(ZKStore.dialogData.waitCollect);
        }else {
            components.unshift({
                type: "data",
                songs: [ZKStore.dialogData.waitCollect],
            })
        }
        if (selectComponent.value.selectedIndex === ZKStore.playlist.listIndex) {
            ZKStore.playlist.songs.unshift(ZKStore.dialogData.waitCollect)
        }
        writeTextFile(`res/lists/${originFn}`, JSON.stringify(toRaw(ZKStore.playlists[selectComponent.value.selectedIndex])), {dir: BaseDirectory.Resource}).then(() => {
            showMsg(ZKStore.message, 4000, '添加成功');
        }).catch(() => {
            showMsg(ZKStore.message, 4000, `写入文件${originFn}失败`);
        })
        ZKStore.dialog.show = false;
    }
}
function cancel() {
    ZKStore.dialog.show = false;
}
</script>

<style scoped>
.dialogPreviewContainer {
    border: 1px;
    background-color: #fff;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .4)
}
.dialogPreviewContainer .header {
    font-family: SourceSansCNM;
    font-size: 18px;
    margin-bottom: 10px;
}
.footer, .content {
    margin-top: 20px;
}
.dialogBtn {
    border: none;
    background-color: #18191C;
    color: #fff;
    padding: 10px 15px;
    margin: 0 5px;
}
.dialogBtn:hover {
    cursor: pointer;
}
select, input {
  margin: 5px 0;
  font-family: SourceSansCNM;
  font-size: 18px;
  padding: 5px 10px;
  border: 1px solid #000000;
}
</style>