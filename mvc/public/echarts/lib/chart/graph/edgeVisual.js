
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

var util_1 = require("zrender/lib/core/util");

function normalize(a) {
  if (!(a instanceof Array)) {
    a = [a, a];
  }

  return a;
}

function graphEdgeVisual(ecModel) {
  ecModel.eachSeriesByType('graph', function (seriesModel) {
    var graph = seriesModel.getGraph();
    var edgeData = seriesModel.getEdgeData();
    var symbolType = normalize(seriesModel.get('edgeSymbol'));
    var symbolSize = normalize(seriesModel.get('edgeSymbolSize'));
    edgeData.setVisual('fromSymbol', symbolType && symbolType[0]);
    edgeData.setVisual('toSymbol', symbolType && symbolType[1]);
    edgeData.setVisual('fromSymbolSize', symbolSize && symbolSize[0]);
    edgeData.setVisual('toSymbolSize', symbolSize && symbolSize[1]);
    edgeData.setVisual('style', seriesModel.getModel('lineStyle').getLineStyle());
    edgeData.each(function (idx) {
      var itemModel = edgeData.getItemModel(idx);
      var edge = graph.getEdgeByIndex(idx);
      var symbolType = normalize(itemModel.getShallow('symbol', true));
      var symbolSize = normalize(itemModel.getShallow('symbolSize', true));
      var style = itemModel.getModel('lineStyle').getLineStyle();
      var existsStyle = edgeData.ensureUniqueItemVisual(idx, 'style');
      util_1.extend(existsStyle, style);

      switch (existsStyle.stroke) {
        case 'source':
          {
            var nodeStyle = edge.node1.getVisual('style');
            existsStyle.stroke = nodeStyle && nodeStyle.fill;
            break;
          }

        case 'target':
          {
            var nodeStyle = edge.node2.getVisual('style');
            existsStyle.stroke = nodeStyle && nodeStyle.fill;
            break;
          }
      }

      symbolType[0] && edge.setVisual('fromSymbol', symbolType[0]);
      symbolType[1] && edge.setVisual('toSymbol', symbolType[1]);
      symbolSize[0] && edge.setVisual('fromSymbolSize', symbolSize[0]);
      symbolSize[1] && edge.setVisual('toSymbolSize', symbolSize[1]);
    });
  });
}

exports["default"] = graphEdgeVisual;