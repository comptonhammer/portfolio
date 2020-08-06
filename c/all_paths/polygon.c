#include "polygon.h"

int max(int a, int b){
  return (a > b) ? a : b;
}

int min(int a, int b){
  return (a < b) ? a : b;
}

_Bool onSegment(POINT p, POINT q, POINT r) { 
    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && 
            q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y)) 
        return TRUE; 
    return FALSE; 
} 
  
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
int orientation(POINT p, POINT q, POINT r){ 
    int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y); 
  
    if (val == 0) return 0;
    return (val > 0)
      ? 1
      : 2;
} 

_Bool doIntersect(POINT p1, POINT q1, POINT p2, POINT q2) {
    int o1 = orientation(p1, q1, p2); 
    int o2 = orientation(p1, q1, q2); 
    int o3 = orientation(p2, q2, p1); 
    int o4 = orientation(p2, q2, q1); 
  
    // General case 
    if (o1 != o2 && o3 != o4) 
        return TRUE; 
    // Special Cases 
    if (o1 == 0 && onSegment(p1, p2, q1)) return TRUE;
    if (o2 == 0 && onSegment(p1, q2, q1)) return TRUE; 
    if (o3 == 0 && onSegment(p2, p1, q2)) return TRUE; 
    if (o4 == 0 && onSegment(p2, q1, q2)) return TRUE;
    return FALSE; 
} 
  
_Bool isInside(POINT polygon[], int n, POINT p) { 
    if (n < 3)  return FALSE; 
  
    POINT extreme;
    extreme.x = INF;
    extreme.y = p.y - 1;
   
    int count = 0;
    int i = 0; 
    do{ 
        int next = (i+1) % n; 
  
        if (doIntersect(polygon[i], polygon[next], p, extreme)) 
        { 
            if (orientation(polygon[i], p, polygon[next]) == 0) 
               return onSegment(polygon[i], p, polygon[next]); 
  
            count++; 
        } 
        i = next; 
    } while (i != 0); 
  
    return count&1; //if odd
} 

_Bool pointIsDrawableInPolygon(POINT polygon[], long x, long y, int sides){
  POINT p;
  p.x = x;
  p.y = y;
  return isInside(polygon, sides, p);
}

POINT* createPolygon(long height, long width, int sides){
  JSAMPLE* _x = malloc(width * 3 * height * sizeof(JSAMPLE));
  POINT* polygon = malloc(sides*sizeof(POINT));

  for(int i = 0; i < sides; i++){
    polygon[i].x = (int) (cos((2*i*PI)/sides)*(width/2) + width/2);
    polygon[i].y = (int) (sin((2*i*PI)/sides)*(height/2) + width/2);
  }

  for(int _dj = 0; _dj < width * 3 * height; _dj++) _x[_dj] = 255;

  for(int _zzz = 0; _zzz < sides; _zzz++){
    int index = (polygon[_zzz].x)*3 + height*(polygon[_zzz].y) * 3;
    _x[index] = 0;
    _x[index + 1] = 0;
    _x[index + 2] = 0;
  }

  free(_x);
  return polygon;
}