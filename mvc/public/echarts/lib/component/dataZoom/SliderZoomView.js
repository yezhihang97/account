
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

var util_1 = require("zrender/lib/core/util");

var eventTool = require("zrender/lib/core/event");

var graphic = require("../../util/graphic");

var throttle = require("../../util/throttle");

var DataZoomView_1 = require("./DataZoomView");

var number_1 = require("../../util/number");

var layout = require("../../util/layout");

var sliderMove_1 = require("../helper/sliderMove");

var Component_1 = require("../../view/Component");

var helper_1 = require("./helper");

var states_1 = require("../../util/states");

var symbol_1 = require("../../util/symbol");

var log_1 = require("../../util/log");

var Rect = graphic.Rect;
var DEFAULT_LOCATION_EDGE_GAP = 7;
var DEFAULT_FRAME_BORDER_WIDTH = 1;
var DEFAULT_FILLER_SIZE = 30;
var DEFAULT_MOVE_HANDLE_SIZE = 7;
var HORIZONTAL = 'horizontal';
var VERTICAL = 'vertical';
var LABEL_GAP = 5;
var SHOW_DATA_SHADOW_SERIES_TYPE = ['line', 'bar', 'candlestick', 'scatter'];
var REALTIME_ANIMATION_CONFIG = {
  easing: 'cubicOut',
  duration: 100
};

