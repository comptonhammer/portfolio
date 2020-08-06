#ifndef BUFFER_H
#define BUFFER_H

#include <stdio.h>
#include <stdlib.h>

#include <jpeglib.h>
#include <setjmp.h>

_Bool writeBuffer(char*, JSAMPLE*, long, long);

#endif
