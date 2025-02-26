
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

var Path_1 = require("zrender/lib/graphic/Path");

var PathProxy_1 = require("zrender/lib/core/PathProxy");

var curve_1 = require("zrender/lib/core/curve");

var mathMin = Math.min;
var mathMax = Math.max;

function isPointNull(x, y) {
  return isNaN(x) || isNaN(y);
}

function drawSegment(ctx, points, start, segLen, allLen, dir, smooth, smoothMonotone, connectNulls) {
  var prevX;
  var prevY;
  var cpx0;
  var cpy0;
  var cpx1;
  var cpy1;
  var idx = start;
  var k = 0;

  for (; k < segLen; k++) {
    var x = points[idx * 2];
    var y = points[idx * 2 + 1];

    if (idx >= allLen || idx < 0) {
      break;
    }

    if (isPointNull(x, y)) {
      if (connectNulls) {
        idx += dir;
        continue;
      }

      break;
    }

    if (idx === start) {
      ctx[dir > 0 ? 'moveTo' : 'lineTo'](x, y);
      cpx0 = x;
      cpy0 = y;
    } else {
      var dx = x - prevX;
      var dy = y - prevY;

      if (dx * dx + dy * dy < 0.5) {
        idx += dir;
        continue;
      }

      if (smooth > 0) {
        var nextIdx = idx + dir;
        var nextX = points[nextIdx * 2];
        var nextY = points[nextIdx * 2 + 1];
        var tmpK = k + 1;

        if (connectNulls) {
          while (isPointNull(nextX, nextY) && tmpK < segLen) {
            tmpK++;
            nextIdx += dir;
            nextX = points[nextIdx * 2];
            nextY = points[nextIdx * 2 + 1];
          }
        }

        var ratioNextSeg = 0.5;
        var vx = 0;
        var vy = 0;
        var nextCpx0 = void 0;
        var nextCpy0 = void 0;

        if (tmpK >= segLen || isPointNull(nextX, nextY)) {
          cpx1 = x;
          cpy1 = y;
        } else {
          vx = nextX - prevX;
          vy = nextY - prevY;
          var dx0 = x - prevX;
          var dx1 = nextX - x;
          var dy0 = y - prevY;
          var dy1 = nextY - y;
          var lenPrevSeg = void 0;
          var lenNextSeg = void 0;

          if (smoothMonotone === 'x') {
            lenPrevSeg = Math.abs(dx0);
            lenNextSeg = Math.abs(dx1);
            cpx1 = x - lenPrevSeg * smooth;
            cpy1 = y;
            nextCpx0 = x + lenPrevSeg * smooth;
            nextCpy0 = y;
          } else if (smoothMonotone === 'y') {
            lenPrevSeg = Math.abs(dy0);
            lenNextSeg = Math.abs(dy1);
            cpx1 = x;
            cpy1 = y - lenPrevSeg * smooth;
            nextCpx0 = x;
            nextCpy0 = y + lenPrevSeg * smooth;
          } else {
            lenPrevSeg = Math.sqrt(dx0 * dx0 + dy0 * dy0);
            lenNextSeg = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            ratioNextSeg = lenNextSeg / (lenNextSeg + lenPrevSeg);
            cpx1 = x - vx * smooth * (1 - ratioNextSeg);
            cpy1 = y - vy * smooth * (1 - ratioNextSeg);
            nextCpx0 = x + vx * smooth * ratioNextSeg;
            nextCpy0 = y + vy * smooth * ratioNextSeg;
            nextCpx0 = mathMin(nextCpx0, mathMax(nextX, x));
            nextCpy0 = mathMin(nextCpy0, mathMax(nextY, y));
            nextCpx0 = mathMax(nextCpx0, mathMin(nextX, x));
            nextCpy0 = mathMax(nextCpy0, mathMin(nextY, y));
            vx = nextCpx0 - x;
            vy = nextCpy0 - y;
            cpx1 = x - vx * lenPrevSeg / lenNextSeg;
            cpy1 = y - vy * lenPrevSeg / lenNextSeg;
            cpx1 = mathMin(cpx1, mathMax(prevX, x));
            cpy1 = mathMin(cpy1, mathMax(prevY, y));
            cpx1 = mathMax(cpx1, mathMin(prevX, x));
            cpy1 = mathMax(cpy1, mathMin(prevY, y));
            vx = x - cpx1;
            vy = y - cpy1;
            nextCpx0 = x + vx * lenNextSeg / lenPrevSeg;
            nextCpy0 = y + vy * lenNextSeg / lenPrevSeg;
          }
        }

        ctx.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, x, y);
        cpx0 = nextCpx0;
        cpy0 = nextCpy0;
      } else {
        ctx.lineTo(x, y);
      }
    }

    prevX = x;
    prevY = y;
    idx += dir;
  }

  return k;
}

