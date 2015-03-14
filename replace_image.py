import sys, json
from PIL import Image, ImageOps



filename=raw_input('Where is the image file?\n')
while True:
    try:
        im=Image.open(filename)
        break
    except IOError:
        print "Not a file"
        sys.exit()


outname=raw_input("What's the piece ID#?\n")
icon_name="images/"+outname+"_icon.png"
new_name="images/"+outname+".jpg"
thumb_name="images/"+outname+"_thumb.jpg"
nav_name="images/"+outname+"_nav.jpg"
imsize=im.size
ratio=float(imsize[0])/imsize[1]

if ratio<1:
    newsize=(int(ratio*2000),2000)
    thumbsize=(int(ratio*300),300)
    iconsize=(100,int(100/ratio))
else:
    newsize=(2000,int(2000/ratio))
    thumbsize=(300,int(300/ratio))
    iconsize=(int(100*ratio),100)

mask = Image.open('images/icon_mask.png').convert('L')
icon=ImageOps.fit(im, mask.size,method=Image.ANTIALIAS, centering=(0.5, 0.5))
icon.putalpha(mask)
icon.save(icon_name, quality=100)
navsize=(int(ratio*75),75)
im.resize(newsize, Image.ANTIALIAS).save(new_name, quality=100)
im.resize(thumbsize, Image.ANTIALIAS).save(thumb_name, quality=100)
im.resize(navsize, Image.ANTIALIAS).save(nav_name, quality=100)