
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

var zrUtil = require("zrender/lib/core/util");

var symbol_1 = require("../../util/symbol");

var graphic_1 = require("../../util/graphic");

var states_1 = require("../../util/states");

var number_1 = require("../../util/number");

var Symbol_1 = require("./Symbol");

var EFFECT_RIPPLE_NUMBER = 3;

function normalizeSymbolSize(symbolSize) {
  if (!zrUtil.isArray(symbolSize)) {
    symbolSize = [+symbolSize, +symbolSize];
  }

  return symbolSize;
}

function updateRipplePath(rippleGroup, effectCfg) {
  var color = effectCfg.rippleEffectColor || effectCfg.color;
  rippleGroup.eachChild(function (ripplePath) {
    ripplePath.attr({
      z: effectCfg.z,
      zlevel: effectCfg.zlevel,
      style: {
        stroke: effectCfg.brushType === 'stroke' ? color : null,
        fill: effectCfg.brushType === 'fill' ? color : null
      }
    });
  });
}

var EffectSymbol = function (_super) {
  tslib_1.__extends(EffectSymbol, _super);

  function EffectSymbol(data, idx) {
    var _this = _super.call(this) || this;

    var symbol = new Symbol_1["default"](data, idx);
    var rippleGroup = new graphic_1.Group();

    _this.add(symbol);

    _this.add(rippleGroup);

    _this.updateData(data, idx);

    return _this;
  }

  EffectSymbol.prototype.stopEffectAnimation = function () {
    this.childAt(1).removeAll();
  };

  EffectSymbol.prototype.startEffectAnimation = function (effectCfg) {
    var symbolType = effectCfg.symbolType;
    var color = effectCfg.color;
    var rippleGroup = this.childAt(1);

    for (var i = 0; i < EFFECT_RIPPLE_NUMBER; i++) {
      var ripplePath = symbol_1.createSymbol(symbolType, -1, -1, 2, 2, color);
      ripplePath.attr({
        style: {
          strokeNoScale: true
        },
        z2: 99,
        silent: true,
        scaleX: 0.5,
        scaleY: 0.5
      });
      var delay = -i / EFFECT_RIPPLE_NUMBER * effectCfg.period + effectCfg.effectOffset;
      ripplePath.animate('', true).when(effectCfg.period, {
        scale: [effectCfg.rippleScale / 2, effectCfg.rippleScale / 2]
      }).delay(delay).start();
      ripplePath.animateStyle(true).when(effectCfg.period, {
        opacity: 0
      }).delay(delay).start();
      rippleGroup.add(ripplePath);
    }

    updateRipplePath(rippleGroup, effectCfg);
  };

  EffectSymbol.prototype.updateEffectAnimation = function (effectCfg) {
    var oldEffectCfg = this._effectCfg;
    var rippleGroup = this.childAt(1);
    var DIFFICULT_PROPS = ['symbolType', 'period', 'rippleScale'];

    for (var i = 0; i < DIFFICULT_PROPS.length; i++) {
      var propName = DIFFICULT_PROPS[i];

      if (oldEffectCfg[propName] !== effectCfg[propName]) {
        this.stopEffectAnimation();
        this.startEffectAnimation(effectCfg);
        return;
      }
    }

    updateRipplePath(rippleGroup, effectCfg);
  };

  EffectSymbol.prototype.highlight = function () {
    states_1.enterEmphasis(this);
  };

  EffectSymbol.prototype.downplay = function () {
    states_1.leaveEmphasis(this);
  };

  EffectSymbol.prototype.updateData = function (data, idx) {
    var _this = this;

    var seriesModel = data.hostModel;
    this.childAt(0).updateData(data, idx);
    var rippleGroup = this.childAt(1);
    var itemModel = data.getItemModel(idx);
    var symbolType = data.getItemVisual(idx, 'symbol');
    var symbolSize = normalizeSymbolSize(data.getItemVisual(idx, 'symbolSize'));
    var symbolStyle = data.getItemVisual(idx, 'style');
    var color = symbolStyle && symbolStyle.fill;
    rippleGroup.setScale(symbolSize);
    rippleGroup.traverse(function (ripplePath) {
      ripplePath.setStyle('fill', color);
    });
    var symbolOffset = itemModel.getShallow('symbolOffset');

    if (symbolOffset) {
      rippleGroup.x = number_1.parsePercent(symbolOffset[0], symbolSize[0]);
      rippleGroup.y = number_1.parsePercent(symbolOffset[1], symbolSize[1]);
    }

    var symbolRotate = data.getItemVisual(idx, 'symbolRotate');
    rippleGroup.rotation = (symbolRotate || 0) * Math.PI / 180 || 0;
    var effectCfg = {};
    effectCfg.showEffectOn = seriesModel.get('showEffectOn');
    effectCfg.rippleScale = itemModel.get(['rippleEffect', 'scale']);
    effectCfg.brushType = itemModel.get(['rippleEffect', 'brushType']);
    effectCfg.period = itemModel.get(['rippleEffect', 'period']) * 1000;
    effectCfg.effectOffset = idx / data.count();
    effectCfg.z = seriesModel.getShallow('z') || 0;
    effectCfg.zlevel = seriesModel.getShallow('zlevel') || 0;
    effectCfg.symbolType = symbolType;
    effectCfg.color = color;
    effectCfg.rippleEffectColor = itemModel.get(['rippleEffect', 'color']);
    this.off('mouseover').off('mouseout').off('emphasis').off('normal');

    if (effectCfg.showEffectOn === 'render') {
      this._effectCfg ? this.updateEffectAnimation(effectCfg) : this.startEffectAnimation(effectCfg);
      this._effectCfg = effectCfg;
    } else {
      this._effectCfg = null;
      this.stopEffectAnimation();

      this.onHoverStateChange = function (toState) {
        if (toState === 'emphasis') {
          if (effectCfg.showEffectOn !== 'render') {
            _this.startEffectAnimation(effectCfg);
          }
        } else if (toState === 'normal') {
          if (effectCfg.showEffectOn !== 'render') {
            _this.stopEffectAnimation();
          }
        }
      };
    }

    this._effectCfg = effectCfg;
    states_1.enableHoverEmphasis(this);
  };

  ;

  EffectSymbol.prototype.fadeOut = function (cb) {
    this.off('mouseover').off('mouseout');
    cb && cb();
  };

  ;
  return EffectSymbol;
}(graphic_1.Group);

zrUtil.inherits(EffectSymbol, graphic_1.Group);
exports["default"] = EffectSymbol;