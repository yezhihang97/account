
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

var List_1 = require("../../data/List");

var util_1 = require("zrender/lib/core/util");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var tooltipMarkup_1 = require("../../component/tooltip/tooltipMarkup");

var Uint32Arr = typeof Uint32Array === 'undefined' ? Array : Uint32Array;
var Float64Arr = typeof Float64Array === 'undefined' ? Array : Float64Array;

function compatEc2(seriesOpt) {
  var data = seriesOpt.data;

  if (data && data[0] && data[0][0] && data[0][0].coord) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Lines data configuration has been changed to' + ' { coords:[[1,2],[2,3]] }');
    }

    seriesOpt.data = util_1.map(data, function (itemOpt) {
      var coords = [itemOpt[0].coord, itemOpt[1].coord];
      var target = {
        coords: coords
      };

      if (itemOpt[0].name) {
        target.fromName = itemOpt[0].name;
      }

      if (itemOpt[1].name) {
        target.toName = itemOpt[1].name;
      }

      return util_1.mergeAll([target, itemOpt[0], itemOpt[1]]);
    });
  }
}

var LinesSeriesModel = function (_super) {
  tslib_1.__extends(LinesSeriesModel, _super);

  function LinesSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = LinesSeriesModel.type;
    _this.visualStyleAccessPath = 'lineStyle';
    _this.visualDrawType = 'stroke';
    return _this;
  }

  LinesSeriesModel.prototype.init = function (option) {
    option.data = option.data || [];
    compatEc2(option);

    var result = this._processFlatCoordsArray(option.data);

    this._flatCoords = result.flatCoords;
    this._flatCoordsOffset = result.flatCoordsOffset;

    if (result.flatCoords) {
      option.data = new Float32Array(result.count);
    }

    _super.prototype.init.apply(this, arguments);
  };

  LinesSeriesModel.prototype.mergeOption = function (option) {
    compatEc2(option);

    if (option.data) {
      var result = this._processFlatCoordsArray(option.data);

      this._flatCoords = result.flatCoords;
      this._flatCoordsOffset = result.flatCoordsOffset;

      if (result.flatCoords) {
        option.data = new Float32Array(result.count);
      }
    }

    _super.prototype.mergeOption.apply(this, arguments);
  };

  LinesSeriesModel.prototype.appendData = function (params) {
    var result = this._processFlatCoordsArray(params.data);

    if (result.flatCoords) {
      if (!this._flatCoords) {
        this._flatCoords = result.flatCoords;
        this._flatCoordsOffset = result.flatCoordsOffset;
      } else {
        this._flatCoords = util_1.concatArray(this._flatCoords, result.flatCoords);
        this._flatCoordsOffset = util_1.concatArray(this._flatCoordsOffset, result.flatCoordsOffset);
      }

      params.data = new Float32Array(result.count);
    }

    this.getRawData().appendData(params.data);
  };

  LinesSeriesModel.prototype._getCoordsFromItemModel = function (idx) {
    var itemModel = this.getData().getItemModel(idx);
    var coords = itemModel.option instanceof Array ? itemModel.option : itemModel.getShallow('coords');

    if (process.env.NODE_ENV !== 'production') {
      if (!(coords instanceof Array && coords.length > 0 && coords[0] instanceof Array)) {
        throw new Error('Invalid coords ' + JSON.stringify(coords) + '. Lines must have 2d coords array in data item.');
      }
    }

    return coords;
  };

  LinesSeriesModel.prototype.getLineCoordsCount = function (idx) {
    if (this._flatCoordsOffset) {
      return this._flatCoordsOffset[idx * 2 + 1];
    } else {
      return this._getCoordsFromItemModel(idx).length;
    }
  };

  LinesSeriesModel.prototype.getLineCoords = function (idx, out) {
    if (this._flatCoordsOffset) {
      var offset = this._flatCoordsOffset[idx * 2];
      var len = this._flatCoordsOffset[idx * 2 + 1];

      for (var i = 0; i < len; i++) {
        out[i] = out[i] || [];
        out[i][0] = this._flatCoords[offset + i * 2];
        out[i][1] = this._flatCoords[offset + i * 2 + 1];
      }

      return len;
    } else {
      var coords = this._getCoordsFromItemModel(idx);

      for (var i = 0; i < coords.length; i++) {
        out[i] = out[i] || [];
        out[i][0] = coords[i][0];
        out[i][1] = coords[i][1];
      }

      return coords.length;
    }
  };

  LinesSeriesModel.prototype._processFlatCoordsArray = function (data) {
    var startOffset = 0;

    if (this._flatCoords) {
      startOffset = this._flatCoords.length;
    }

    if (typeof data[0] === 'number') {
      var len = data.length;
      var coordsOffsetAndLenStorage = new Uint32Arr(len);
      var coordsStorage = new Float64Arr(len);
      var coordsCursor = 0;
      var offsetCursor = 0;
      var dataCount = 0;

      for (var i = 0; i < len;) {
        dataCount++;
        var count = data[i++];
        coordsOffsetAndLenStorage[offsetCursor++] = coordsCursor + startOffset;
        coordsOffsetAndLenStorage[offsetCursor++] = count;

        for (var k = 0; k < count; k++) {
          var x = data[i++];
          var y = data[i++];
          coordsStorage[coordsCursor++] = x;
          coordsStorage[coordsCursor++] = y;

          if (i > len) {
            if (process.env.NODE_ENV !== 'production') {
              throw new Error('Invalid data format.');
            }
          }
        }
      }

      return {
        flatCoordsOffset: new Uint32Array(coordsOffsetAndLenStorage.buffer, 0, offsetCursor),
        flatCoords: coordsStorage,
        count: dataCount
      };
    }

    return {
      flatCoordsOffset: null,
      flatCoords: null,
      count: data.length
    };
  };

  LinesSeriesModel.prototype.getInitialData = function (option, ecModel) {
    if (process.env.NODE_ENV !== 'production') {
      var CoordSys = CoordinateSystem_1["default"].get(option.coordinateSystem);

      if (!CoordSys) {
        throw new Error('Unkown coordinate system ' + option.coordinateSystem);
      }
    }

    var lineData = new List_1["default"](['value'], this);
    lineData.hasItemOption = false;
    lineData.initData(option.data, [], function (dataItem, dimName, dataIndex, dimIndex) {
      if (dataItem instanceof Array) {
        return NaN;
      } else {
        lineData.hasItemOption = true;
        var value = dataItem.value;

        if (value != null) {
          return value instanceof Array ? value[dimIndex] : value;
        }
      }
    });
    return lineData;
  };

  LinesSeriesModel.prototype.formatTooltip = function (dataIndex, multipleSeries, dataType) {
    var data = this.getData();
    var itemModel = data.getItemModel(dataIndex);
    var name = itemModel.get('name');

    if (name) {
      return name;
    }

    var fromName = itemModel.get('fromName');
    var toName = itemModel.get('toName');
    var nameArr = [];
    fromName != null && nameArr.push(fromName);
    toName != null && nameArr.push(toName);
    return tooltipMarkup_1.createTooltipMarkup('nameValue', {
      name: nameArr.join(' > ')
    });
  };

  LinesSeriesModel.prototype.preventIncremental = function () {
    return !!this.get(['effect', 'show']);
  };

  LinesSeriesModel.prototype.getProgressive = function () {
    var progressive = this.option.progressive;

    if (progressive == null) {
      return this.option.large ? 1e4 : this.get('progressive');
    }

    return progressive;
  };

  LinesSeriesModel.prototype.getProgressiveThreshold = function () {
    var progressiveThreshold = this.option.progressiveThreshold;

    if (progressiveThreshold == null) {
      return this.option.large ? 2e4 : this.get('progressiveThreshold');
    }

    return progressiveThreshold;
  };

  LinesSeriesModel.type = 'series.lines';
  LinesSeriesModel.dependencies = ['grid', 'polar', 'geo', 'calendar'];
  LinesSeriesModel.defaultOption = {
    coordinateSystem: 'geo',
    zlevel: 0,
    z: 2,
    legendHoverLink: true,
    xAxisIndex: 0,
    yAxisIndex: 0,
    symbol: ['none', 'none'],
    symbolSize: [10, 10],
    geoIndex: 0,
    effect: {
      show: false,
      period: 4,
      constantSpeed: 0,
      symbol: 'circle',
      symbolSize: 3,
      loop: true,
      trailLength: 0.2
    },
    large: false,
    largeThreshold: 2000,
    polyline: false,
    clip: true,
    label: {
      show: false,
      position: 'end'
    },
    lineStyle: {
      opacity: 0.5
    }
  };
  return LinesSeriesModel;
}(Series_1["default"]);

Series_1["default"].registerClass(LinesSeriesModel);
exports["default"] = LinesSeriesModel;