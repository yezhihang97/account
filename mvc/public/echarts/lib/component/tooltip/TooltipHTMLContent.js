
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

var color_1 = require("zrender/lib/tool/color");

var event_1 = require("zrender/lib/core/event");

var dom_1 = require("zrender/lib/core/dom");

var env_1 = require("zrender/lib/core/env");

var format_1 = require("../../util/format");

var helper_1 = require("./helper");

var tooltipMarkup_1 = require("./tooltipMarkup");

var vendors = ['-ms-', '-moz-', '-o-', '-webkit-', ''];
var gCssText = 'position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;';

function mirrorPos(pos) {
  pos = pos === 'left' ? 'right' : pos === 'right' ? 'left' : pos === 'top' ? 'bottom' : 'top';
  return pos;
}

function assembleArrow(backgroundColor, borderColor, arrowPosition) {
  if (!util_1.isString(arrowPosition) || arrowPosition === 'inside') {
    return '';
  }

  borderColor = format_1.convertToColorString(borderColor);
  var arrowPos = mirrorPos(arrowPosition);
  var positionStyle = '';
  var transformStyle = '';

  if (util_1.indexOf(['left', 'right'], arrowPos) > -1) {
    positionStyle = arrowPos + ":-6px;top:50%;";
    transformStyle = "translateY(-50%) rotate(" + (arrowPos === 'left' ? -225 : -45) + "deg)";
  } else {
    positionStyle = arrowPos + ":-6px;left:50%;";
    transformStyle = "translateX(-50%) rotate(" + (arrowPos === 'top' ? 225 : 45) + "deg)";
  }

  transformStyle = util_1.map(vendors, function (vendorPrefix) {
    return vendorPrefix + 'transform:' + transformStyle;
  }).join(';');
  var styleCss = ['position:absolute;width:10px;height:10px;', "" + positionStyle + transformStyle + ";", "border-bottom: " + borderColor + " solid 1px;", "border-right: " + borderColor + " solid 1px;", "background-color: " + backgroundColor + ";", 'box-shadow: 8px 8px 16px -3px #000;'];
  return "<div style=\"" + styleCss.join('') + "\"></div>";
}

function assembleTransition(duration, onlyFade) {
  var transitionCurve = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var transitionText = 'opacity ' + duration / 2 + 's ' + transitionCurve + ',' + 'visibility ' + duration / 2 + 's ' + transitionCurve;

  if (!onlyFade) {
    transitionText += ',left ' + duration + 's ' + transitionCurve + ',top ' + duration + 's ' + transitionCurve;
  }

  return util_1.map(vendors, function (vendorPrefix) {
    return vendorPrefix + 'transition:' + transitionText;
  }).join(';');
}

function assembleFont(textStyleModel) {
  var cssText = [];
  var fontSize = textStyleModel.get('fontSize');
  var color = textStyleModel.getTextColor();
  color && cssText.push('color:' + color);
  cssText.push('font:' + textStyleModel.getFont());
  fontSize && cssText.push('line-height:' + Math.round(fontSize * 3 / 2) + 'px');
  var shadowColor = textStyleModel.get('textShadowColor');
  var shadowBlur = textStyleModel.get('textShadowBlur') || 0;
  var shadowOffsetX = textStyleModel.get('textShadowOffsetX') || 0;
  var shadowOffsetY = textStyleModel.get('textShadowOffsetY') || 0;
  shadowColor && shadowBlur && cssText.push('text-shadow:' + shadowOffsetX + 'px ' + shadowOffsetY + 'px ' + shadowBlur + 'px ' + shadowColor);
  util_1.each(['decoration', 'align'], function (name) {
    var val = textStyleModel.get(name);
    val && cssText.push('text-' + name + ':' + val);
  });
  return cssText.join(';');
}

