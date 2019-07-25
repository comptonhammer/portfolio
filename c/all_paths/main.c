//Snippet from all-paths program, 
//that allows one to recieve instructions on how to recreate a digital image in the real world, 
//via strings on a circle board with equally placed hooks on the perimiter.
// Author: Alec Moore, 2019

#define TERMINATING_CHAR -999

#include <stdio.h>
#include <stdlib.h>
#include <jpeglib.h>
#include <setjmp.h>
#include <string.h>

#include "density_map.h"
#include "monochrome.h"
#include "circle.h"
#include "path_finding.h"
#include "hook.h"

struct my_error_mgr {
  struct jpeg_error_mgr pub;
  jmp_buf setjmp_buffer;
};

typedef struct my_error_mgr * my_error_ptr;

METHODDEF(void) my_error_exit (j_common_ptr cinfo){
  /* cinfo->err really points to a my_error_mgr struct, so coerce pointer */
  my_error_ptr myerr = (my_error_ptr) cinfo->err;
  (*cinfo->err->output_message) (cinfo);
  
  longjmp(myerr->setjmp_buffer, 1);
}

int main(int argc, char* argv[]){
  if(argc < 2){
    printf("Please specify a source .jpeg file");
    return 1;
  }
  
  struct jpeg_decompress_struct cinfo;
  struct my_error_mgr jerr;
  FILE *infile;
  JSAMPARRAY buffer;		/* Output row buffer */
  long row_stride = 0;		/* physical row width in output buffer */

  infile = fopen(argv[1], "rb");

  if(infile == NULL){ 
    printf("Couldn't read file, or file doesn't exist.");
    return 1;
  }

  cinfo.err = jpeg_std_error(&jerr.pub);
  jerr.pub.error_exit = my_error_exit;
  if (setjmp(jerr.setjmp_buffer)) {
      jpeg_destroy_decompress(&cinfo);
      fclose(infile);
      printf("Error in libjpeg.");
      return 1;
  }
  jpeg_create_decompress(&cinfo);
  jpeg_stdio_src(&cinfo, infile);
  jpeg_read_header(&cinfo, TRUE);
  jpeg_start_decompress(&cinfo);

  /* JSAMPLEs per row in output buffer */
  row_stride = cinfo.output_width * cinfo.output_components;
  buffer = (*cinfo.mem->alloc_sarray) ((j_common_ptr) &cinfo, JPOOL_IMAGE, row_stride, 1);

  JSAMPLE* ogSample;
  ogSample = malloc((cinfo.output_height * row_stride) * sizeof(JSAMPLE));
  printf("Image read. Height:%i, Width:%i\n", cinfo.output_height, cinfo.output_width);

  long j = 0;
  while (cinfo.output_scanline < cinfo.output_height) {
    jpeg_read_scanlines(&cinfo, buffer, 1);
    for(long i = 0; i < row_stride; i += 3){
        ogSample[j] = buffer[0][i];
        ogSample[j + 1] = buffer[0][i + 1];
        ogSample[j + 2] = buffer[0][i + 2];
        j += 3;
    }
  }

  jpeg_finish_decompress(&cinfo);
  jpeg_destroy_decompress(&cinfo);
  fclose(infile);
  
  long circle_height = cinfo.output_height < cinfo.output_width 
    ? ((int)(cinfo.output_height/2)) * 2
    : ((int)(cinfo.output_width/2)) * 2;
  long circle_width = circle_height; // Maintain a square ratio
  
  int number_of_colors = (argc > 3 && argv[3] > 0)
    ? argv[3]
    : 4;
  
  int number_of_hooks = (argc > 4 && argv[4] > 40) // 40 is arbitrary... in testing, everything below will not turn out well
    ? argv[4]
    : 80;

  JSAMPLE * bwSample = NULL;
  bwSample = getBlackAndWhiteBuffer(ogSample, cinfo.output_height, cinfo.output_width); // Turns image to monochrome
  JSAMPLE * wcSample = NULL;
  wcSample = getCircleBuffer(bwSample, cinfo.output_height, cinfo.output_width); // Cuts image into circle
  JSAMPLE * qdbSample = NULL;
  qdbSample = getQuantizedDensityBuffer(wcSample, number_of_colors, circle_height, circle_width); // Quantizes monochrome image to specified number of colors... kind of like giving an image high contrast
  
  // The HOOK struct contains xy coordinates and a number representing what place in the order it's in,
  // with possible values 0 to number_of_hooks - 1.
  // This is determined by converting the heigth & width into a circle with 
  // radius = height/2, center = (x: width/2, y: height/2)... 
  // note that the circle must be in a "square" coordinate grid, so height == width.
  // Then that circle's converted into a polygon with number_of_hooks sides and the coordinates of each angle point are taken
  HOOK * hooks = getHooks(number_of_hooks, circle_height, circle_width);
  
  // Path simply contains an ordered list of the hook number visited.
  unsigned int * path = getBestPath(qdbSample, hooks, number_of_hooks, circle_height, circle_width);
  
  writePath("instructions.txt", path, TERMINATING_CHAR);
  pathToImagePreview("preview.jpeg", path, hooks, circle_height, circle_width, TERMINATING_CHAR);

  if(bwSample != NULL){
     free(bwSample);
     bwSample = NULL;
  }
  if(qdbSample != NULL){
    free(qdbSample);
    qdbSample = NULL;
  }
  if(wcSample != NULL){ 
    free(wcSample);
    wcSample = NULL;
  }
  if (ogSample != NULL){
    free(ogSample);
    ogSample = NULL;
  }
  
  if(path != NULL){
    free(path);
    path = NULL;
  }
  
  if(hooks != NULL){
    free(hooks);
    hooks = NULL;
  }
  
  printf("Finished.");
  
  return 0;
}
