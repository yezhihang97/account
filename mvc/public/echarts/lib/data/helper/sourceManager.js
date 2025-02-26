
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

var Source_1 = require("../Source");

var types_1 = require("../../util/types");

var sourceHelper_1 = require("./sourceHelper");

var transform_1 = require("./transform");

var SourceManager = function () {
  function SourceManager(sourceHost) {
    this._sourceList = [];
    this._upstreamSignList = [];
    this._versionSignBase = 0;
    this._sourceHost = sourceHost;
  }

  SourceManager.prototype.dirty = function () {
    this._setLocalSource([], []);
  };

  SourceManager.prototype._setLocalSource = function (sourceList, upstreamSignList) {
    this._sourceList = sourceList;
    this._upstreamSignList = upstreamSignList;
    this._versionSignBase++;

    if (this._versionSignBase > 9e10) {
      this._versionSignBase = 0;
    }
  };

  SourceManager.prototype._getVersionSign = function () {
    return this._sourceHost.uid + '_' + this._versionSignBase;
  };

  SourceManager.prototype.prepareSource = function () {
    if (this._isDirty()) {
      this._createSource();
    }
  };

  SourceManager.prototype._createSource = function () {
    this._setLocalSource([], []);

    var sourceHost = this._sourceHost;

    var upSourceMgrList = this._getUpstreamSourceManagers();

    var hasUpstream = !!upSourceMgrList.length;
    var resultSourceList;
    var upstreamSignList;

    if (isSeries(sourceHost)) {
      var seriesModel = sourceHost;
      var data = void 0;
      var sourceFormat = void 0;
      var upSource = void 0;

      if (hasUpstream) {
        var upSourceMgr = upSourceMgrList[0];
        upSourceMgr.prepareSource();
        upSource = upSourceMgr.getSource();
        data = upSource.data;
        sourceFormat = upSource.sourceFormat;
        upstreamSignList = [upSourceMgr._getVersionSign()];
      } else {
        data = seriesModel.get('data', true);
        sourceFormat = util_1.isTypedArray(data) ? types_1.SOURCE_FORMAT_TYPED_ARRAY : types_1.SOURCE_FORMAT_ORIGINAL;
        upstreamSignList = [];
      }

      var thisMetaRawOption = sourceHelper_1.inheritSourceMetaRawOption(upSource, this._getSourceMetaRawOption());
      resultSourceList = [Source_1.createSource(data, thisMetaRawOption, sourceFormat, seriesModel.get('encode', true))];
    } else {
      var datasetModel = sourceHost;

      if (hasUpstream) {
        var result = this._applyTransform(upSourceMgrList);

        resultSourceList = result.sourceList;
        upstreamSignList = result.upstreamSignList;
      } else {
        var sourceData = datasetModel.get('source', true);
        resultSourceList = [Source_1.createSource(sourceData, this._getSourceMetaRawOption(), null, null)];
        upstreamSignList = [];
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      util_1.assert(resultSourceList && upstreamSignList);
    }

    this._setLocalSource(resultSourceList, upstreamSignList);
  };

  SourceManager.prototype._applyTransform = function (upMgrList) {
    var datasetModel = this._sourceHost;
    var transformOption = datasetModel.get('transform', true);
    var fromTransformResult = datasetModel.get('fromTransformResult', true);

    if (process.env.NODE_ENV !== 'production') {
      util_1.assert(fromTransformResult != null || transformOption != null);
    }

    if (fromTransformResult != null) {
      var errMsg = '';

      if (upMgrList.length !== 1) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = 'When using `fromTransformResult`, there should be only one upstream dataset';
        }

        doThrow(errMsg);
      }
    }

    var sourceList;
    var upSourceList = [];
    var upstreamSignList = [];
    util_1.each(upMgrList, function (upMgr) {
      upMgr.prepareSource();
      var upSource = upMgr.getSource(fromTransformResult || 0);
      var errMsg = '';

      if (fromTransformResult != null && !upSource) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = 'Can not retrieve result by `fromTransformResult`: ' + fromTransformResult;
        }

        doThrow(errMsg);
      }

      upSourceList.push(upSource);
      upstreamSignList.push(upMgr._getVersionSign());
    });

    if (transformOption) {
      sourceList = transform_1.applyDataTransform(transformOption, upSourceList, {
        datasetIndex: datasetModel.componentIndex
      });
    } else if (fromTransformResult != null) {
      sourceList = [Source_1.cloneSourceShallow(upSourceList[0])];
    }

    return {
      sourceList: sourceList,
      upstreamSignList: upstreamSignList
    };
  };

  SourceManager.prototype._isDirty = function () {
    var sourceList = this._sourceList;

    if (!sourceList.length) {
      return true;
    }

    var upSourceMgrList = this._getUpstreamSourceManagers();

    for (var i = 0; i < upSourceMgrList.length; i++) {
      var upSrcMgr = upSourceMgrList[i];

      if (upSrcMgr._isDirty() || this._upstreamSignList[i] !== upSrcMgr._getVersionSign()) {
        return true;
      }
    }
  };

  SourceManager.prototype.getSource = function (sourceIndex) {
    return this._sourceList[sourceIndex || 0];
  };

  SourceManager.prototype._getUpstreamSourceManagers = function () {
    var sourceHost = this._sourceHost;

    if (isSeries(sourceHost)) {
      var datasetModel = sourceHelper_1.querySeriesUpstreamDatasetModel(sourceHost);
      return !datasetModel ? [] : [datasetModel.getSourceManager()];
    } else {
      return util_1.map(sourceHelper_1.queryDatasetUpstreamDatasetModels(sourceHost), function (datasetModel) {
        return datasetModel.getSourceManager();
      });
    }
  };

  SourceManager.prototype._getSourceMetaRawOption = function () {
    var sourceHost = this._sourceHost;
    var seriesLayoutBy;
    var sourceHeader;
    var dimensions;

    if (isSeries(sourceHost)) {
      seriesLayoutBy = sourceHost.get('seriesLayoutBy', true);
      sourceHeader = sourceHost.get('sourceHeader', true);
      dimensions = sourceHost.get('dimensions', true);
    } else if (!this._getUpstreamSourceManagers().length) {
      var model = sourceHost;
      seriesLayoutBy = model.get('seriesLayoutBy', true);
      sourceHeader = model.get('sourceHeader', true);
      dimensions = model.get('dimensions', true);
    }

    return {
      seriesLayoutBy: seriesLayoutBy,
      sourceHeader: sourceHeader,
      dimensions: dimensions
    };
  };

  return SourceManager;
}();

exports.SourceManager = SourceManager;

function disableTransformOptionMerge(datasetModel) {
  var transformOption = datasetModel.option.transform;
  transformOption && util_1.setAsPrimitive(datasetModel.option.transform);
}

exports.disableTransformOptionMerge = disableTransformOptionMerge;

function isSeries(sourceHost) {
  return sourceHost.mainType === 'series';
}

function doThrow(errMsg) {
  throw new Error(errMsg);
}