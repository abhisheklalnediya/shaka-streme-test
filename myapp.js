// 4K VOD
// var manifestUri = `https://uselector.cdn.intigral.net/Titles/M0019480/M0019480.ism/manifest.mpd?filter=((type=="video"%26%26MaxHeight<=2160)%7C%7C(type=="audio")%7C%7C(type=="textstream"))&codec=hevc`;
// var manifestUri = `https://uselector.cdn.intigral.net/Titles/M0019480/M0019480.ism/manifest.mpd`;
// 1080 VOD
var manifestUri = `https://uselector.cdn.intigral.net/Titles/M0012400/M0012400.ism/manifest.mpd`;
// var manifestUri = `"https://uselector.cdn.intigral.net/Titles/M0019020/M0019020.ism/manifest.mpd"`;
// Live
// var manifestUri = `="https://uselector.cdn.intigral.net/JAW1/JAW1.isml/manifest.mpd`;

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
  window.addEventListener('keydown', function (e) {
    console.log("eee", e)
    if (videoElement.paused)
      videoElement.play();
    else
      videoElement.pause();
  });
  
  var drmServerList = {
    'com.widevine.alpha': 'https://wv.drm.intigral-ott.net:8063?deviceId=ZWI0MmM1NzQtZTY4OS0zODEwLWE4NzEtMDViMDNlZTU2NWQ5',
    'com.microsoft.playready': 'http://pr.drm.intigral-ott.net/PlayReady/RightsManager.asmx?deviceId=ZWI0MmM1NzQtZTY4OS0zODEwLWE4NzEtMDViMDNlZTU2NWQ5',
  };


  player.detach().then(function () {
    player.attach(videoElement);
    player.configure('abr.enabled', true);
    player.configure({
      drm: {
        servers: drmServerList
      }
    });
    document.getElementById("manifestUri").innerHTML = `URL : ${manifestUri}`;
    player.load(manifestUri)
      .then(function (response) {
        console.log("Working", response);
      })
      .catch(function (response) {
        document.getElementById("error").innerHTML = `Shaka Error : ${response.code}`;
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

  console.log("################ on loaded data ##################" )
   
  console.log("tracks", player.getVariantTracks() );
    let videoData = player.getVariantTracks();
    let qualities = videoData.map((item)=> item.height)
    console.log("qualities", qualities)
    let currentTrack =  videoData.filter((tracks) => tracks.active);
    document.getElementById("error").innerHTML = `Quality : ${currentTrack[0].height} x ${currentTrack[0].width}`;
    console.log("active ", currentTrack[0])
   
    setTimeout(()=>{ 
      const item =  videoData[0]
      console.log("quality switch with", item)
      player.configure('abr.enabled', false);
      player.selectVariantTrack(item, true)
     }, 15000)

  }
 
  videoElement.ontimeupdate = function () {
  console.log("################ time update ##################",  player.getStats())
  }
  
  videoElement.onpause = function () {
  console.log("################ on pausing ##################",  player.getStats())
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