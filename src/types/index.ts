import { AxiosInstance } from "axios";
import { InjectionKey } from "vue";
export type list_basic = {
    pic: string,
    title: string,
}
export type list_data = {
    type: 'data'
    songs: song[],
} & list_basic;
export type list_trace_bilibili_fav = {
    type: 'trace_bilibili_fav',
    favid: string,
} & list_basic;
export type list_trace_siren = {
    type: 'trace_siren',
} & list_basic;
export type list = list_data | list_trace_bilibili_fav | list_trace_siren;


export type song_lrc_web = {
    type: 'web',
    path: ''
}
export type song_lrc_local = {
    type: 'local',
    path: ''
}
export type song_lrc_item = {
    time: number,
    text: string
}
export type song_lrc = song_lrc_local | song_lrc_web;
export type song_basic = {
    title: string,
    singer: string,
    pic?: string,
    lrc?: song_lrc
}
export type song_basic_w = {
    title?: string,
    singer?: string,
    pic?: string,
}

export type song_bilibili = {
    type: 'bilibili',
    BV: string
} & song_basic;
export type song_local = {
    type: 'local',
    path: string
} & song_basic;
export type song_web = {
    type: 'web',
    url: string,
} & song_basic;
export type song_netease = {
    type: 'netease',
    id: string
} & song_basic;
export type song_netease_outer = {
    type: 'netease_outer',
    id: string
} & song_basic;
export type song_netease_other = {
    type: 'netease_other',
    id: string
} & song_basic;
export type song_siren = {
    type: 'siren',
    cid: string
} & song_basic;

export type song = song_bilibili |
                    song_local |
                    song_web |
                    song_netease |
                    song_netease_outer |
                    song_netease_other |
                    song_siren
export const clientInjectionKey: InjectionKey<AxiosInstance> = Symbol()
export const normalClientInjectionKey: InjectionKey<AxiosInstance> = Symbol()
export const playSongInjectionKey: InjectionKey<(song: song) => void> = Symbol()