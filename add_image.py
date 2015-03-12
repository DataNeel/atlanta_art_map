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


outname=raw_input("What's the new piece ID#?\n")
icon_name="images/"+outname+"_icon.png"
new_name="images/"+outname+".jpg"
thumb_name="images/"+outname+"_thumb.jpg"
nav_name="images/"+outname+"_nav.jpg"
coords=raw_input('Paste Google coordinates\n')
coords=[float(i) for i in coords.split(',')][::-1]
picnote=raw_input('Notes about this pictures?\n')
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

with open('art.geojson') as f:
    data = json.load(f)

b = open("art.geojson.bak", "w")
b.write(json.dumps(data, indent=4))
b.close()

new_piece={"geometry": {"type": "Point", "coordinates":coords}, "type": "Feature", "properties": {"marker-color": "#ff8888", "icon": {"iconSize": [50, 50], "iconUrl": icon_name, "popupAnchor": [0, -15], "className": "dot"}, "url": new_name, "image": thumb_name, "nav": nav_name, "pieceID": int(outname), "picnote": picnote, "marker-size": "large"}}
data["features"].insert(0,new_piece)
f = open("art.geojson", "w")
f.write(json.dumps(data, indent=4))
f.close()