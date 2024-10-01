<script setup lang="ts">
import simplebar from "simplebar-vue";
import 'simplebar-vue/dist/simplebar.min.css'
import {ref} from "vue";
import {saveConfig, useZKStore} from "@/stores/useZKstore.ts";
import {showMsg} from "@/utils/u.ts";
let ZKStore = useZKStore();

let apiConfig = ref({
  neteaseUrl: ZKStore.config.neteaseApi.url,
  qqUrl: ZKStore.config.qqApi.url,
})
function saveApiConfig () {
  ZKStore.config.neteaseApi.url = apiConfig.value.neteaseUrl;
  ZKStore.config.qqApi.url = apiConfig.value.qqUrl;
  saveConfig();
  showMsg(ZKStore.message, 4000, '保存成功')
}
</script>

<template>
<div class="SettingsContainer">
  <simplebar class="simplebar">
    <div class="SettingsPane css1">
      <div class="title">API</div>
      <div class="content">
        <div class="apiInput">
          <div class="label">网易云</div>
          <input class="input" v-model="apiConfig.neteaseUrl" type="text" />
        </div>
        <div class="apiInput">
          <div class="label">QQ</div>
          <input class="input" v-model="apiConfig.qqUrl" type="text" />
        </div>
        <div class="controlBtns">
          <div @click="saveApiConfig" class="controlBtn">保存</div>
        </div>
      </div>
    </div>
    <div class="SettingsPane">
      <div class="title">颜色</div>
      <div class="content">
        <div v-for="(_, k) in ZKStore.colors" class="colorInput apiInput">
          <div class="label">{{k}}</div>
          <el-color-picker show-alpha v-model="ZKStore.colors[k]" />
        </div>
      </div>
    </div>
  </simplebar>
</div>
</template>

<style scoped>
.simplebar {
  width: 100%;
  height: 100%;
}
.SettingsContainer {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}
.SettingsPane {
  margin: 10px;
}
.SettingsPane > .title {
  font-family: SourceSansCNM;
  font-size: 28px;
  color: var(--ymk-text-color);
}
.SettingsPane > .content {
  padding-top: 10px;
  padding-left: 20px;
}
.apiInput {
  margin: 10px 0;
  display: flex;
}
.apiInput .label {
  width: 70px;
  margin-right: 10px;
}
.colorInput .label {
  width: auto;
}
.apiInput .label, .apiInput .input {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  font-family: SourceSansCNM;
  color: var(--ymk-text-color);
}
input {
  background-color: rgba(0,0,0,.3);
}
.apiInput .input {
  flex: 1;
  border: 1px solid #18191C;
  padding:0 10px;
}
.controlBtn {
  cursor: pointer;
  background-color: #18191C;
  display: inline-block;
  color: #fff;
  padding: 0 15px;
  height: 35px;
  line-height: 35px;
}
</style>