
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

var decal_1 = require("../util/decal");

function decalVisual(ecModel, api) {
  ecModel.eachRawSeries(function (seriesModel) {
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }

    var data = seriesModel.getData();

    if (data.hasItemVisual()) {
      data.each(function (idx) {
        var decal = data.getItemVisual(idx, 'decal');

        if (decal) {
          var itemStyle = data.ensureUniqueItemVisual(idx, 'style');
          itemStyle.decal = decal_1.createOrUpdatePatternFromDecal(decal, api);
        }
      });
    }

    var decal = data.getVisual('decal');

    if (decal) {
      var style = data.getVisual('style');
      style.decal = decal_1.createOrUpdatePatternFromDecal(decal, api);
    }
  });
}

exports["default"] = decalVisual;