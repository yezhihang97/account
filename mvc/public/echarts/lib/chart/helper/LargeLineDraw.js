
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

var IncrementalDisplayable_1 = require("zrender/lib/graphic/IncrementalDisplayable");

var lineContain = require("zrender/lib/contain/line");

var quadraticContain = require("zrender/lib/contain/quadratic");

var innerStore_1 = require("../../util/innerStore");

var LargeLinesPathShape = function () {
  function LargeLinesPathShape() {
    this.polyline = false;
    this.curveness = 0;
    this.segs = [];
  }

  return LargeLinesPathShape;
}();

var LargeLinesPath = function (_super) {
  tslib_1.__extends(LargeLinesPath, _super);

  function LargeLinesPath(opts) {
    return _super.call(this, opts) || this;
  }

  LargeLinesPath.prototype.getDefaultStyle = function () {
    return {
      stroke: '#000',
      fill: null
    };
  };

  LargeLinesPath.prototype.getDefaultShape = function () {
    return new LargeLinesPathShape();
  };

  LargeLinesPath.prototype.buildPath = function (ctx, shape) {
    var segs = shape.segs;
    var curveness = shape.curveness;

    if (shape.polyline) {
      for (var i = 0; i < segs.length;) {
        var count = segs[i++];

        if (count > 0) {
          ctx.moveTo(segs[i++], segs[i++]);

          for (var k = 1; k < count; k++) {
            ctx.lineTo(segs[i++], segs[i++]);
          }
        }
      }
    } else {
      for (var i = 0; i < segs.length;) {
        var x0 = segs[i++];
        var y0 = segs[i++];
        var x1 = segs[i++];
        var y1 = segs[i++];
        ctx.moveTo(x0, y0);

        if (curveness > 0) {
          var x2 = (x0 + x1) / 2 - (y0 - y1) * curveness;
          var y2 = (y0 + y1) / 2 - (x1 - x0) * curveness;
          ctx.quadraticCurveTo(x2, y2, x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
      }
    }
  };

  LargeLinesPath.prototype.findDataIndex = function (x, y) {
    var shape = this.shape;
    var segs = shape.segs;
    var curveness = shape.curveness;
    var lineWidth = this.style.lineWidth;

    if (shape.polyline) {
      var dataIndex = 0;

      for (var i = 0; i < segs.length;) {
        var count = segs[i++];

        if (count > 0) {
          var x0 = segs[i++];
          var y0 = segs[i++];

          for (var k = 1; k < count; k++) {
            var x1 = segs[i++];
            var y1 = segs[i++];

            if (lineContain.containStroke(x0, y0, x1, y1, lineWidth, x, y)) {
              return dataIndex;
            }
          }
        }

        dataIndex++;
      }
    } else {
      var dataIndex = 0;

      for (var i = 0; i < segs.length;) {
        var x0 = segs[i++];
        var y0 = segs[i++];
        var x1 = segs[i++];
        var y1 = segs[i++];

        if (curveness > 0) {
          var x2 = (x0 + x1) / 2 - (y0 - y1) * curveness;
          var y2 = (y0 + y1) / 2 - (x1 - x0) * curveness;

          if (quadraticContain.containStroke(x0, y0, x2, y2, x1, y1, lineWidth, x, y)) {
            return dataIndex;
          }
        } else {
          if (lineContain.containStroke(x0, y0, x1, y1, lineWidth, x, y)) {
            return dataIndex;
          }
        }

        dataIndex++;
      }
    }

    return -1;
  };

  return LargeLinesPath;
}(graphic.Path);

var LargeLineDraw = function () {
  function LargeLineDraw() {
    this.group = new graphic.Group();
  }

  LargeLineDraw.prototype.isPersistent = function () {
    return !this._incremental;
  };

  ;

  LargeLineDraw.prototype.updateData = function (data) {
    this.group.removeAll();
    var lineEl = new LargeLinesPath({
      rectHover: true,
      cursor: 'default'
    });
    lineEl.setShape({
      segs: data.getLayout('linesPoints')
    });

    this._setCommon(lineEl, data);

    this.group.add(lineEl);
    this._incremental = null;
  };

  ;

  LargeLineDraw.prototype.incrementalPrepareUpdate = function (data) {
    this.group.removeAll();

    this._clearIncremental();

    if (data.count() > 5e5) {
      if (!this._incremental) {
        this._incremental = new IncrementalDisplayable_1["default"]({
          silent: true
        });
      }

      this.group.add(this._incremental);
    } else {
      this._incremental = null;
    }
  };

  ;

  LargeLineDraw.prototype.incrementalUpdate = function (taskParams, data) {
    var lineEl = new LargeLinesPath();
    lineEl.setShape({
      segs: data.getLayout('linesPoints')
    });

    this._setCommon(lineEl, data, !!this._incremental);

    if (!this._incremental) {
      lineEl.rectHover = true;
      lineEl.cursor = 'default';
      lineEl.__startIndex = taskParams.start;
      this.group.add(lineEl);
    } else {
      this._incremental.addDisplayable(lineEl, true);
    }
  };

  ;

  LargeLineDraw.prototype.remove = function () {
    this._clearIncremental();

    this._incremental = null;
    this.group.removeAll();
  };

  ;

  LargeLineDraw.prototype._setCommon = function (lineEl, data, isIncremental) {
    var hostModel = data.hostModel;
    lineEl.setShape({
      polyline: hostModel.get('polyline'),
      curveness: hostModel.get(['lineStyle', 'curveness'])
    });
    lineEl.useStyle(hostModel.getModel('lineStyle').getLineStyle());
    lineEl.style.strokeNoScale = true;
    var style = data.getVisual('style');

    if (style && style.stroke) {
      lineEl.setStyle('stroke', style.stroke);
    }

    lineEl.setStyle('fill', null);

    if (!isIncremental) {
      var ecData_1 = innerStore_1.getECData(lineEl);
      ecData_1.seriesIndex = hostModel.seriesIndex;
      lineEl.on('mousemove', function (e) {
        ecData_1.dataIndex = null;
        var dataIndex = lineEl.findDataIndex(e.offsetX, e.offsetY);

        if (dataIndex > 0) {
          ecData_1.dataIndex = dataIndex + lineEl.__startIndex;
        }
      });
    }
  };

  ;

  LargeLineDraw.prototype._clearIncremental = function () {
    var incremental = this._incremental;

    if (incremental) {
      incremental.clearDisplaybles();
    }
  };

  ;
  return LargeLineDraw;
}();

exports["default"] = LargeLineDraw;