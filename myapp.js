var manifestUri = "add your manifest here";

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();
  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}
function initPlayer() {
  var videoElement = document.getElementById('video');
  var player = new shaka.Player();
  window.ddd = videoElement;
  window.addEventListener('keydown', function () {
    if (videoElement.paused)
      videoElement.play();
    else
      videoElement.pause();
  });
  
  var drmServerList = {
    'com.widevine.alpha': 'add your drm here',
  };


  player.detach().then(function () {
    player.attach(videoElement);
    player.configure({
      drm: {
        servers: drmServerList
      }
    });
    player.load(manifestUri)
      .then(function (response) {
        console.log("Working", response);
      })
      .catch(function (response) {
        console.log("Error", response);
      });

  });
  player.addEventListener('error', onErrorEvent);

  videoElement.onplaying = function () {
    console.log("################### onplaying ####################");
  }

  videoElement.oncanplay = function () {

  }

  videoElement.onloadeddata = function () {

    console.log("################ on loaded data ##################")

  }

  videoElement.onloadedmetadata = function () {
    console.log("################ onloadedmetadata ##################");
    console.log("onloadedmetadata called", videoElement.currentTime);
  };
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
  document.getElementById("error").innerHTML = `Shaka Error : ${error.code}`;
}

document.addEventListener('DOMContentLoaded', initApp);