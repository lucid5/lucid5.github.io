let general_transform = (function() {

let origin = [150, 140], 
    origin2 = [480, 140],
    scale = 100, 
    sphere_shadow = null,
    u_sphere = null,
    scatter = [],
    cloud = [],
    axis = [], 
    grid = [],
    expectedGrid = [],
    expectedScatter = [],
    expectedCloud = [],
    expectedAxis = [],
    startAngleX = Math.PI/8 * 1.7,
    startAngleY = -Math.PI/8,
    startAngleZ = Math.PI/8 * 0.6,
    axis_len = 1.2,
    unit = axis_len/10,
    radius = 0.5,
    svg = null,
    lib = null;


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


function round_to(x, n, tol=0.02) {
  if (Math.abs(x - 0.0) < tol) {
    return 0;
  }
  if (Math.abs(x - 1.0) < tol) {
    return 1;
  }
  return x.toFixed(n);
}


function plot(scatter, grid, axis, tt){
  lib.plot_lines(grid, tt, 'grid');

  let basis = {
    ex: lib.normalize(axis[axis_len/unit * 0][1]),
    ey: lib.normalize(axis[axis_len/unit * 1][1]),
    ez: lib.normalize(axis[axis_len/unit * 2][1]),
  };

  let points = [];
  scatter.forEach(function(d){
    points.push(Object.assign({}, d));
  });
  
  let lines = [];
  points.forEach(function(d, i){
    if (i == 0) {
      return;
    }
    lines.push(...lib.create_segments(d));
  });
  lib.plot_lines(lines, tt, 'arrow');

  let [u, v1, v2, v3] = points;

  
  let inverse_matrix = multiply_matrices(
          inverse_3by3_matrix(v1, v2, v3), 
          [[basis.ex.x, basis.ex.y, basis.ex.z],
           [basis.ey.x, basis.ey.y, basis.ey.z],
           [basis.ez.x, basis.ez.y, basis.ez.z]]
  );

  let v01 = {x: inverse_matrix[0][0],
             y: inverse_matrix[0][1],
             z: inverse_matrix[0][2]
            },
      v02 = {x: inverse_matrix[1][0],
             y: inverse_matrix[1][1],
             z: inverse_matrix[1][2]
            },
      v03 = {x: inverse_matrix[2][0],
             y: inverse_matrix[2][1],
             z: inverse_matrix[2][2]
  };

  let transform = circle_to_ellipse_shadow_map(
      v01, v02, v03, radius);

  let ellipse_shadow = [];
  sphere_shadow.forEach(function(d, i) {
    let seg = [transform.map(d[0]), 
               transform.map(d[1])];
    seg.color = 'grey';
    seg.stroke_width_factor = 1.2;
    seg.opacity_factor = 0.9;
    ellipse_shadow.push(seg);
  })
  lib.plot_lines(ellipse_shadow, tt, 'ellipse_shadow', 
                 null, null, null, origin2);
  
  lib._plot_polygons({
      data: transform.surface_polygons,
      name: 'ellipse_surface',
      with_origin: origin2
  })

  points.forEach(function(p, i){
    let txt = lib.norm(p).toFixed(2);
    if (i == 0) {
      p.name = 'u';
    } else if (i == 1) {
      p.name = '|v\u2081|';
    } else if (i == 2) {
      p.name = '|v\u2082|';
    } else if (i == 3) {
      p.name = '|v\u2083|';
    }
    p.text = p.name;
    if (i > 0) {
      p.text += ' = ' + txt;
    }
  });

  [v1, v2, v3].forEach(function(v) {
    let v_ = lib.normalize(v);
    v_.text_opacity = 0.5;
    v_.text = v.name + ' = 1'; 
    v_.text_opacity_factor = 0.5;
    v_.z -= 1/scale;
    v_.opacity_factor = 0.5;
    points.push(v_);
  });

  lib.plot_points(points, tt,
                  drag_point_fn=dragged_point,
                  drag_start_fn=drag_start,
                  drag_end_fn=drag_end);
  
  plot_v_perspective(u, grid, v1, v2, v3, axis, tt);
  lib.sort();
}


function compute_transformation(u, v1, v2, v3, basis) {
  let uTv1 = lib.dot_product(u, v1),
      uTv2 = lib.dot_product(u, v2),
      uTv3 = lib.dot_product(u, v3);

  let r = Object.assign({}, u);
  r.x = 0;
  r.y = 0;
  r.z = 0;
  let components = [
      r,
      lib.times(basis.x, uTv1),
      lib.times(basis.y, uTv2),
      lib.times(basis.z, uTv3),
  ]
  return lib.add(components);
}


function compute_transformation_grid(grid, v1, v2, v3, basis) {
  let lines = [];
  grid.forEach(function(d) {
    lines.push([compute_transformation(d[0], v1, v2, v3, basis),
                compute_transformation(d[1], v1, v2, v3, basis)]);
  })
  return lines;
}


function plot_v_perspective(u, grid, v1, v2, v3, axis, tt) {
  let basis = {
    x: lib.normalize(axis[axis_len/unit * 0][1]),
    y: lib.normalize(axis[axis_len/unit * 1][1]),
    z: lib.normalize(axis[axis_len/unit * 2][1]),
  };

  u = compute_transformation(u, v1, v2, v3, basis);
  u.color = 4;
  u.text = 'u\'';
  lib.plot_points([u], tt, null, null, null, 'u2', origin2);

  let grid2 = compute_transformation_grid(grid, v1, v2, v3, basis);
  lib.plot_lines(grid2, tt, 'grid2', 
                 null, null, null, origin2);


  basis.x.color = v1.color;
  basis.x.text = '[1, 0, 0]';

  basis.y.color = v2.color;
  basis.y.text = '[0, 1, 0]';

  basis.z.color = v3.color;
  basis.z.text = '[0, 0, 1]';

  let unit_marks = [basis.x, basis.y, basis.z] 
  lib.plot_points(unit_marks, 
                  tt, null, null, null, 'basis2', origin2);

  let lines = [];
  [basis.x, basis.y, basis.z].forEach(function(d) {
    let color = d.color;
    d = lib.strip(d);
    d.color = color;
    lines.push(...lib.create_segments(d));
  })
  lib.plot_lines(lines, 
                 tt, 'axis2', null, null, null, origin2);
}


function sphere_grid(radius, n=2) {
  let lines = [];
  for (let i = 0; i < n; i++) {
    let circle_lines = lib.create_circle_lines(radius);
    if (i == n-1) {
      circle_lines = lib.rotate_lines(
          circle_lines, Math.PI/2, 0, 0);
    } else {
      circle_lines = lib.rotate_lines(
          circle_lines, 0, Math.PI/(n-1)*i, 0);
    }
    lines.push(...circle_lines);
  }

  return lines;
}


function multiply_matrices(m1, m2) {
  let result_matrix = [];

  for (i = 0; i < 3; i++) {
    let temp_list = [];
    for (j = 0; j < 3; j++) {
      temp_list.push(m1[i][0] * m2[0][j] +
                     m1[i][1] * m2[1][j] +
                     m1[i][2] * m2[2][j])
    };
    result_matrix.push(temp_list);
  }
  return result_matrix;
}


function inverse_3by3_matrix(v1, v2, v3) {

  let A = v2.y * v3.z - v2.z * v3.y,
      B = - (v2.x * v3.z - v2.z * v3.x),
      C =  v2.x * v3.y - v2.y * v3.x,
      
      D = - (v1.y * v3.z - v1.z * v3.y),
      E = v1.x * v3.z - v1.z * v3.x,
      F = - (v1.x * v3.y - v1.y * v3.x),

      G = v1.y * v2.z - v1.z * v2.y,
      H = - (v1.x * v2.z - v1.z * v2.x),
      I =  v1.x * v2.y - v1.y * v2.x,

      det_m = v1.x * A + v1.y * B + v1.z * C;
      
  return [[A/det_m, D/det_m, G/det_m],
          [B/det_m, E/det_m, H/det_m],
          [C/det_m, F/det_m, I/det_m]
         ];
}


function init(tt){
  axis = lib.init_float_axis(axis_len=axis_len, unit=unit);
  scatter = [];

  let u = {
      x: radius + 1.5/scale,
      y: 0.,
      z: 0.,
      // r: 4
  }
  grid = sphere_grid(radius);

  u = lib.rotate_point(u, startAngleX, 2*startAngleY, 2*startAngleZ);
  grid = lib.rotate_lines(grid, startAngleX, 2*startAngleY, 2*startAngleZ);
  
  u.color = 4;

  let v1 = {
      x: 1.0,
      y: 0.0, 
      z: 0.0, 
      color: 0,
  },
      v2 = {
      x: 0.0, 
      y: 1.0, 
      z: 0.0, 
      color: 3,
  },
      v3 = {
      x: 0.0, 
      y: 0.0,  
      z: 1.0,  
      color: 9,
  };

  scatter = [u, v1, v2, v3];

  scatter = lib.rotate_points(scatter, startAngleX, startAngleY, startAngleZ);
  grid = lib.rotate_lines(grid, startAngleX, startAngleY, startAngleZ);
  axis = lib.rotate_lines(axis, startAngleX, startAngleY, startAngleZ);

  // u sphere & its shadow is a constant.
  sphere_shadow = lib.create_circle_lines(radius*0.99);
  sphere_shadow.forEach(function(d) {
    d.color = 'grey';
  });
  u_sphere = circle_to_ellipse_shadow_map(
      {x: 1, y: 0, z: 0},
      {x: 0, y: 1, z: 0},
      {x: 0, y: 0, z: 1},
      radius);

  lib._plot_lines({data: sphere_shadow, tt: tt,
                   name: 'circle_shadow'});
  lib._plot_polygons({
      data: u_sphere.surface_polygons,
      name: 'u_sphere'
  });

  plot(scatter,
       grid,
       axis, 
       tt);
}


let drag_on_left = true;


function drag_start(){
  if (lib.get_mouse_position().x < 300) {
    drag_on_left = true;
    lib.drag_start();
  } else {
    drag_on_left = false;
    lib.drag_start(origin2);
  }
}

function dragged(){
  if (drag_on_left) {
    [angle_x, angle_y] = lib.get_drag_angles();  
  } else {
    [angle_x, angle_y] = lib.get_drag_angles(origin2);
  }  
  expectedScatter = lib.rotate_points(scatter, angle_x, angle_y);
  expectedAxis = lib.rotate_lines(axis, angle_x, angle_y);
  expectedGrid = lib.rotate_lines(grid, angle_x, angle_y);
  
  plot(expectedScatter,
       expectedGrid,
       expectedAxis,
       0);
}


function dragged_v_only(i) {
  let [angle_x, angle_y] = lib.get_drag_angles();
  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        r = lib.rotate_point(d, angle_x, angle_y);
        expectedScatter.push(r);
      } else {
        expectedScatter.push(d);
      }
  });

  expectedGrid = grid;
  expectedAxis = axis;
  
  plot(expectedScatter,
       expectedGrid,
       expectedAxis, 
       0);
}


