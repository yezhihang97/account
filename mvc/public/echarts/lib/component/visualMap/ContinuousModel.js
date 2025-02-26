
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

var VisualMapModel_1 = require("./VisualMapModel");

var numberUtil = require("../../util/number");

var Component_1 = require("../../model/Component");

var component_1 = require("../../util/component");

var DEFAULT_BAR_BOUND = [20, 140];

var ContinuousModel = function (_super) {
  tslib_1.__extends(ContinuousModel, _super);

  function ContinuousModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ContinuousModel.type;
    return _this;
  }

  ContinuousModel.prototype.optionUpdated = function (newOption, isInit) {
    _super.prototype.optionUpdated.apply(this, arguments);

    this.resetExtent();
    this.resetVisual(function (mappingOption) {
      mappingOption.mappingMethod = 'linear';
      mappingOption.dataExtent = this.getExtent();
    });

    this._resetRange();
  };

  ContinuousModel.prototype.resetItemSize = function () {
    _super.prototype.resetItemSize.apply(this, arguments);

    var itemSize = this.itemSize;
    (itemSize[0] == null || isNaN(itemSize[0])) && (itemSize[0] = DEFAULT_BAR_BOUND[0]);
    (itemSize[1] == null || isNaN(itemSize[1])) && (itemSize[1] = DEFAULT_BAR_BOUND[1]);
  };

  ContinuousModel.prototype._resetRange = function () {
    var dataExtent = this.getExtent();
    var range = this.option.range;

    if (!range || range.auto) {
      dataExtent.auto = 1;
      this.option.range = dataExtent;
    } else if (zrUtil.isArray(range)) {
      if (range[0] > range[1]) {
        range.reverse();
      }

      range[0] = Math.max(range[0], dataExtent[0]);
      range[1] = Math.min(range[1], dataExtent[1]);
    }
  };

  ContinuousModel.prototype.completeVisualOption = function () {
    _super.prototype.completeVisualOption.apply(this, arguments);

    zrUtil.each(this.stateList, function (state) {
      var symbolSize = this.option.controller[state].symbolSize;

      if (symbolSize && symbolSize[0] !== symbolSize[1]) {
        symbolSize[0] = symbolSize[1] / 3;
      }
    }, this);
  };

  ContinuousModel.prototype.setSelected = function (selected) {
    this.option.range = selected.slice();

    this._resetRange();
  };

  ContinuousModel.prototype.getSelected = function () {
    var dataExtent = this.getExtent();
    var dataInterval = numberUtil.asc((this.get('range') || []).slice());
    dataInterval[0] > dataExtent[1] && (dataInterval[0] = dataExtent[1]);
    dataInterval[1] > dataExtent[1] && (dataInterval[1] = dataExtent[1]);
    dataInterval[0] < dataExtent[0] && (dataInterval[0] = dataExtent[0]);
    dataInterval[1] < dataExtent[0] && (dataInterval[1] = dataExtent[0]);
    return dataInterval;
  };

  ContinuousModel.prototype.getValueState = function (value) {
    var range = this.option.range;
    var dataExtent = this.getExtent();
    return (range[0] <= dataExtent[0] || range[0] <= value) && (range[1] >= dataExtent[1] || value <= range[1]) ? 'inRange' : 'outOfRange';
  };

  ContinuousModel.prototype.findTargetDataIndices = function (range) {
    var result = [];
    this.eachTargetSeries(function (seriesModel) {
      var dataIndices = [];
      var data = seriesModel.getData();
      data.each(this.getDataDimension(data), function (value, dataIndex) {
        range[0] <= value && value <= range[1] && dataIndices.push(dataIndex);
      }, this);
      result.push({
        seriesId: seriesModel.id,
        dataIndex: dataIndices
      });
    }, this);
    return result;
  };

  ContinuousModel.prototype.getVisualMeta = function (getColorVisual) {
    var oVals = getColorStopValues(this, 'outOfRange', this.getExtent());
    var iVals = getColorStopValues(this, 'inRange', this.option.range.slice());
    var stops = [];

    function setStop(value, valueState) {
      stops.push({
        value: value,
        color: getColorVisual(value, valueState)
      });
    }

    var iIdx = 0;
    var oIdx = 0;
    var iLen = iVals.length;
    var oLen = oVals.length;

    for (; oIdx < oLen && (!iVals.length || oVals[oIdx] <= iVals[0]); oIdx++) {
      if (oVals[oIdx] < iVals[iIdx]) {
        setStop(oVals[oIdx], 'outOfRange');
      }
    }

    for (var first = 1; iIdx < iLen; iIdx++, first = 0) {
      first && stops.length && setStop(iVals[iIdx], 'outOfRange');
      setStop(iVals[iIdx], 'inRange');
    }

    for (var first = 1; oIdx < oLen; oIdx++) {
      if (!iVals.length || iVals[iVals.length - 1] < oVals[oIdx]) {
        if (first) {
          stops.length && setStop(stops[stops.length - 1].value, 'outOfRange');
          first = 0;
        }

        setStop(oVals[oIdx], 'outOfRange');
      }
    }

    var stopsLen = stops.length;
    return {
      stops: stops,
      outerColors: [stopsLen ? stops[0].color : 'transparent', stopsLen ? stops[stopsLen - 1].color : 'transparent']
    };
  };

  ContinuousModel.type = 'visualMap.continuous';
  ContinuousModel.defaultOption = component_1.inheritDefaultOption(VisualMapModel_1["default"].defaultOption, {
    align: 'auto',
    calculable: false,
    hoverLink: true,
    realtime: true,
    handleIcon: 'path://M-11.39,9.77h0a3.5,3.5,0,0,1-3.5,3.5h-22a3.5,3.5,0,0,1-3.5-3.5h0a3.5,3.5,0,0,1,3.5-3.5h22A3.5,3.5,0,0,1-11.39,9.77Z',
    handleSize: '120%',
    handleStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    indicatorIcon: 'circle',
    indicatorSize: '50%',
    indicatorStyle: {
      borderColor: '#fff',
      borderWidth: 2,
      shadowBlur: 2,
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowColor: 'rgba(0,0,0,0.2)'
    }
  });
  return ContinuousModel;
}(VisualMapModel_1["default"]);

function getColorStopValues(visualMapModel, valueState, dataExtent) {
  if (dataExtent[0] === dataExtent[1]) {
    return dataExtent.slice();
  }

  var count = 200;
  var step = (dataExtent[1] - dataExtent[0]) / count;
  var value = dataExtent[0];
  var stopValues = [];

  for (var i = 0; i <= count && value < dataExtent[1]; i++) {
    stopValues.push(value);
    value += step;
  }

  stopValues.push(dataExtent[1]);
  return stopValues;
}

Component_1["default"].registerClass(ContinuousModel);
exports["default"] = ContinuousModel;