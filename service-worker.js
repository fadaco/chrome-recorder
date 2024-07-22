chrome.action.onClicked.addListener(async (tab) => {
  const existingContexts = await chrome.runtime.getContexts({});
  let recording = false;

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
  );

  if (!offscreenDocument) {
    await chrome.offscreen.createDocument({
      url: 'popup.html',
      reasons: ['USER_MEDIA'],
      justification: 'Recording from chrome.tabCapture API'
    });
  } else {
    recording = offscreenDocument.documentUrl.endsWith('#recording');
  }

  if (recording) {
    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'offscreen'
    });
    chrome.tabs.sendMessage(tab.id, "stop")

    chrome.action.setIcon({ path: 'images/icon-48.png' });
    return;
  }

  const streamId = await chrome.tabCapture.getMediaStreamId({
    targetTabId: tab.id
  });

  chrome.runtime.sendMessage({
    type: 'start-recording',
    target: 'offscreen',
    data: streamId
  });

  chrome.tabs.sendMessage(tab.id, "run")

  chrome.action.setIcon({ path: 'images/icon-128.png' });

});