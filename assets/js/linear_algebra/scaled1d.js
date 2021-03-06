let scaled1d = (function() {

let origin = [300, 75],
    scale = 60, 
    scatter = [], 
    expectedScatter = [],
    startAngleX = Math.PI,
    startAngleY = 0., 
    startAngleZ = 0.,
    ruler_len = 4,
    svg = null,
    lib = null,
    spacing = 1.,
    c1 = 0,
    c2 = 1,
    c0 = 2;


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


function plot(scatter, tt){
  let points = [];
  scatter.forEach(function(d,i) {
    points.push(d);
  })
  lib.plot_points(points, tt,
                  dragged_point, drag_start,
                  drag_end, 'points_in_origin');

  let scaler_point = scatter[0],
      point_A = scatter[1],
      point_B = scatter[2],
      point_C = scatter[3],
      point_D = scatter[4],
      texts = [];

  texts.push({
    text: '\u03b1',
    x: scaler_point.x - 0.05,
    y: scaler_point.y - 0.1,
    z: 0,
  });


  let reflect_points = [],
      point_A1 = {
          x: point_A.x * scaler_point.x,
          y: spacing, z: 0,
          r: 5, color: c1
      },
      point_B1 = {
          x: point_B.x * scaler_point.x,
          y: spacing, z: 0,
          r: 5, color: c1
      },
      point_C1 = {
          x: point_C.x * scaler_point.x,
          y: spacing, z: 0,
          r: 5, color: c2
      },
      point_D1 = {
          x: point_D.x * scaler_point.x,
          y: spacing, z: 0,
          r: 5, color: c2
      };
  
  reflect_points.push(point_A1, point_B1, point_C1, point_D1);

  for (i = 0; i < reflect_points.length; i++) {
    if (reflect_points[i].x < - 4.5) {
      reflect_points[i].x = -4.5;
      reflect_points[i].r = 0;
    }
    else if (reflect_points[i].x > 4.5) {
      reflect_points[i].x = 4.5;
      reflect_points[i].r = 0;
    }
  }

  let lines = [],
      lineAB = [point_A, point_B],
      lineCD = [point_C, point_D],
      lineAB1 = [point_A1, point_B1],
      lineCD1 = [point_C1, point_D1];

  lineAB.color = c1;
  lineCD.color = c2;
  lineAB1.color = c1;
  lineCD1.color = c2;

  lines.push(lineAB, lineCD, lineAB1, lineCD1);
  for (i = 0; i < lines.length; i++) {
    lines[i].stroke_width = 3;
  }

  lib.plot_lines(lines, tt, 'lines');
  lib.plot_texts(texts, tt, 'text_in_ruler');
  lib.plot_points(reflect_points, tt,
                  null,  null, null,
                  'reflect_points');
}

function init(tt){
  rulers = [];
  // set up the rulers.
  rulers.push([
      {x: 4.5, y: spacing, z: 0, r: 0},
      {x: -4.5, y: spacing, z: 0, r: 0}
  ]);
  rulers.push([
      {x: 4.5, y: 0, z: 0, r: 0},
      {x: -4.5, y: 0, z: 0, r: 0}
  ]);
  rulers.push([
      {x: 2, y: -spacing, z: 0, r: 0},
      {x: -2, y: -spacing, z: 0, r: 0}
  ]);
  lib.plot_lines(rulers, 0, 'rulers');

  let rulers_texts = [];
  for (let i = -ruler_len; i <= ruler_len; i++) {
    rulers_texts.push({
        text: i.toFixed(0),
        x: i-0.15, y: 0.3,
        z: 0, text_color: 'grey',
        font_size: 12});
  }
  for (let i = -ruler_len; i <= ruler_len; i++) {
    rulers_texts.push({
        text: i.toFixed(0),
        x: i - 0.15, y: spacing + 0.3,
        z: 0, text_color: 'grey',
        font_size: 12});
  }
  for (let i = -ruler_len/2; i <= ruler_len/2; i++) {
    rulers_texts.push({
        text: i.toFixed(0),
        x: i - 0.14, y: -spacing + 0.3,
        z: 0, text_color: 'grey',
        font_size: 12,
        text_opacity: 1});
  }

  rulers_texts.push(...[{
      text: 'x',
      x: -4.85, y: 0, text_color: 'grey'
    },{
      text: '\u03b1x',
      x: -4.85, y: 1., text_color: 'grey',
      text_anchor: 'middle'
  }])

  lib.plot_texts(rulers_texts, 0, 'rulers_texts');

  scatter = [{
        x: 1, y: 1.,
        z: 0, r: 5,
        color: c0    
    }, {
        x: 1, y: 0,
        z: 0, r: 5,
        color: c1
    }, {
        x: 2, y: 0,
        z: 0, r: 5,
        color: c1,
    }, {
        x: -2, y: 0,
        z: 0, r: 5,
        color: c2
    }, {
        x: 0, y: 0,
        z: 0, r: 5,
        color: c2
  }];

  expectedScatter = lib.rotate_points(scatter, startAngleX,
                                      startAngleY, startAngleZ);
  plot(expectedScatter, tt);
  drag_end();
}


function drag_start(){
  lib.drag_start2d();
}


function dragged(){
  plot(expectedScatter, 0);
}


function dragged_point(d, i){
  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        let r = lib.update_point_position_from_mouse(d);
        if (j == 0) {
          if (r.x < -2) {
          r.x = -2;}
          else if (r.x > 2){
          r.x = 2;}
        }
        
        if (r.x < -4.5) {
          r.x = -4.5;
        } else if (r.x > 4.5){
          r.x = 4.5;
        }

        r.x = r.x;
        r.y = d.y;
        r.z = d.z;
        expectedScatter.push(r);
      } else {
        expectedScatter.push(d);
      }
  });

  plot(expectedScatter, 0);
}


function drag_end(){
  scatter = expectedScatter;
}


return {
  init: function(tt=0){init(tt);},
  select_svg: function(svg_id){select_svg(svg_id);}
};

})();