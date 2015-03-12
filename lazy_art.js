function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function newIconSize() {
    adjustedZoom=Math.min(map.getZoom(),17)/8;
    scaler=150;
    newsize=Math.log10(adjustedZoom)*scaler;
    return [newsize, newsize];
};

function newZoom() {
    return Math.max(18,map.getZoom());
};

pieceID = getURLParameter('piece');

L.mapbox.accessToken = 'pk.eyJ1IjoiYXRsYW50YWFydG1hcCIsImEiOiJ0T3oyX3IwIn0.YYbtHpDXBWgojH8IVkOLKQ';

//bounds
var southWest = L.latLng(33.607203, -84.537855),
    northEast = L.latLng(33.925717, -84.232984),
bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map-one', 'atlantaartmap.jnem740e',
    {
        maxBounds: bounds,
        minZoom: 13,
        zoomControl: false 
    }).
    setView([33.7581812, -84.363660], 13);

var markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    disableClusteringAtZoom: 17
});
var oneArtPlease = L.mapbox.featureLayer()
    .loadURL('art.geojson')
    .addTo(markers);

//identify the thumbnail bar
var info = document.getElementById('info');

//populate markers
oneArtPlease.on('layeradd', function(e) {
    
    var marker = e.layer,
    feature = marker.feature;

    // popupz
    var popupContent =  '<div class="thumbnail"><a target="_blank" class="popup" href="' + feature.properties.url + '">' +
        '<img src="' + feature.properties.image + '" title="Click for the full picture" /><br> Click for the full picture</a>' +
        '<br>Link: http://atlantaartmap.com/index.html?piece='+feature.properties.pieceID+'<br>' +
        feature.properties.picnote +
        '</div>';
    marker.bindPopup(popupContent,{
        closeButton: true,
        minWidth: 320
    });

    //change icon
    marker.feature.properties.icon.iconSize=newIconSize();
    marker.setIcon(L.icon(feature.properties.icon));

    //Open piece if ID found in URL
    if (marker.feature.properties.pieceID == pieceID) {
        marker.once('add', function () {
            marker.openPopup();
        });
        map.setView(marker.getLatLng(), newZoom());
    }

    //populate thumbnail bar
    var link = document.createElement('a');
    link.className = 'item';
    link.href = '#';
    link.innerHTML ='<img src="" data-src="' + feature.properties.nav + '" class="lazyload"></img>';
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
            map.setView(marker.getLatLng(), newZoom(), {animation: true});
            marker.openPopup();
        }
        return false;
    };
    info.appendChild(link,info.firstChild);

    //Zoom when clicking a marker
    marker.on('click', function() {
        map.setView(marker.getLatLng(), newZoom(), {animation: true});
    });
    markers.addLayer(marker);
});

//add zoom control
new L.Control.Zoom({ position: 'topright' }).addTo(map);
map.addLayer(markers);

//resize icons on zoom end
map.on('zoomend', function() {
  var currentZoom = map.getZoom()-10;
  oneArtPlease.eachLayer(function(marker) {
    marker.feature.properties.icon.iconSize=newIconSize();
    newIcon=L.icon(marker.feature.properties.icon);
    marker.setIcon(L.icon(marker.feature.properties.icon));
  });
});


