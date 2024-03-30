import { type playSongParams } from '@/types';
import mitt from 'mitt'
const emitter = mitt<{
    'playSong': playSongParams,
    'playPrevSong': void,
    'playNextSong': void,
    'changeVolumeTo': number,
    'changeCurTimeTo': number,
    'updateActiveLrcIndex': void
}>();
export default emitter;