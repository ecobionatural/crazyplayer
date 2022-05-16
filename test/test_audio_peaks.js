
import lib from '../lib/lib.js'
import audio_peaks from '../lib/audio_peaks.js';

//let q = audio_peaks.getFromRaw('../var/_testsound.raw',400);
let q = audio_peaks.getFromVideo('../var/test.mp4');

console.log(q)