function assembleCssText(tooltipModel, enableTransition, onlyFade) {
  var cssText = [];
  var transitionDuration = tooltipModel.get('transitionDuration');
  var backgroundColor = tooltipModel.get('backgroundColor');
  var shadowBlur = tooltipModel.get('shadowBlur');
  var shadowColor = tooltipModel.get('shadowColor');
  var shadowOffsetX = tooltipModel.get('shadowOffsetX');
  var shadowOffsetY = tooltipModel.get('shadowOffsetY');
  var textStyleModel = tooltipModel.getModel('textStyle');
  var padding = tooltipMarkup_1.getPaddingFromTooltipModel(tooltipModel, 'html');
  var boxShadow = shadowOffsetX + "px " + shadowOffsetY + "px " + shadowBlur + "px " + shadowColor;
  cssText.push('box-shadow:' + boxShadow);
  enableTransition && transitionDuration && cssText.push(assembleTransition(transitionDuration, onlyFade));

  if (backgroundColor) {
    if (env_1["default"].canvasSupported) {
      cssText.push('background-Color:' + backgroundColor);
    } else {
      cssText.push('background-Color:#' + color_1.toHex(backgroundColor));
      cssText.push('filter:alpha(opacity=70)');
    }
  }

  util_1.each(['width', 'color', 'radius'], function (name) {
    var borderName = 'border-' + name;
    var camelCase = format_1.toCamelCase(borderName);
    var val = tooltipModel.get(camelCase);
    val != null && cssText.push(borderName + ':' + val + (name === 'color' ? '' : 'px'));
  });
  cssText.push(assembleFont(textStyleModel));

  if (padding != null) {
    cssText.push('padding:' + format_1.normalizeCssArray(padding).join('px ') + 'px');
  }

  return cssText.join(';') + ';';
}

function makeStyleCoord(out, zr, appendToBody, zrX, zrY) {
  var zrPainter = zr && zr.painter;

  if (appendToBody) {
    var zrViewportRoot = zrPainter && zrPainter.getViewportRoot();

    if (zrViewportRoot) {
      dom_1.transformLocalCoord(out, zrViewportRoot, document.body, zrX, zrY);
    }
  } else {
    out[0] = zrX;
    out[1] = zrY;
    var viewportRootOffset = zrPainter && zrPainter.getViewportRootOffset();

    if (viewportRootOffset) {
      out[0] += viewportRootOffset.offsetLeft;
      out[1] += viewportRootOffset.offsetTop;
    }
  }

  out[2] = out[0] / zr.getWidth();
  out[3] = out[1] / zr.getHeight();
}

