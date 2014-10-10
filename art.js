   L.mapbox.accessToken = 'pk.eyJ1IjoiYXRsYW50YWFydG1hcCIsImEiOiJ0T3oyX3IwIn0.YYbtHpDXBWgojH8IVkOLKQ';
      var southWest = L.latLng(33.721217, -84.505926),
      northEast = L.latLng(33.893768,-84.274348),
      bounds = L.latLngBounds(southWest, northEast);

    var map = L.mapbox.map('map-one', 'atlantaartmap.jnem740e',{
        maxBounds: bounds,
        minZoom: 11,
        zoomControl: false 
      }).setView([33.764, -84.366], 14);

    var oneArtPlease = L.mapbox.featureLayer()
    .loadURL('art.geojson')
    .addTo(map);

    var info = document.getElementById('info');

    oneArtPlease.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature;

        // popupz
        var popupContent =  '<div class="thumbnail"><a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                                '<img src="' + feature.properties.image + '" width="300" /><br>' +
                                feature.geometry.coordinates+'</br>'+
                                feature.properties.picnote +
                            '</a></div>';

        // http://leafletjs.com/reference.html#popup
        marker.bindPopup(popupContent,{
            closeButton: true,
            minWidth: 320
        });
        //attempt to link
        marker.setIcon(L.icon(feature.properties.icon));
        var link = info.appendChild(document.createElement('a'));
        link.className = 'item';
        link.href = '#';
        link.innerHTML ='<img src="' + feature.properties.image + '" height="100"/>';
        link.onclick = function() {
          if (/active/.test(this.className)) {
            this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
          } else {
            var siblings = info.getElementsByTagName('a');
            for (var i = 0; i < siblings.length; i++) {
              siblings[i].className = siblings[i].className
                .replace(/active/, '').replace(/\s\s*$/, '');
            };
            this.className += ' active';

            // When a menu item is clicked, animate the map to center
            // its associated marker and open its popup.
            map.panTo(marker.getLatLng());
            marker.openPopup();
          }
    return false;
  };

    });
new L.Control.Zoom({ position: 'topright' }).addTo(map);