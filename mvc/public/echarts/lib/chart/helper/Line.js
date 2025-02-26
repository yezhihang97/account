
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

var vector = require("zrender/lib/core/vector");

var symbolUtil = require("../../util/symbol");

var LinePath_1 = require("./LinePath");

var graphic = require("../../util/graphic");

var states_1 = require("../../util/states");

var labelStyle_1 = require("../../label/labelStyle");

var number_1 = require("../../util/number");

var SYMBOL_CATEGORIES = ['fromSymbol', 'toSymbol'];

function makeSymbolTypeKey(symbolCategory) {
  return '_' + symbolCategory + 'Type';
}

function createSymbol(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);

  if (!symbolType || symbolType === 'none') {
    return;
  }

  var symbolSize = lineData.getItemVisual(idx, name + 'Size');
  var symbolRotate = lineData.getItemVisual(idx, name + 'Rotate');
  var symbolSizeArr = zrUtil.isArray(symbolSize) ? symbolSize : [symbolSize, symbolSize];
  var symbolPath = symbolUtil.createSymbol(symbolType, -symbolSizeArr[0] / 2, -symbolSizeArr[1] / 2, symbolSizeArr[0], symbolSizeArr[1]);
  symbolPath.__specifiedRotation = symbolRotate == null || isNaN(symbolRotate) ? void 0 : +symbolRotate * Math.PI / 180 || 0;
  symbolPath.name = name;
  return symbolPath;
}

function createLine(points) {
  var line = new LinePath_1["default"]({
    name: 'line',
    subPixelOptimize: true
  });
  setLinePoints(line.shape, points);
  return line;
}

function setLinePoints(targetShape, points) {
  targetShape.x1 = points[0][0];
  targetShape.y1 = points[0][1];
  targetShape.x2 = points[1][0];
  targetShape.y2 = points[1][1];
  targetShape.percent = 1;
  var cp1 = points[2];

  if (cp1) {
    targetShape.cpx1 = cp1[0];
    targetShape.cpy1 = cp1[1];
  } else {
    targetShape.cpx1 = NaN;
    targetShape.cpy1 = NaN;
  }
}

