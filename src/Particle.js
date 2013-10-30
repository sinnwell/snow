/*jslint indent:2*/

/**
 * Particle
 */
var Snowflake = function() {

  'use strict';

  this.alphaMin = 0.08;
  this.alphaMax = 0.7;

  this.zMin = 0;
  this.zMax = 1;

  this.sizeMin = 1;
  this.sizeMax = 12;

  this.depth = 0;
  this.scale = 1;

  this.rotation = 0;

  this.turbulence = 1;

  this.gravity = 1;
  this.wind = {force: 1};

  this.x = null;
  this.y = null;

  // a set of colors
  this.colors = [];
  this.colors.push({
    r: 255,
    g: 255,
    b: 255
  });
  this.colors.push({
    r: 18,
    g: 71,
    b: 108
  });
  this.colors.push({
    r: 90,
    g: 111,
    b: 115
  });
  this.colors.push({
    r: 135,
    g: 95,
    b: 100
  });
  this.colors.push({
    r: 255,
    g: 255,
    b: 255
  });

  /**
   * the cancvas
   */
  this.context = null;


  this.init();
};

Snowflake.prototype = {

  init: function() {

    this.scaleX = 1;
    //this.radius = this.sizeMin + Math.pow(Math.random() * this.sizeMax, 2);
    this.radius = this.sizeMin + Math.random() * this.sizeMax;
    this.scale = this.radius / this.sizeMax ;
    this.rotation = Math.random() * 360;
    this.color = this.colors[ Math.floor(Math.random()*this.colors.length)];
    this.bounds = {
      width: $(window).width(),
      height: $(window).height()
    };

    this.depth = Math.random() * (this.zMax * 2 - this.zMin) + this.zMin;
    this.depth = parseInt(this.depth * 100) / 100;
    this.scale = Math.max(0.4, (1 / (Math.max(0, this.depth)) -0.5 ));
    this.alpha = this._updateAlpha();

    // position
    //this.x = 0; //Math.random() * this.bounds.width;
    //this.y = 0; //Math.random() * this.bounds.height;

    $(window).on('resize', $.proxy(this._onResize, this));

    this.context = null;
  },

  update: function() {
    this._xReset();
    this._yReset();
  },

  render: function() {
    // if(_.isNull(this.context)) {
    //   console.log("Error this.context is not defined");
    //   return;
    // }

    var posX = this.x + Math.cos(this.rotation * Math.PI / 180) * this.radius * 0.5;
    var posY = this.y + Math.sin(this.rotation * Math.PI / 180) * this.radius * 0.5;

    this.context.fillStyle = 'rgba(' + this.color.r +','+ this.color.g +','+ this.color.b +',' + this.alpha + ')';
    this.context.beginPath();
    this.context.arc(posX, posY, this.radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fill();
  },

  startAnimation: function() {
    this._xSnow();
    this._ySnow();
  },

  blink: function() {
    if(this.valpha === 1) {
      TweenLite.to(this, Math.random()*0.4+0.2, {
        valpha: this.myalpha,
        onCompleteParams:[this],
        onComplete: this.blink,
        ease: Quad.easeInOut,
        overwrite:false
      });
    }else {
      TweenLite.to(this, Math.random()*0.4+0.2, {
        valpha: 1,
        onComplete: this.blink,
        onCompleteParams:[this],
        ease: Quad.easeInOut,
        overwrite:false,
        delay: Math.random() * 100
      });
    }
  },

  // event handlers

  _onResize: function() {
    this.bounds = {
      width: $(window).width(),
      height: $(window).height()
    };
  },

  // private

  _xReset: function(m) {
    var margin = 20;
    if (this.x > this.bounds.width + margin) {
      this.x = -1 * margin;
    } else  if (this.x < (-1 * margin)) {
      this.x = this.bounds.width + margin;
    }
  },

  _yReset: function(m) {
    var margin = 20;
    if (this.y > this.bounds.height + margin) {
      this.y = -1 * margin;
    } else if (this.y < (-1 * margin)) {
      this.y = this.bounds.height - margin;
    }
  },

  _updateAlpha: function() {
    var alpha;
    if(this.scale < 2) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin);
    } else if(this.scale > 2 && this.scale < 4) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin) * 0.6;
    } else if(this.scale > 4) {
      alpha = (Math.random() * (this.alphaMax - this.alphaMin) + this.alphaMin) * 0.4;
    }
    return alpha;
  },
/*
  _xSnow: function() {
    console.log(this);
    var self = this;
    //Math.random()*6+6
    TweenLite.to(this, 1, {
      //alpha: $.proxy(this._updateAlpha, this),
      //x: this.x + (Math.random() * 40 - 20 + this.wind.force) * this.scale * 5,
      onComplete: $.proxy(this._xSnow, this),
      //rotation: Math.random() * 900 * this.turbulence,
      ease: Linear.easeInOut,
      overwrite:true
    });
  },
  ,
  */

  _xSnow: function() {
    TweenLite.to(this, Math.random()*6+6, {
      alpha: $.proxy(this._updateAlpha, this),
      x: this.x + (Math.random() * 40 - 20 + this.wind.force) * this.scale * 5,
      rotation: Math.random() * 900 * this.turbulence,
      onComplete: $.proxy(this._xSnow, this),
      ease: Linear.easeInOut,
      overwrite:false
    });
  },

  _ySnow: function() {
    TweenLite.to(this, Math.random()*6+6, {
      y: this.y + (Math.random() * (this.gravity * 0.5) + (this.gravity * 0.5)) * this.scale * 10,

      onComplete: $.proxy(this._ySnow, this),
      ease: Linear.easeInOut,
      overwrite:false
    });
  }

};