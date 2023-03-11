import AudioRecorder from 'audio-recorder-polyfill'
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'

AudioRecorder.encoder = mpegEncoder
AudioRecorder.prototype.mimeType = 'audio/mpeg'
window.MediaRecorder = AudioRecorder