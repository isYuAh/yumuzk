import { song } from '@/types';
import mitt from 'mitt'
const emitter = mitt<{
    'playSong': song,
    'playPrevSong': void,
    'playNextSong': void,
    'changeVolumeTo': number,
    'changeCurTimeTo': number,
    'updateActiveLrcIndex': void
}>();
export default emitter;