function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

pieceID = getURLParameter('piece');


L.mapbox.accessToken = 'pk.eyJ1IjoiYXRsYW50YWFydG1hcCIsImEiOiJ0T3oyX3IwIn0.YYbtHpDXBWgojH8IVkOLKQ';

//bounds
var southWest = L.latLng(33.607203, -84.537855),
    northEast = L.latLng(33.925717, -84.232984),
bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map-one', 'atlantaartmap.jnem740e',
    {
        maxBounds: bounds,
        minZoom: 11,
        zoomControl: false 
    }).
    setView([33.764, -84.366], 14);

var oneArtPlease = L.mapbox.featureLayer()
    .loadURL('art.geojson')
    .addTo(map);

//identify the thumbnail bar
var info = document.getElementById('info');

//populate markers
oneArtPlease.on('layeradd', function(e) {
    var marker = e.layer,
    feature = marker.feature;

    // popupz
    var popupContent =  '<div class="thumbnail"><a target="_blank" class="popup" href="' + feature.properties.url + '">' +
        '<img src="' + feature.properties.image + '" width="300" title="Click for the full picture" /><br> Click to Zoom</a>' +
        '<br><a href="http://atlantaartmap.com/index.html?piece='+feature.properties.pieceID+'" > Link to this piece </a><br>' +
        feature.properties.picnote +
        '</div>';
    marker.bindPopup(popupContent,{
        closeButton: true,
        minWidth: 320
    });

    //change icon
    marker.setIcon(L.icon(feature.properties.icon));
    //Open piece if ID found in URL
    if (marker.feature.properties.pieceID == pieceID) {
        map.panTo(marker.getLatLng());
        marker.openPopup();
    }
    //populate thumbnail bar
    var link = info.insertBefore(document.createElement('a'),info.firstChild);
    link.className = 'item';
    link.href = '#';
    link.innerHTML ='<img src="' + feature.properties.image + '" class="navthumb"/>';
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
            // move to marker and open on thumbnail click
            map.panTo(marker.getLatLng());
            marker.openPopup();
        }
        return false;
    };

});
new L.Control.Zoom({ position: 'topright' }).addTo(map);
