var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];
var running;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

$(function() {
  init();
  initData();
  points = data200;
  $('#addRandom_btn').click(function() {
    addRandomPoints(50);
    $('#status').text("");
    running = false;
  });
  $('#start_btn').click(function() { 
    if(points.length >= 3) {
      initData();
      GAInitialize();
      running = true;
    } else {
      alert("add some more points to the map!");
    }
  });
  $('#clear_btn').click(function() {
    running === false;
    initData();
    points = new Array();
  });
  $('#stop_btn').click(function() {
    if(running === false && currentGeneration !== 0){
      if(best.length !== points.length) {
          initData();
          GAInitialize();
      }
      running = true;
    } else {
      running = false;
    }
  });
});
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $('#canvas').width();
  HEIGHT = $('#canvas').height();
  setInterval(draw, 10);
  init_mouse();
}
function init_mouse() {
  $("canvas").click(function(evt) {
    if(!running) {
      canvasMinX = $("#canvas").offset().left;
      canvasMinY = $("#canvas").offset().top;
      $('#status').text("");

      x = evt.pageX - canvasMinX;
      y = evt.pageY - canvasMinY;
      points.push(new Point(x, y));
    }
  });
}
function initData() {
  running = false;
  POPULATION_SIZE = 30;
  ELITE_RATE = 0.3;
  CROSSOVER_PROBABILITY = 0.9;
  MUTATION_PROBABILITY  = 0.01;
  //OX_CROSSOVER_RATE = 0.05;
  UNCHANGED_GENS = 0;
  mutationTimes = 0;
  doPreciseMutate = true;

  bestValue = undefined;
  best = [];
  currentGeneration = 0;
  currentBest;
  population = []; //new Array(POPULATION_SIZE);
  values = new Array(POPULATION_SIZE);
  fitnessValues = new Array(POPULATION_SIZE);
  roulette = new Array(POPULATION_SIZE);
}
function addRandomPoints(number) {
  running = false;
  for(var i = 0; i<number; i++) {
    points.push(randomPoint());
  }
}
function drawCircle(point) {
  ctx.fillStyle   = '#000';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function drawLines(array) {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(points[array[0]].x, points[array[0]].y);
  for(var i=1; i<array.length; i++) {
    ctx.lineTo( points[array[i]].x, points[array[i]].y )
  }
  ctx.lineTo(points[array[0]].x, points[array[0]].y);

  ctx.stroke();
  ctx.closePath();
}

function drawMapLines(array) {
    var Augustine = {
        info: '<strong>Augustine University</strong><br>\
					<br>Igbonla Road, 1010, Epe <br>\
					<a href="https://bit.ly/2FiSU25">Get Directions</a>',
        lat:6.6490121,
        long: 3.9912698
    };

    var Lasu = {
        info: '<strong>Lagos State University</strong><br>\
        <br>Lagos - Badagry Expy, Ojo, Lagos<br>\
					<a href=" https://bit.ly/2vQrMIu">Get Directions</a>',
        lat: 6.4639375,
        long: 3.1988882
    };

    var Unilag = {
        info: '<strong>University of Lagos</strong><br>\r\
					<br> Akoka, Yaba <br>\
					<a href="https://bit.ly/2KeSrlu">Get Directions</a>',
        lat: 6.5193116,
        long: 3.3971378
    };


    var Yaba = {
        info: '<strong>Yaba College of Technology</strong><br>\r\
					<br> Herbert Macaulay Way, Yaba, Lagos<br>\
					<a href="https://bit.ly/2vTgcMW">Get Directions</a>',
        lat: 6.5187345,
        long: 3.3722376
    };

    var AOCE = {
        info: '<strong>Adeniran Ogunsanya College of Education</strong><br>\r\
					<br>Otto-Awori, Nigeria, Ojo, Lagos<br>\
					<a href="https://bit.ly/2FfWNVz">Get Directions</a>',
        lat: 6.5001372,
        long: 3.1086725
    };

    var Anchor = {
        info: '<strong>Anchor University</strong><br>\r\
					<br>Ipaja, Lagos<br>\
					<a href="https://bit.ly/2KfbsUR">Get Directions</a>',
        lat: 6.6057617,
        long: 3.2392411
    };

    var Caleb = {
        info: '<strong>Caleb University</strong><br>\r\
					<br>Ikorodu, Lagos<br>\
					<a href="https://bit.ly/2KfbxI9">Get Directions</a>',
        lat: 6.6194184,
        long: 3.508265
    };


    var Christopher = {
        info: '<strong>Christopher University</strong><br>\r\
					<br>Lagos Ibadan Expressway, Ibokun Aro 3008, Mowe<br>\
					<a href="https://bit.ly/2r1DyKl">Get Directions</a>',
        lat: 6.8273478,
        long: 3.4622118
    };

    var FCEA = {
        info: '<strong>Federal College of Education, Akoka</strong><br>\r\
					<br>St. Finbarrs College Road, Akoka, Lagos<br>\
					<a href="http://bit.do/eeQUk">Get Directions</a>',
        lat: 6.5225924,
        long: 3.3819078
    };

    var LASPOTECH = {
        info: '<strong>Lagos State Polytechnic</strong><br>\
					<br>1 A1, Ikorodu, Lagos<br>\
					<a href=" http://bit.do/eeQT8">Get Directions</a>',
        lat: 6.6462946,
        long: 3.5156813
    };

    var NOUN = {
        info: '<strong>National Open University of Nigeria</strong><br>\
					<br>14/16 Ahmadu Bello Way, Victoria Island, Lagos<br>\
					<a href="http://bit.do/eeQUG">Get Directions</a>',
        lat: 6.4341691,
        long: 3.4069982
    };

    var PAN = {
        info: '<strong>Pan-Atlantic University</strong><br>\
					<br>KM 52 Lekki-epe expressway, Ibeju-Lekki, Lagos<br>\
					<a href="http://bit.do/eeQVr">Get Directions</a>',
        lat: 6.4872606,
        long: 3.8531619
    };

    var Ronik = {
        info: '<strong>Ronik Polytechnic</strong><br>\
					<br>23/25 Ailegun Rd, Isheri Osun 21764, Lagos<br>\
					<a href="http://bit.do/eeQVK">Get Directions</a>',
        lat: 6.5372312,
        long: 3.2929776
    };

    var SACE = {
        info: '<strong>St. Augustine College of Education</strong><br>\
					<br>2 Moronfolu St, Akoka, Lagos<br>\
					<a href="http://bit.do/eeQVX">Get Directions</a>',
        lat: 6.5238066,
        long: 3.3850396
    };


    var Grace = {
        info: '<strong>Grace Polytechnic</strong><br>\
					<br>Surulere, Lagos<br>\
					<a href="http://bit.do/eeQV9">Get Directions</a>',
        lat: 6.5131549,
        long: 3.3581842
    };

    var locations = [
        [Augustine.info, Augustine.lat, Augustine.long, 0],
        [Lasu.info, Lasu.lat, Lasu.long, 1],
        [Unilag.info, Unilag.lat, Unilag.long, 2],
        [Yaba.info, Yaba.lat, Yaba.long, 3],
        [AOCE.info, AOCE.lat, AOCE.long, 4],
        [Anchor.info, Anchor.lat, Anchor.long, 5],
        [Caleb.info, Caleb.lat, Caleb.long, 6],
        [Christopher.info, Christopher.lat, Christopher.long, 7],
        [FCEA.info, FCEA.lat, FCEA.long, 8],
        [LASPOTECH.info, LASPOTECH.lat, LASPOTECH.long, 9],
        [NOUN.info, NOUN.lat, NOUN.long, 10],
        [PAN.info, PAN.lat, PAN.long, 11],
        [Ronik.info, Ronik.lat, Ronik.long, 12],
        [SACE.info, SACE.lat, SACE.long, 13],
        [Grace.info, Grace.lat, SACE.long, 14]
    ];

    var route = [];
    for(var i=0; i<array.length; i++) {
        ctx.lineTo( points[array[i]].x, points[array[i]].y );
        route[i] = {
          lat: points[array[i]].x, lng: points[array[i]].y
        }
    }

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(6.5193116,3.3971378 ),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow({});

    var marker;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(route[i].lat, route[i].lng),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    var salesManPath = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    salesManPath.setMap(map);
}

function draw() {
  if(running) {
    GANextGeneration();
    $('#status').text("There are " + points.length + " cities in the map, "
                      +"the " + currentGeneration + "th generation with "
                      + mutationTimes + " times of mutation. best value: "
                      + ~~(bestValue));
  } else {
    $('#status').text("There are " + points.length + " Cities in the map. ")
  }
    clearCanvas();
    if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            drawCircle(points[i]);
        }
        if (best.length === points.length) {
            console.log(best);
            drawMapLines(best);
            //drawLines(best);
        }
    }
}
function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
