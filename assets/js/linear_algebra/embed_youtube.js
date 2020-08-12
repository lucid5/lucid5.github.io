
var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytplayer;
function onYouTubeIframeAPIReady() {
	ytplayer = new YT.Player('player', {
    ytplayerVars: {showinfo:0, autoplay:0},
	  events: {
	    'onReady': onPlayerReady
	    // 'onStateChange': onPlayerStateChange
	  }
	});
}

let svg_key =  null,
    video_status = null,
    time = null,
    mytimer = null;
d3.selectAll('#switch')
  .on('click', function(){
    is_3d = this.checked;
});

is_3d = false;

function onPlayerReady(event) {
	time = ytplayer.getCurrentTime();
  console.log("start_time", time);
  event.target.playVideo();
  
  setInterval(function(){
    time = ytplayer.getCurrentTime();
    console.log("counting_time", time);
  }, 5000);

  mytimer = time;
  console.log(mytimer);

  show_svg(time);
  console.log(time);
}

// function onPlayerStateChange(event) {
//   video_status = event.data;
//   console.log("status_change", video_status);
// }

function show_svg(time) {
  if (time <= 60) {
    svg_key = 'point_cloud';
    console.log(svg_key);
    console.log(is_3d);
    point_cloud.select_svg('#svg_' + "anonimous1");
    point_cloud.init();
    d3.selectAll('#button')
      .on('click', point_cloud.init)
  }

  if (60 < time & time <= 150) {
    svg_key = 'point_location';
    console.log(svg_key);
    // console.log(is_3d);
    draw_on_svg(
        "anonimous1",
        point_location2d,
        point_location
    );
  }

  if (time > 150) {
    svg_key = 'point_arrow_location';
    console.log(svg_key);
    console.log(is_3d);
    draw_on_svg(
        "anonimous1",
        point_arrow_location2d,
        point_arrow_location
    );
  }
}

