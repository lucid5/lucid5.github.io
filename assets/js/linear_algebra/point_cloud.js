let point_cloud = (function() {

let origin = [300, 150], 
  scale = 10, 
  scatter = [], 
  axis = [],
  expectedAxis = [],
  beta = 0, alpha = 0, 
  startAngleX = Math.PI/8. * 2,
  startAngleY = -Math.PI/8.,
  startAngleZ = Math.PI/8.
  axis_len = 13,
  svg = null,
  lib = null;


// let svg = d3.select(svg_id);
function select_svg(svg_id) {
  svg = d3.select(svg_id);

  lib = space_plot_lib(
    svg,
    origin, 
    scale,
    is_2d=false);

  svg = svg.call(d3.drag()
           .on('drag', dragged)
           .on('start', drag_start)
           .on('end', drag_end))
           .append('g');
}

// let lib = space_plot_lib(
//   svg,
//   origin,
//   scale,
//   is_2d=false)


// svg = svg.call(d3.drag()
//          .on('drag', dragged)
//          .on('start', drag_start)
//          .on('end', drag_end))
//          .append('g');


function plot(scatter, axis, tt){

  let lines = [], points = [];
  lib.plot_points(scatter, tt,
                  function(d, i){dragged_point(i)},
                  drag_start,
                  drag_end);
  lib.sort();
}


function init(){
  axis = lib.init_axis(axis_len=axis_len);
  scatter = [];

  for (let i=0; i < 15; i++){
    scatter.push({
        x: d3.randomUniform(-axis_len+3, axis_len-3)(),
        y: d3.randomUniform(-axis_len+3, axis_len-3)(), 
        z: d3.randomUniform(-axis_len+3, axis_len-3)(),
        color: i*2,
    });
  }

  expectedScatter = lib.rotate_points(scatter, startAngleX,
                                      startAngleY, startAngleZ);
  expectedAxis = lib.rotate_lines(axis, startAngleX,
                                  startAngleY, startAngleZ);
  plot(expectedScatter, expectedAxis, 1000);
  drag_end();
}



function drag_start(){
  lib.drag_start();
}

function dragged(){
  [angle_x, angle_y] = lib.get_drag_angles();

  expectedScatter = lib.rotate_points(scatter, angle_x, angle_y);
  expectedAxis = lib.rotate_lines(axis, angle_x, angle_y);
  
  plot(expectedScatter, 
       expectedAxis, 
       0);
}

function dragged_point(i){
  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        expectedScatter.push(lib.shift_point_accord_to_mouse(d));
      } else {
        expectedScatter.push(d);
      }
  });
  
  plot(expectedScatter, 
       expectedAxis, 
       0);
}


function drag_end(){
  scatter = expectedScatter;
  axis = expectedAxis;
  startAngleX = 0;
  startAngleY = 0;
  startAngleZ = 0;
}

// init();


return {
  init: function(){init();},
  select_svg: function(svg_id){select_svg(svg_id);}
};

})();