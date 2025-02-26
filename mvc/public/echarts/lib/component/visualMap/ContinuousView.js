
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

var zrUtil = require("zrender/lib/core/util");

var LinearGradient_1 = require("zrender/lib/graphic/LinearGradient");

var eventTool = require("zrender/lib/core/event");

var VisualMapView_1 = require("./VisualMapView");

var graphic = require("../../util/graphic");

var numberUtil = require("../../util/number");

var sliderMove_1 = require("../helper/sliderMove");

var helper = require("./helper");

var modelUtil = require("../../util/model");

var Component_1 = require("../../view/Component");

var text_1 = require("zrender/lib/contain/text");

var states_1 = require("../../util/states");

var symbol_1 = require("../../util/symbol");

var Image_1 = require("zrender/lib/graphic/Image");

var innerStore_1 = require("../../util/innerStore");

var linearMap = numberUtil.linearMap;
var each = zrUtil.each;
var mathMin = Math.min;
var mathMax = Math.max;
var HOVER_LINK_SIZE = 12;
var HOVER_LINK_OUT = 6;

var ContinuousView = function (_super) {
  tslib_1.__extends(ContinuousView, _super);

  function ContinuousView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ContinuousView.type;
    _this._shapes = {};
    _this._dataInterval = [];
    _this._handleEnds = [];
    _this._hoverLinkDataIndices = [];
    return _this;
  }

  ContinuousView.prototype.doRender = function (visualMapModel, ecModel, api, payload) {
    this._api = api;

    if (!payload || payload.type !== 'selectDataRange' || payload.from !== this.uid) {
      this._buildView();
    }
  };

  ContinuousView.prototype._buildView = function () {
    this.group.removeAll();
    var visualMapModel = this.visualMapModel;
    var thisGroup = this.group;
    this._orient = visualMapModel.get('orient');
    this._useHandle = visualMapModel.get('calculable');

    this._resetInterval();

    this._renderBar(thisGroup);

    var dataRangeText = visualMapModel.get('text');

    this._renderEndsText(thisGroup, dataRangeText, 0);

    this._renderEndsText(thisGroup, dataRangeText, 1);

    this._updateView(true);

    this.renderBackground(thisGroup);

    this._updateView();

    this._enableHoverLinkToSeries();

    this._enableHoverLinkFromSeries();

    this.positionGroup(thisGroup);
  };

  ContinuousView.prototype._renderEndsText = function (group, dataRangeText, endsIndex) {
    if (!dataRangeText) {
      return;
    }

    var text = dataRangeText[1 - endsIndex];
    text = text != null ? text + '' : '';
    var visualMapModel = this.visualMapModel;
    var textGap = visualMapModel.get('textGap');
    var itemSize = visualMapModel.itemSize;
    var barGroup = this._shapes.mainGroup;

    var position = this._applyTransform([itemSize[0] / 2, endsIndex === 0 ? -textGap : itemSize[1] + textGap], barGroup);

    var align = this._applyTransform(endsIndex === 0 ? 'bottom' : 'top', barGroup);

    var orient = this._orient;
    var textStyleModel = this.visualMapModel.textStyleModel;
    this.group.add(new graphic.Text({
      style: {
        x: position[0],
        y: position[1],
        verticalAlign: orient === 'horizontal' ? 'middle' : align,
        align: orient === 'horizontal' ? align : 'center',
        text: text,
        font: textStyleModel.getFont(),
        fill: textStyleModel.getTextColor()
      }
    }));
  };

  ContinuousView.prototype._renderBar = function (targetGroup) {
    var visualMapModel = this.visualMapModel;
    var shapes = this._shapes;
    var itemSize = visualMapModel.itemSize;
    var orient = this._orient;
    var useHandle = this._useHandle;
    var itemAlign = helper.getItemAlign(visualMapModel, this.api, itemSize);

    var mainGroup = shapes.mainGroup = this._createBarGroup(itemAlign);

    var gradientBarGroup = new graphic.Group();
    mainGroup.add(gradientBarGroup);
    gradientBarGroup.add(shapes.outOfRange = createPolygon());
    gradientBarGroup.add(shapes.inRange = createPolygon(null, useHandle ? getCursor(this._orient) : null, zrUtil.bind(this._dragHandle, this, 'all', false), zrUtil.bind(this._dragHandle, this, 'all', true)));
    gradientBarGroup.setClipPath(new graphic.Rect({
      shape: {
        x: 0,
        y: 0,
        width: itemSize[0],
        height: itemSize[1],
        r: 3
      }
    }));
    var textRect = visualMapModel.textStyleModel.getTextRect('国');
    var textSize = mathMax(textRect.width, textRect.height);

    if (useHandle) {
      shapes.handleThumbs = [];
      shapes.handleLabels = [];
      shapes.handleLabelPoints = [];

      this._createHandle(visualMapModel, mainGroup, 0, itemSize, textSize, orient);

      this._createHandle(visualMapModel, mainGroup, 1, itemSize, textSize, orient);
    }

    this._createIndicator(visualMapModel, mainGroup, itemSize, textSize, orient);

    targetGroup.add(mainGroup);
  };

  ContinuousView.prototype._createHandle = function (visualMapModel, mainGroup, handleIndex, itemSize, textSize, orient) {
    var onDrift = zrUtil.bind(this._dragHandle, this, handleIndex, false);
    var onDragEnd = zrUtil.bind(this._dragHandle, this, handleIndex, true);
    var handleSize = text_1.parsePercent(visualMapModel.get('handleSize'), itemSize[0]);
    var handleThumb = symbol_1.createSymbol(visualMapModel.get('handleIcon'), -handleSize / 2, -handleSize / 2, handleSize, handleSize, null, true);
    var cursor = getCursor(this._orient);
    handleThumb.attr({
      cursor: cursor,
      draggable: true,
      drift: onDrift,
      ondragend: onDragEnd,
      onmousemove: function (e) {
        eventTool.stop(e.event);
      }
    });
    handleThumb.x = itemSize[0] / 2;
    handleThumb.useStyle(visualMapModel.getModel('handleStyle').getItemStyle());
    handleThumb.setStyle({
      strokeNoScale: true,
      strokeFirst: true
    });
    handleThumb.style.lineWidth *= 2;
    handleThumb.ensureState('emphasis').style = visualMapModel.getModel(['emphasis', 'handleStyle']).getItemStyle();
    states_1.setAsHighDownDispatcher(handleThumb, true);
    mainGroup.add(handleThumb);
    var textStyleModel = this.visualMapModel.textStyleModel;
    var handleLabel = new graphic.Text({
      cursor: cursor,
      draggable: true,
      drift: onDrift,
      onmousemove: function (e) {
        eventTool.stop(e.event);
      },
      ondragend: onDragEnd,
      style: {
        x: 0,
        y: 0,
        text: '',
        font: textStyleModel.getFont(),
        fill: textStyleModel.getTextColor()
      }
    });
    handleLabel.ensureState('blur').style = {
      opacity: 0.1
    };
    handleLabel.stateTransition = {
      duration: 200
    };
    this.group.add(handleLabel);
    var handleLabelPoint = [handleSize, 0];
    var shapes = this._shapes;
    shapes.handleThumbs[handleIndex] = handleThumb;
    shapes.handleLabelPoints[handleIndex] = handleLabelPoint;
    shapes.handleLabels[handleIndex] = handleLabel;
  };

  ContinuousView.prototype._createIndicator = function (visualMapModel, mainGroup, itemSize, textSize, orient) {
    var scale = text_1.parsePercent(visualMapModel.get('indicatorSize'), itemSize[0]);
    var indicator = symbol_1.createSymbol(visualMapModel.get('indicatorIcon'), -scale / 2, -scale / 2, scale, scale, null, true);
    indicator.attr({
      cursor: 'move',
      invisible: true,
      silent: true,
      x: itemSize[0] / 2
    });
    var indicatorStyle = visualMapModel.getModel('indicatorStyle').getItemStyle();

    if (indicator instanceof Image_1["default"]) {
      var pathStyle = indicator.style;
      indicator.useStyle(zrUtil.extend({
        image: pathStyle.image,
        x: pathStyle.x,
        y: pathStyle.y,
        width: pathStyle.width,
        height: pathStyle.height
      }, indicatorStyle));
    } else {
      indicator.useStyle(indicatorStyle);
    }

    mainGroup.add(indicator);
    var textStyleModel = this.visualMapModel.textStyleModel;
    var indicatorLabel = new graphic.Text({
      silent: true,
      invisible: true,
      style: {
        x: 0,
        y: 0,
        text: '',
        font: textStyleModel.getFont(),
        fill: textStyleModel.getTextColor()
      }
    });
    this.group.add(indicatorLabel);
    var indicatorLabelPoint = [(orient === 'horizontal' ? textSize / 2 : HOVER_LINK_OUT) + itemSize[0] / 2, 0];
    var shapes = this._shapes;
    shapes.indicator = indicator;
    shapes.indicatorLabel = indicatorLabel;
    shapes.indicatorLabelPoint = indicatorLabelPoint;
    this._firstShowIndicator = true;
  };

  ContinuousView.prototype._dragHandle = function (handleIndex, isEnd, dx, dy) {
    if (!this._useHandle) {
      return;
    }

    this._dragging = !isEnd;

    if (!isEnd) {
      var vertex = this._applyTransform([dx, dy], this._shapes.mainGroup, true);

      this._updateInterval(handleIndex, vertex[1]);

      this._hideIndicator();

      this._updateView();
    }

    if (isEnd === !this.visualMapModel.get('realtime')) {
      this.api.dispatchAction({
        type: 'selectDataRange',
        from: this.uid,
        visualMapId: this.visualMapModel.id,
        selected: this._dataInterval.slice()
      });
    }

    if (isEnd) {
      !this._hovering && this._clearHoverLinkToSeries();
    } else if (useHoverLinkOnHandle(this.visualMapModel)) {
      this._doHoverLinkToSeries(this._handleEnds[handleIndex], false);
    }
  };

  ContinuousView.prototype._resetInterval = function () {
    var visualMapModel = this.visualMapModel;
    var dataInterval = this._dataInterval = visualMapModel.getSelected();
    var dataExtent = visualMapModel.getExtent();
    var sizeExtent = [0, visualMapModel.itemSize[1]];
    this._handleEnds = [linearMap(dataInterval[0], dataExtent, sizeExtent, true), linearMap(dataInterval[1], dataExtent, sizeExtent, true)];
  };

  ContinuousView.prototype._updateInterval = function (handleIndex, delta) {
    delta = delta || 0;
    var visualMapModel = this.visualMapModel;
    var handleEnds = this._handleEnds;
    var sizeExtent = [0, visualMapModel.itemSize[1]];
    sliderMove_1["default"](delta, handleEnds, sizeExtent, handleIndex, 0);
    var dataExtent = visualMapModel.getExtent();
    this._dataInterval = [linearMap(handleEnds[0], sizeExtent, dataExtent, true), linearMap(handleEnds[1], sizeExtent, dataExtent, true)];
  };

  ContinuousView.prototype._updateView = function (forSketch) {
    var visualMapModel = this.visualMapModel;
    var dataExtent = visualMapModel.getExtent();
    var shapes = this._shapes;
    var outOfRangeHandleEnds = [0, visualMapModel.itemSize[1]];
    var inRangeHandleEnds = forSketch ? outOfRangeHandleEnds : this._handleEnds;

    var visualInRange = this._createBarVisual(this._dataInterval, dataExtent, inRangeHandleEnds, 'inRange');

    var visualOutOfRange = this._createBarVisual(dataExtent, dataExtent, outOfRangeHandleEnds, 'outOfRange');

    shapes.inRange.setStyle({
      fill: visualInRange.barColor
    }).setShape('points', visualInRange.barPoints);
    shapes.outOfRange.setStyle({
      fill: visualOutOfRange.barColor
    }).setShape('points', visualOutOfRange.barPoints);

    this._updateHandle(inRangeHandleEnds, visualInRange);
  };

  ContinuousView.prototype._createBarVisual = function (dataInterval, dataExtent, handleEnds, forceState) {
    var opts = {
      forceState: forceState,
      convertOpacityToAlpha: true
    };

    var colorStops = this._makeColorGradient(dataInterval, opts);

    var symbolSizes = [this.getControllerVisual(dataInterval[0], 'symbolSize', opts), this.getControllerVisual(dataInterval[1], 'symbolSize', opts)];

    var barPoints = this._createBarPoints(handleEnds, symbolSizes);

    return {
      barColor: new LinearGradient_1["default"](0, 0, 0, 1, colorStops),
      barPoints: barPoints,
      handlesColor: [colorStops[0].color, colorStops[colorStops.length - 1].color]
    };
  };

  ContinuousView.prototype._makeColorGradient = function (dataInterval, opts) {
    var sampleNumber = 100;
    var colorStops = [];
    var step = (dataInterval[1] - dataInterval[0]) / sampleNumber;
    colorStops.push({
      color: this.getControllerVisual(dataInterval[0], 'color', opts),
      offset: 0
    });

    for (var i = 1; i < sampleNumber; i++) {
      var currValue = dataInterval[0] + step * i;

      if (currValue > dataInterval[1]) {
        break;
      }

      colorStops.push({
        color: this.getControllerVisual(currValue, 'color', opts),
        offset: i / sampleNumber
      });
    }

    colorStops.push({
      color: this.getControllerVisual(dataInterval[1], 'color', opts),
      offset: 1
    });
    return colorStops;
  };

  ContinuousView.prototype._createBarPoints = function (handleEnds, symbolSizes) {
    var itemSize = this.visualMapModel.itemSize;
    return [[itemSize[0] - symbolSizes[0], handleEnds[0]], [itemSize[0], handleEnds[0]], [itemSize[0], handleEnds[1]], [itemSize[0] - symbolSizes[1], handleEnds[1]]];
  };

  ContinuousView.prototype._createBarGroup = function (itemAlign) {
    var orient = this._orient;
    var inverse = this.visualMapModel.get('inverse');
    return new graphic.Group(orient === 'horizontal' && !inverse ? {
      scaleX: itemAlign === 'bottom' ? 1 : -1,
      rotation: Math.PI / 2
    } : orient === 'horizontal' && inverse ? {
      scaleX: itemAlign === 'bottom' ? -1 : 1,
      rotation: -Math.PI / 2
    } : orient === 'vertical' && !inverse ? {
      scaleX: itemAlign === 'left' ? 1 : -1,
      scaleY: -1
    } : {
      scaleX: itemAlign === 'left' ? 1 : -1
    });
  };

  ContinuousView.prototype._updateHandle = function (handleEnds, visualInRange) {
    if (!this._useHandle) {
      return;
    }

    var shapes = this._shapes;
    var visualMapModel = this.visualMapModel;
    var handleThumbs = shapes.handleThumbs;
    var handleLabels = shapes.handleLabels;
    var itemSize = visualMapModel.itemSize;
    var dataExtent = visualMapModel.getExtent();
    each([0, 1], function (handleIndex) {
      var handleThumb = handleThumbs[handleIndex];
      handleThumb.setStyle('fill', visualInRange.handlesColor[handleIndex]);
      handleThumb.y = handleEnds[handleIndex];
      var val = linearMap(handleEnds[handleIndex], [0, itemSize[1]], dataExtent, true);
      var symbolSize = this.getControllerVisual(val, 'symbolSize');
      handleThumb.scaleX = handleThumb.scaleY = symbolSize / itemSize[0];
      handleThumb.x = itemSize[0] - symbolSize / 2;
      var textPoint = graphic.applyTransform(shapes.handleLabelPoints[handleIndex], graphic.getTransform(handleThumb, this.group));
      handleLabels[handleIndex].setStyle({
        x: textPoint[0],
        y: textPoint[1],
        text: visualMapModel.formatValueText(this._dataInterval[handleIndex]),
        verticalAlign: 'middle',
        align: this._orient === 'vertical' ? this._applyTransform('left', shapes.mainGroup) : 'center'
      });
    }, this);
  };

  ContinuousView.prototype._showIndicator = function (cursorValue, textValue, rangeSymbol, halfHoverLinkSize) {
    var visualMapModel = this.visualMapModel;
    var dataExtent = visualMapModel.getExtent();
    var itemSize = visualMapModel.itemSize;
    var sizeExtent = [0, itemSize[1]];
    var shapes = this._shapes;
    var indicator = shapes.indicator;

    if (!indicator) {
      return;
    }

    indicator.attr('invisible', false);
    var opts = {
      convertOpacityToAlpha: true
    };
    var color = this.getControllerVisual(cursorValue, 'color', opts);
    var symbolSize = this.getControllerVisual(cursorValue, 'symbolSize');
    var y = linearMap(cursorValue, dataExtent, sizeExtent, true);
    var x = itemSize[0] - symbolSize / 2;
    var oldIndicatorPos = {
      x: indicator.x,
      y: indicator.y
    };
    indicator.y = y;
    indicator.x = x;
    var textPoint = graphic.applyTransform(shapes.indicatorLabelPoint, graphic.getTransform(indicator, this.group));
    var indicatorLabel = shapes.indicatorLabel;
    indicatorLabel.attr('invisible', false);

    var align = this._applyTransform('left', shapes.mainGroup);

    var orient = this._orient;
    var isHorizontal = orient === 'horizontal';
    indicatorLabel.setStyle({
      text: (rangeSymbol ? rangeSymbol : '') + visualMapModel.formatValueText(textValue),
      verticalAlign: isHorizontal ? align : 'middle',
      align: isHorizontal ? 'center' : align
    });
    var indicatorNewProps = {
      x: x,
      y: y,
      style: {
        fill: color
      }
    };
    var labelNewProps = {
      style: {
        x: textPoint[0],
        y: textPoint[1]
      }
    };

    if (visualMapModel.ecModel.isAnimationEnabled() && !this._firstShowIndicator) {
      var animationCfg = {
        duration: 100,
        easing: 'cubicInOut',
        additive: true
      };
      indicator.x = oldIndicatorPos.x;
      indicator.y = oldIndicatorPos.y;
      indicator.animateTo(indicatorNewProps, animationCfg);
      indicatorLabel.animateTo(labelNewProps, animationCfg);
    } else {
      indicator.attr(indicatorNewProps);
      indicatorLabel.attr(labelNewProps);
    }

    this._firstShowIndicator = false;
    var handleLabels = this._shapes.handleLabels;

    if (handleLabels) {
      for (var i = 0; i < handleLabels.length; i++) {
        this._api.enterBlur(handleLabels[i]);
      }
    }
  };

  ContinuousView.prototype._enableHoverLinkToSeries = function () {
    var self = this;

    this._shapes.mainGroup.on('mousemove', function (e) {
      self._hovering = true;

      if (!self._dragging) {
        var itemSize = self.visualMapModel.itemSize;

        var pos = self._applyTransform([e.offsetX, e.offsetY], self._shapes.mainGroup, true, true);

        pos[1] = mathMin(mathMax(0, pos[1]), itemSize[1]);

        self._doHoverLinkToSeries(pos[1], 0 <= pos[0] && pos[0] <= itemSize[0]);
      }
    }).on('mouseout', function () {
      self._hovering = false;
      !self._dragging && self._clearHoverLinkToSeries();
    });
  };

  ContinuousView.prototype._enableHoverLinkFromSeries = function () {
    var zr = this.api.getZr();

    if (this.visualMapModel.option.hoverLink) {
      zr.on('mouseover', this._hoverLinkFromSeriesMouseOver, this);
      zr.on('mouseout', this._hideIndicator, this);
    } else {
      this._clearHoverLinkFromSeries();
    }
  };

  ContinuousView.prototype._doHoverLinkToSeries = function (cursorPos, hoverOnBar) {
    var visualMapModel = this.visualMapModel;
    var itemSize = visualMapModel.itemSize;

    if (!visualMapModel.option.hoverLink) {
      return;
    }

    var sizeExtent = [0, itemSize[1]];
    var dataExtent = visualMapModel.getExtent();
    cursorPos = mathMin(mathMax(sizeExtent[0], cursorPos), sizeExtent[1]);
    var halfHoverLinkSize = getHalfHoverLinkSize(visualMapModel, dataExtent, sizeExtent);
    var hoverRange = [cursorPos - halfHoverLinkSize, cursorPos + halfHoverLinkSize];
    var cursorValue = linearMap(cursorPos, sizeExtent, dataExtent, true);
    var valueRange = [linearMap(hoverRange[0], sizeExtent, dataExtent, true), linearMap(hoverRange[1], sizeExtent, dataExtent, true)];
    hoverRange[0] < sizeExtent[0] && (valueRange[0] = -Infinity);
    hoverRange[1] > sizeExtent[1] && (valueRange[1] = Infinity);

    if (hoverOnBar) {
      if (valueRange[0] === -Infinity) {
        this._showIndicator(cursorValue, valueRange[1], '< ', halfHoverLinkSize);
      } else if (valueRange[1] === Infinity) {
        this._showIndicator(cursorValue, valueRange[0], '> ', halfHoverLinkSize);
      } else {
        this._showIndicator(cursorValue, cursorValue, '≈ ', halfHoverLinkSize);
      }
    }

    var oldBatch = this._hoverLinkDataIndices;
    var newBatch = [];

    if (hoverOnBar || useHoverLinkOnHandle(visualMapModel)) {
      newBatch = this._hoverLinkDataIndices = visualMapModel.findTargetDataIndices(valueRange);
    }

    var resultBatches = modelUtil.compressBatches(oldBatch, newBatch);

    this._dispatchHighDown('downplay', helper.makeHighDownBatch(resultBatches[0], visualMapModel));

    this._dispatchHighDown('highlight', helper.makeHighDownBatch(resultBatches[1], visualMapModel));
  };

  ContinuousView.prototype._hoverLinkFromSeriesMouseOver = function (e) {
    var el = e.target;
    var visualMapModel = this.visualMapModel;

    if (!el || innerStore_1.getECData(el).dataIndex == null) {
      return;
    }

    var ecData = innerStore_1.getECData(el);
    var dataModel = this.ecModel.getSeriesByIndex(ecData.seriesIndex);

    if (!visualMapModel.isTargetSeries(dataModel)) {
      return;
    }

    var data = dataModel.getData(ecData.dataType);
    var value = data.get(visualMapModel.getDataDimension(data), ecData.dataIndex);

    if (!isNaN(value)) {
      this._showIndicator(value, value);
    }
  };

  ContinuousView.prototype._hideIndicator = function () {
    var shapes = this._shapes;
    shapes.indicator && shapes.indicator.attr('invisible', true);
    shapes.indicatorLabel && shapes.indicatorLabel.attr('invisible', true);
    var handleLabels = this._shapes.handleLabels;

    if (handleLabels) {
      for (var i = 0; i < handleLabels.length; i++) {
        this._api.leaveBlur(handleLabels[i]);
      }
    }
  };

  ContinuousView.prototype._clearHoverLinkToSeries = function () {
    this._hideIndicator();

    var indices = this._hoverLinkDataIndices;

    this._dispatchHighDown('downplay', helper.makeHighDownBatch(indices, this.visualMapModel));

    indices.length = 0;
  };

  ContinuousView.prototype._clearHoverLinkFromSeries = function () {
    this._hideIndicator();

    var zr = this.api.getZr();
    zr.off('mouseover', this._hoverLinkFromSeriesMouseOver);
    zr.off('mouseout', this._hideIndicator);
  };

  ContinuousView.prototype._applyTransform = function (vertex, element, inverse, global) {
    var transform = graphic.getTransform(element, global ? null : this.group);
    return zrUtil.isArray(vertex) ? graphic.applyTransform(vertex, transform, inverse) : graphic.transformDirection(vertex, transform, inverse);
  };

  ContinuousView.prototype._dispatchHighDown = function (type, batch) {
    batch && batch.length && this.api.dispatchAction({
      type: type,
      batch: batch
    });
  };

  ContinuousView.prototype.dispose = function () {
    this._clearHoverLinkFromSeries();

    this._clearHoverLinkToSeries();
  };

  ContinuousView.prototype.remove = function () {
    this._clearHoverLinkFromSeries();

    this._clearHoverLinkToSeries();
  };

  ContinuousView.type = 'visualMap.continuous';
  return ContinuousView;
}(VisualMapView_1["default"]);

function createPolygon(points, cursor, onDrift, onDragEnd) {
  return new graphic.Polygon({
    shape: {
      points: points
    },
    draggable: !!onDrift,
    cursor: cursor,
    drift: onDrift,
    onmousemove: function (e) {
      eventTool.stop(e.event);
    },
    ondragend: onDragEnd
  });
}

function getHalfHoverLinkSize(visualMapModel, dataExtent, sizeExtent) {
  var halfHoverLinkSize = HOVER_LINK_SIZE / 2;
  var hoverLinkDataSize = visualMapModel.get('hoverLinkDataSize');

  if (hoverLinkDataSize) {
    halfHoverLinkSize = linearMap(hoverLinkDataSize, dataExtent, sizeExtent, true) / 2;
  }

  return halfHoverLinkSize;
}

function useHoverLinkOnHandle(visualMapModel) {
  var hoverLinkOnHandle = visualMapModel.get('hoverLinkOnHandle');
  return !!(hoverLinkOnHandle == null ? visualMapModel.get('realtime') : hoverLinkOnHandle);
}

function getCursor(orient) {
  return orient === 'vertical' ? 'ns-resize' : 'ew-resize';
}

Component_1["default"].registerClass(ContinuousView);
exports["default"] = ContinuousView;