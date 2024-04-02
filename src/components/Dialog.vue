<template>
    <div v-show="useZKStore().dialog.show" class="dialogMask">
        <div class="dialogContainer">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useZKStore } from '@/stores/useZKstore';


</script>

<style scoped>
.dialogMask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 105;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .4);
}
</style>