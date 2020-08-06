#ifndef CIR
#define CIR

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#include <jpeglib.h>
#include <setjmp.h>

#include "point.h"
#include "hook.h"

typedef struct{
  long radius;
  long center_x;
  long center_y;
}CIRCLE;

_Bool pointIsInCircle(long, long, CIRCLE);

JSAMPLE* getCircle(JSAMPLE*, long, long, POINT*, int);

#endif