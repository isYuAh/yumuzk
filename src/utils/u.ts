import { messageController } from "@/types";

export function secondsToMmss(seconds: number) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    var mm = minutes < 10 ? '0' + minutes : minutes;
    var ss = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return mm + ':' + ss;
}
export function minmax(value: number, min: number, max: number) {
    return Math.min(max, Math.max(value, min))
}
export function showMsg(controller: messageController, time: number, text: string) {
    controller.text = text;
    controller.show = true;
    clearTimeout(controller.timer);
    controller.timer = setTimeout(() => controller.show = false, time);
}