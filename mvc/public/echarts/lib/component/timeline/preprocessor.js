
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

function timelinePreprocessor(option) {
  var timelineOpt = option && option.timeline;

  if (!zrUtil.isArray(timelineOpt)) {
    timelineOpt = timelineOpt ? [timelineOpt] : [];
  }

  zrUtil.each(timelineOpt, function (opt) {
    if (!opt) {
      return;
    }

    compatibleEC2(opt);
  });
}

exports["default"] = timelinePreprocessor;

function compatibleEC2(opt) {
  var type = opt.type;
  var ec2Types = {
    'number': 'value',
    'time': 'time'
  };

  if (ec2Types[type]) {
    opt.axisType = ec2Types[type];
    delete opt.type;
  }

  transferItem(opt);

  if (has(opt, 'controlPosition')) {
    var controlStyle = opt.controlStyle || (opt.controlStyle = {});

    if (!has(controlStyle, 'position')) {
      controlStyle.position = opt.controlPosition;
    }

    if (controlStyle.position === 'none' && !has(controlStyle, 'show')) {
      controlStyle.show = false;
      delete controlStyle.position;
    }

    delete opt.controlPosition;
  }

  zrUtil.each(opt.data || [], function (dataItem) {
    if (zrUtil.isObject(dataItem) && !zrUtil.isArray(dataItem)) {
      if (!has(dataItem, 'value') && has(dataItem, 'name')) {
        dataItem.value = dataItem.name;
      }

      transferItem(dataItem);
    }
  });
}

function transferItem(opt) {
  var itemStyle = opt.itemStyle || (opt.itemStyle = {});
  var itemStyleEmphasis = itemStyle.emphasis || (itemStyle.emphasis = {});
  var label = opt.label || opt.label || {};
  var labelNormal = label.normal || (label.normal = {});
  var excludeLabelAttr = {
    normal: 1,
    emphasis: 1
  };
  zrUtil.each(label, function (value, name) {
    if (!excludeLabelAttr[name] && !has(labelNormal, name)) {
      labelNormal[name] = value;
    }
  });

  if (itemStyleEmphasis.label && !has(label, 'emphasis')) {
    label.emphasis = itemStyleEmphasis.label;
    delete itemStyleEmphasis.label;
  }
}

function has(obj, attr) {
  return obj.hasOwnProperty(attr);
}