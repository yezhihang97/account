
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

var Series_1 = require("../../model/Series");

var createListSimply_1 = require("../helper/createListSimply");

var zrUtil = require("zrender/lib/core/util");

var LegendVisualProvider_1 = require("../../visual/LegendVisualProvider");

var tooltipMarkup_1 = require("../../component/tooltip/tooltipMarkup");

var RadarSeriesModel = function (_super) {
  tslib_1.__extends(RadarSeriesModel, _super);

  function RadarSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = RadarSeriesModel.type;
    _this.useColorPaletteOnData = true;
    _this.hasSymbolVisual = true;
    return _this;
  }

  RadarSeriesModel.prototype.init = function (option) {
    _super.prototype.init.apply(this, arguments);

    this.legendVisualProvider = new LegendVisualProvider_1["default"](zrUtil.bind(this.getData, this), zrUtil.bind(this.getRawData, this));
  };

  RadarSeriesModel.prototype.getInitialData = function (option, ecModel) {
    return createListSimply_1["default"](this, {
      generateCoord: 'indicator_',
      generateCoordCount: Infinity
    });
  };

  RadarSeriesModel.prototype.formatTooltip = function (dataIndex, multipleSeries, dataType) {
    var data = this.getData();
    var coordSys = this.coordinateSystem;
    var indicatorAxes = coordSys.getIndicatorAxes();
    var name = this.getData().getName(dataIndex);
    var nameToDisplay = name === '' ? this.name : name;
    var markerColor = tooltipMarkup_1.retrieveVisualColorForTooltipMarker(this, dataIndex);
    return tooltipMarkup_1.createTooltipMarkup('section', {
      header: nameToDisplay,
      sortBlocks: true,
      blocks: zrUtil.map(indicatorAxes, function (axis) {
        var val = data.get(data.mapDimension(axis.dim), dataIndex);
        return tooltipMarkup_1.createTooltipMarkup('nameValue', {
          markerType: 'subItem',
          markerColor: markerColor,
          name: axis.name,
          value: val,
          sortParam: val
        });
      })
    });
  };

  RadarSeriesModel.prototype.getTooltipPosition = function (dataIndex) {
    if (dataIndex != null) {
      var data_1 = this.getData();
      var coordSys = this.coordinateSystem;
      var values = data_1.getValues(zrUtil.map(coordSys.dimensions, function (dim) {
        return data_1.mapDimension(dim);
      }), dataIndex);

      for (var i = 0, len = values.length; i < len; i++) {
        if (!isNaN(values[i])) {
          var indicatorAxes = coordSys.getIndicatorAxes();
          return coordSys.coordToPoint(indicatorAxes[i].dataToCoord(values[i]), i);
        }
      }
    }
  };

  RadarSeriesModel.type = 'series.radar';
  RadarSeriesModel.dependencies = ['radar'];
  RadarSeriesModel.defaultOption = {
    zlevel: 0,
    z: 2,
    coordinateSystem: 'radar',
    legendHoverLink: true,
    radarIndex: 0,
    lineStyle: {
      width: 2,
      type: 'solid'
    },
    label: {
      position: 'top'
    },
    symbol: 'emptyCircle',
    symbolSize: 4
  };
  return RadarSeriesModel;
}(Series_1["default"]);

Series_1["default"].registerClass(RadarSeriesModel);
exports["default"] = RadarSeriesModel;