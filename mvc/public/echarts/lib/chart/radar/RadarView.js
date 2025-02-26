
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

var states_1 = require("../../util/states");

var zrUtil = require("zrender/lib/core/util");

var symbolUtil = require("../../util/symbol");

var Chart_1 = require("../../view/Chart");

var labelStyle_1 = require("../../label/labelStyle");

var Image_1 = require("zrender/lib/graphic/Image");

function normalizeSymbolSize(symbolSize) {
  if (!zrUtil.isArray(symbolSize)) {
    symbolSize = [+symbolSize, +symbolSize];
  }

  return symbolSize;
}

var RadarView = function (_super) {
  tslib_1.__extends(RadarView, _super);

  function RadarView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = RadarView.type;
    return _this;
  }

  RadarView.prototype.render = function (seriesModel, ecModel, api) {
    var polar = seriesModel.coordinateSystem;
    var group = this.group;
    var data = seriesModel.getData();
    var oldData = this._data;

    function createSymbol(data, idx) {
      var symbolType = data.getItemVisual(idx, 'symbol') || 'circle';

      if (symbolType === 'none') {
        return;
      }

      var symbolSize = normalizeSymbolSize(data.getItemVisual(idx, 'symbolSize'));
      var symbolPath = symbolUtil.createSymbol(symbolType, -1, -1, 2, 2);
      var symbolRotate = data.getItemVisual(idx, 'symbolRotate') || 0;
      symbolPath.attr({
        style: {
          strokeNoScale: true
        },
        z2: 100,
        scaleX: symbolSize[0] / 2,
        scaleY: symbolSize[1] / 2,
        rotation: symbolRotate * Math.PI / 180 || 0
      });
      return symbolPath;
    }

    function updateSymbols(oldPoints, newPoints, symbolGroup, data, idx, isInit) {
      symbolGroup.removeAll();

      for (var i = 0; i < newPoints.length - 1; i++) {
        var symbolPath = createSymbol(data, idx);

        if (symbolPath) {
          symbolPath.__dimIdx = i;

          if (oldPoints[i]) {
            symbolPath.setPosition(oldPoints[i]);
            graphic[isInit ? 'initProps' : 'updateProps'](symbolPath, {
              x: newPoints[i][0],
              y: newPoints[i][1]
            }, seriesModel, idx);
          } else {
            symbolPath.setPosition(newPoints[i]);
          }

          symbolGroup.add(symbolPath);
        }
      }
    }

    function getInitialPoints(points) {
      return zrUtil.map(points, function (pt) {
        return [polar.cx, polar.cy];
      });
    }

    data.diff(oldData).add(function (idx) {
      var points = data.getItemLayout(idx);

      if (!points) {
        return;
      }

      var polygon = new graphic.Polygon();
      var polyline = new graphic.Polyline();
      var target = {
        shape: {
          points: points
        }
      };
      polygon.shape.points = getInitialPoints(points);
      polyline.shape.points = getInitialPoints(points);
      graphic.initProps(polygon, target, seriesModel, idx);
      graphic.initProps(polyline, target, seriesModel, idx);
      var itemGroup = new graphic.Group();
      var symbolGroup = new graphic.Group();
      itemGroup.add(polyline);
      itemGroup.add(polygon);
      itemGroup.add(symbolGroup);
      updateSymbols(polyline.shape.points, points, symbolGroup, data, idx, true);
      data.setItemGraphicEl(idx, itemGroup);
    }).update(function (newIdx, oldIdx) {
      var itemGroup = oldData.getItemGraphicEl(oldIdx);
      var polyline = itemGroup.childAt(0);
      var polygon = itemGroup.childAt(1);
      var symbolGroup = itemGroup.childAt(2);
      var target = {
        shape: {
          points: data.getItemLayout(newIdx)
        }
      };

      if (!target.shape.points) {
        return;
      }

      updateSymbols(polyline.shape.points, target.shape.points, symbolGroup, data, newIdx, false);
      graphic.updateProps(polyline, target, seriesModel);
      graphic.updateProps(polygon, target, seriesModel);
      data.setItemGraphicEl(newIdx, itemGroup);
    }).remove(function (idx) {
      group.remove(oldData.getItemGraphicEl(idx));
    }).execute();
    data.eachItemGraphicEl(function (itemGroup, idx) {
      var itemModel = data.getItemModel(idx);
      var polyline = itemGroup.childAt(0);
      var polygon = itemGroup.childAt(1);
      var symbolGroup = itemGroup.childAt(2);
      var itemStyle = data.getItemVisual(idx, 'style');
      var color = itemStyle.fill;
      group.add(itemGroup);
      polyline.useStyle(zrUtil.defaults(itemModel.getModel('lineStyle').getLineStyle(), {
        fill: 'none',
        stroke: color
      }));
      states_1.setStatesStylesFromModel(polyline, itemModel, 'lineStyle');
      states_1.setStatesStylesFromModel(polygon, itemModel, 'areaStyle');
      var areaStyleModel = itemModel.getModel('areaStyle');
      var polygonIgnore = areaStyleModel.isEmpty() && areaStyleModel.parentModel.isEmpty();
      polygon.ignore = polygonIgnore;
      zrUtil.each(['emphasis', 'select', 'blur'], function (stateName) {
        var stateModel = itemModel.getModel([stateName, 'areaStyle']);
        var stateIgnore = stateModel.isEmpty() && stateModel.parentModel.isEmpty();
        polygon.ensureState(stateName).ignore = stateIgnore && polygonIgnore;
      });
      polygon.useStyle(zrUtil.defaults(areaStyleModel.getAreaStyle(), {
        fill: color,
        opacity: 0.7,
        decal: itemStyle.decal
      }));
      var emphasisModel = itemModel.getModel('emphasis');
      var itemHoverStyle = emphasisModel.getModel('itemStyle').getItemStyle();
      symbolGroup.eachChild(function (symbolPath) {
        if (symbolPath instanceof Image_1["default"]) {
          var pathStyle = symbolPath.style;
          symbolPath.useStyle(zrUtil.extend({
            image: pathStyle.image,
            x: pathStyle.x,
            y: pathStyle.y,
            width: pathStyle.width,
            height: pathStyle.height
          }, itemStyle));
        } else {
          symbolPath.useStyle(itemStyle);
          symbolPath.setColor(color);
        }

        var pathEmphasisState = symbolPath.ensureState('emphasis');
        pathEmphasisState.style = zrUtil.clone(itemHoverStyle);
        var defaultText = data.get(data.dimensions[symbolPath.__dimIdx], idx);
        (defaultText == null || isNaN(defaultText)) && (defaultText = '');
        labelStyle_1.setLabelStyle(symbolPath, labelStyle_1.getLabelStatesModels(itemModel), {
          labelFetcher: data.hostModel,
          labelDataIndex: idx,
          labelDimIndex: symbolPath.__dimIdx,
          defaultText: defaultText,
          inheritColor: color,
          defaultOpacity: itemStyle.opacity
        });
      });
      states_1.enableHoverEmphasis(itemGroup, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
    });
    this._data = data;
  };

  RadarView.prototype.remove = function () {
    this.group.removeAll();
    this._data = null;
  };

  RadarView.type = 'radar';
  return RadarView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(RadarView);