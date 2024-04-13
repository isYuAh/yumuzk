<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref} from "vue";
import {normalClientInjectionKey} from "@/types";
import {saveConfig, useZKStore} from "@/stores/useZKstore.ts";
import {AxiosResponse} from "axios";
import {showMsg} from "@/utils/u.ts";
import emitter from "@/emitter";

let ZKStore = useZKStore();
let qrimgEl = ref<HTMLImageElement>();
let qrstatus = ref('')
let normalClient = inject(normalClientInjectionKey)!;
let mode = ref('');
let key = ref('');
let timer = <NodeJS.Timeout>(-1 as any);
function checkStatus(refresh: boolean = false) {
  if (Object.values(ZKStore.neteaseUser).every(s => s)) {
    mode.value = 'logined';
    return;
  }
  normalClient.post(ZKStore.config.neteaseApi.url + `login/status?timestamp=${Date.now()}`, {
    cookie: ZKStore.neteaseUser.cookie
  }).then((res: AxiosResponse) => {
    console.log(res.data);
    if (res.data.data.account.status == 0) {
      console.log('$profile', res.data.data.profile);
      ZKStore.neteaseUser.nickname = res.data.data.profile.nickname;
      ZKStore.neteaseUser.avatarUrl = res.data.data.profile.avatarUrl;
      ZKStore.neteaseUser.uid = res.data.data.profile.userId;
      ZKStore.neteaseUser.vipType = res.data.data.profile.vipType;
      if (refresh) {
        emitter.emit('refreshPlaylists');
      }
      saveConfig();
      mode.value = 'logined';
    }else {
      mode.value = 'unlogin'
      ZKStore.neteaseUser.nickname = '';
      ZKStore.neteaseUser.avatarUrl = '';
      ZKStore.neteaseUser.cookie = '';
      ZKStore.neteaseUser.uid = '';
      ZKStore.neteaseUser.vipType = '0';
      saveConfig();
    }
  }).finally(() => {
    if (mode.value === 'unlogin') {
      normalClient.post(ZKStore.config.neteaseApi.url + 'login/qr/key', {
        timestamp: Date.now(),
      }).then((res: AxiosResponse) => {
        console.log('$Key', res.data);
        if (res.data.data.code && res.data.data.code === 200) {
          key.value = res.data.data.unikey;
        }
      }).finally(() => {
        normalClient.post(ZKStore.config.neteaseApi.url + 'login/qr/create', {
          timestamp: Date.now(),
          key: key.value,
          qrimg: "true"
        }).then((res: AxiosResponse) => {
          console.log(res.data);
          if (qrimgEl.value) {
            res.data.data.qrimg && (qrimgEl.value.src = res.data.data.qrimg);
          }
          timer = setInterval(async () => {
            const status = await normalClient.get(ZKStore.config.neteaseApi.url + 'login/qr/check', {
              params: {
                timestamp: Date.now(),
                key: key.value,
                noCookie: 'true'
              }
            });
            if (status.data.code === 800) {
              clearInterval(timer);
              showMsg(ZKStore.message, 4000, `二维码过期，请重新切换到这个页面`);
            }
            qrstatus.value = status.data.message;
            if (status.data.code === 803) {
              clearInterval(timer);
              showMsg(ZKStore.message, 4000, `${status.data.message}`);
              ZKStore.neteaseUser.cookie = status.data.cookie;
              // console.log('$cookie', status.data.cookie);
              checkStatus(true);
            }
            // console.log('$status', status.data);
          }, 3000)
        })
      })
    }
  });
  onUnmounted(() => {
    clearInterval(timer)
  })
}
function logout() {
  normalClient.post(ZKStore.config.neteaseApi.url + 'logout', {
    cookie: ZKStore.neteaseUser.cookie
  }).finally(() => {
    mode.value = 'unlogin'
    ZKStore.neteaseUser.nickname = '';
    ZKStore.neteaseUser.avatarUrl = '';
    ZKStore.neteaseUser.cookie = '';
    ZKStore.neteaseUser.uid = '';
    ZKStore.neteaseUser.vipType = '0';
    saveConfig();
    checkStatus(true);
  })
}
onMounted(() => checkStatus());
</script>

<template>
<div class="UserCenter">
  <div v-if="mode === 'unlogin'" class="tab">
    <div class="unloginContainer">
      <div class="text">请扫码登陆</div>
      <img ref="qrimgEl" src="" alt="">
      <div class="text">{{ qrstatus }}</div>
    </div>
  </div>
  <div v-if="mode === 'logined'" class="tab">
    nickname: {{ZKStore.neteaseUser.nickname}}
    <button @click="logout">退出登录</button>
  </div>
</div>
</template>

<style scoped>
.tab {
  width: 100%;
  height: 100%;
}
.unloginContainer {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.UserCenterContainer {
  width: 100%;
  height: 100%;
}
</style>