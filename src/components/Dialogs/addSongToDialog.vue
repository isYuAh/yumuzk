<script setup lang="ts">
import {useZKStore} from "@/stores/useZKstore.ts";
import {clipboard} from "@tauri-apps/api";
import {AxiosResponse} from "axios";
import emitter from "@/emitter";
import {inject, ref} from "vue";
import {clientInjectionKey, normalClientInjectionKey, song} from "@/types";
let ZKStore = useZKStore();
let title = ref("");
let singer = ref("");
let id = ref("");
let selectComponent = ref<HTMLSelectElement>();
let normalClient = inject(normalClientInjectionKey)!;
let client = inject(clientInjectionKey)!;
function cancel() {
  ZKStore.dialog.show = false;
}
async function autoDetectFromClipboard() {
  let clip = await clipboard.readText() || '';
  if (clip.startsWith('https://music.163.com/#/song?id=') ||
      clip.startsWith('music.163.com/#/song?id=')
  ) {
    let match = clip.match(/\/song\?id=(\d+)/);
    if (match) {
      id.value = match[1];
      selectComponent.value!.value = 'netease';
      let rawDetail = {} as any;
      normalClient.get(`${ZKStore.config.neteaseApi.url}song/detail?ids=${id.value}`).then((res: AxiosResponse) => {
        rawDetail = res.data['songs'][0];
        title.value = rawDetail.name;
        singer.value = rawDetail.ar.map((artist: any) => artist.name).join(' & ');
      })
    }
  }else if (clip.startsWith('https://www.bilibili.com/video/BV')) {
    let match = clip.match(/\/video\/BV([a-zA-Z0-9]+)/);
    if (match) {
      id.value = match[1];
      selectComponent.value!.value = 'bilibili';
      let rawDetail = {} as any;
      client.get('https://api.bilibili.com/x/web-interface/view', {
        params: {
          bvid: id.value,
        }
      }).then((res: AxiosResponse) => {
        rawDetail = res.data.data
        title.value = rawDetail.title;
        singer.value = rawDetail.owner.name;
      })
    }
  }else if (clip.startsWith('https://y.qq.com/n/ryqq/songDetail/')) {
    let match = clip.match(/\/songDetail\/([a-zA-Z0-9]+)/);
    if (match) {
      id.value = match[1];
      selectComponent.value!.value = 'qq';
      let rawDetail = {} as any;
      normalClient.post(`${ZKStore.config.qqApi.url}api/y/get_song`, {
        type: "qq",
        mid: id.value,
      }).then((res: AxiosResponse) => {
        rawDetail = res.data.data[0]
        title.value = rawDetail.title;
        singer.value = rawDetail.owner.singer;
      })
    }
  }else if (clip.startsWith('https://monster-siren.hypergryph.com/music/')) {
    let match = clip.match(/\/music\/(\d+)/);
    if (match) {
      id.value = match[1];
      selectComponent.value!.value = 'siren';
      let rawDetail = {} as any;
      normalClient.get(`https://monster-siren.hypergryph.com/api/song/${id.value}`).then((res: AxiosResponse) => {
        rawDetail = res.data.data
        title.value = rawDetail.name;
        singer.value = rawDetail.artists.join(' & ');
      })
    }
  }
}
function addSong() {
  let song = {
    title: title.value,
    singer: singer.value,
    type: selectComponent.value!.value,
  } as Record<string, any>;
  switch(selectComponent.value!.value) {
    case 'netease':
      song.id = id.value;
      break;
    case 'qq':
      song.mid = id.value;
      break;
    case 'siren':
      song.id = id.value;
      break;
    case 'bilibili':
      song.BV = id.value;
      break;
    default:
      return;
  }
  emitter.emit('addSongTo', {song: (song as song), save: true});
  ZKStore.dialog.show = false;
}
</script>

<template>
  <div class="dialogPreviewContainer">
    <div class="header">添加歌曲</div>
    <div class="content">
      <div class="typeChoose">
        <label for="">类型：</label>
        <select ref="selectComponent" style="width: 400px" name="" id="">
          <option value="bilibili">哔哩哔哩</option>
          <option value="netease">网易云</option>
          <option value="qq">QQ音乐</option>
          <option value="siren">塞壬唱片</option>
        </select>
      </div>
      <div>
        <label for="">歌名：</label>
        <input style="width: 400px" v-model="title" type="text"/>
      </div>
      <div>
        <label for="">歌手：</label>
        <input style="width: 400px" v-model="singer" type="text"/>
      </div>
      <div>
        <label for="">id：</label>
        <input style="width: 400px" v-model="id"/>
      </div>
    </div>
    <div class="footer">
      <button @click="autoDetectFromClipboard" class="dialogBtn confirm">从剪贴板</button>
      <button @click="addSong" class="dialogBtn confirm">添加</button>
      <button @click="cancel" class="dialogBtn cancel">取消</button>
    </div>
  </div>
</template>

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

.asDataLabel {
  vertical-align: text-top;
  padding-left: 2px;
}
</style>