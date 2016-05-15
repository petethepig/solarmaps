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
//= require knockout
//= require main_view
//= require jquery_ujs

Array.prototype.chunk = function ( n ) {
  if ( !this.length ) {
    return [];
  }
  return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
};

var map;
var FPS = 30;

var UTILITY_API_ENDPOINT = "https://utilityapi.com/portal/altstaterus_gmail";

function resizeMap(){
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
}

$.ajax({
  url: "data2.json",
  success: function(data){
    window.data = data.map(function(x){
      x[3] = Math.round(x[3]/3);
      return x;
    });
  }
})

function initMap() {
  var myOptions = {
    zoom: 20,
    minZoom: 20,

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
    // center: new google.maps.LatLng((37.8044) / 1, (-122.2711) / 1),
    // 37.796030384465006 -122.24247488548396

    center: new google.maps.LatLng((37.7959689196709) / 1, (-122.24153611232873) / 1),
    // center: new google.maps.LatLng((37.796030384465006) / 1, (-122.24247488548396) / 1),
    // center: new google.maps.LatLng((37.7786871 + 37.79593620000001) / 2, (-122.42124239999998 - 122.40000320000001) / 2),
    // mapTypeId: google.maps.MapTypeId.SATELLITE
    mapTypeId: google.maps.MapTypeId.HYBRID
    // mapTypeControlOptions: {
    //   mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'grayscale']
    // }
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
  // for(var i = 0; i < 200; i++){
  //   ky = 250 / 4;
  //   kx = 250 / 2;
  //   var latlng = new google.maps.LatLng((37.8044 + (Math.random() - 0.5)/kx) / 1, (-122.2711 + (Math.random() - 0.5)/ky) / 1);
  //   var overlay = new CustomMarker(
  //     latlng,
  //     map,
  //     {
  //       text: "$&nbsp;1,000",
  //       class: "green"
  //     }
  //   );
  // }
  var classes = ["green", "blue", "yellow"];
  var mapping ={
    green: "Verified",
    blue: "Estimated",
    yellow: "Referer",
  }

  function toStr(bid){
    str = String(bid);
    str = str.split("").reverse().chunk(3).map( function(x){ return x.join("") }).join(",").split("").reverse().join("");
    return str;
  }

  var seed = 1;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  for(var i = 0; i < window.data.length; i++) {
    var arr = window.data[i];
    var address = arr[0];
    var l1 = arr[1];
    var l2 = arr[2];
    var l3 = toStr(arr[3]);
    var latlng = new google.maps.LatLng(l1 / 1, l2 / 1);
    var r2 = Math.floor(random() * 1000);
    var i2 = r2 % 3;
    if (r2 < 200) {
      i2 = 0;
    } else if (r2 < 300) {
      i2 = 2;
    } else if (r2 < 1000) {
      i2 = 1;
    }

    var clz = classes[i2];
    var txt = "$&nbsp;"+l3+"<br><span class='small'>"+mapping[clz]+"</span>";

    var r = Math.floor(Math.random() * 3) + 1;
    if(mapping[clz]=="Verified"){
      txt += "<span class='bubble'>"+r+"</span>";
    }
    arr.push(mapping[clz]);
    var overlay = new CustomMarker(
      latlng,
      map,
      {
        text: txt,
        data: arr,
        class: clz
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
        $(".marker").removeClass("active");
        setTimeout(function(){
          $(self).addClass("active");
        })
        var data = $(self).data();
        window.mainView.address(data[0]);
        window.mainView.value(data[3]);
        window.mainView.status(data[4]);
        $(".search-bar input").val(data[0]);
        window.selectedMarker = self;
        // console.log();
      })
    });
    var marker = $($(".marker").get(0));
    $(marker).click();
  }, 50)
}

$(function() {

  window.mainView = new MainView();
  ko.applyBindings(window.mainView);

  initMap();

  setTimeout(function() {
    $("#search-form").addClass("fade-in");
  }, 1000);

  $("#search-form").submit(function(e) {
    e.preventDefault();
    $(".search-bar").addClass("fade-in");
    $(".logo").addClass("fade-in");
    $(".left-part").addClass("fade-out");
    $("#map-overlay").addClass("fade-out");
    $("aside").addClass("fade-in");
    var times = 0;
    var interval = setInterval(function(){
      resizeMap();
      if(times > 1000 / FPS){
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


