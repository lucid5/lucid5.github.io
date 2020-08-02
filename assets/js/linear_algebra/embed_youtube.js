var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytplayer;
function onYouTubeIframeAPIReady() {
ytplayer = new YT.Player('player', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
});
}
function onPlayerReady(event) {
event.target.playVideo();
}

function onPlayerStateChange(event) {
if (event.data == 2){ // paused
  var time;
  time = ytplayer.getCurrentTime();
  console.log(time);
}
}