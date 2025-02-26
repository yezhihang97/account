
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

var createListFromArray_1 = require("../helper/createListFromArray");

var Series_1 = require("../../model/Series");

var EffectScatterSeriesModel = function (_super) {
  tslib_1.__extends(EffectScatterSeriesModel, _super);

  function EffectScatterSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = EffectScatterSeriesModel.type;
    _this.hasSymbolVisual = true;
    return _this;
  }

  EffectScatterSeriesModel.prototype.getInitialData = function (option, ecModel) {
    return createListFromArray_1["default"](this.getSource(), this, {
      useEncodeDefaulter: true
    });
  };

  EffectScatterSeriesModel.prototype.brushSelector = function (dataIndex, data, selectors) {
    return selectors.point(data.getItemLayout(dataIndex));
  };

  EffectScatterSeriesModel.type = 'series.effectScatter';
  EffectScatterSeriesModel.dependencies = ['grid', 'polar'];
  EffectScatterSeriesModel.defaultOption = {
    coordinateSystem: 'cartesian2d',
    zlevel: 0,
    z: 2,
    legendHoverLink: true,
    effectType: 'ripple',
    progressive: 0,
    showEffectOn: 'render',
    rippleEffect: {
      period: 4,
      scale: 2.5,
      brushType: 'fill'
    },
    symbolSize: 10
  };
  return EffectScatterSeriesModel;
}(Series_1["default"]);

Series_1["default"].registerClass(EffectScatterSeriesModel);
exports["default"] = EffectScatterSeriesModel;