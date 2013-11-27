/*jslint indent:2*/

/**
 * Snow main class
 */
var Snow = function(config) {
  this.init(config);
  this.create();
};

Snow.prototype = {

  // public
  start: function() {
    this.render();
  },

  stop: function() {
    // this.create();
  },

  // View constructor
  init: function(config) {

    this.config(config);

    // AnimationFrame Polyfill
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if(!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
         var currTime = new Date().getTime();
         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
         var id = window.setTimeout(function() { callback(currTime + timeToCall); },
           timeToCall);
         lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }

    this._createCanvas();

    // $(window).scroll($.proxy(this.onScroll, this));
    // $(window).on('resize', $.proxy(this.onResize, this));
  },

  // public

  config: function(config) {
    // Storing the View context
    var self = this;

    //————————————————————— C U S T O M    V A L U E S

    // Debug
    this.debug = true;
    this.stats = null;

    // Snow behavior
    this.intro = true; // If true, the snowflakes will appear from the top left hand corner, instead of directly filling the screen.
    this.fade = true; // If true, the snowflakes will appear using opacity

    // Snow Look
    this.snowAmount = config.amount; // The number of snowflakes
    this.snowSize = 1;// Scale of individual snowflakes. 1 is normal, 2 is double, 0.5 is half
    this.sizeMin = config.sizeMin;
    this.sizeMax = config.sizeMax; 

    this.windMin = config.windMin;
    this.windMax = config.windMax; 

    // Snow distance
    this.snowZmin = config.sizeMin; // The min snowflake distance : 0 is close, 1 is far
    this.snowZmax = config.sizeMax; // The max snowflake distance : 0 is close, 1 is far

    // Snow Opacity
    this.snowAlphaMin = 1; // The minimum alpha value
    this.snowAlphaMax = 1; // The maximum alpha value

    // Snow Rotation
    this.snowRotation = 0; // Rotation animation. 0.5 is half, 2 is double.

    // Gravity
    this.gravity = config.gravity; // Speed of fall. 100 is the normal speed. 0 to float, -100 to inverse the direction.

    // Wind Force
    this.windBegin = 10; // The inital wind when the snow starts, then it smoothly changes to the normal values
    this.windForceMin = 2; // The minimum force of the wind
    this.windForceMax = 10; // The maximum force of the wind


    // Wind Direction
    this.windDirection = "both"; // You can chose between "left", "right", and "both"

    // Wind duration
    this.windTimeMin = 1; // Minimum time between two winds
    this.windTimeMax = 20; // Maximum time between two winds

    this.activeFlakes = [];

    // this.gravity = Math.random() * 40 - 20;

    this.wind = {force: 1};

    // scrolling

    this.previousScroll = 0;
  },

  create: function() {
    // this._randomgravity();
    this._randomWind();
    this._createSnow();
    if(this.debug) {
      this._createStats();
    }
  },

  destroy: function() {
    for (var i = 0; i < this.activeFlakes.length; i++) {
      delete(this.activeFlakes[i]);
    }
    this.activeFlakes = [];
  },

  render: function() {

    if(this.debug) {
      this.stats.begin();
    }

    // clear the canvas
    this._clear();

    // render the flakes
    for (var i = 0; i < this.activeFlakes.length; i++) {
      this.activeFlakes[i].gravity = this.gravity;
      this.activeFlakes[i].wind = this.wind;
      this.activeFlakes[i].update();
      this.activeFlakes[i].render();
    }

    this._loop(this.render);

    if(this.debug) {
      this.stats.end();
    }
  },

  // private

  _clear: function() {
    this.context.clearRect(0, 0, $(window).width(), $(window).height());
  },

  _loop: function(handler) {
    window.requestAnimationFrame($.proxy(handler, this));
  },

  _createStats: function() {
    this.stats = new Stats();
    this.stats.setMode(0);
    // Align top-left
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = '20000';
    document.body.appendChild( this.stats.domElement );
  },


  // canvas

  _createCanvas: function() {
    var canvas = $('<canvas/>',{'class':'flares', 'id':'flares'});
    $('body > #container').after(canvas);
    this.context = canvas[0].getContext('2d');

    this._resizeCanvas();
  },

  _resizeCanvas: function() {
    $('#flares').attr('width', $(window).width()).attr('height', $(window).height());
  },

  // snow

  _createSnow: function() {
    for (var i=0; i < this.snowAmount; i++) {
      this._createFlake(i);
    }
    this._distributeFlakes();
    for (var i = 0; i < this.activeFlakes.length; i++) {
      this.activeFlakes[i].gravity = this.gravity;
      this.activeFlakes[i].wind = this.wind;
      this.activeFlakes[i].startAnimation();
    }
  },

  _distributeFlakes: function() {
    for (var i = 0; i < this.activeFlakes.length; i++) {
      this.activeFlakes[i].x = Math.random() * $(window).width();
      this.activeFlakes[i].y = Math.random() * $(window).height();
    }

    // var iterationsWidth = 1;
    // var iterationsHeight = 1;

    // for (var i = 0; i < this.activeFlakes.length; i++) {
    //   var x = 0;
    //   for (var j = 0; j < iterationsWidth; j++) {
    //     x += Math.random() * $(window).width() *1.2;
    //   };
    //   this.activeFlakes[i].x = x / iterationsWidth + $(window).width() * 0.5 - 50;
    //   if(this.activeFlakes[i].x > $(window).width()) {
    //     this.activeFlakes[i].x = $(window).width() - (this.activeFlakes[i].x - $(window).width());
    //   }

    //   var y = 0;
    //   for (var j = 0; j < iterationsHeight; j++) {
    //     y += Math.random() * $(window).height();
    //   };
    //   this.activeFlakes[i].y = y / (iterationsHeight);
    // }
  },

  _createFlake: function() {
    var m = new Snowflake({
      sizeMin: this.sizeMin,
      sizeMax: this.sizeMax
    });
    m.context = this.context;
    this.activeFlakes.push(m);
  },

  _randomgravity: function() {
    TweenLite.to(this, Math.random() * 5 + 1, {
      gravity: this.gravity + Math.random() * this.gravity - this.gravity * 0.5,
      onComplete: $.proxy(this._randomgravity, this)
    });
  },

  _randomWind: function() {
    var nWind;
    var wind = new Object;
    wind.min = this.windMin;
    wind.max = this.windMax;
    wind.dir = "left";
    // Wind duration
    var windTimeMin = 3; // Minimum time between two winds
    var windTimeMax = 10; // Maximum time between two winds

    if(wind.dir == "right") {
      nWind = Math.random() * (wind.max - wind.min) + wind.min;
    } else if(wind.dir == "left") {
      nWind = -Math.random()*(wind.max-wind.min)-wind.min;
    } else {
      nWind = Math.random()*(wind.max*2-wind.min)-wind.min-wind.max;
    }
    if(this.debug == true) {
      console.log("SNOW : next wind : "+nWind)
    }
    TweenLite.to(this.wind, Math.random()*3+1, {
      force: nWind,
      delay: Math.random() * ( windTimeMax - windTimeMin) + windTimeMin,
      onComplete:$.proxy(this._randomWind, this)
    });
  },

  // eventhandler

  onScroll: function(event) {

    // var currentScroll = $(window).scrollTop();
    // var gravity;
    // if (currentScroll > this.previousScroll){
    //  gravity = -50;
    // } else {
    //  gravity = 50;
    // }

    // this.previousScroll = currentScroll;

    // var perc = $(document).scrollTop() / ($(document).height() - $(window).height());
    // TweenLite.killTweensOf($('#background'));
    // TweenLite.killTweensOf($(this));
    // TweenLite.to($('#background'), 0.4, {css:{top:(perc*-100)}});
    // TweenLite.to($(this), 0.4, {
    //  gravity: gravity,
    //  onComplete: $.proxy(this._randomgravity, this),
    //  ease: Linear.easeInOut,
    //  overwrite: true
    // });


    var perc = $(document).scrollTop() / ($(document).height() - $(window).height());
    $('#background').css({'top': (perc * -2000)});
    // TweenLite.to($('#background'), 0.4, {
    //   css:{
    //     top:(perc * -2000)
    //   },
    //   overwrite: true
    // });
  },

  onResize: function() {
    this._resizeBackground();
  }
}