function dragged_all_v() {
  let [angle_x, angle_y] = lib.get_drag_angles();
  
  expectedScatter = lib.rotate_points(scatter, angle_x, angle_y);
  expectedScatter[0] = scatter[0];
  expectedGrid = grid;
  expectedAxis = axis;
  
  plot(expectedScatter,
       expectedGrid,
       expectedAxis, 
       0);
}


let is_rotating_v = false;


function stretch_point(d, i){
  let d_2d = {x: d.x, y: d.y, z: 0.},
      d_2d_ = lib.normalize(d_2d),
      m = lib.mouse_to_point_position(),
      d_2d_Tm = lib.dot_product(d_2d_, m),
      r = d_2d_Tm / lib.norm(d_2d);

  let p = {
    x: d.x * r,
    y: d.y * r,
    z: d.z * r,
  }

  let diff = Math.sqrt((p.x-m.x)*(p.x-m.x) +
                       (p.y-m.y)*(p.y-m.y));
  if (diff > 0.1) {
    drag_end();
    is_rotating_v = true;
    lib.drag_start();
    return; 
  }

  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        d.x = p.x;
        d.y = p.y;
        d.z = p.z;
      }
      if (lib.norm(d) > 1.5) {
        d = lib.times(d, 1.5/lib.norm(d));
      }
      expectedScatter.push(d);
  });

  expectedGrid = grid;
  expectedAxis = axis;
  plot(expectedScatter, 
       expectedGrid,
       expectedAxis, 
       0);
}


function dragged_point(d, i){
  if (1 <= i && i <= 3) {
    if (!is_rotating_v) {
      stretch_point(d, i);
    } else {
      dragged_v_only(i);
    }
    return;
  } else if (i >= 4) {
    dragged_all_v();
    return;
  }

  let [angle_x, angle_y] = lib.get_drag_angles(
      drag_on_left ? origin : origin2);
  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        r = lib.rotate_point(d, angle_x, angle_y);
        expectedScatter.push(r);
      } else {
        expectedScatter.push(d);
      }
  });
  expectedGrid = lib.rotate_lines(grid, angle_x, angle_y);
  expectedAxis = axis;

  plot(expectedScatter,
       expectedGrid,
       expectedAxis, 
       0);
}


function drag_end(){
  scatter = expectedScatter;
  axis = expectedAxis;
  grid = expectedGrid;
  is_rotating_v = false;
}


return {
  init: function(tt=0){init(tt);},
  select_svg: function(svg_id){select_svg(svg_id);},
};

})();