var ECPolylineShape = function () {
  function ECPolylineShape() {
    this.smooth = 0;
    this.smoothConstraint = true;
  }

  return ECPolylineShape;
}();

var ECPolyline = function (_super) {
  tslib_1.__extends(ECPolyline, _super);

  function ECPolyline(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'ec-polyline';
    return _this;
  }

  ECPolyline.prototype.getDefaultStyle = function () {
    return {
      stroke: '#000',
      fill: null
    };
  };

  ECPolyline.prototype.getDefaultShape = function () {
    return new ECPolylineShape();
  };

  ECPolyline.prototype.buildPath = function (ctx, shape) {
    var points = shape.points;
    var i = 0;
    var len = points.length / 2;

    if (shape.connectNulls) {
      for (; len > 0; len--) {
        if (!isPointNull(points[len * 2 - 2], points[len * 2 - 1])) {
          break;
        }
      }

      for (; i < len; i++) {
        if (!isPointNull(points[i * 2], points[i * 2 + 1])) {
          break;
        }
      }
    }

    while (i < len) {
      i += drawSegment(ctx, points, i, len, len, 1, shape.smooth, shape.smoothMonotone, shape.connectNulls) + 1;
    }
  };

  ECPolyline.prototype.getPointOn = function (xOrY, dim) {
    if (!this.path) {
      this.createPathProxy();
      this.buildPath(this.path, this.shape);
    }

    var path = this.path;
    var data = path.data;
    var CMD = PathProxy_1["default"].CMD;
    var x0;
    var y0;
    var isDimX = dim === 'x';
    var roots = [];

    for (var i = 0; i < data.length;) {
      var cmd = data[i++];
      var x = void 0;
      var y = void 0;
      var x2 = void 0;
      var y2 = void 0;
      var x3 = void 0;
      var y3 = void 0;
      var t = void 0;

      switch (cmd) {
        case CMD.M:
          x0 = data[i++];
          y0 = data[i++];
          break;

        case CMD.L:
          x = data[i++];
          y = data[i++];
          t = isDimX ? (xOrY - x0) / (x - x0) : (xOrY - y0) / (y - y0);

          if (t <= 1 && t >= 0) {
            var val = isDimX ? (y - y0) * t + y0 : (x - x0) * t + x0;
            return isDimX ? [xOrY, val] : [val, xOrY];
          }

          x0 = x;
          y0 = y;
          break;

        case CMD.C:
          x = data[i++];
          y = data[i++];
          x2 = data[i++];
          y2 = data[i++];
          x3 = data[i++];
          y3 = data[i++];
          var nRoot = isDimX ? curve_1.cubicRootAt(x0, x, x2, x3, xOrY, roots) : curve_1.cubicRootAt(y0, y, y2, y3, xOrY, roots);

          if (nRoot > 0) {
            for (var i_1 = 0; i_1 < nRoot; i_1++) {
              var t_1 = roots[i_1];

              if (t_1 <= 1 && t_1 >= 0) {
                var val = isDimX ? curve_1.cubicAt(y0, y, y2, y3, t_1) : curve_1.cubicAt(x0, x, x2, x3, t_1);
                return isDimX ? [xOrY, val] : [val, xOrY];
              }
            }
          }

          x0 = x3;
          y0 = y3;
          break;
      }
    }
  };

  return ECPolyline;
}(Path_1["default"]);

exports.ECPolyline = ECPolyline;

var ECPolygonShape = function (_super) {
  tslib_1.__extends(ECPolygonShape, _super);

  function ECPolygonShape() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return ECPolygonShape;
}(ECPolylineShape);

var ECPolygon = function (_super) {
  tslib_1.__extends(ECPolygon, _super);

  function ECPolygon(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'ec-polygon';
    return _this;
  }

  ECPolygon.prototype.getDefaultShape = function () {
    return new ECPolygonShape();
  };

  ECPolygon.prototype.buildPath = function (ctx, shape) {
    var points = shape.points;
    var stackedOnPoints = shape.stackedOnPoints;
    var i = 0;
    var len = points.length / 2;
    var smoothMonotone = shape.smoothMonotone;

    if (shape.connectNulls) {
      for (; len > 0; len--) {
        if (!isPointNull(points[len * 2 - 2], points[len * 2 - 1])) {
          break;
        }
      }

      for (; i < len; i++) {
        if (!isPointNull(points[i * 2], points[i * 2 + 1])) {
          break;
        }
      }
    }

    while (i < len) {
      var k = drawSegment(ctx, points, i, len, len, 1, shape.smooth, smoothMonotone, shape.connectNulls);
      drawSegment(ctx, stackedOnPoints, i + k - 1, k, len, -1, shape.stackedOnSmooth, smoothMonotone, shape.connectNulls);
      i += k + 1;
      ctx.closePath();
    }
  };

  return ECPolygon;
}(Path_1["default"]);

exports.ECPolygon = ECPolygon;