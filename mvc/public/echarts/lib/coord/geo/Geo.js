
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

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var View_1 = require("../View");

var geoSourceManager_1 = require("./geoSourceManager");

var model_1 = require("../../util/model");

var Geo = function (_super) {
  tslib_1.__extends(Geo, _super);

  function Geo(name, map, nameMap, invertLongitute) {
    var _this = _super.call(this, name) || this;

    _this.dimensions = ['lng', 'lat'];
    _this.type = 'geo';
    _this.map = map;
    var source = geoSourceManager_1["default"].load(map, nameMap);
    _this._nameCoordMap = source.nameCoordMap;
    _this._regionsMap = source.regionsMap;
    _this._invertLongitute = invertLongitute == null ? true : invertLongitute;
    _this.regions = source.regions;
    _this._rect = source.boundingRect;
    return _this;
  }

  Geo.prototype.containCoord = function (coord) {
    var regions = this.regions;

    for (var i = 0; i < regions.length; i++) {
      if (regions[i].contain(coord)) {
        return true;
      }
    }

    return false;
  };

  Geo.prototype.transformTo = function (x, y, width, height) {
    var rect = this.getBoundingRect();
    var invertLongitute = this._invertLongitute;
    rect = rect.clone();

    if (invertLongitute) {
      rect.y = -rect.y - rect.height;
    }

    var rawTransformable = this._rawTransformable;
    rawTransformable.transform = rect.calculateTransform(new BoundingRect_1["default"](x, y, width, height));
    rawTransformable.decomposeTransform();

    if (invertLongitute) {
      rawTransformable.scaleY = -rawTransformable.scaleY;
    }

    rawTransformable.updateTransform();

    this._updateTransform();
  };

  Geo.prototype.getRegion = function (name) {
    return this._regionsMap.get(name);
  };

  Geo.prototype.getRegionByCoord = function (coord) {
    var regions = this.regions;

    for (var i = 0; i < regions.length; i++) {
      if (regions[i].contain(coord)) {
        return regions[i];
      }
    }
  };

  Geo.prototype.addGeoCoord = function (name, geoCoord) {
    this._nameCoordMap.set(name, geoCoord);
  };

  Geo.prototype.getGeoCoord = function (name) {
    return this._nameCoordMap.get(name);
  };

  Geo.prototype.getBoundingRect = function () {
    return this._rect;
  };

  Geo.prototype.dataToPoint = function (data, noRoam, out) {
    if (typeof data === 'string') {
      data = this.getGeoCoord(data);
    }

    if (data) {
      return View_1["default"].prototype.dataToPoint.call(this, data, noRoam, out);
    }
  };

  Geo.prototype.convertToPixel = function (ecModel, finder, value) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.dataToPoint(value) : null;
  };

  Geo.prototype.convertFromPixel = function (ecModel, finder, pixel) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.pointToData(pixel) : null;
  };

  return Geo;
}(View_1["default"]);

;
zrUtil.mixin(Geo, View_1["default"]);

function getCoordSys(finder) {
  var geoModel = finder.geoModel;
  var seriesModel = finder.seriesModel;
  return geoModel ? geoModel.coordinateSystem : seriesModel ? seriesModel.coordinateSystem || (seriesModel.getReferringComponents('geo', model_1.SINGLE_REFERRING).models[0] || {}).coordinateSystem : null;
}

exports["default"] = Geo;