
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

import { __extends } from "tslib";
import * as zrUtil from 'zrender/esm/core/util';
import SeriesModel from '../../model/Series';
import { WhiskerBoxCommonMixin } from '../helper/whiskerBoxCommon';

var BoxplotSeriesModel = function (_super) {
  __extends(BoxplotSeriesModel, _super);

  function BoxplotSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = BoxplotSeriesModel.type;
    _this.defaultValueDimensions = [{
      name: 'min',
      defaultTooltip: true
    }, {
      name: 'Q1',
      defaultTooltip: true
    }, {
      name: 'median',
      defaultTooltip: true
    }, {
      name: 'Q3',
      defaultTooltip: true
    }, {
      name: 'max',
      defaultTooltip: true
    }];
    _this.visualDrawType = 'stroke';
    return _this;
  }

  BoxplotSeriesModel.type = 'series.boxplot';
  BoxplotSeriesModel.dependencies = ['xAxis', 'yAxis', 'grid'];
  BoxplotSeriesModel.defaultOption = {
    zlevel: 0,
    z: 2,
    coordinateSystem: 'cartesian2d',
    legendHoverLink: true,
    layout: null,
    boxWidth: [7, 50],
    itemStyle: {
      color: '#fff',
      borderWidth: 1
    },
    emphasis: {
      scale: true,
      itemStyle: {
        borderWidth: 2,
        shadowBlur: 5,
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowColor: 'rgba(0,0,0,0.2)'
      }
    },
    animationDuration: 800
  };
  return BoxplotSeriesModel;
}(SeriesModel);

zrUtil.mixin(BoxplotSeriesModel, WhiskerBoxCommonMixin, true);
SeriesModel.registerClass(BoxplotSeriesModel);
export default BoxplotSeriesModel;