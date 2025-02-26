
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

var Parallel_1 = require("./Parallel");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var model_1 = require("../../util/model");

function create(ecModel, api) {
  var coordSysList = [];
  ecModel.eachComponent('parallel', function (parallelModel, idx) {
    var coordSys = new Parallel_1["default"](parallelModel, ecModel, api);
    coordSys.name = 'parallel_' + idx;
    coordSys.resize(parallelModel, api);
    parallelModel.coordinateSystem = coordSys;
    coordSys.model = parallelModel;
    coordSysList.push(coordSys);
  });
  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'parallel') {
      var parallelModel = seriesModel.getReferringComponents('parallel', model_1.SINGLE_REFERRING).models[0];
      seriesModel.coordinateSystem = parallelModel.coordinateSystem;
    }
  });
  return coordSysList;
}

CoordinateSystem_1["default"].register('parallel', {
  create: create
});