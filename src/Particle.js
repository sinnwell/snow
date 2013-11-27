/**
 * Particle
 */
var Snowflake = function(config) {

  'use strict';

  this.alphaMin = 0.1;
  this.alphaMax = 1.3;

  this.zMin = 0;
  this.zMax = 1;

  this.sizeMin = config.sizeMin;
  this.sizeMax = config.sizeMax;

  this.depth = 0;
  this.scale = 1;

  this.rotation = 0;

  this.turbulence = 0.5;

  this.gravity = 100;
  this.wind = {force: 1};

  this.x = null;
  this.y = null;

  this.tweenX = null;
  this.tweenY = null;

  // a set of colors
  this.colors = [];
  this.colors.push({
    r: 255,
    g: 255,
    b: 255
  });
  // this.colors.push({
  //   r: 18,
  //   g: 71,
  //   b: 108
  // });
  // this.colors.push({
  //   r: 90,
  //   g: 111,
  //   b: 115
  // });
  // this.colors.push({
  //   r: 135,
  //   g: 95,
  //   b: 100
  // });
  // this.colors.push({
  //   r: 255,
  //   g: 255,
  //   b: 255
  // });

  this.images = [
    'img/flake-1.png',
    'img/flake-2.png',
    'img/flake-3.png',
    'img/flake-3.png',
    'img/flake-3.png',
    'img/flake-3.png',
    'img/flake-3.png',
    'img/flake-4.png'
  ];

  /**
   * the cancvas
   */
  this.context = null;


  this.init();
};

Snowflake.prototype = {

  init: function() {

    this.radius = this.sizeMin + Math.random() * this.sizeMax;

    this.depth = Math.random() * (this.zMax * 2 - this.zMin) + this.zMin;
    this.depth = parseInt(this.depth * 100) / 100;
    this.scale = Math.max(0.4, (1 / (Math.max(0, this.depth)) -0.5 ));
    this.alpha = this._updateAlpha();

    this.rotation = Math.random() * 360;
    this.color = this.colors[ Math.floor(Math.random()*this.colors.length)];
    this.bounds = {
      width: $(window).width(),
      height: $(window).height()
    };

    $(window).on('resize', $.proxy(this._onResize, this));

    this.context = null;

    this.img = new Image();
    this.img.src = this.images[Math.floor(Math.random() * this.images.length)];
  },

  update: function() {
    this._boundsX();
    this._boundsY();
  },

  render: function() {
    var posX = this.x + Math.cos(this.rotation * Math.PI / 180) * this.radius * 0.5;
    var posY = this.y + Math.sin(this.rotation * Math.PI / 180) * this.radius * 0.5;

    // this.context.fillStyle = 'rgba(' + this.color.r +','+ this.color.g +','+ this.color.b +',' + this.alpha + ')';
    // this.context.beginPath();
    // this.context.arc(posX, posY, this.radius * this.scale, 0, Math.PI * 2, true);
    // this.context.closePath();
    // this.context.fill();
    
    this.context.globalAlpha = this.alpha;
    this.context.drawImage(this.img, posX, posY, this.radius * this.scale, this.radius * this.scale);
  },

  startAnimation: function() {
    this._xSnow();
    this._ySnow();
  },


  // event handlers

  _onResize: function() {
    this.bounds = {
      width: $(window).width(),
      height: $(window).height()
    };
  },


  // private

  _boundsX: function(m) {
    var margin = 20;
    if (this.x > this.bounds.width + this.radius * this.scale) {
      TweenLite.killTweensOf(this);
      this.x = -this.radius * this.scale;
      this._xSnow();
      this._ySnow();
    } else if (this.x < (-this.radius * this.scale)) {
      TweenLite.killTweensOf(this);
      this.x = this.bounds.width + this.radius * this.scale;
      this._xSnow();
      this._ySnow();
    }
  },

  _boundsY: function(m) {
    if(this.y > this.bounds.height + this.radius * this.scale) {
      TweenLite.killTweensOf(this);
      this.y = -this.radius * this.scale;
      this._xSnow();
      this._ySnow();
    }
  },

  _updateAlpha: function() {
    var alpha;
    if(this.scale < 2 * this.radius) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin);
    } else if(this.scale > 2 * this.radius && this.scale < 4 * this.radius) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin) * 0.6;
    } else if(this.scale > 4 * this.radius) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin) * 0.15;
    }
    return alpha;
  },

  _xSnow: function() {
    this._boundsX();

    TweenLite.to(this, Math.random()*2+1, {
      alpha: this._updateAlpha,
      x: this.x + (Math.random() * 80 - 40 + this.wind.force) * this.scale,
      rotation: Math.random() * 900 * this.turbulence,
      onComplete: $.proxy(this._xSnow, this),
      ease: Quad.easeInOut,
      overwrite: false
    });
  },

  _ySnow: function() {
    this._boundsY();

    this.tweenY = TweenLite.to(this, Math.random()*2+1, {
      // y: this.y + (Math.random() * (this.gravity * 0.5) + (this.gravity * 0.5)) * this.scale * 0.3,
      y: this.y + this.gravity * this.scale * 0.5,
      onComplete: $.proxy(this._ySnow, this),
      ease: Linear.easeInOut,
      overwrite: false
    });
  }

};