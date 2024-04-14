import {checkDetailParams, type playSongParams, refreshPlaylistsParams} from '@/types';
import mitt from 'mitt'
const emitter = mitt<{
    'playSong': playSongParams,
    'playPrevSong': void,
    'playNextSong': void,
    'changeVolumeTo': number,
    'changeCurTimeTo': number,
    'updateActiveLrcIndex': void,
    'refreshPlaylists': refreshPlaylistsParams,
    'checkDetail': checkDetailParams,
}>();
export default emitter;