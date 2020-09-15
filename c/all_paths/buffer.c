#include "buffer.h"

_Bool writeBuffer(char* filename, JSAMPLE* original_buf, long height, long width){
    struct jpeg_compress_struct cinfo;
    struct jpeg_error_mgr jerr;
    
    JSAMPLE * img_buf;     
    img_buf = original_buf;
    
    JSAMPROW * row_pointer;	/* pointer to JSAMPLE row[s] */
    row_pointer = malloc(width * sizeof(JSAMPROW));
    long row_stride = width * 3; // 3 to account for R,G,B

    cinfo.err = jpeg_std_error(&jerr);
    jpeg_create_compress(&cinfo);
    
    FILE * outfile;		/* target file */
    if ((outfile = fopen(filename, "wb")) == NULL) {
        fprintf(stderr, "can't open\n");
        return FALSE;
    }

    jpeg_stdio_dest(&cinfo, outfile);

    cinfo.image_width = width; 	/* image width and height, in pixels */
    cinfo.image_height = height;
    cinfo.input_components = 3;		/* # of color components per pixel */
    cinfo.in_color_space = JCS_RGB; /* colorspace of input image */

    jpeg_set_defaults(&cinfo);
    jpeg_set_quality(&cinfo, 100, TRUE /* limit to baseline-JPEG values */);
    jpeg_start_compress(&cinfo, TRUE);

    while (cinfo.next_scanline < cinfo.image_height) {
        row_pointer[0] = &img_buf[cinfo.next_scanline * row_stride];
        jpeg_write_scanlines(&cinfo, row_pointer, 1);
    }
    
    jpeg_finish_compress(&cinfo);
    jpeg_destroy_compress(&cinfo);
    
    fclose(outfile);

    free(row_pointer);
    return TRUE;
}
