#include <stdio.h>
#include <stdlib.h>

#include <jpeglib.h>
#include <setjmp.h>
#include <string.h>
#include "density_map.h"
#include "monochrome.h"
#include "circle.h"
#include "buffer.h"
#include "dijkstra.h"
#include "polygon.h"

struct my_error_mgr {
  struct jpeg_error_mgr pub;	/* "public" fields */

  jmp_buf setjmp_buffer;	/* for return to caller */
};

typedef struct my_error_mgr * my_error_ptr;

METHODDEF(void) my_error_exit (j_common_ptr cinfo){
  /* cinfo->err really points to a my_error_mgr struct, so coerce pointer */
  my_error_ptr myerr = (my_error_ptr) cinfo->err;

  /* Always display the message. */
  /* We could postpone this until after returning, if we chose. */
  (*cinfo->err->output_message) (cinfo);

  /* Return control to the setjmp point */
  longjmp(myerr->setjmp_buffer, 1);
}

int main(int argc, char* argv[]){
  
  struct jpeg_decompress_struct cinfo;
  struct my_error_mgr jerr;
  FILE *infile;		/* source file */
  JSAMPARRAY buffer;		/* Output row buffer */
  long row_stride = 0;		/* physical row width in output buffer */

  infile = fopen("mccartney.jpeg", "rb");

  if(infile == NULL){ 
    printf("Couldnt read files");
    return 0;
  }

  cinfo.err = jpeg_std_error(&jerr.pub);
  jerr.pub.error_exit = my_error_exit;
  if (setjmp(jerr.setjmp_buffer)) {
      jpeg_destroy_decompress(&cinfo);
      fclose(infile);
      return 0;
  }
  jpeg_create_decompress(&cinfo);
  jpeg_stdio_src(&cinfo, infile);
  jpeg_read_header(&cinfo, TRUE);
  jpeg_start_decompress(&cinfo);

  /* We may need to do some setup of our own at this point before reading
   * the data.  After jpeg_start_decompress() we have the correct scaled
   * output image dimensions available, as well as the output colormap
   * if we asked for color quantization.
   * In this example, we need to make an output work buffer of the right size.
   */ 
  /* JSAMPLEs per row in output buffer */
  row_stride = cinfo.output_width * cinfo.output_components;
  buffer = (*cinfo.mem->alloc_sarray) ((j_common_ptr) &cinfo, JPOOL_IMAGE, row_stride, 1);

  JSAMPLE* bw;
  bw = malloc((cinfo.output_height * row_stride) * sizeof(JSAMPLE));
  printf("height:%i, width:%i\n", cinfo.output_height, cinfo.output_width);

  long int j = 0;
  while (cinfo.output_scanline < cinfo.output_height) {
    jpeg_read_scanlines(&cinfo, buffer, 1);
    for(long i = 0; i < row_stride; i += 3){
        bw[j] = buffer[0][i];
        bw[j + 1] = buffer[0][i + 1];
        bw[j + 2] = buffer[0][i + 2];
        j += 3;
    }
  }

  jpeg_finish_decompress(&cinfo);
  jpeg_destroy_decompress(&cinfo);
  fclose(infile);
  long circle_height = cinfo.output_height < cinfo.output_width 
    ? ((int)(cinfo.output_height/2)) * 2
    : ((int)(cinfo.output_width/2)) * 2;
  long circle_width = circle_height;

  JSAMPLE * bwSample = NULL;
  bwSample = writeBw(bw, cinfo.output_height, cinfo.output_width);
  JSAMPLE * wcSample = NULL;
  wcSample = writeCircle(bwSample, cinfo.output_height, cinfo.output_width);
  JSAMPLE * qbwSample = NULL;
  qbwSample = getQuantizedDensityBuffer(wcSample, circle_height, circle_width); 

  writeBuffer("qbw.jpeg", qbwSample, circle_height, circle_width);

  if(bwSample != NULL) free(bwSample);
  bwSample = NULL;
  if(qbwSample != NULL) free(qbwSample);
  qbwSample = NULL;
  if(wcSample != NULL){ 
    free(wcSample);
    wcSample = NULL;
  }
  if (bw != NULL) free(bw);
  bw = NULL;
  printf("Finished!");
  
  return 0;
}