var TooltipHTMLContent = function () {
  function TooltipHTMLContent(container, api, opt) {
    this._show = false;
    this._styleCoord = [0, 0, 0, 0];
    this._enterable = true;
    this._firstShow = true;
    this._longHide = true;

    if (env_1["default"].wxa) {
      return null;
    }

    var el = document.createElement('div');
    el.domBelongToZr = true;
    this.el = el;
    var zr = this._zr = api.getZr();
    var appendToBody = this._appendToBody = opt && opt.appendToBody;
    makeStyleCoord(this._styleCoord, zr, appendToBody, api.getWidth() / 2, api.getHeight() / 2);

    if (appendToBody) {
      document.body.appendChild(el);
    } else {
      container.appendChild(el);
    }

    this._container = container;
    var self = this;

    el.onmouseenter = function () {
      if (self._enterable) {
        clearTimeout(self._hideTimeout);
        self._show = true;
      }

      self._inContent = true;
    };

    el.onmousemove = function (e) {
      e = e || window.event;

      if (!self._enterable) {
        var handler = zr.handler;
        var zrViewportRoot = zr.painter.getViewportRoot();
        event_1.normalizeEvent(zrViewportRoot, e, true);
        handler.dispatch('mousemove', e);
      }
    };

    el.onmouseleave = function () {
      self._inContent = false;

      if (self._enterable) {
        if (self._show) {
          self.hideLater(self._hideDelay);
        }
      }
    };
  }

  TooltipHTMLContent.prototype.update = function (tooltipModel) {
    var container = this._container;
    var stl = container.currentStyle || document.defaultView.getComputedStyle(container);
    var domStyle = container.style;

    if (domStyle.position !== 'absolute' && stl.position !== 'absolute') {
      domStyle.position = 'relative';
    }

    var alwaysShowContent = tooltipModel.get('alwaysShowContent');
    alwaysShowContent && this._moveIfResized();
    this.el.className = tooltipModel.get('className') || '';
  };

  TooltipHTMLContent.prototype.show = function (tooltipModel, nearPointColor) {
    clearTimeout(this._hideTimeout);
    clearTimeout(this._longHideTimeout);
    var el = this.el;
    var styleCoord = this._styleCoord;
    var offset = el.offsetHeight / 2;
    nearPointColor = format_1.convertToColorString(nearPointColor);
    el.style.cssText = gCssText + assembleCssText(tooltipModel, !this._firstShow, this._longHide) + ';left:' + styleCoord[0] + 'px;top:' + (styleCoord[1] - offset) + 'px;' + ("border-color: " + nearPointColor + ";") + (tooltipModel.get('extraCssText') || '');
    el.style.display = el.innerHTML ? 'block' : 'none';
    el.style.pointerEvents = this._enterable ? 'auto' : 'none';
    this._show = true;
    this._firstShow = false;
    this._longHide = false;
  };

  TooltipHTMLContent.prototype.setContent = function (content, markers, tooltipModel, borderColor, arrowPosition) {
    if (content == null) {
      return;
    }

    var el = this.el;

    if (util_1.isString(arrowPosition) && tooltipModel.get('trigger') === 'item' && !helper_1.shouldTooltipConfine(tooltipModel)) {
      content += assembleArrow(tooltipModel.get('backgroundColor'), borderColor, arrowPosition);
    }

    if (util_1.isString(content)) {
      el.innerHTML = content;
    } else if (content) {
      el.innerHTML = '';

      if (!util_1.isArray(content)) {
        content = [content];
      }

      for (var i = 0; i < content.length; i++) {
        if (util_1.isDom(content[i]) && content[i].parentNode !== el) {
          el.appendChild(content[i]);
        }
      }
    }
  };

  TooltipHTMLContent.prototype.setEnterable = function (enterable) {
    this._enterable = enterable;
  };

  TooltipHTMLContent.prototype.getSize = function () {
    var el = this.el;
    return [el.clientWidth, el.clientHeight];
  };

  TooltipHTMLContent.prototype.moveTo = function (zrX, zrY) {
    var styleCoord = this._styleCoord;
    makeStyleCoord(styleCoord, this._zr, this._appendToBody, zrX, zrY);

    if (styleCoord[0] != null && styleCoord[1] != null) {
      var style = this.el.style;
      style.left = styleCoord[0].toFixed(0) + 'px';
      style.top = styleCoord[1].toFixed(0) + 'px';
    }
  };

  TooltipHTMLContent.prototype._moveIfResized = function () {
    var ratioX = this._styleCoord[2];
    var ratioY = this._styleCoord[3];
    this.moveTo(ratioX * this._zr.getWidth(), ratioY * this._zr.getHeight());
  };

  TooltipHTMLContent.prototype.hide = function () {
    var _this = this;

    this.el.style.visibility = 'hidden';
    this.el.style.opacity = '0';
    this._show = false;
    this._longHideTimeout = setTimeout(function () {
      return _this._longHide = true;
    }, 500);
  };

  TooltipHTMLContent.prototype.hideLater = function (time) {
    if (this._show && !(this._inContent && this._enterable)) {
      if (time) {
        this._hideDelay = time;
        this._show = false;
        this._hideTimeout = setTimeout(util_1.bind(this.hide, this), time);
      } else {
        this.hide();
      }
    }
  };

  TooltipHTMLContent.prototype.isShow = function () {
    return this._show;
  };

  TooltipHTMLContent.prototype.dispose = function () {
    this.el.parentNode.removeChild(this.el);
  };

  TooltipHTMLContent.prototype.getOuterSize = function () {
    var width = this.el.clientWidth;
    var height = this.el.clientHeight;

    if (document.defaultView && document.defaultView.getComputedStyle) {
      var stl = document.defaultView.getComputedStyle(this.el);

      if (stl) {
        width += parseInt(stl.borderLeftWidth, 10) + parseInt(stl.borderRightWidth, 10);
        height += parseInt(stl.borderTopWidth, 10) + parseInt(stl.borderBottomWidth, 10);
      }
    }

    return {
      width: width,
      height: height
    };
  };

  return TooltipHTMLContent;
}();

exports["default"] = TooltipHTMLContent;