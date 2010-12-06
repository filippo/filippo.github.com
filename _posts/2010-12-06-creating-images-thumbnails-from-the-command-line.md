---
layout: post
title: Simple script to create image thumbnails from the command line
disqus_uid: creating-images-thumbnails-from-the-command-line
---
{{ page.title }}
================
Every website has one or more photo galleries, so one of the common tasks when building websites is reducing photos to put in photo galleries.

I've built a simple shell script that uses [ImageMagick](http://www.imagemagick.org/script/index.php) to create thumbnails and convert images to RGB. You can [download the script](/stuff/img_resize.sh) in case you find it useful.

Usage example:
{% highlight sh %}
$ img_resize.sh imagesdir 650x650 x150
{% endhighlight %}

The script recurse into iamgesdir looking for images (.png, jpg, .gif, .tiff). 
It then resizes every image so it fits in a box of 650x650. The image is resized only if bigger and aspect ratio is preserved. The new images have a -B (for big) appended at the end of the name, right before the extension.
The second size, which is optional, tells the script to resize the image to 150 pixels height. Aspect ratio is preserved. 
The new images have a -S (for small) appended at the end of the name, right before the extension.

Here is the complete script:
{% highlight sh %}
#/bin/bash
Usage="Usage: $0 basedir geometry1 [geometry2]"

prhelp() {
    echo "$Usage 

Recursively looks for images inside basedir and resizes them to geometry1 adding -B (for big) to the name before the extension and, optionally, resizes to geometry2 adding -S (for small) before the extension. 
Resizing always keeps aspect ratio.
If the image is already smaller then geometry the image it's not stretched. 

Geometry examples:
- 150x170 resizes the image to fit in a rectangle of width 150 pixels and height 170 pixels.
- 150     resizes image to a width of 150 pixels.
- x150    resizes image to en height of 150 pixels.
 "
}

convert_name() {
    local full_name=$1
    local small_or_big=$2
    #split name into base and extension
    local base_dir=$(dirname $full_name)
    local base_name=$(basename $full_name)
    local name=$(echo "$base_name" | cut -d'.' -f1)
    local ext=$(echo "$base_name" | cut -d'.' -f2)
    echo "$base_dir/$name$small_or_big.$ext"
}

thumb() {
    local in_file=$1
    local out_file=$2
    local geometry=$3
    $(convert -colorspace RGB -density 72x72 -strip -thumbnail $geometry\> $in_file $out_file)
}

if [ $# -le 1 ]; then
    prhelp
    exit 1
fi

#read input parameters
basedir=$1
geo_big=$2
geo_small=$3

for i in $(find $basedir -iname *.jpg -o -iname *.jpeg -o -iname *.png -o -iname *.gif -o -iname *.tiff); do
    echo "Resizing $i"
    if [ -n "$geo_small" ]; then
	small_name=$(convert_name $i '-S');
	$(thumb $i $small_name $geo_small);
    fi
    big_name=$(convert_name $i '-B');
    $(thumb $i $big_name $geo_big);
done;
{% endhighlight %}