var Line = function (_super) {
  tslib_1.__extends(Line, _super);

  function Line(lineData, idx, seriesScope) {
    var _this = _super.call(this) || this;

    _this._createLine(lineData, idx, seriesScope);

    return _this;
  }

  Line.prototype._createLine = function (lineData, idx, seriesScope) {
    var seriesModel = lineData.hostModel;
    var linePoints = lineData.getItemLayout(idx);
    var line = createLine(linePoints);
    line.shape.percent = 0;
    graphic.initProps(line, {
      shape: {
        percent: 1
      }
    }, seriesModel, idx);
    this.add(line);
    zrUtil.each(SYMBOL_CATEGORIES, function (symbolCategory) {
      var symbol = createSymbol(symbolCategory, lineData, idx);
      this.add(symbol);
      this[makeSymbolTypeKey(symbolCategory)] = lineData.getItemVisual(idx, symbolCategory);
    }, this);

    this._updateCommonStl(lineData, idx, seriesScope);
  };

  Line.prototype.updateData = function (lineData, idx, seriesScope) {
    var seriesModel = lineData.hostModel;
    var line = this.childOfName('line');
    var linePoints = lineData.getItemLayout(idx);
    var target = {
      shape: {}
    };
    setLinePoints(target.shape, linePoints);
    graphic.updateProps(line, target, seriesModel, idx);
    zrUtil.each(SYMBOL_CATEGORIES, function (symbolCategory) {
      var symbolType = lineData.getItemVisual(idx, symbolCategory);
      var key = makeSymbolTypeKey(symbolCategory);

      if (this[key] !== symbolType) {
        this.remove(this.childOfName(symbolCategory));
        var symbol = createSymbol(symbolCategory, lineData, idx);
        this.add(symbol);
      }

      this[key] = symbolType;
    }, this);

    this._updateCommonStl(lineData, idx, seriesScope);
  };

  ;

  Line.prototype.getLinePath = function () {
    return this.childAt(0);
  };

  Line.prototype._updateCommonStl = function (lineData, idx, seriesScope) {
    var seriesModel = lineData.hostModel;
    var line = this.childOfName('line');
    var emphasisLineStyle = seriesScope && seriesScope.emphasisLineStyle;
    var blurLineStyle = seriesScope && seriesScope.blurLineStyle;
    var selectLineStyle = seriesScope && seriesScope.selectLineStyle;
    var labelStatesModels = seriesScope && seriesScope.labelStatesModels;

    if (!seriesScope || lineData.hasItemOption) {
      var itemModel = lineData.getItemModel(idx);
      emphasisLineStyle = itemModel.getModel(['emphasis', 'lineStyle']).getLineStyle();
      blurLineStyle = itemModel.getModel(['blur', 'lineStyle']).getLineStyle();
      selectLineStyle = itemModel.getModel(['select', 'lineStyle']).getLineStyle();
      labelStatesModels = labelStyle_1.getLabelStatesModels(itemModel);
    }

    var lineStyle = lineData.getItemVisual(idx, 'style');
    var visualColor = lineStyle.stroke;
    line.useStyle(lineStyle);
    line.style.fill = null;
    line.style.strokeNoScale = true;
    line.ensureState('emphasis').style = emphasisLineStyle;
    line.ensureState('blur').style = blurLineStyle;
    line.ensureState('select').style = selectLineStyle;
    zrUtil.each(SYMBOL_CATEGORIES, function (symbolCategory) {
      var symbol = this.childOfName(symbolCategory);

      if (symbol) {
        symbol.setColor(visualColor);
        symbol.style.opacity = lineStyle.opacity;

        for (var i = 0; i < states_1.SPECIAL_STATES.length; i++) {
          var stateName = states_1.SPECIAL_STATES[i];
          var lineState = line.getState(stateName);

          if (lineState) {
            var lineStateStyle = lineState.style || {};
            var state = symbol.ensureState(stateName);
            var stateStyle = state.style || (state.style = {});

            if (lineStateStyle.stroke != null) {
              stateStyle[symbol.__isEmptyBrush ? 'stroke' : 'fill'] = lineStateStyle.stroke;
            }

            if (lineStateStyle.opacity != null) {
              stateStyle.opacity = lineStateStyle.opacity;
            }
          }
        }

        symbol.markRedraw();
      }
    }, this);
    var rawVal = seriesModel.getRawValue(idx);
    labelStyle_1.setLabelStyle(this, labelStatesModels, {
      labelDataIndex: idx,
      labelFetcher: {
        getFormattedLabel: function (dataIndex, stateName) {
          return seriesModel.getFormattedLabel(dataIndex, stateName, lineData.dataType);
        }
      },
      inheritColor: visualColor || '#000',
      defaultOpacity: lineStyle.opacity,
      defaultText: (rawVal == null ? lineData.getName(idx) : isFinite(rawVal) ? number_1.round(rawVal) : rawVal) + ''
    });
    var label = this.getTextContent();

    if (label) {
      var labelNormalModel = labelStatesModels.normal;
      label.__align = label.style.align;
      label.__verticalAlign = label.style.verticalAlign;
      label.__position = labelNormalModel.get('position') || 'middle';
      var distance = labelNormalModel.get('distance');

      if (!zrUtil.isArray(distance)) {
        distance = [distance, distance];
      }

      label.__labelDistance = distance;
    }

    this.setTextConfig({
      position: null,
      local: true,
      inside: false
    });
    states_1.enableHoverEmphasis(this);
  };

  Line.prototype.highlight = function () {
    states_1.enterEmphasis(this);
  };

  Line.prototype.downplay = function () {
    states_1.leaveEmphasis(this);
  };

  Line.prototype.updateLayout = function (lineData, idx) {
    this.setLinePoints(lineData.getItemLayout(idx));
  };

  Line.prototype.setLinePoints = function (points) {
    var linePath = this.childOfName('line');
    setLinePoints(linePath.shape, points);
    linePath.dirty();
  };

  Line.prototype.beforeUpdate = function () {
    var lineGroup = this;
    var symbolFrom = lineGroup.childOfName('fromSymbol');
    var symbolTo = lineGroup.childOfName('toSymbol');
    var label = lineGroup.getTextContent();

    if (!symbolFrom && !symbolTo && (!label || label.ignore)) {
      return;
    }

    var invScale = 1;
    var parentNode = this.parent;

    while (parentNode) {
      if (parentNode.scaleX) {
        invScale /= parentNode.scaleX;
      }

      parentNode = parentNode.parent;
    }

    var line = lineGroup.childOfName('line');

    if (!this.__dirty && !line.__dirty) {
      return;
    }

    var percent = line.shape.percent;
    var fromPos = line.pointAt(0);
    var toPos = line.pointAt(percent);
    var d = vector.sub([], toPos, fromPos);
    vector.normalize(d, d);

    function setSymbolRotation(symbol, percent) {
      var specifiedRotation = symbol.__specifiedRotation;

      if (specifiedRotation == null) {
        var tangent = line.tangentAt(percent);
        symbol.attr('rotation', (percent === 1 ? -1 : 1) * Math.PI / 2 - Math.atan2(tangent[1], tangent[0]));
      } else {
        symbol.attr('rotation', specifiedRotation);
      }
    }

    if (symbolFrom) {
      symbolFrom.setPosition(fromPos);
      setSymbolRotation(symbolFrom, 0);
      symbolFrom.scaleX = symbolFrom.scaleY = invScale * percent;
      symbolFrom.markRedraw();
    }

    if (symbolTo) {
      symbolTo.setPosition(toPos);
      setSymbolRotation(symbolTo, 1);
      symbolTo.scaleX = symbolTo.scaleY = invScale * percent;
      symbolTo.markRedraw();
    }

    if (label && !label.ignore) {
      label.x = label.y = 0;
      label.originX = label.originY = 0;
      var textAlign = void 0;
      var textVerticalAlign = void 0;
      var distance = label.__labelDistance;
      var distanceX = distance[0] * invScale;
      var distanceY = distance[1] * invScale;
      var halfPercent = percent / 2;
      var tangent = line.tangentAt(halfPercent);
      var n = [tangent[1], -tangent[0]];
      var cp = line.pointAt(halfPercent);

      if (n[1] > 0) {
        n[0] = -n[0];
        n[1] = -n[1];
      }

      var dir = tangent[0] < 0 ? -1 : 1;

      if (label.__position !== 'start' && label.__position !== 'end') {
        var rotation = -Math.atan2(tangent[1], tangent[0]);

        if (toPos[0] < fromPos[0]) {
          rotation = Math.PI + rotation;
        }

        label.rotation = rotation;
      }

      var dy = void 0;

      switch (label.__position) {
        case 'insideStartTop':
        case 'insideMiddleTop':
        case 'insideEndTop':
        case 'middle':
          dy = -distanceY;
          textVerticalAlign = 'bottom';
          break;

        case 'insideStartBottom':
        case 'insideMiddleBottom':
        case 'insideEndBottom':
          dy = distanceY;
          textVerticalAlign = 'top';
          break;

        default:
          dy = 0;
          textVerticalAlign = 'middle';
      }

      switch (label.__position) {
        case 'end':
          label.x = d[0] * distanceX + toPos[0];
          label.y = d[1] * distanceY + toPos[1];
          textAlign = d[0] > 0.8 ? 'left' : d[0] < -0.8 ? 'right' : 'center';
          textVerticalAlign = d[1] > 0.8 ? 'top' : d[1] < -0.8 ? 'bottom' : 'middle';
          break;

        case 'start':
          label.x = -d[0] * distanceX + fromPos[0];
          label.y = -d[1] * distanceY + fromPos[1];
          textAlign = d[0] > 0.8 ? 'right' : d[0] < -0.8 ? 'left' : 'center';
          textVerticalAlign = d[1] > 0.8 ? 'bottom' : d[1] < -0.8 ? 'top' : 'middle';
          break;

        case 'insideStartTop':
        case 'insideStart':
        case 'insideStartBottom':
          label.x = distanceX * dir + fromPos[0];
          label.y = fromPos[1] + dy;
          textAlign = tangent[0] < 0 ? 'right' : 'left';
          label.originX = -distanceX * dir;
          label.originY = -dy;
          break;

        case 'insideMiddleTop':
        case 'insideMiddle':
        case 'insideMiddleBottom':
        case 'middle':
          label.x = cp[0];
          label.y = cp[1] + dy;
          textAlign = 'center';
          label.originY = -dy;
          break;

        case 'insideEndTop':
        case 'insideEnd':
        case 'insideEndBottom':
          label.x = -distanceX * dir + toPos[0];
          label.y = toPos[1] + dy;
          textAlign = tangent[0] >= 0 ? 'right' : 'left';
          label.originX = distanceX * dir;
          label.originY = -dy;
          break;
      }

      label.scaleX = label.scaleY = invScale;
      label.setStyle({
        verticalAlign: label.__verticalAlign || textVerticalAlign,
        align: label.__align || textAlign
      });
    }
  };

  return Line;
}(graphic.Group);

exports["default"] = Line;