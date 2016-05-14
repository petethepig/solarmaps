// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require custom_marker
//= require jquery_ujs


var map;
var FPS = 30;

var UTILITY_API_ENDPOINT = "https://utilityapi.com/portal/altstaterus_gmail";

function resizeMap(){
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
}

function initMap() {
  var myOptions = {
    zoom: 17,
    minZoom: 17,

    // scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    // draggable: false,
    // disableDoubleClickZoom: true,
    streetViewControl: false,
    // disableDefaultUI: true,

    // 37.8044° N, 122.2711° W

    // center: new google.maps.LatLng(37.7786871, -122.42124239999998),
    center: new google.maps.LatLng((37.8044) / 1, (-122.2711) / 1),
    // center: new google.maps.LatLng((37.7786871 + 37.79593620000001) / 2, (-122.42124239999998 - 122.40000320000001) / 2),
    // mapTypeId: google.maps.MapTypeId.ROADMAP
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'grayscale']
    }
  };

  map = new google.maps.Map(document.getElementById('map'), myOptions);

  var center;
  google.maps.event.addListener(map, 'center_changed', function() { center = map.getCenter(); }); 
  google.maps.event.addDomListener(window, 'resize', resizeMap);
  // new MapLabel({
  //   text: 'Test',
  //   position: latlng,
  //   map: map,
  //   fontSize: 20,
  //   align: 'center'
  // });

  // var marker = new google.maps.Marker({
  //   position: latlng,
  //   map: map,
  //   label: "Test",
  //   title: 'Hello World!'
  // });
}

// setTimeout(function(){
//   map.panTo(new google.maps.LatLng((37.9044) / 1, (-122.2711) / 1));
// }, 2000);

function initQuotes(){
  for(var i = 0; i < 200; i++){
    ky = 250 / 4;
    kx = 250 / 2;
    var latlng = new google.maps.LatLng((37.8044 + (Math.random() - 0.5)/kx) / 1, (-122.2711 + (Math.random() - 0.5)/ky) / 1);
    var overlay = new CustomMarker(
      latlng,
      map,
      {
        text: "$&nbsp;1,000"
      }
    );
  }

  setTimeout(function(){
    $(".marker").each(function(){
      var self = this;
      setTimeout(function(){
        $(self).addClass("fade-in");
      }, Math.random()*1000);
      $(this).click(function(){
        // $("#map-overlay").show();
        // $(".property-info").show();
        // setTimeout(function(){
        //   $("#map-overlay").addClass("fade-in");
        //   $(".property-info").addClass("fade-in");
        // }, 100)
      })
    });
  }, 50)
}

$(function() {
  initMap();

  setTimeout(function() {
    $("#search-form").addClass("fade-in");
  }, 1000);

  $("#search-form").submit(function(e) {
    e.preventDefault();
    $(".left-part").addClass("fade-out");
    $("#map-overlay").addClass("fade-out");
    $("aside").addClass("fade-in");
    var times = 0;
    var interval = setInterval(function(){
      resizeMap();
      console.log(times)
      if(times > 1000 / FPS){
        // console.log(stop)
        clearInterval(interval);
      }
      times++;
    }, 1000 / FPS)
    $("#map").addClass("shrink");
    setTimeout(function() {
      $("#map-overlay").hide();
      initQuotes();
    }, 700);
  });
});


