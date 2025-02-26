
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

var BaseBarSeries_1 = require("./BaseBarSeries");

var Series_1 = require("../../model/Series");

var component_1 = require("../../util/component");

var BarSeriesModel = function (_super) {
  tslib_1.__extends(BarSeriesModel, _super);

  function BarSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = BarSeriesModel.type;
    return _this;
  }

  BarSeriesModel.prototype.getProgressive = function () {
    return this.get('large') ? this.get('progressive') : false;
  };

  BarSeriesModel.prototype.getProgressiveThreshold = function () {
    var progressiveThreshold = this.get('progressiveThreshold');
    var largeThreshold = this.get('largeThreshold');

    if (largeThreshold > progressiveThreshold) {
      progressiveThreshold = largeThreshold;
    }

    return progressiveThreshold;
  };

  BarSeriesModel.prototype.brushSelector = function (dataIndex, data, selectors) {
    return selectors.rect(data.getItemLayout(dataIndex));
  };

  BarSeriesModel.type = 'series.bar';
  BarSeriesModel.dependencies = ['grid', 'polar'];
  BarSeriesModel.defaultOption = component_1.inheritDefaultOption(BaseBarSeries_1["default"].defaultOption, {
    clip: true,
    roundCap: false,
    showBackground: false,
    backgroundStyle: {
      color: 'rgba(180, 180, 180, 0.2)',
      borderColor: null,
      borderWidth: 0,
      borderType: 'solid',
      borderRadius: 0,
      shadowBlur: 0,
      shadowColor: null,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      opacity: 1
    },
    select: {
      itemStyle: {
        borderColor: '#212121'
      }
    },
    realtimeSort: false
  });
  return BarSeriesModel;
}(BaseBarSeries_1["default"]);

Series_1["default"].registerClass(BarSeriesModel);
exports["default"] = BarSeriesModel;