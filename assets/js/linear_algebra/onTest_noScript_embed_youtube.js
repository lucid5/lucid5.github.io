
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

let video_status = null,
    time = null,
    is_3d = false;  

function onPlayerStateChange(event) {
  video_status = event.data;
  time = ytplayer.getCurrentTime();

  if (video_status == 2) {
    preparing_svg("svg_anonimous");
    video_play_control(event);
    
    if (time <= 60) {
      draw_on_svg(
          "anonimous",
          point_location2d,
          point_location,
          is_3d
      );
      console.log(is_3d);
      // update_slider_status();

    } else if (60 < time & time <= 120) {
      draw_on_svg(
          "anonimous",
          point_arrow_location2d,
          point_arrow_location,
          is_3d
      );
      console.log(is_3d);

    } else if (120 < time & time <= 180) {
      draw_on_svg(
          "anonimous",
          dot_product_formula2d,
          dot_product_formula,
          is_3d
      );
      console.log(is_3d);
      // update_slider_status();

    } else if (time > 180) {
      draw_on_svg(
          "anonimous",
          dot_product_collide2d,
          dot_product_collide,
          is_3d
      );
      console.log(is_3d);
      // update_slider_status();

      d3.selectAll('#compute_button')
        .on('click', function(){
          if (ytplayer.getCurrentTime() <= 180) {
            return;
          }
          let is_3d = d3.selectAll('#switch').node().checked;
          if (is_3d) {
            dot_product_collide.compute();
          } else {
            dot_product_collide2d.compute(); 
          }
      });
    }

  } else {
      document.getElementById("svg_anonimous").style.zIndex = 1;
      update_slider_status();
    }

}


function preparing_svg(id) {
  // update_slider_status();
  let svg = d3.select("#" + id);
  // cleanup;
  svg = svg.selectAll("*").remove();
  // bring on top of iframe;
  document.getElementById(id).style.zIndex = 100;
  // video_play_control(event); // st wrong, does not work here.
};


function video_play_control(event) {
  d3.selectAll('#play_button')
    .on('click', function(){
      if (event.data==2) {
        event.target.playVideo();
      } else if (event.data==1) {
        event.target.pauseVideo();
      }
  });
}


function update_slider_status(){
  console.log('be4_update_3d', is_3d);
  d3.selectAll('#switch')
  .on('click', function(){
    if (this.checked) {
      is_3d = true;
    } else {
      is_3d = false;
    }
    console.log('update_3d', is_3d);
  })
}
















// function check_slider_status(){
//   let is_3d = null;
//   this.d3.selectAll('#switch');
//   // is_3d = this.checked;
//   if (this.checked) {
//       is_3d = true;
//       console.log('check_3d:', is_3d);
//     } else {
//       is_2d = true;
//       console.log('check_3d:', is_3d);
//     }  
// };
// function includeJs(jsFilePath) {
//     var js = document.createElement("script");

//     js.type = "text/javascript";
//     js.src = jsFilePath;
//     // js.defer = true;

//     document.body.appendChild(js);
// }

// console.log(svg_id, svg_id_2d);
//     includeJs(svg_id);
//     includeJs(svg_id_2d);

// import {point_arrow_location_2d} from "./assets/js/linear_algebra/point_arrow_location_2d.js";
    // import {point_arrow_location} from "./assets/js/linear_algebra/point_arrow_location.js";

// svg.selectAll("*").remove();
//svg.selectAll.remove();
//('svg_anonimous').remove();


// add clean up inside draw on svg but doesn't work, be before or after chosing svg.
// d3.select("svg_anonimous").remove();

// function update_slider_status(){
//     d3.selectAll('#switch')
//       .on('click', function(){
//         is_3d = this.checked;
//         if (this.checked) {
//           is_3d = true;
//           console.log('update_3d', is_3d);
//         } else {
//           is_2d = true;
//           console.log('update_3d', is_3d);
//         } 
//       })
// };