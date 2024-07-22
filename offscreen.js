
const btn = document.querySelector('#btn')


chrome.runtime.onMessage.addListener(async (message) => {
    if (message.target === 'offscreen') {
      switch (message.type) {
        case 'start-recording':
          startRecording(message.data);
          break;
        case 'stop-recording':
          stopRecording();
          break;
        default:
          throw new Error('Unrecognized message:', message.type);
      }
    }
  });
  
  let recorder;
  let data = [];
  
  async function startRecording(streamId) {
    if (recorder?.state === 'recording') {
      throw new Error('Called startRecording while recording is in progress.');
    }
  
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });
  
    const output = new AudioContext();
    const source = output.createMediaStreamSource(media);
    source.connect(output.destination);
  
    recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(data, { type: 'video/webm' });
      window.open(URL.createObjectURL(blob), '_blank');
        recorder = undefined;
      data = [];
    };
    recorder.start();

    window.location.hash = 'recording';
    
  }
  
  async function stopRecording() {
    recorder.stop();
  
    // Stopping the tracks makes sure the recording icon in the tab is removed.
    recorder.stream.getTracks().forEach((t) => t.stop());
  
    // Update current state in URL
    window.location.hash = '';
  
    // Note: In a real extension, you would want to write the recording to a more
    // permanent location (e.g IndexedDB) and then close the offscreen document,
    // to avoid keeping a document around unnecessarily. Here we avoid that to
    // make sure the browser keeps the Object URL we create (see above) and to
    // keep the sample fairly simple to follow.
  }