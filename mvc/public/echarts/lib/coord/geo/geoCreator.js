
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

var echarts = require("../../echarts");

var zrUtil = require("zrender/lib/core/util");

var Geo_1 = require("./Geo");

var layout = require("../../util/layout");

var numberUtil = require("../../util/number");

var geoSourceManager_1 = require("./geoSourceManager");

var mapDataStorage_1 = require("./mapDataStorage");

function resizeGeo(geoModel, api) {
  var boundingCoords = geoModel.get('boundingCoords');

  if (boundingCoords != null) {
    var leftTop = boundingCoords[0];
    var rightBottom = boundingCoords[1];

    if (isNaN(leftTop[0]) || isNaN(leftTop[1]) || isNaN(rightBottom[0]) || isNaN(rightBottom[1])) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Invalid boundingCoords');
      }
    } else {
      this.setBoundingRect(leftTop[0], leftTop[1], rightBottom[0] - leftTop[0], rightBottom[1] - leftTop[1]);
    }
  }

  var rect = this.getBoundingRect();
  var centerOption = geoModel.get('layoutCenter');
  var sizeOption = geoModel.get('layoutSize');
  var viewWidth = api.getWidth();
  var viewHeight = api.getHeight();
  var aspect = rect.width / rect.height * this.aspectScale;
  var useCenterAndSize = false;
  var center;
  var size;

  if (centerOption && sizeOption) {
    center = [numberUtil.parsePercent(centerOption[0], viewWidth), numberUtil.parsePercent(centerOption[1], viewHeight)];
    size = numberUtil.parsePercent(sizeOption, Math.min(viewWidth, viewHeight));

    if (!isNaN(center[0]) && !isNaN(center[1]) && !isNaN(size)) {
      useCenterAndSize = true;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Given layoutCenter or layoutSize data are invalid. Use left/top/width/height instead.');
      }
    }
  }

  var viewRect;

  if (useCenterAndSize) {
    viewRect = {};

    if (aspect > 1) {
      viewRect.width = size;
      viewRect.height = size / aspect;
    } else {
      viewRect.height = size;
      viewRect.width = size * aspect;
    }

    viewRect.y = center[1] - viewRect.height / 2;
    viewRect.x = center[0] - viewRect.width / 2;
  } else {
    var boxLayoutOption = geoModel.getBoxLayoutParams();
    boxLayoutOption.aspect = aspect;
    viewRect = layout.getLayoutRect(boxLayoutOption, {
      width: viewWidth,
      height: viewHeight
    });
  }

  this.setViewRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
  this.setCenter(geoModel.get('center'));
  this.setZoom(geoModel.get('zoom'));
}

function setGeoCoords(geo, model) {
  zrUtil.each(model.get('geoCoord'), function (geoCoord, name) {
    geo.addGeoCoord(name, geoCoord);
  });
}

var GeoCreator = function () {
  function GeoCreator() {
    this.dimensions = Geo_1["default"].prototype.dimensions;
  }

  GeoCreator.prototype.create = function (ecModel, api) {
    var geoList = [];
    ecModel.eachComponent('geo', function (geoModel, idx) {
      var name = geoModel.get('map');
      var aspectScale = geoModel.get('aspectScale');
      var invertLongitute = true;
      var mapRecords = mapDataStorage_1["default"].retrieveMap(name);

      if (mapRecords && mapRecords[0] && mapRecords[0].type === 'svg') {
        aspectScale == null && (aspectScale = 1);
        invertLongitute = false;
      } else {
        aspectScale == null && (aspectScale = 0.75);
      }

      var geo = new Geo_1["default"](name + idx, name, geoModel.get('nameMap'), invertLongitute);
      geo.aspectScale = aspectScale;
      geo.zoomLimit = geoModel.get('scaleLimit');
      geoList.push(geo);
      geoModel.coordinateSystem = geo;
      geo.model = geoModel;
      geo.resize = resizeGeo;
      geo.resize(geoModel, api);
    });
    ecModel.eachSeries(function (seriesModel) {
      var coordSys = seriesModel.get('coordinateSystem');

      if (coordSys === 'geo') {
        var geoIndex = seriesModel.get('geoIndex') || 0;
        seriesModel.coordinateSystem = geoList[geoIndex];
      }
    });
    var mapModelGroupBySeries = {};
    ecModel.eachSeriesByType('map', function (seriesModel) {
      if (!seriesModel.getHostGeoModel()) {
        var mapType = seriesModel.getMapType();
        mapModelGroupBySeries[mapType] = mapModelGroupBySeries[mapType] || [];
        mapModelGroupBySeries[mapType].push(seriesModel);
      }
    });
    zrUtil.each(mapModelGroupBySeries, function (mapSeries, mapType) {
      var nameMapList = zrUtil.map(mapSeries, function (singleMapSeries) {
        return singleMapSeries.get('nameMap');
      });
      var geo = new Geo_1["default"](mapType, mapType, zrUtil.mergeAll(nameMapList));
      geo.zoomLimit = zrUtil.retrieve.apply(null, zrUtil.map(mapSeries, function (singleMapSeries) {
        return singleMapSeries.get('scaleLimit');
      }));
      geoList.push(geo);
      geo.resize = resizeGeo;
      geo.aspectScale = mapSeries[0].get('aspectScale');
      geo.resize(mapSeries[0], api);
      zrUtil.each(mapSeries, function (singleMapSeries) {
        singleMapSeries.coordinateSystem = geo;
        setGeoCoords(geo, singleMapSeries);
      });
    });
    return geoList;
  };

  GeoCreator.prototype.getFilledRegions = function (originRegionArr, mapName, nameMap) {
    var regionsArr = (originRegionArr || []).slice();
    var dataNameMap = zrUtil.createHashMap();

    for (var i = 0; i < regionsArr.length; i++) {
      dataNameMap.set(regionsArr[i].name, regionsArr[i]);
    }

    var source = geoSourceManager_1["default"].load(mapName, nameMap);
    zrUtil.each(source.regions, function (region) {
      var name = region.name;
      !dataNameMap.get(name) && regionsArr.push({
        name: name
      });
    });
    return regionsArr;
  };

  return GeoCreator;
}();

var geoCreator = new GeoCreator();
echarts.registerCoordinateSystem('geo', geoCreator);
exports["default"] = geoCreator;