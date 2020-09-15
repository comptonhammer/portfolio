#include "circle.h"
#include "buffer.h"
#include "density_map.h"
#include "dijkstra.h"

_Bool pointIsInCircle(long x, long y, CIRCLE circle){
  double _x = (x - circle.center_x) * (x - circle.center_x);
  double _y = (y - circle.center_y) * (y - circle.center_y);
  return _x + _y < circle.radius*circle.radius;
}

JSAMPLE* getCircle(JSAMPLE* original_buf, long og_height, long og_width, POINT* hooks, int number_of_hooks){
  JSAMPLE * image_buf = NULL;
  image_buf = original_buf;

  CIRCLE circle;

  if(og_height > og_width){
    circle.center_x = (long) og_width/2;
    circle.center_y = (long) og_width/2;
    circle.radius = (long) og_width/2;
  }
  else{
    circle.center_x = (long) og_height/2;
    circle.center_y = (long) og_height/2;
    circle.radius = (long) og_height/2;
  }  

  long width = circle.center_x * 2;
  long height = circle.center_y * 2;
  int row_stride = og_width * 3;

  JSAMPLE* temp = malloc(row_stride * height * sizeof(JSAMPLE));

  for(long index = 0; index < row_stride * og_height; index += 3){
    long y_val = index / row_stride;
    long x_val =  (index / 3) - (y_val * og_width);
    if(x_val < width && y_val < height){
      if(
        pointIsInCircle(x_val, y_val, circle) 
        && pointIsDrawableInPolygon(hooks, x_val, y_val, number_of_hooks)
        ){
          temp[index] = image_buf[index]; //r
          temp[index + 1] = image_buf[index + 1]; //g
          temp[index + 2] = image_buf[index + 2]; //b
        }
      else{ //Cast white
        temp[index] = 255; //r
        temp[index + 1] = 255; //g
        temp[index + 2] = 255; //b
      }
    }
  }
  
  return temp;
}
