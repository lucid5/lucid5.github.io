let default_basis2d = (function() {

let origin = [150, 140], 
  origin2 = [450, 140],
  scale = 60, 
  scatter = [],
  axis = [], 
  expectedAxis = [],
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


function plot(scatter, axis, tt){
  let axis1 = lib.cp_list(axis),
      axis2 = lib.cp_list(axis);
  if (show_proj) {
    axis1 = hide(axis1, 0.2);
  }
  lib.plot_lines(axis1, tt, 'axis');

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
  if (!show_proj) {
    lines = hide(lines);
  }
  lib.plot_lines(lines, tt, 'arrow');

  let [u, v1, v2, v3] = points;

  plot_project_u_onto_v(u, v1, tt, 'v1', true);
  plot_project_u_onto_v(u, v2, tt, 'v2', true);
  plot_project_u_onto_v(u, v3, tt, 'v3', false);

  points.forEach(function(p, i){
    if (i == 0) {
      p.text = 'u';
    } else if (i == 1) {
      p.text = 'v\u2081 = [1, 0]';
    } else if (i == 2) {
      p.text = 'v\u2082 = [0, 1]';
    } else if (i == 3) {
      p.text = 'v\u2083 = [0, 0, 1]';
      p.text_opacity = 0.0;
    }
  })

  // lib.plot_lines(axis, tt);

  lib.plot_points(points, tt,
                  drag_point_fn=dragged_point,
                  drag_start_fn=drag_start,
                  drag_end_fn=drag_end);

  plot_v_perspective(u, v1, v2, v3, axis2, tt);
  lib.sort();
}


function plot_v_perspective(u, v1, v2, v3, axis2, tt) {
  axis2.forEach(function(d, i) {
    let axis_ord = Math.floor(i / (axis_len/unit));
    let v = [v1, v2, v3][axis_ord];
    if (show_proj) {
      d.color = v.color;
    } else {
      d.color = 'grey';
    }
  });
  lib.plot_lines(axis2, tt, 'axis2', null, null, null, origin2);
  basis = {
    x: lib.normalize(axis2[axis_len/unit * 0][1]),
    y: lib.normalize(axis2[axis_len/unit * 1][1]),
    z: lib.normalize(axis2[axis_len/unit * 2][1]),
  };

  let uTv1 = lib.dot_product(u, v1) / lib.norm2(v1),
      uTv2 = lib.dot_product(u, v2) / lib.norm2(v2),
      uTv3 = 1.0;

  let components = [
      lib.times(basis.x, uTv1),
      lib.times(basis.y, uTv2),
  ]
  u = lib.add(components);
  components.push(lib.times(basis.z, uTv3))

  u.color = 4
  u.text = 'u\' = [v\u2081\u1d40u, v\u2082\u1d40u] = u';
  lib.plot_points([u], tt, null, null, null, 'u2', origin2);

  basis.x.color = v1.color;
  basis.x.r = 3;
  basis.x.text = 1;

  basis.y.color = v2.color;
  basis.y.r = 3;
  basis.y.text = 1;

  basis.z.color = v3.color;
  basis.z.r = 3;
  basis.z.text = 1;
  basis.z.opacity = 0;

  let unit_marks = [basis.x, basis.y, basis.z] 
  if (!show_proj) {
    unit_marks = hide(unit_marks);
  }
  lib.plot_points(unit_marks, 
                  tt, null, null, null, 'basis2', origin2);

  let lines = [];
  let ux_line = [{x:0, y:0, z:0}, components[0]],
      uy_line = [{x:0, y:0, z:0}, components[1]],
      uz_line = [{x:0, y:0, z:0}, components[2]];

  ux_line.color = v1.color-1;
  ux_line.centroid_z = 1000;
  uy_line.color = v2.color-1;
  uy_line.centroid_z = 1000;
  uz_line.color = v3.color-1;
  uz_line.centroid_z = 1000;
  uz_line.opacity = 0.0;

  let u_lines = [ux_line, uy_line, uz_line];
  if (!show_proj) {
    u_lines = hide(u_lines);
  }
  lib.plot_lines(
      u_lines,
      tt, 'u_lines', null, null, null, origin2);

  let x_dash_lines = lib.create_dash_segments(
      lib.strip(u), lib.strip(components[0]));
  if (!show_proj) {
    x_dash_lines = hide(x_dash_lines);
  }
  lib.plot_lines(
      x_dash_lines,
      tt, 'x_dash_lines', null, null, null, origin2);

  let y_dash_lines = lib.create_dash_segments(
      lib.strip(u), lib.strip(components[1]));
  if (!show_proj) {
    y_dash_lines = hide(y_dash_lines);
  }
  lib.plot_lines(
      y_dash_lines,
      tt, 'y_dash_lines', null, null, null, origin2);

  let z_dash_lines = lib.create_dash_segments(
          lib.strip(u), lib.strip(components[2]));
  z_dash_lines = hide(z_dash_lines);
  lib.plot_lines(
      z_dash_lines,
      tt, 'z_dash_lines', null, null, null, origin2);
}


function init(tt){
  axis = lib.init_float_axis(axis_len=axis_len, unit=unit);
  scatter = [];

  scatter.push({
    x: -1.0,
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
  axis = lib.rotate_lines(axis, alpha, beta, startAngleZ);
  plot(scatter,
       axis,
       tt);
}


let drag_on_left = true;


function drag_start(){
  if (lib.get_mouse_position().x < 300) {
    drag_on_left = true;
    lib.drag_start2d();
  } else {
    drag_on_left = false;
    lib.drag_start2d(origin2);
  }
}

function dragged(){
  let angle_z = lib.get_drag_angle_2d(
      drag_on_left ? origin : origin2);

  expectedScatter = lib.rotate_points(scatter, 0, 0, angle_z);
  expectedAxis = lib.rotate_lines(axis, 0, 0, angle_z);
  
  plot(expectedScatter, 
       expectedAxis,
       0);
}


function dragged_point(d, i){
  if (!drag_on_left) {
    return;
  }
  if (i > 0) {
    return;
  }

  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        let r = lib.update_point_position_from_mouse(d);
        r.x = Math.min(r.x, (300-origin[0])/scale);
        expectedScatter.push(r);
      } else {
        expectedScatter.push(d);
      }
  });
  expectedAxis = axis;

  plot(expectedScatter, 
       expectedAxis, 
       0);
}


function drag_end(){
  scatter = expectedScatter;
  axis = expectedAxis;
}


return {
  init: function(tt=0){init(tt);},
  select_svg: function(svg_id){select_svg(svg_id);},
  set_show_proj: function(s){show_proj = s;},
  replot: function(){
    plot(scatter, 
         axis,
         1000);
  },
};

})();