var SliderZoomView = function (_super) {
  tslib_1.__extends(SliderZoomView, _super);

  function SliderZoomView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = SliderZoomView.type;
    _this._displayables = {};
    return _this;
  }

  SliderZoomView.prototype.init = function (ecModel, api) {
    this.api = api;
    this._onBrush = util_1.bind(this._onBrush, this);
    this._onBrushEnd = util_1.bind(this._onBrushEnd, this);
  };

  SliderZoomView.prototype.render = function (dataZoomModel, ecModel, api, payload) {
    _super.prototype.render.apply(this, arguments);

    throttle.createOrUpdate(this, '_dispatchZoomAction', dataZoomModel.get('throttle'), 'fixRate');
    this._orient = dataZoomModel.getOrient();

    if (dataZoomModel.get('show') === false) {
      this.group.removeAll();
      return;
    }

    if (dataZoomModel.noTarget()) {
      this._clear();

      this.group.removeAll();
      return;
    }

    if (!payload || payload.type !== 'dataZoom' || payload.from !== this.uid) {
      this._buildView();
    }

    this._updateView();
  };

  SliderZoomView.prototype.dispose = function () {
    this._clear();

    _super.prototype.dispose.apply(this, arguments);
  };

  SliderZoomView.prototype._clear = function () {
    throttle.clear(this, '_dispatchZoomAction');
    var zr = this.api.getZr();
    zr.off('mousemove', this._onBrush);
    zr.off('mouseup', this._onBrushEnd);
  };

  SliderZoomView.prototype._buildView = function () {
    var thisGroup = this.group;
    thisGroup.removeAll();
    this._brushing = false;
    this._displayables.brushRect = null;

    this._resetLocation();

    this._resetInterval();

    var barGroup = this._displayables.sliderGroup = new graphic.Group();

    this._renderBackground();

    this._renderHandle();

    this._renderDataShadow();

    thisGroup.add(barGroup);

    this._positionGroup();
  };

  SliderZoomView.prototype._resetLocation = function () {
    var dataZoomModel = this.dataZoomModel;
    var api = this.api;
    var showMoveHandle = dataZoomModel.get('brushSelect');
    var moveHandleSize = showMoveHandle ? DEFAULT_MOVE_HANDLE_SIZE : 0;

    var coordRect = this._findCoordRect();

    var ecSize = {
      width: api.getWidth(),
      height: api.getHeight()
    };
    var positionInfo = this._orient === HORIZONTAL ? {
      right: ecSize.width - coordRect.x - coordRect.width,
      top: ecSize.height - DEFAULT_FILLER_SIZE - DEFAULT_LOCATION_EDGE_GAP - moveHandleSize,
      width: coordRect.width,
      height: DEFAULT_FILLER_SIZE
    } : {
      right: DEFAULT_LOCATION_EDGE_GAP,
      top: coordRect.y,
      width: DEFAULT_FILLER_SIZE,
      height: coordRect.height
    };
    var layoutParams = layout.getLayoutParams(dataZoomModel.option);
    util_1.each(['right', 'top', 'width', 'height'], function (name) {
      if (layoutParams[name] === 'ph') {
        layoutParams[name] = positionInfo[name];
      }
    });
    var layoutRect = layout.getLayoutRect(layoutParams, ecSize);
    this._location = {
      x: layoutRect.x,
      y: layoutRect.y
    };
    this._size = [layoutRect.width, layoutRect.height];
    this._orient === VERTICAL && this._size.reverse();
  };

  SliderZoomView.prototype._positionGroup = function () {
    var thisGroup = this.group;
    var location = this._location;
    var orient = this._orient;
    var targetAxisModel = this.dataZoomModel.getFirstTargetAxisModel();
    var inverse = targetAxisModel && targetAxisModel.get('inverse');
    var sliderGroup = this._displayables.sliderGroup;
    var otherAxisInverse = (this._dataShadowInfo || {}).otherAxisInverse;
    sliderGroup.attr(orient === HORIZONTAL && !inverse ? {
      scaleY: otherAxisInverse ? 1 : -1,
      scaleX: 1
    } : orient === HORIZONTAL && inverse ? {
      scaleY: otherAxisInverse ? 1 : -1,
      scaleX: -1
    } : orient === VERTICAL && !inverse ? {
      scaleY: otherAxisInverse ? -1 : 1,
      scaleX: 1,
      rotation: Math.PI / 2
    } : {
      scaleY: otherAxisInverse ? -1 : 1,
      scaleX: -1,
      rotation: Math.PI / 2
    });
    var rect = thisGroup.getBoundingRect([sliderGroup]);
    thisGroup.x = location.x - rect.x;
    thisGroup.y = location.y - rect.y;
    thisGroup.markRedraw();
  };

  SliderZoomView.prototype._getViewExtent = function () {
    return [0, this._size[0]];
  };

  SliderZoomView.prototype._renderBackground = function () {
    var dataZoomModel = this.dataZoomModel;
    var size = this._size;
    var barGroup = this._displayables.sliderGroup;
    var brushSelect = dataZoomModel.get('brushSelect');
    barGroup.add(new Rect({
      silent: true,
      shape: {
        x: 0,
        y: 0,
        width: size[0],
        height: size[1]
      },
      style: {
        fill: dataZoomModel.get('backgroundColor')
      },
      z2: -40
    }));
    var clickPanel = new Rect({
      shape: {
        x: 0,
        y: 0,
        width: size[0],
        height: size[1]
      },
      style: {
        fill: 'transparent'
      },
      z2: 0,
      onclick: util_1.bind(this._onClickPanel, this)
    });
    var zr = this.api.getZr();

    if (brushSelect) {
      clickPanel.on('mousedown', this._onBrushStart, this);
      clickPanel.cursor = 'crosshair';
      zr.on('mousemove', this._onBrush);
      zr.on('mouseup', this._onBrushEnd);
    } else {
      zr.off('mousemove', this._onBrush);
      zr.off('mouseup', this._onBrushEnd);
    }

    barGroup.add(clickPanel);
  };

  SliderZoomView.prototype._renderDataShadow = function () {
    var info = this._dataShadowInfo = this._prepareDataShadowInfo();

    this._displayables.dataShadowSegs = [];

    if (!info) {
      return;
    }

    var size = this._size;
    var seriesModel = info.series;
    var data = seriesModel.getRawData();
    var otherDim = seriesModel.getShadowDim ? seriesModel.getShadowDim() : info.otherDim;

    if (otherDim == null) {
      return;
    }

    var otherDataExtent = data.getDataExtent(otherDim);
    var otherOffset = (otherDataExtent[1] - otherDataExtent[0]) * 0.3;
    otherDataExtent = [otherDataExtent[0] - otherOffset, otherDataExtent[1] + otherOffset];
    var otherShadowExtent = [0, size[1]];
    var thisShadowExtent = [0, size[0]];
    var areaPoints = [[size[0], 0], [0, 0]];
    var linePoints = [];
    var step = thisShadowExtent[1] / (data.count() - 1);
    var thisCoord = 0;
    var stride = Math.round(data.count() / size[0]);
    var lastIsEmpty;
    data.each([otherDim], function (value, index) {
      if (stride > 0 && index % stride) {
        thisCoord += step;
        return;
      }

      var isEmpty = value == null || isNaN(value) || value === '';
      var otherCoord = isEmpty ? 0 : number_1.linearMap(value, otherDataExtent, otherShadowExtent, true);

      if (isEmpty && !lastIsEmpty && index) {
        areaPoints.push([areaPoints[areaPoints.length - 1][0], 0]);
        linePoints.push([linePoints[linePoints.length - 1][0], 0]);
      } else if (!isEmpty && lastIsEmpty) {
        areaPoints.push([thisCoord, 0]);
        linePoints.push([thisCoord, 0]);
      }

      areaPoints.push([thisCoord, otherCoord]);
      linePoints.push([thisCoord, otherCoord]);
      thisCoord += step;
      lastIsEmpty = isEmpty;
    });
    var dataZoomModel = this.dataZoomModel;

    function createDataShadowGroup(isSelectedArea) {
      var model = dataZoomModel.getModel(isSelectedArea ? 'selectedDataBackground' : 'dataBackground');
      var group = new graphic.Group();
      var polygon = new graphic.Polygon({
        shape: {
          points: areaPoints
        },
        segmentIgnoreThreshold: 1,
        style: model.getModel('areaStyle').getAreaStyle(),
        silent: true,
        z2: -20
      });
      var polyline = new graphic.Polyline({
        shape: {
          points: linePoints
        },
        segmentIgnoreThreshold: 1,
        style: model.getModel('lineStyle').getLineStyle(),
        silent: true,
        z2: -19
      });
      group.add(polygon);
      group.add(polyline);
      return group;
    }

    for (var i = 0; i < 3; i++) {
      var group = createDataShadowGroup(i === 1);

      this._displayables.sliderGroup.add(group);

      this._displayables.dataShadowSegs.push(group);
    }
  };

  SliderZoomView.prototype._prepareDataShadowInfo = function () {
    var dataZoomModel = this.dataZoomModel;
    var showDataShadow = dataZoomModel.get('showDataShadow');

    if (showDataShadow === false) {
      return;
    }

    var result;
    var ecModel = this.ecModel;
    dataZoomModel.eachTargetAxis(function (axisDim, axisIndex) {
      var seriesModels = dataZoomModel.getAxisProxy(axisDim, axisIndex).getTargetSeriesModels();
      util_1.each(seriesModels, function (seriesModel) {
        if (result) {
          return;
        }

        if (showDataShadow !== true && util_1.indexOf(SHOW_DATA_SHADOW_SERIES_TYPE, seriesModel.get('type')) < 0) {
          return;
        }

        var thisAxis = ecModel.getComponent(helper_1.getAxisMainType(axisDim), axisIndex).axis;
        var otherDim = getOtherDim(axisDim);
        var otherAxisInverse;
        var coordSys = seriesModel.coordinateSystem;

        if (otherDim != null && coordSys.getOtherAxis) {
          otherAxisInverse = coordSys.getOtherAxis(thisAxis).inverse;
        }

        otherDim = seriesModel.getData().mapDimension(otherDim);
        result = {
          thisAxis: thisAxis,
          series: seriesModel,
          thisDim: axisDim,
          otherDim: otherDim,
          otherAxisInverse: otherAxisInverse
        };
      }, this);
    }, this);
    return result;
  };

  SliderZoomView.prototype._renderHandle = function () {
    var thisGroup = this.group;
    var displayables = this._displayables;
    var handles = displayables.handles = [null, null];
    var handleLabels = displayables.handleLabels = [null, null];
    var sliderGroup = this._displayables.sliderGroup;
    var size = this._size;
    var dataZoomModel = this.dataZoomModel;
    var api = this.api;
    var borderRadius = dataZoomModel.get('borderRadius') || 0;
    var brushSelect = dataZoomModel.get('brushSelect');
    var filler = displayables.filler = new Rect({
      silent: brushSelect,
      style: {
        fill: dataZoomModel.get('fillerColor')
      },
      textConfig: {
        position: 'inside'
      }
    });
    sliderGroup.add(filler);
    sliderGroup.add(new Rect({
      silent: true,
      subPixelOptimize: true,
      shape: {
        x: 0,
        y: 0,
        width: size[0],
        height: size[1],
        r: borderRadius
      },
      style: {
        stroke: dataZoomModel.get('dataBackgroundColor') || dataZoomModel.get('borderColor'),
        lineWidth: DEFAULT_FRAME_BORDER_WIDTH,
        fill: 'rgba(0,0,0,0)'
      }
    }));
    util_1.each([0, 1], function (handleIndex) {
      var iconStr = dataZoomModel.get('handleIcon');

      if (!symbol_1.symbolBuildProxies[iconStr] && iconStr.indexOf('path://') < 0) {
        iconStr = 'path://' + iconStr;

        if (process.env.NODE_ENV !== 'production') {
          log_1.deprecateLog('handleIcon now needs \'path://\' prefix when using a path string');
        }
      }

      var path = symbol_1.createSymbol(iconStr, -1, 0, 2, 2, null, true);
      path.attr({
        cursor: getCursor(this._orient),
        draggable: true,
        drift: util_1.bind(this._onDragMove, this, handleIndex),
        ondragend: util_1.bind(this._onDragEnd, this),
        onmouseover: util_1.bind(this._showDataInfo, this, true),
        onmouseout: util_1.bind(this._showDataInfo, this, false),
        z2: 5
      });
      var bRect = path.getBoundingRect();
      var handleSize = dataZoomModel.get('handleSize');
      this._handleHeight = number_1.parsePercent(handleSize, this._size[1]);
      this._handleWidth = bRect.width / bRect.height * this._handleHeight;
      path.setStyle(dataZoomModel.getModel('handleStyle').getItemStyle());
      path.style.strokeNoScale = true;
      path.rectHover = true;
      path.ensureState('emphasis').style = dataZoomModel.getModel(['emphasis', 'handleStyle']).getItemStyle();
      states_1.enableHoverEmphasis(path);
      var handleColor = dataZoomModel.get('handleColor');

      if (handleColor != null) {
        path.style.fill = handleColor;
      }

      sliderGroup.add(handles[handleIndex] = path);
      var textStyleModel = dataZoomModel.getModel('textStyle');
      thisGroup.add(handleLabels[handleIndex] = new graphic.Text({
        silent: true,
        invisible: true,
        style: {
          x: 0,
          y: 0,
          text: '',
          verticalAlign: 'middle',
          align: 'center',
          fill: textStyleModel.getTextColor(),
          font: textStyleModel.getFont()
        },
        z2: 10
      }));
    }, this);
    var actualMoveZone = filler;

    if (brushSelect) {
      var moveHandleHeight = number_1.parsePercent(dataZoomModel.get('moveHandleSize'), size[1]);
      var moveHandle_1 = displayables.moveHandle = new graphic.Rect({
        style: dataZoomModel.getModel('moveHandleStyle').getItemStyle(),
        silent: true,
        shape: {
          r: [0, 0, 2, 2],
          y: size[1] - 0.5,
          height: moveHandleHeight
        }
      });
      var iconSize = moveHandleHeight * 0.8;
      var moveHandleIcon = displayables.moveHandleIcon = symbol_1.createSymbol(dataZoomModel.get('moveHandleIcon'), -iconSize / 2, -iconSize / 2, iconSize, iconSize, '#fff', true);
      moveHandleIcon.silent = true;
      moveHandleIcon.y = size[1] + moveHandleHeight / 2 - 0.5;
      moveHandle_1.ensureState('emphasis').style = dataZoomModel.getModel(['emphasis', 'moveHandleStyle']).getItemStyle();
      var moveZoneExpandSize = Math.min(size[1] / 2, Math.max(moveHandleHeight, 10));
      actualMoveZone = displayables.moveZone = new graphic.Rect({
        invisible: true,
        shape: {
          y: size[1] - moveZoneExpandSize,
          height: moveHandleHeight + moveZoneExpandSize
        }
      });
      actualMoveZone.on('mouseover', function () {
        api.enterEmphasis(moveHandle_1);
      }).on('mouseout', function () {
        api.leaveEmphasis(moveHandle_1);
      });
      sliderGroup.add(moveHandle_1);
      sliderGroup.add(moveHandleIcon);
      sliderGroup.add(actualMoveZone);
    }

    actualMoveZone.attr({
      draggable: true,
      cursor: getCursor(this._orient),
      drift: util_1.bind(this._onDragMove, this, 'all'),
      ondragstart: util_1.bind(this._showDataInfo, this, true),
      ondragend: util_1.bind(this._onDragEnd, this),
      onmouseover: util_1.bind(this._showDataInfo, this, true),
      onmouseout: util_1.bind(this._showDataInfo, this, false)
    });
  };

  SliderZoomView.prototype._resetInterval = function () {
    var range = this._range = this.dataZoomModel.getPercentRange();

    var viewExtent = this._getViewExtent();

    this._handleEnds = [number_1.linearMap(range[0], [0, 100], viewExtent, true), number_1.linearMap(range[1], [0, 100], viewExtent, true)];
  };

  SliderZoomView.prototype._updateInterval = function (handleIndex, delta) {
    var dataZoomModel = this.dataZoomModel;
    var handleEnds = this._handleEnds;

    var viewExtend = this._getViewExtent();

    var minMaxSpan = dataZoomModel.findRepresentativeAxisProxy().getMinMaxSpan();
    var percentExtent = [0, 100];
    sliderMove_1["default"](delta, handleEnds, viewExtend, dataZoomModel.get('zoomLock') ? 'all' : handleIndex, minMaxSpan.minSpan != null ? number_1.linearMap(minMaxSpan.minSpan, percentExtent, viewExtend, true) : null, minMaxSpan.maxSpan != null ? number_1.linearMap(minMaxSpan.maxSpan, percentExtent, viewExtend, true) : null);
    var lastRange = this._range;
    var range = this._range = number_1.asc([number_1.linearMap(handleEnds[0], viewExtend, percentExtent, true), number_1.linearMap(handleEnds[1], viewExtend, percentExtent, true)]);
    return !lastRange || lastRange[0] !== range[0] || lastRange[1] !== range[1];
  };

  SliderZoomView.prototype._updateView = function (nonRealtime) {
    var displaybles = this._displayables;
    var handleEnds = this._handleEnds;
    var handleInterval = number_1.asc(handleEnds.slice());
    var size = this._size;
    util_1.each([0, 1], function (handleIndex) {
      var handle = displaybles.handles[handleIndex];
      var handleHeight = this._handleHeight;
      handle.attr({
        scaleX: handleHeight / 2,
        scaleY: handleHeight / 2,
        x: handleEnds[handleIndex] + (handleIndex ? -1 : 1),
        y: size[1] / 2 - handleHeight / 2
      });
    }, this);
    displaybles.filler.setShape({
      x: handleInterval[0],
      y: 0,
      width: handleInterval[1] - handleInterval[0],
      height: size[1]
    });
    var viewExtent = {
      x: handleInterval[0],
      width: handleInterval[1] - handleInterval[0]
    };

    if (displaybles.moveHandle) {
      displaybles.moveHandle.setShape(viewExtent);
      displaybles.moveZone.setShape(viewExtent);
      displaybles.moveZone.getBoundingRect();
      displaybles.moveHandleIcon && displaybles.moveHandleIcon.attr('x', viewExtent.x + viewExtent.width / 2);
    }

    var dataShadowSegs = displaybles.dataShadowSegs;
    var segIntervals = [0, handleInterval[0], handleInterval[1], size[0]];

    for (var i = 0; i < dataShadowSegs.length; i++) {
      var segGroup = dataShadowSegs[i];
      var clipPath = segGroup.getClipPath();

      if (!clipPath) {
        clipPath = new graphic.Rect();
        segGroup.setClipPath(clipPath);
      }

      clipPath.setShape({
        x: segIntervals[i],
        y: 0,
        width: segIntervals[i + 1] - segIntervals[i],
        height: size[1]
      });
    }

    this._updateDataInfo(nonRealtime);
  };

  SliderZoomView.prototype._updateDataInfo = function (nonRealtime) {
    var dataZoomModel = this.dataZoomModel;
    var displaybles = this._displayables;
    var handleLabels = displaybles.handleLabels;
    var orient = this._orient;
    var labelTexts = ['', ''];

    if (dataZoomModel.get('showDetail')) {
      var axisProxy = dataZoomModel.findRepresentativeAxisProxy();

      if (axisProxy) {
        var axis = axisProxy.getAxisModel().axis;
        var range = this._range;
        var dataInterval = nonRealtime ? axisProxy.calculateDataWindow({
          start: range[0],
          end: range[1]
        }).valueWindow : axisProxy.getDataValueWindow();
        labelTexts = [this._formatLabel(dataInterval[0], axis), this._formatLabel(dataInterval[1], axis)];
      }
    }

    var orderedHandleEnds = number_1.asc(this._handleEnds.slice());
    setLabel.call(this, 0);
    setLabel.call(this, 1);

    function setLabel(handleIndex) {
      var barTransform = graphic.getTransform(displaybles.handles[handleIndex].parent, this.group);
      var direction = graphic.transformDirection(handleIndex === 0 ? 'right' : 'left', barTransform);
      var offset = this._handleWidth / 2 + LABEL_GAP;
      var textPoint = graphic.applyTransform([orderedHandleEnds[handleIndex] + (handleIndex === 0 ? -offset : offset), this._size[1] / 2], barTransform);
      handleLabels[handleIndex].setStyle({
        x: textPoint[0],
        y: textPoint[1],
        verticalAlign: orient === HORIZONTAL ? 'middle' : direction,
        align: orient === HORIZONTAL ? direction : 'center',
        text: labelTexts[handleIndex]
      });
    }
  };

  SliderZoomView.prototype._formatLabel = function (value, axis) {
    var dataZoomModel = this.dataZoomModel;
    var labelFormatter = dataZoomModel.get('labelFormatter');
    var labelPrecision = dataZoomModel.get('labelPrecision');

    if (labelPrecision == null || labelPrecision === 'auto') {
      labelPrecision = axis.getPixelPrecision();
    }

    var valueStr = value == null || isNaN(value) ? '' : axis.type === 'category' || axis.type === 'time' ? axis.scale.getLabel({
      value: Math.round(value)
    }) : value.toFixed(Math.min(labelPrecision, 20));
    return util_1.isFunction(labelFormatter) ? labelFormatter(value, valueStr) : util_1.isString(labelFormatter) ? labelFormatter.replace('{value}', valueStr) : valueStr;
  };

  SliderZoomView.prototype._showDataInfo = function (showOrHide) {
    showOrHide = this._dragging || showOrHide;
    var displayables = this._displayables;
    var handleLabels = displayables.handleLabels;
    handleLabels[0].attr('invisible', !showOrHide);
    handleLabels[1].attr('invisible', !showOrHide);
    displayables.moveHandle && this.api[showOrHide ? 'enterEmphasis' : 'leaveEmphasis'](displayables.moveHandle, 1);
  };

  SliderZoomView.prototype._onDragMove = function (handleIndex, dx, dy, event) {
    this._dragging = true;
    eventTool.stop(event.event);

    var barTransform = this._displayables.sliderGroup.getLocalTransform();

    var vertex = graphic.applyTransform([dx, dy], barTransform, true);

    var changed = this._updateInterval(handleIndex, vertex[0]);

    var realtime = this.dataZoomModel.get('realtime');

    this._updateView(!realtime);

    changed && realtime && this._dispatchZoomAction(true);
  };

  SliderZoomView.prototype._onDragEnd = function () {
    this._dragging = false;

    this._showDataInfo(false);

    var realtime = this.dataZoomModel.get('realtime');
    !realtime && this._dispatchZoomAction(false);
  };

  SliderZoomView.prototype._onClickPanel = function (e) {
    var size = this._size;

    var localPoint = this._displayables.sliderGroup.transformCoordToLocal(e.offsetX, e.offsetY);

    if (localPoint[0] < 0 || localPoint[0] > size[0] || localPoint[1] < 0 || localPoint[1] > size[1]) {
      return;
    }

    var handleEnds = this._handleEnds;
    var center = (handleEnds[0] + handleEnds[1]) / 2;

    var changed = this._updateInterval('all', localPoint[0] - center);

    this._updateView();

    changed && this._dispatchZoomAction(false);
  };

  SliderZoomView.prototype._onBrushStart = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    this._brushStart = new graphic.Point(x, y);
    this._brushing = true;
    this._brushStartTime = +new Date();
  };

  SliderZoomView.prototype._onBrushEnd = function (e) {
    if (!this._brushing) {
      return;
    }

    var brushRect = this._displayables.brushRect;
    this._brushing = false;

    if (!brushRect) {
      return;
    }

    brushRect.attr('ignore', true);
    var brushShape = brushRect.shape;
    var brushEndTime = +new Date();

    if (brushEndTime - this._brushStartTime < 200 && Math.abs(brushShape.width) < 5) {
      return;
    }

    var viewExtend = this._getViewExtent();

    var percentExtent = [0, 100];
    this._range = number_1.asc([number_1.linearMap(brushShape.x, viewExtend, percentExtent, true), number_1.linearMap(brushShape.x + brushShape.width, viewExtend, percentExtent, true)]);
    this._handleEnds = [brushShape.x, brushShape.x + brushShape.width];

    this._updateView();

    this._dispatchZoomAction(false);
  };

  SliderZoomView.prototype._onBrush = function (e) {
    if (this._brushing) {
      eventTool.stop(e.event);

      this._updateBrushRect(e.offsetX, e.offsetY);
    }
  };

  SliderZoomView.prototype._updateBrushRect = function (mouseX, mouseY) {
    var displayables = this._displayables;
    var dataZoomModel = this.dataZoomModel;
    var brushRect = displayables.brushRect;

    if (!brushRect) {
      brushRect = displayables.brushRect = new Rect({
        silent: true,
        style: dataZoomModel.getModel('brushStyle').getItemStyle()
      });
      displayables.sliderGroup.add(brushRect);
    }

    brushRect.attr('ignore', false);
    var brushStart = this._brushStart;
    var sliderGroup = this._displayables.sliderGroup;
    var endPoint = sliderGroup.transformCoordToLocal(mouseX, mouseY);
    var startPoint = sliderGroup.transformCoordToLocal(brushStart.x, brushStart.y);
    var size = this._size;
    endPoint[0] = Math.max(Math.min(size[0], endPoint[0]), 0);
    brushRect.setShape({
      x: startPoint[0],
      y: 0,
      width: endPoint[0] - startPoint[0],
      height: size[1]
    });
  };

  SliderZoomView.prototype._dispatchZoomAction = function (realtime) {
    var range = this._range;
    this.api.dispatchAction({
      type: 'dataZoom',
      from: this.uid,
      dataZoomId: this.dataZoomModel.id,
      animation: realtime ? REALTIME_ANIMATION_CONFIG : null,
      start: range[0],
      end: range[1]
    });
  };

  SliderZoomView.prototype._findCoordRect = function () {
    var rect;
    var coordSysInfoList = helper_1.collectReferCoordSysModelInfo(this.dataZoomModel).infoList;

    if (!rect && coordSysInfoList.length) {
      var coordSys = coordSysInfoList[0].model.coordinateSystem;
      rect = coordSys.getRect && coordSys.getRect();
    }

    if (!rect) {
      var width = this.api.getWidth();
      var height = this.api.getHeight();
      rect = {
        x: width * 0.2,
        y: height * 0.2,
        width: width * 0.6,
        height: height * 0.6
      };
    }

    return rect;
  };

  SliderZoomView.type = 'dataZoom.slider';
  return SliderZoomView;
}(DataZoomView_1["default"]);

function getOtherDim(thisDim) {
  var map = {
    x: 'y',
    y: 'x',
    radius: 'angle',
    angle: 'radius'
  };
  return map[thisDim];
}

function getCursor(orient) {
  return orient === 'vertical' ? 'ns-resize' : 'ew-resize';
}

Component_1["default"].registerClass(SliderZoomView);
exports["default"] = SliderZoomView;