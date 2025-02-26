
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

var graphic = require("../../util/graphic");

var AxisBuilder_1 = require("./AxisBuilder");

var AxisView_1 = require("./AxisView");

var cartesianAxisHelper = require("../../coord/cartesian/cartesianAxisHelper");

var axisSplitHelper_1 = require("./axisSplitHelper");

var Component_1 = require("../../view/Component");

var axisBuilderAttrs = ['axisLine', 'axisTickLabel', 'axisName'];
var selfBuilderAttrs = ['splitArea', 'splitLine', 'minorSplitLine'];

var CartesianAxisView = function (_super) {
  tslib_1.__extends(CartesianAxisView, _super);

  function CartesianAxisView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = CartesianAxisView.type;
    _this.axisPointerClass = 'CartesianAxisPointer';
    return _this;
  }

  CartesianAxisView.prototype.render = function (axisModel, ecModel, api, payload) {
    this.group.removeAll();
    var oldAxisGroup = this._axisGroup;
    this._axisGroup = new graphic.Group();
    this.group.add(this._axisGroup);

    if (!axisModel.get('show')) {
      return;
    }

    var gridModel = axisModel.getCoordSysModel();
    var layout = cartesianAxisHelper.layout(gridModel, axisModel);
    var axisBuilder = new AxisBuilder_1["default"](axisModel, zrUtil.extend({
      handleAutoShown: function (elementType) {
        var cartesians = gridModel.coordinateSystem.getCartesians();

        for (var i = 0; i < cartesians.length; i++) {
          var otherAxisType = cartesians[i].getOtherAxis(axisModel.axis).type;

          if (otherAxisType === 'value' || otherAxisType === 'log') {
            return true;
          }
        }

        return false;
      }
    }, layout));
    zrUtil.each(axisBuilderAttrs, axisBuilder.add, axisBuilder);

    this._axisGroup.add(axisBuilder.getGroup());

    zrUtil.each(selfBuilderAttrs, function (name) {
      if (axisModel.get([name, 'show'])) {
        axisElementBuilders[name](this, this._axisGroup, axisModel, gridModel);
      }
    }, this);
    graphic.groupTransition(oldAxisGroup, this._axisGroup, axisModel);

    _super.prototype.render.call(this, axisModel, ecModel, api, payload);
  };

  CartesianAxisView.prototype.remove = function () {
    axisSplitHelper_1.rectCoordAxisHandleRemove(this);
  };

  CartesianAxisView.type = 'cartesianAxis';
  return CartesianAxisView;
}(AxisView_1["default"]);

var axisElementBuilders = {
  splitLine: function (axisView, axisGroup, axisModel, gridModel) {
    var axis = axisModel.axis;

    if (axis.scale.isBlank()) {
      return;
    }

    var splitLineModel = axisModel.getModel('splitLine');
    var lineStyleModel = splitLineModel.getModel('lineStyle');
    var lineColors = lineStyleModel.get('color');
    lineColors = zrUtil.isArray(lineColors) ? lineColors : [lineColors];
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var lineCount = 0;
    var ticksCoords = axis.getTicksCoords({
      tickModel: splitLineModel
    });
    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();

    for (var i = 0; i < ticksCoords.length; i++) {
      var tickCoord = axis.toGlobalCoord(ticksCoords[i].coord);

      if (isHorizontal) {
        p1[0] = tickCoord;
        p1[1] = gridRect.y;
        p2[0] = tickCoord;
        p2[1] = gridRect.y + gridRect.height;
      } else {
        p1[0] = gridRect.x;
        p1[1] = tickCoord;
        p2[0] = gridRect.x + gridRect.width;
        p2[1] = tickCoord;
      }

      var colorIndex = lineCount++ % lineColors.length;
      var tickValue = ticksCoords[i].tickValue;
      axisGroup.add(new graphic.Line({
        anid: tickValue != null ? 'line_' + ticksCoords[i].tickValue : null,
        subPixelOptimize: true,
        autoBatch: true,
        shape: {
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1]
        },
        style: zrUtil.defaults({
          stroke: lineColors[colorIndex]
        }, lineStyle),
        silent: true
      }));
    }
  },
  minorSplitLine: function (axisView, axisGroup, axisModel, gridModel) {
    var axis = axisModel.axis;
    var minorSplitLineModel = axisModel.getModel('minorSplitLine');
    var lineStyleModel = minorSplitLineModel.getModel('lineStyle');
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var minorTicksCoords = axis.getMinorTicksCoords();

    if (!minorTicksCoords.length) {
      return;
    }

    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();

    for (var i = 0; i < minorTicksCoords.length; i++) {
      for (var k = 0; k < minorTicksCoords[i].length; k++) {
        var tickCoord = axis.toGlobalCoord(minorTicksCoords[i][k].coord);

        if (isHorizontal) {
          p1[0] = tickCoord;
          p1[1] = gridRect.y;
          p2[0] = tickCoord;
          p2[1] = gridRect.y + gridRect.height;
        } else {
          p1[0] = gridRect.x;
          p1[1] = tickCoord;
          p2[0] = gridRect.x + gridRect.width;
          p2[1] = tickCoord;
        }

        axisGroup.add(new graphic.Line({
          anid: 'minor_line_' + minorTicksCoords[i][k].tickValue,
          subPixelOptimize: true,
          autoBatch: true,
          shape: {
            x1: p1[0],
            y1: p1[1],
            x2: p2[0],
            y2: p2[1]
          },
          style: lineStyle,
          silent: true
        }));
      }
    }
  },
  splitArea: function (axisView, axisGroup, axisModel, gridModel) {
    axisSplitHelper_1.rectCoordAxisBuildSplitArea(axisView, axisGroup, axisModel, gridModel);
  }
};

var CartesianXAxisView = function (_super) {
  tslib_1.__extends(CartesianXAxisView, _super);

  function CartesianXAxisView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = CartesianXAxisView.type;
    return _this;
  }

  CartesianXAxisView.type = 'xAxis';
  return CartesianXAxisView;
}(CartesianAxisView);

var CartesianYAxisView = function (_super) {
  tslib_1.__extends(CartesianYAxisView, _super);

  function CartesianYAxisView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = CartesianXAxisView.type;
    return _this;
  }

  CartesianYAxisView.type = 'yAxis';
  return CartesianYAxisView;
}(CartesianAxisView);

Component_1["default"].registerClass(CartesianXAxisView);
Component_1["default"].registerClass(CartesianYAxisView);
exports["default"] = CartesianAxisView;