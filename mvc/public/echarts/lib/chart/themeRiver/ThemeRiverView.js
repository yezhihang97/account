
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

var poly_1 = require("../line/poly");

var graphic = require("../../util/graphic");

var states_1 = require("../../util/states");

var labelStyle_1 = require("../../label/labelStyle");

var util_1 = require("zrender/lib/core/util");

var DataDiffer_1 = require("../../data/DataDiffer");

var Chart_1 = require("../../view/Chart");

var ThemeRiverView = function (_super) {
  tslib_1.__extends(ThemeRiverView, _super);

  function ThemeRiverView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ThemeRiverView.type;
    _this._layers = [];
    return _this;
  }

  ThemeRiverView.prototype.render = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    var self = this;
    var group = this.group;
    var layersSeries = seriesModel.getLayerSeries();
    var layoutInfo = data.getLayout('layoutInfo');
    var rect = layoutInfo.rect;
    var boundaryGap = layoutInfo.boundaryGap;
    group.x = 0;
    group.y = rect.y + boundaryGap[0];

    function keyGetter(item) {
      return item.name;
    }

    var dataDiffer = new DataDiffer_1["default"](this._layersSeries || [], layersSeries, keyGetter, keyGetter);
    var newLayersGroups = [];
    dataDiffer.add(util_1.bind(process, this, 'add')).update(util_1.bind(process, this, 'update')).remove(util_1.bind(process, this, 'remove')).execute();

    function process(status, idx, oldIdx) {
      var oldLayersGroups = self._layers;

      if (status === 'remove') {
        group.remove(oldLayersGroups[idx]);
        return;
      }

      var points0 = [];
      var points1 = [];
      var style;
      var indices = layersSeries[idx].indices;
      var j = 0;

      for (; j < indices.length; j++) {
        var layout = data.getItemLayout(indices[j]);
        var x = layout.x;
        var y0 = layout.y0;
        var y = layout.y;
        points0.push(x, y0);
        points1.push(x, y0 + y);
        style = data.getItemVisual(indices[j], 'style');
      }

      var polygon;
      var textLayout = data.getItemLayout(indices[0]);
      var labelModel = seriesModel.getModel('label');
      var margin = labelModel.get('margin');
      var emphasisModel = seriesModel.getModel('emphasis');

      if (status === 'add') {
        var layerGroup = newLayersGroups[idx] = new graphic.Group();
        polygon = new poly_1.ECPolygon({
          shape: {
            points: points0,
            stackedOnPoints: points1,
            smooth: 0.4,
            stackedOnSmooth: 0.4,
            smoothConstraint: false
          },
          z2: 0
        });
        layerGroup.add(polygon);
        group.add(layerGroup);

        if (seriesModel.isAnimationEnabled()) {
          polygon.setClipPath(createGridClipShape(polygon.getBoundingRect(), seriesModel, function () {
            polygon.removeClipPath();
          }));
        }
      } else {
        var layerGroup = oldLayersGroups[oldIdx];
        polygon = layerGroup.childAt(0);
        group.add(layerGroup);
        newLayersGroups[idx] = layerGroup;
        graphic.updateProps(polygon, {
          shape: {
            points: points0,
            stackedOnPoints: points1
          }
        }, seriesModel);
      }

      labelStyle_1.setLabelStyle(polygon, labelStyle_1.getLabelStatesModels(seriesModel), {
        labelDataIndex: indices[j - 1],
        defaultText: data.getName(indices[j - 1]),
        inheritColor: style.fill
      }, {
        normal: {
          verticalAlign: 'middle'
        }
      });
      polygon.setTextConfig({
        position: null,
        local: true
      });
      var labelEl = polygon.getTextContent();

      if (labelEl) {
        labelEl.x = textLayout.x - margin;
        labelEl.y = textLayout.y0 + textLayout.y / 2;
      }

      polygon.useStyle(style);
      data.setItemGraphicEl(idx, polygon);
      states_1.setStatesStylesFromModel(polygon, seriesModel);
      states_1.enableHoverEmphasis(polygon, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
    }

    this._layersSeries = layersSeries;
    this._layers = newLayersGroups;
  };

  ThemeRiverView.type = 'themeRiver';
  return ThemeRiverView;
}(Chart_1["default"]);

;

function createGridClipShape(rect, seriesModel, cb) {
  var rectEl = new graphic.Rect({
    shape: {
      x: rect.x - 10,
      y: rect.y - 10,
      width: 0,
      height: rect.height + 20
    }
  });
  graphic.initProps(rectEl, {
    shape: {
      x: rect.x - 50,
      width: rect.width + 100,
      height: rect.height + 20
    }
  }, seriesModel, cb);
  return rectEl;
}

Chart_1["default"].registerClass(ThemeRiverView);