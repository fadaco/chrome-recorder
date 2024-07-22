

chrome.runtime.onMessage.addListener(async (message) => {
    if (message === 'run') {
         await showWebcaRecorder()
    } else if (message === 'stop') {
        await showWebCamRecorder()
     }
})

async function showWebcaRecorder() {
const div = document.createElement('div')
const video = document.createElement('video')
const body = document.querySelector('body')
body.style.position = 'relative'
div.style.position = 'sticky'
div.style.right =  div.style.bottom = '10px'
div.style.zIndex = '99999999999'
div.style.float = 'right'
div.style.display = 'flex'
div.style.justifyContent = 'flex-end'
div.style.borderRadius = video.style.borderRadius = '25%'
video.style.height = video.style.width = '200px'
div.appendChild(video)
body.appendChild(div)
video.muted = true
video.play()


    if (navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            video.srcObject = stream;
        } catch (e) {
            console.error('Error accessing webcam:', e);
        }
} else {
    console.error('getUserMedia not supported in this browser.');
}

}

async function showWebCamRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getVideoTracks()[0].stop()
    window.location.reload()
}

