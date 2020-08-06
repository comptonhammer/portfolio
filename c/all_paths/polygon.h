#ifndef POLY
#define POLY

#include "circle.h"
#include "buffer.h"
#include "point.h"

#define PI 3.14159265
#define INF 100000

POINT* createPolygon(long height, long width, int sides);

_Bool pointIsDrawableInPolygon(POINT polygon[], long x, long y, int sides);

#endif