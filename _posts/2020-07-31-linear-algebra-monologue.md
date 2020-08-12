---
title: Linear Algebra Monologue
---
<script src="/assets/js/linear_algebra/lib.js"></script>

<style type="text/css">
.js {
  font-size: 12.5;
  color: #696969;
  text-align: center-justify;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 16px;
  top: -10px;
  left: 0px;
}

.switch.show {
  width: 52px;
  top: -8.5px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
  display: inline;
}

.slider {
  position: absolute;
  display: inline-block;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.slider:after
{
 content:'2D';
 font-weight: bold;
 color: white;
 display: block;
 position: absolute;
 transform: translate(-50%,-50%);
 top: 50%;
 left: 65%;
 font-size: 10px;
 font-family: Verdana, sans-serif;
}

input:checked + .slider:after
{  
  content:'3D';
  left: 35%;
}

input:checked + .slider.show:before {
  -webkit-transform: translateX(36px);
  -ms-transform: translateX(36px);
  transform: translateX(36px);
}

.slider.show:after {
  content: 'Show';
  font-weight: bold;
  left: 63%;
  font-size: 12px;
  font-family: Georgia, sans-serif;
}

input:checked + .slider.show:after
{  
  content:'Hide';
}

.iframe {
    position:relative;
    z-index:1;

}
.svg{
    position:relative;
    z-index:1;
    background-color: snow; // aliceblue
}

</style>

<script>
function draw_on_svg(svg_id, fn_2d, fn_3d=null) {
  let is_3d = false,
      data_2d = null,
      data_3d = null;
  fn_2d.select_svg('#svg_' + svg_id);
  fn_2d.init(0);

  d3.selectAll('#button')
    .on('click', function(){
      if (is_3d) {
        fn_3d.init(1000);
      } else {
        fn_2d.init(1000);
      }
    });

  d3.selectAll('#switch')
    .on('click', function(){
      is_3d = this.checked;
      if (is_3d) {
        data_2d = fn_2d.hasOwnProperty('data') ? fn_2d.data() : null;
        fn_3d.select_svg('#svg_' + svg_id);
        fn_3d.init(1000, data_2d);
      } else {
        data_3d = fn_3d.hasOwnProperty('data') ? fn_3d.data() : null;
        fn_2d.select_svg('#svg_' + svg_id);
        fn_2d.init(1000, data_3d);
      }
    })
}
</script>

<div align="left" style="margin:0px;padding:0x;overflow:hidden;">
  <iframe class='iframe' id="player"
          src="https://www.youtube.com/embed/g9hwjQBQFIo?enablejsapi=1"
          frameborder="0"
          style="height:280;width:600" 
          allowfullscreen       
  ></iframe>
</div>
<div align="left" style="margin:0px;padding:0x;overflow:hidden;">
    <svg height="10" width="650"  id="svg_intentionally_blank"></svg>
    <svg class='svg' height="280" width="600" id="svg_anonimous1"></svg>
    <center class='js'>
      Drag or click <button id='button'>reset</button>
      <label class='switch'>
        <input type='checkbox' id='switch'> 
        <div class='slider'></div>
      </label>
      <button id='compute_button'>compute</button>
    </center>
</div>


<!-- <div align="left" style="margin:0px;padding:0x;overflow:hidden;"> -->
  <!-- <svg width="600" height="50" id="svg_intentionally_blank"></svg> -->
<!-- </div> -->
<script src="/assets/js/linear_algebra/point_cloud.js"></script>
<script src="/assets/js/linear_algebra/point_location.js"></script>
<script src="/assets/js/linear_algebra/point_location2d.js"></script>
<script src="/assets/js/linear_algebra/point_arrow_location.js"></script>
<script src="/assets/js/linear_algebra/point_arrow_location2d.js"></script>
<script src="/assets/js/linear_algebra/embed_youtube.js"></script>
