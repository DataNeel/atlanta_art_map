import sys
from PIL import Image, ImageOps

if len(sys.argv)<2:
    filename=raw_input('Where is the image file?\n')
else:
    filename=sys.argv[1]

if len(sys.argv)<3:
    outname=raw_input("What's the output filename (without extention)?\n")
else:
    outname=sys.argv[2]



while True:
    try:
        im=Image.open(filename)
        break
    except IOError:
        print "Not a file"
        sys.exit()


imsize=im.size
ratio=float(imsize[0])/imsize[1]

if ratio<1:
    newsize=(int(ratio*2000),2000)
    thumbsize=(int(ratio*300),300)
    iconsize=(int(ratio*100),100)
else:
    newsize=(2000,int(ratio*2000))
    thumbsize=(300,int(ratio*300))
    iconsize=(100,int(ratio*100))

mask = Image.open('icon_mask.png').convert('L')
icon=ImageOps.fit(im, mask.size,method=Image.ANTIALIAS, centering=(0.5, 0.5))
icon.putalpha(mask)
icon.save(outname+"_icon.png", quality=100)

navsize=(int(ratio*75),75)
im.resize(newsize, Image.ANTIALIAS).save(outname+".jpg", quality=100)
im.resize(thumbsize, Image.ANTIALIAS).save(outname+"_thumb.jpg", quality=100)
im.resize(navsize, Image.ANTIALIAS).save(outname+"_nav.jpg", quality=100)
