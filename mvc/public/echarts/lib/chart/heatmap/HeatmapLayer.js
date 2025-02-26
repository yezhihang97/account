
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/



/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

"use strict";

exports.__esModule = true;

var zrUtil = require("zrender/lib/core/util");

var GRADIENT_LEVELS = 256;

var HeatmapLayer = function () {
  function HeatmapLayer() {
    this.blurSize = 30;
    this.pointSize = 20;
    this.maxOpacity = 1;
    this.minOpacity = 0;
    this._gradientPixels = {
      inRange: null,
      outOfRange: null
    };
    var canvas = zrUtil.createCanvas();
    this.canvas = canvas;
  }

  HeatmapLayer.prototype.update = function (data, width, height, normalize, colorFunc, isInRange) {
    var brush = this._getBrush();

    var gradientInRange = this._getGradient(colorFunc, 'inRange');

    var gradientOutOfRange = this._getGradient(colorFunc, 'outOfRange');

    var r = this.pointSize + this.blurSize;
    var canvas = this.canvas;
    var ctx = canvas.getContext('2d');
    var len = data.length;
    canvas.width = width;
    canvas.height = height;

    for (var i = 0; i < len; ++i) {
      var p = data[i];
      var x = p[0];
      var y = p[1];
      var value = p[2];
      var alpha = normalize(value);
      ctx.globalAlpha = alpha;
      ctx.drawImage(brush, x - r, y - r);
    }

    if (!canvas.width || !canvas.height) {
      return canvas;
    }

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    var offset = 0;
    var pixelLen = pixels.length;
    var minOpacity = this.minOpacity;
    var maxOpacity = this.maxOpacity;
    var diffOpacity = maxOpacity - minOpacity;

    while (offset < pixelLen) {
      var alpha = pixels[offset + 3] / 256;
      var gradientOffset = Math.floor(alpha * (GRADIENT_LEVELS - 1)) * 4;

      if (alpha > 0) {
        var gradient = isInRange(alpha) ? gradientInRange : gradientOutOfRange;
        alpha > 0 && (alpha = alpha * diffOpacity + minOpacity);
        pixels[offset++] = gradient[gradientOffset];
        pixels[offset++] = gradient[gradientOffset + 1];
        pixels[offset++] = gradient[gradientOffset + 2];
        pixels[offset++] = gradient[gradientOffset + 3] * alpha * 256;
      } else {
        offset += 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  HeatmapLayer.prototype._getBrush = function () {
    var brushCanvas = this._brushCanvas || (this._brushCanvas = zrUtil.createCanvas());
    var r = this.pointSize + this.blurSize;
    var d = r * 2;
    brushCanvas.width = d;
    brushCanvas.height = d;
    var ctx = brushCanvas.getContext('2d');
    ctx.clearRect(0, 0, d, d);
    ctx.shadowOffsetX = d;
    ctx.shadowBlur = this.blurSize;
    ctx.shadowColor = '#000';
    ctx.beginPath();
    ctx.arc(-r, r, this.pointSize, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    return brushCanvas;
  };

  HeatmapLayer.prototype._getGradient = function (colorFunc, state) {
    var gradientPixels = this._gradientPixels;
    var pixelsSingleState = gradientPixels[state] || (gradientPixels[state] = new Uint8ClampedArray(256 * 4));
    var color = [0, 0, 0, 0];
    var off = 0;

    for (var i = 0; i < 256; i++) {
      colorFunc[state](i / 255, true, color);
      pixelsSingleState[off++] = color[0];
      pixelsSingleState[off++] = color[1];
      pixelsSingleState[off++] = color[2];
      pixelsSingleState[off++] = color[3];
    }

    return pixelsSingleState;
  };

  return HeatmapLayer;
}();

exports["default"] = HeatmapLayer;