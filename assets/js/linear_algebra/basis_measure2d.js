let basis_measure2d = (function() {

let origin = [300, 140],
  scale = 60, 
  scatter = [],
  axis = [], 
  axis2 = [],
  expectedAxis = [],
  expectedAxis2 = [],
  startAngleX = Math.PI,
  startAngleY = 0.,
  startAngleZ = 0.,
  axis_len = 2,
  unit = axis_len/10,
  svg = null,
  lib = null,
  show_proj = true;


function select_svg(svg_id) {
  svg = d3.select(svg_id);

  lib = space_plot_lib(
    svg,
    origin, 
    scale,
    is_2d=true);

  svg = svg.call(d3.drag()
           .on('drag', dragged)
           .on('start', drag_start)
           .on('end', drag_end))
           .append('g');  
}


function plot_project_u_onto_v(u, v, tt, name, visible) {
  let lines = [];
  v.centroid_z = 1000;
  let uTv = lib.dot_product(u, v);
  let uTvv = {
      x: v.x * uTv,
      y: v.y * uTv,
      z: 0,
      color: v.color-1,
      tt: true
  }

  let uTvv_line = [
      {x: 0, y: 0, z: 0},
      uTvv
  ];
  uTvv_line.stroke_width = 2.0
  uTvv_line.centroid_z = 1000;
  if (!visible) {
    uTvv_line.opacity = 0;
  }

  lines.push(uTvv_line);

  lib.create_dash_segments(u, uTvv).forEach(
      function(d) {
        d.color = 'grey';
        if (!visible) {
          d.opacity = 0.;
        }
        lines.push(d);
      }
  );

  if (!show_proj) {
    lines = hide(lines);
  }
  lib.plot_lines(lines, tt, name);
}


function hide(objs, op=0.0) {
  let r = [];
  objs.forEach(function(d) {
    let d_ = Object.assign({}, d);
    d_.opacity = op;
    d_.text_opacity = op;
    r.push(d_);
  })
  return r;
}


function plot(scatter, tt){
  let points = [];
  scatter.forEach(function(d){
    points.push(Object.assign({}, d));
  });

  points.push({
    x: 0,
    y: 0,
    z: 1,
    opacity: 0,
    color: 9
  });
  
  let lines = [];
  points.forEach(function(d, i){
    if (i == 0) {
      return;
    }
    lines.push(...lib.create_segments(d));
  });
  // if (!show_proj) {
  //   lines = hide(lines);
  // }
  lib.plot_lines(lines, tt, 'arrow');

  let [u, v1, v2, v3] = points;

  plot_project_u_onto_v(u, v1, tt, 'v1', true);
  plot_project_u_onto_v(u, v2, tt, 'v2', true);
  plot_project_u_onto_v(u, v3, tt, 'v3', false);

  points.forEach(function(p, i){
    if (i == 0) {
      p.text = 'u = ['.concat(
          lib.dot_product(u, v1).toFixed(1),
          ', ',
          lib.dot_product(u, v2).toFixed(1),
          ']'
      )
    } else if (i == 1) {
      p.text = 'v\u2081';
    } else if (i == 2) {
      p.text = 'v\u2082';
    } else if (i == 3) {
      p.text = 'v\u2083';
      p.text_opacity = 0.0;
    }
  })

  lib.plot_points(points, tt,
                  drag_point_fn=dragged_point,
                  drag_start_fn=drag_start,
                  drag_end_fn=drag_end);

  lib.sort();
}


function init(tt){
  scatter = [];

  scatter.push({
    x: 0.8,
    y: -4.0/3, 
    z: 0.,
    color: 4,
  });

  scatter.push({
    x: 1.,
    y: 0., 
    z: 0.,
    color: 3,
  })

  scatter.push({
    x: 0.,
    y: 1., 
    z: 0.,
    color: 19,
  })


  alpha = startAngleX;
  beta = startAngleY;

  scatter = lib.rotate_points(scatter, alpha, beta, startAngleZ);
  plot(scatter,
       tt);
}


function drag_start(){
  lib.drag_start2d();
}

function dragged(){
  let angle_z = lib.get_drag_angle_2d();

  expectedScatter = lib.rotate_points(scatter, 0, 0, angle_z);
  
  plot(expectedScatter, 
       0);
}


function dragged_v_only(){
  let angle_z = lib.get_drag_angle_2d();

  expectedScatter = lib.rotate_points(scatter, 0, 0, angle_z);
  expectedScatter[0] = scatter[0];
  
  plot(expectedScatter, 
       0);
}


function dragged_point(d, i){
  if (i > 0) {
    dragged_v_only();
    return;
  }

  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        let r = lib.update_point_position_from_mouse(d);
        expectedScatter.push(r);
      } else {
        expectedScatter.push(d);
      }
  });

  plot(expectedScatter, 
       0);
}


function drag_end(){
  scatter = expectedScatter;
}


return {
  init: function(tt=0){init(tt);},
  select_svg: function(svg_id){select_svg(svg_id);},
  set_show_proj: function(s){show_proj = s;},
  replot: function(){
    plot(scatter,
         1000);
  },
};

})();