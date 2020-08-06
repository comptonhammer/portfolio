#ifndef BUFFR
#define BUFFR

#include <stdio.h>
#include <stdlib.h>

#include <jpeglib.h>
#include <setjmp.h>

_Bool writeBuffer(char*, JSAMPLE*, long, long);

#endif