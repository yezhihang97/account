
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
import * as modelUtil from '../../util/model';
import ComponentModel from '../../model/Component';
import Model from '../../model/Model';
import geoCreator from './geoCreator';
;
;

var GeoModel = function (_super) {
  __extends(GeoModel, _super);

  function GeoModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = GeoModel.type;
    return _this;
  }

  GeoModel.prototype.init = function (option, parentModel, ecModel) {
    _super.prototype.init.call(this, option, parentModel, ecModel);

    modelUtil.defaultEmphasis(option, 'label', ['show']);
  };

  GeoModel.prototype.optionUpdated = function () {
    var option = this.option;
    var self = this;
    option.regions = geoCreator.getFilledRegions(option.regions, option.map, option.nameMap);
    var selectedMap = {};
    this._optionModelMap = zrUtil.reduce(option.regions || [], function (optionModelMap, regionOpt) {
      var regionName = regionOpt.name;

      if (regionName) {
        optionModelMap.set(regionName, new Model(regionOpt, self));

        if (regionOpt.selected) {
          selectedMap[regionName] = true;
        }
      }

      return optionModelMap;
    }, zrUtil.createHashMap());

    if (!option.selectedMap) {
      option.selectedMap = selectedMap;
    }
  };

  GeoModel.prototype.getRegionModel = function (name) {
    return this._optionModelMap.get(name) || new Model(null, this, this.ecModel);
  };

  GeoModel.prototype.getFormattedLabel = function (name, status) {
    var regionModel = this.getRegionModel(name);
    var formatter = status === 'normal' ? regionModel.get(['label', 'formatter']) : regionModel.get(['emphasis', 'label', 'formatter']);
    var params = {
      name: name
    };

    if (typeof formatter === 'function') {
      params.status = status;
      return formatter(params);
    } else if (typeof formatter === 'string') {
      return formatter.replace('{a}', name != null ? name : '');
    }
  };

  GeoModel.prototype.setZoom = function (zoom) {
    this.option.zoom = zoom;
  };

  GeoModel.prototype.setCenter = function (center) {
    this.option.center = center;
  };

  GeoModel.prototype.select = function (name) {
    var option = this.option;
    var selectedMode = option.selectedMode;

    if (!selectedMode) {
      return;
    }

    if (selectedMode !== 'multiple') {
      option.selectedMap = null;
    }

    var selectedMap = option.selectedMap || (option.selectedMap = {});
    selectedMap[name] = true;
  };

  GeoModel.prototype.unSelect = function (name) {
    var selectedMap = this.option.selectedMap;

    if (selectedMap) {
      selectedMap[name] = false;
    }
  };

  GeoModel.prototype.toggleSelected = function (name) {
    this[this.isSelected(name) ? 'unSelect' : 'select'](name);
  };

  GeoModel.prototype.isSelected = function (name) {
    var selectedMap = this.option.selectedMap;
    return !!(selectedMap && selectedMap[name]);
  };

  GeoModel.prototype._initSelectedMapFromData = function () {};

  GeoModel.type = 'geo';
  GeoModel.layoutMode = 'box';
  GeoModel.defaultOption = {
    zlevel: 0,
    z: 0,
    show: true,
    left: 'center',
    top: 'center',
    aspectScale: null,
    silent: false,
    map: '',
    boundingCoords: null,
    center: null,
    zoom: 1,
    scaleLimit: null,
    label: {
      show: false,
      color: '#000'
    },
    itemStyle: {
      borderWidth: 0.5,
      borderColor: '#444',
      color: '#eee'
    },
    emphasis: {
      label: {
        show: true,
        color: 'rgb(100,0,0)'
      },
      itemStyle: {
        color: 'rgba(255,215,0,0.8)'
      }
    },
    select: {
      label: {
        show: true,
        color: 'rgb(100,0,0)'
      },
      itemStyle: {
        color: 'rgba(255,215,0,0.8)'
      }
    },
    regions: []
  };
  return GeoModel;
}(ComponentModel);

ComponentModel.registerClass(GeoModel);
export default GeoModel;