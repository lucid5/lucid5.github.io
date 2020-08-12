
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


// let timer = null;
let svg_key =  null,
    video_status = null;

    // svg_key_2d = null;
    // my_dictionary = null;


function onPlayerStateChange(event) {
  video_status = event.data;
  console.log(video_status);
  var time;
  time = ytplayer.getCurrentTime();

  // if (time <= 60) {
  //   // svg_key = 'point_cloud';
  //   // console.log(svg_key);
  //   if (video_status == 2) {
  //     document.getElementById("svg_anonimous").style.zIndex = 100;
  //     point_cloud.select_svg('#svg_' + "anonimous");
  //     point_cloud.init();
  //     d3.selectAll('#button')
  //       .on('click', point_cloud.init) ;
  //     video_play_control(event);
  //   } else {
  //     document.getElementById("svg_anonimous").style.zIndex = 1;
  //   }   
  // } else
  if (time <= 60) {
    svg_key = 'point_location';
    console.log(svg_key);
    if (video_status == 2) {
      document.getElementById("svg_anonimous").style.zIndex = 100;
      draw_on_svg(
          "anonimous",
          point_location2d,
          point_location
      );
      video_play_control(event);
    } else {
      document.getElementById("svg_anonimous").style.zIndex = 1;
    }
  } else if (60 < time & time <= 120) {
    svg_key = 'point_arrow_location';
    console.log(svg_key);
    if (video_status == 2) {
      document.getElementById("svg_anonimous").style.zIndex = 100;
      draw_on_svg(
          "anonimous",
          point_arrow_location2d,
          point_arrow_location
      );
    } else {
      document.getElementById("svg_anonimous").style.zIndex = 1;
    }
    video_play_control(event);
  } else if (120 < time & time <= 180) {
    svg_key = 'dot_product_formula';
    console.log(svg_key);
    if (video_status == 2) {
      document.getElementById("svg_anonimous").style.zIndex = 100;
      draw_on_svg(
          "anonimous",
          dot_product_formula2d,
          dot_product_formula
      )
    } else  {
      document.getElementById("svg_anonimous").style.zIndex = 1;
    };
    video_play_control(event);
  } else if (time > 180) {
    svg_key = 'dot_product_collide';
    console.log(svg_key);
    if (video_status == 2) {
      document.getElementById("svg_anonimous").style.zIndex = 100;
      draw_on_svg(
          "anonimous",
          dot_product_collide2d,
          dot_product_collide
      );

      d3.selectAll('#compute_button')
        .on('click', function(){
            let is_3d = d3.selectAll('#switch').node().checked;
            if (is_3d) {
              dot_product_collide.compute();
            } else {
              dot_product_collide2d.compute(); 
            }
      });
    } else {
      document.getElementById("svg_anonimous").style.zIndex = 1;
    }
    video_play_control(event);
  }
}

function video_play_control(event) {
  console.log('in control');
  d3.selectAll('#play_button')
    .on('click', function(){
      if (event.data==2) {
        event.target.playVideo();
      } else if (event.data==1) {
        event.target.pauseVideo();
      }
  });
}


function includeJs(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;
    // js.defer = true;

    document.body.appendChild(js);
}

// console.log(svg_id, svg_id_2d);
//     includeJs(svg_id);
//     includeJs(svg_id_2d);

// import {point_arrow_location_2d} from "./assets/js/linear_algebra/point_arrow_location_2d.js";
    // import {point_arrow_location} from "./assets/js/linear_algebra/point_arrow_location.js";

