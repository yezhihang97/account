
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

var graphic = require("../../util/graphic");

var Line_1 = require("./Line");

var labelStyle_1 = require("../../label/labelStyle");

var LineDraw = function () {
  function LineDraw(LineCtor) {
    this.group = new graphic.Group();
    this._LineCtor = LineCtor || Line_1["default"];
  }

  LineDraw.prototype.isPersistent = function () {
    return true;
  };

  ;

  LineDraw.prototype.updateData = function (lineData) {
    var _this = this;

    var lineDraw = this;
    var group = lineDraw.group;
    var oldLineData = lineDraw._lineData;
    lineDraw._lineData = lineData;

    if (!oldLineData) {
      group.removeAll();
    }

    var seriesScope = makeSeriesScope(lineData);
    lineData.diff(oldLineData).add(function (idx) {
      _this._doAdd(lineData, idx, seriesScope);
    }).update(function (newIdx, oldIdx) {
      _this._doUpdate(oldLineData, lineData, oldIdx, newIdx, seriesScope);
    }).remove(function (idx) {
      group.remove(oldLineData.getItemGraphicEl(idx));
    }).execute();
  };

  ;

  LineDraw.prototype.updateLayout = function () {
    var lineData = this._lineData;

    if (!lineData) {
      return;
    }

    lineData.eachItemGraphicEl(function (el, idx) {
      el.updateLayout(lineData, idx);
    }, this);
  };

  ;

  LineDraw.prototype.incrementalPrepareUpdate = function (lineData) {
    this._seriesScope = makeSeriesScope(lineData);
    this._lineData = null;
    this.group.removeAll();
  };

  ;

  LineDraw.prototype.incrementalUpdate = function (taskParams, lineData) {
    function updateIncrementalAndHover(el) {
      if (!el.isGroup && !isEffectObject(el)) {
        el.incremental = true;
        el.ensureState('emphasis').hoverLayer = true;
      }
    }

    for (var idx = taskParams.start; idx < taskParams.end; idx++) {
      var itemLayout = lineData.getItemLayout(idx);

      if (lineNeedsDraw(itemLayout)) {
        var el = new this._LineCtor(lineData, idx, this._seriesScope);
        el.traverse(updateIncrementalAndHover);
        this.group.add(el);
        lineData.setItemGraphicEl(idx, el);
      }
    }
  };

  ;

  LineDraw.prototype.remove = function () {
    this.group.removeAll();
  };

  ;

  LineDraw.prototype._doAdd = function (lineData, idx, seriesScope) {
    var itemLayout = lineData.getItemLayout(idx);

    if (!lineNeedsDraw(itemLayout)) {
      return;
    }

    var el = new this._LineCtor(lineData, idx, seriesScope);
    lineData.setItemGraphicEl(idx, el);
    this.group.add(el);
  };

  LineDraw.prototype._doUpdate = function (oldLineData, newLineData, oldIdx, newIdx, seriesScope) {
    var itemEl = oldLineData.getItemGraphicEl(oldIdx);

    if (!lineNeedsDraw(newLineData.getItemLayout(newIdx))) {
      this.group.remove(itemEl);
      return;
    }

    if (!itemEl) {
      itemEl = new this._LineCtor(newLineData, newIdx, seriesScope);
    } else {
      itemEl.updateData(newLineData, newIdx, seriesScope);
    }

    newLineData.setItemGraphicEl(newIdx, itemEl);
    this.group.add(itemEl);
  };

  return LineDraw;
}();

function isEffectObject(el) {
  return el.animators && el.animators.length > 0;
}

function makeSeriesScope(lineData) {
  var hostModel = lineData.hostModel;
  return {
    lineStyle: hostModel.getModel('lineStyle').getLineStyle(),
    emphasisLineStyle: hostModel.getModel(['emphasis', 'lineStyle']).getLineStyle(),
    blurLineStyle: hostModel.getModel(['blur', 'lineStyle']).getLineStyle(),
    selectLineStyle: hostModel.getModel(['select', 'lineStyle']).getLineStyle(),
    labelStatesModels: labelStyle_1.getLabelStatesModels(hostModel)
  };
}

function isPointNaN(pt) {
  return isNaN(pt[0]) || isNaN(pt[1]);
}

function lineNeedsDraw(pts) {
  return !isPointNaN(pts[0]) && !isPointNaN(pts[1]);
}

exports["default"] = LineDraw;