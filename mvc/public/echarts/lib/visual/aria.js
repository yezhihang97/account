
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

var zrUtil = require("zrender/lib/core/util");

var dataProvider_1 = require("../data/helper/dataProvider");

var model_1 = require("../util/model");

var palette_1 = require("../model/mixin/palette");

var DEFAULT_OPTION = {
  label: {
    enabled: true
  },
  decal: {
    show: false
  }
};
var inner = model_1.makeInner();
var decalPaletteScope = {};

function ariaVisual(ecModel, api) {
  var ariaModel = ecModel.getModel('aria');

  if (!ariaModel.get('enabled')) {
    return;
  }

  var defaultOption = zrUtil.clone(DEFAULT_OPTION);
  zrUtil.merge(defaultOption.label, ecModel.getLocaleModel().get('aria'), false);
  zrUtil.merge(ariaModel.option, defaultOption, false);
  setDecal();
  setLabel();

  function setDecal() {
    var decalModel = ariaModel.getModel('decal');
    var useDecal = decalModel.get('show');

    if (useDecal) {
      var paletteScopeGroupByType_1 = zrUtil.createHashMap();
      ecModel.eachSeries(function (seriesModel) {
        if (!seriesModel.useColorPaletteOnData) {
          return;
        }

        var decalScope = paletteScopeGroupByType_1.get(seriesModel.type);

        if (!decalScope) {
          decalScope = {};
          paletteScopeGroupByType_1.set(seriesModel.type, decalScope);
        }

        inner(seriesModel).scope = decalScope;
      });
      ecModel.eachRawSeries(function (seriesModel) {
        if (ecModel.isSeriesFiltered(seriesModel)) {
          return;
        }

        if (typeof seriesModel.enableAriaDecal === 'function') {
          seriesModel.enableAriaDecal();
          return;
        }

        var data = seriesModel.getData();

        if (seriesModel.useColorPaletteOnData) {
          var dataAll_1 = seriesModel.getRawData();
          var idxMap_1 = {};
          var decalScope_1 = inner(seriesModel).scope;
          data.each(function (idx) {
            var rawIdx = data.getRawIndex(idx);
            idxMap_1[rawIdx] = idx;
          });
          var dataCount_1 = dataAll_1.count();
          dataAll_1.each(function (rawIdx) {
            var idx = idxMap_1[rawIdx];
            var name = dataAll_1.getName(rawIdx) || rawIdx + '';
            var paletteDecal = palette_1.getDecalFromPalette(seriesModel.ecModel, name, decalScope_1, dataCount_1);
            var specifiedDecal = data.getItemVisual(idx, 'decal');
            data.setItemVisual(idx, 'decal', mergeDecal(specifiedDecal, paletteDecal));
          });
        } else {
          var paletteDecal = palette_1.getDecalFromPalette(seriesModel.ecModel, seriesModel.name, decalPaletteScope, ecModel.getSeriesCount());
          var specifiedDecal = data.getVisual('decal');
          data.setVisual('decal', mergeDecal(specifiedDecal, paletteDecal));
        }

        function mergeDecal(specifiedDecal, paletteDecal) {
          var resultDecal = specifiedDecal ? zrUtil.extend(zrUtil.extend({}, paletteDecal), specifiedDecal) : paletteDecal;
          resultDecal.dirty = true;
          return resultDecal;
        }
      });
    }
  }

  function setLabel() {
    var labelLocale = ecModel.getLocaleModel().get('aria');
    var labelModel = ariaModel.getModel('label');
    labelModel.option = zrUtil.defaults(labelModel.option, labelLocale);

    if (!labelModel.get('enabled')) {
      return;
    }

    var dom = api.getZr().dom;

    if (labelModel.get('description')) {
      dom.setAttribute('aria-label', labelModel.get('description'));
      return;
    }

    var seriesCnt = ecModel.getSeriesCount();
    var maxDataCnt = labelModel.get(['data', 'maxCount']) || 10;
    var maxSeriesCnt = labelModel.get(['series', 'maxCount']) || 10;
    var displaySeriesCnt = Math.min(seriesCnt, maxSeriesCnt);
    var ariaLabel;

    if (seriesCnt < 1) {
      return;
    } else {
      var title = getTitle();

      if (title) {
        var withTitle = labelModel.get(['general', 'withTitle']);
        ariaLabel = replace(withTitle, {
          title: title
        });
      } else {
        ariaLabel = labelModel.get(['general', 'withoutTitle']);
      }

      var seriesLabels_1 = [];
      var prefix = seriesCnt > 1 ? labelModel.get(['series', 'multiple', 'prefix']) : labelModel.get(['series', 'single', 'prefix']);
      ariaLabel += replace(prefix, {
        seriesCount: seriesCnt
      });
      ecModel.eachSeries(function (seriesModel, idx) {
        if (idx < displaySeriesCnt) {
          var seriesLabel = void 0;
          var seriesName = seriesModel.get('name');
          var withName = seriesName ? 'withName' : 'withoutName';
          seriesLabel = seriesCnt > 1 ? labelModel.get(['series', 'multiple', withName]) : labelModel.get(['series', 'single', withName]);
          seriesLabel = replace(seriesLabel, {
            seriesId: seriesModel.seriesIndex,
            seriesName: seriesModel.get('name'),
            seriesType: getSeriesTypeName(seriesModel.subType)
          });
          var data = seriesModel.getData();

          if (data.count() > maxDataCnt) {
            var partialLabel = labelModel.get(['data', 'partialData']);
            seriesLabel += replace(partialLabel, {
              displayCnt: maxDataCnt
            });
          } else {
            seriesLabel += labelModel.get(['data', 'allData']);
          }

          var dataLabels = [];

          for (var i = 0; i < data.count(); i++) {
            if (i < maxDataCnt) {
              var name_1 = data.getName(i);
              var value = dataProvider_1.retrieveRawValue(data, i);
              var dataLabel = labelModel.get(['data', name_1 ? 'withName' : 'withoutName']);
              dataLabels.push(replace(dataLabel, {
                name: name_1,
                value: value
              }));
            }
          }

          var middleSeparator_1 = labelModel.get(['data', 'separator', 'middle']);
          var endSeparator_1 = labelModel.get(['data', 'separator', 'end']);
          seriesLabel += dataLabels.join(middleSeparator_1) + endSeparator_1;
          seriesLabels_1.push(seriesLabel);
        }
      });
      var separatorModel = labelModel.getModel(['series', 'multiple', 'separator']);
      var middleSeparator = separatorModel.get('middle');
      var endSeparator = separatorModel.get('end');
      ariaLabel += seriesLabels_1.join(middleSeparator) + endSeparator;
      dom.setAttribute('aria-label', ariaLabel);
    }
  }

  function replace(str, keyValues) {
    if (typeof str !== 'string') {
      return str;
    }

    var result = str;
    zrUtil.each(keyValues, function (value, key) {
      result = result.replace(new RegExp('\\{\\s*' + key + '\\s*\\}', 'g'), value);
    });
    return result;
  }

  function getTitle() {
    var title = ecModel.get('title');

    if (title && title.length) {
      title = title[0];
    }

    return title && title.text;
  }

  function getSeriesTypeName(type) {
    return ecModel.getLocaleModel().get(['series', 'typeNames'])[type] || '自定义图';
  }
}

exports["default"] = ariaVisual;