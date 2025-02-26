
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

var util_1 = require("zrender/lib/core/util");

var number_1 = require("../util/number");

var axisTickLabelBuilder_1 = require("./axisTickLabelBuilder");

var NORMALIZED_EXTENT = [0, 1];

var Axis = function () {
  function Axis(dim, scale, extent) {
    this.onBand = false;
    this.inverse = false;
    this.dim = dim;
    this.scale = scale;
    this._extent = extent || [0, 0];
  }

  Axis.prototype.contain = function (coord) {
    var extent = this._extent;
    var min = Math.min(extent[0], extent[1]);
    var max = Math.max(extent[0], extent[1]);
    return coord >= min && coord <= max;
  };

  Axis.prototype.containData = function (data) {
    return this.scale.contain(data);
  };

  Axis.prototype.getExtent = function () {
    return this._extent.slice();
  };

  Axis.prototype.getPixelPrecision = function (dataExtent) {
    return number_1.getPixelPrecision(dataExtent || this.scale.getExtent(), this._extent);
  };

  Axis.prototype.setExtent = function (start, end) {
    var extent = this._extent;
    extent[0] = start;
    extent[1] = end;
  };

  Axis.prototype.dataToCoord = function (data, clamp) {
    var extent = this._extent;
    var scale = this.scale;
    data = scale.normalize(data);

    if (this.onBand && scale.type === 'ordinal') {
      extent = extent.slice();
      fixExtentWithBands(extent, scale.count());
    }

    return number_1.linearMap(data, NORMALIZED_EXTENT, extent, clamp);
  };

  Axis.prototype.coordToData = function (coord, clamp) {
    var extent = this._extent;
    var scale = this.scale;

    if (this.onBand && scale.type === 'ordinal') {
      extent = extent.slice();
      fixExtentWithBands(extent, scale.count());
    }

    var t = number_1.linearMap(coord, extent, NORMALIZED_EXTENT, clamp);
    return this.scale.scale(t);
  };

  Axis.prototype.pointToData = function (point, clamp) {
    return;
  };

  Axis.prototype.getTicksCoords = function (opt) {
    opt = opt || {};
    var tickModel = opt.tickModel || this.getTickModel();
    var result = axisTickLabelBuilder_1.createAxisTicks(this, tickModel);
    var ticks = result.ticks;
    var ticksCoords = util_1.map(ticks, function (tickVal) {
      return {
        coord: this.dataToCoord(this.scale.type === 'ordinal' ? this.scale.getRawIndex(tickVal) : tickVal),
        tickValue: tickVal
      };
    }, this);
    var alignWithLabel = tickModel.get('alignWithLabel');
    fixOnBandTicksCoords(this, ticksCoords, alignWithLabel, opt.clamp);
    return ticksCoords;
  };

  Axis.prototype.getMinorTicksCoords = function () {
    if (this.scale.type === 'ordinal') {
      return [];
    }

    var minorTickModel = this.model.getModel('minorTick');
    var splitNumber = minorTickModel.get('splitNumber');

    if (!(splitNumber > 0 && splitNumber < 100)) {
      splitNumber = 5;
    }

    var minorTicks = this.scale.getMinorTicks(splitNumber);
    var minorTicksCoords = util_1.map(minorTicks, function (minorTicksGroup) {
      return util_1.map(minorTicksGroup, function (minorTick) {
        return {
          coord: this.dataToCoord(minorTick),
          tickValue: minorTick
        };
      }, this);
    }, this);
    return minorTicksCoords;
  };

  Axis.prototype.getViewLabels = function () {
    return axisTickLabelBuilder_1.createAxisLabels(this).labels;
  };

  Axis.prototype.getLabelModel = function () {
    return this.model.getModel('axisLabel');
  };

  Axis.prototype.getTickModel = function () {
    return this.model.getModel('axisTick');
  };

  Axis.prototype.getBandWidth = function () {
    var axisExtent = this._extent;
    var dataExtent = this.scale.getExtent();
    var len = dataExtent[1] - dataExtent[0] + (this.onBand ? 1 : 0);
    len === 0 && (len = 1);
    var size = Math.abs(axisExtent[1] - axisExtent[0]);
    return Math.abs(size) / len;
  };

  Axis.prototype.calculateCategoryInterval = function () {
    return axisTickLabelBuilder_1.calculateCategoryInterval(this);
  };

  return Axis;
}();

function fixExtentWithBands(extent, nTick) {
  var size = extent[1] - extent[0];
  var len = nTick;
  var margin = size / len / 2;
  extent[0] += margin;
  extent[1] -= margin;
}

function fixOnBandTicksCoords(axis, ticksCoords, alignWithLabel, clamp) {
  var ticksLen = ticksCoords.length;

  if (!axis.onBand || alignWithLabel || !ticksLen) {
    return;
  }

  var axisExtent = axis.getExtent();
  var last;
  var diffSize;

  if (ticksLen === 1) {
    ticksCoords[0].coord = axisExtent[0];
    last = ticksCoords[1] = {
      coord: axisExtent[0]
    };
  } else {
    var crossLen = ticksCoords[ticksLen - 1].tickValue - ticksCoords[0].tickValue;
    var shift_1 = (ticksCoords[ticksLen - 1].coord - ticksCoords[0].coord) / crossLen;
    util_1.each(ticksCoords, function (ticksItem) {
      ticksItem.coord -= shift_1 / 2;
    });
    var dataExtent = axis.scale.getExtent();
    diffSize = 1 + dataExtent[1] - ticksCoords[ticksLen - 1].tickValue;
    last = {
      coord: ticksCoords[ticksLen - 1].coord + shift_1 * diffSize
    };
    ticksCoords.push(last);
  }

  var inverse = axisExtent[0] > axisExtent[1];

  if (littleThan(ticksCoords[0].coord, axisExtent[0])) {
    clamp ? ticksCoords[0].coord = axisExtent[0] : ticksCoords.shift();
  }

  if (clamp && littleThan(axisExtent[0], ticksCoords[0].coord)) {
    ticksCoords.unshift({
      coord: axisExtent[0]
    });
  }

  if (littleThan(axisExtent[1], last.coord)) {
    clamp ? last.coord = axisExtent[1] : ticksCoords.pop();
  }

  if (clamp && littleThan(last.coord, axisExtent[1])) {
    ticksCoords.push({
      coord: axisExtent[1]
    });
  }

  function littleThan(a, b) {
    a = number_1.round(a);
    b = number_1.round(b);
    return inverse ? a > b : a < b;
  }
}

exports["default"] = Axis;