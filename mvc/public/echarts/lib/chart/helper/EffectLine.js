
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

var tslib_1 = require("tslib");

var graphic = require("../../util/graphic");

var Line_1 = require("./Line");

var zrUtil = require("zrender/lib/core/util");

var symbol_1 = require("../../util/symbol");

var vec2 = require("zrender/lib/core/vector");

var curveUtil = require("zrender/lib/core/curve");

var EffectLine = function (_super) {
  tslib_1.__extends(EffectLine, _super);

  function EffectLine(lineData, idx, seriesScope) {
    var _this = _super.call(this) || this;

    _this.add(_this.createLine(lineData, idx, seriesScope));

    _this._updateEffectSymbol(lineData, idx);

    return _this;
  }

  EffectLine.prototype.createLine = function (lineData, idx, seriesScope) {
    return new Line_1["default"](lineData, idx, seriesScope);
  };

  EffectLine.prototype._updateEffectSymbol = function (lineData, idx) {
    var itemModel = lineData.getItemModel(idx);
    var effectModel = itemModel.getModel('effect');
    var size = effectModel.get('symbolSize');
    var symbolType = effectModel.get('symbol');

    if (!zrUtil.isArray(size)) {
      size = [size, size];
    }

    var lineStyle = lineData.getItemVisual(idx, 'style');
    var color = effectModel.get('color') || lineStyle && lineStyle.stroke;
    var symbol = this.childAt(1);

    if (this._symbolType !== symbolType) {
      this.remove(symbol);
      symbol = symbol_1.createSymbol(symbolType, -0.5, -0.5, 1, 1, color);
      symbol.z2 = 100;
      symbol.culling = true;
      this.add(symbol);
    }

    if (!symbol) {
      return;
    }

    symbol.setStyle('shadowColor', color);
    symbol.setStyle(effectModel.getItemStyle(['color']));
    symbol.scaleX = size[0];
    symbol.scaleY = size[1];
    symbol.setColor(color);
    this._symbolType = symbolType;
    this._symbolScale = size;

    this._updateEffectAnimation(lineData, effectModel, idx);
  };

  EffectLine.prototype._updateEffectAnimation = function (lineData, effectModel, idx) {
    var symbol = this.childAt(1);

    if (!symbol) {
      return;
    }

    var self = this;
    var points = lineData.getItemLayout(idx);
    var period = effectModel.get('period') * 1000;
    var loop = effectModel.get('loop');
    var constantSpeed = effectModel.get('constantSpeed');
    var delayExpr = zrUtil.retrieve(effectModel.get('delay'), function (idx) {
      return idx / lineData.count() * period / 3;
    });
    symbol.ignore = true;

    this._updateAnimationPoints(symbol, points);

    if (constantSpeed > 0) {
      period = this._getLineLength(symbol) / constantSpeed * 1000;
    }

    if (period !== this._period || loop !== this._loop) {
      symbol.stopAnimation();

      if (period > 0) {
        var delayNum = void 0;

        if (typeof delayExpr === 'function') {
          delayNum = delayExpr(idx);
        } else {
          delayNum = delayExpr;
        }

        if (symbol.__t > 0) {
          delayNum = -period * symbol.__t;
        }

        symbol.__t = 0;
        var animator = symbol.animate('', loop).when(period, {
          __t: 1
        }).delay(delayNum).during(function () {
          self._updateSymbolPosition(symbol);
        });

        if (!loop) {
          animator.done(function () {
            self.remove(symbol);
          });
        }

        animator.start();
      }
    }

    this._period = period;
    this._loop = loop;
  };

  EffectLine.prototype._getLineLength = function (symbol) {
    return vec2.dist(symbol.__p1, symbol.__cp1) + vec2.dist(symbol.__cp1, symbol.__p2);
  };

  EffectLine.prototype._updateAnimationPoints = function (symbol, points) {
    symbol.__p1 = points[0];
    symbol.__p2 = points[1];
    symbol.__cp1 = points[2] || [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
  };

  EffectLine.prototype.updateData = function (lineData, idx, seriesScope) {
    this.childAt(0).updateData(lineData, idx, seriesScope);

    this._updateEffectSymbol(lineData, idx);
  };

  EffectLine.prototype._updateSymbolPosition = function (symbol) {
    var p1 = symbol.__p1;
    var p2 = symbol.__p2;
    var cp1 = symbol.__cp1;
    var t = symbol.__t;
    var pos = [symbol.x, symbol.y];
    var lastPos = pos.slice();
    var quadraticAt = curveUtil.quadraticAt;
    var quadraticDerivativeAt = curveUtil.quadraticDerivativeAt;
    pos[0] = quadraticAt(p1[0], cp1[0], p2[0], t);
    pos[1] = quadraticAt(p1[1], cp1[1], p2[1], t);
    var tx = quadraticDerivativeAt(p1[0], cp1[0], p2[0], t);
    var ty = quadraticDerivativeAt(p1[1], cp1[1], p2[1], t);
    symbol.rotation = -Math.atan2(ty, tx) - Math.PI / 2;

    if (this._symbolType === 'line' || this._symbolType === 'rect' || this._symbolType === 'roundRect') {
      if (symbol.__lastT !== undefined && symbol.__lastT < symbol.__t) {
        symbol.scaleY = vec2.dist(lastPos, pos) * 1.05;

        if (t === 1) {
          pos[0] = lastPos[0] + (pos[0] - lastPos[0]) / 2;
          pos[1] = lastPos[1] + (pos[1] - lastPos[1]) / 2;
        }
      } else if (symbol.__lastT === 1) {
        symbol.scaleY = 2 * vec2.dist(p1, pos);
      } else {
        symbol.scaleY = this._symbolScale[1];
      }
    }

    symbol.__lastT = symbol.__t;
    symbol.ignore = false;
    symbol.x = pos[0];
    symbol.y = pos[1];
  };

  EffectLine.prototype.updateLayout = function (lineData, idx) {
    this.childAt(0).updateLayout(lineData, idx);
    var effectModel = lineData.getItemModel(idx).getModel('effect');

    this._updateEffectAnimation(lineData, effectModel, idx);
  };

  return EffectLine;
}(graphic.Group);

exports["default"] = EffectLine;