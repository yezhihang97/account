
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

var env_1 = require("zrender/lib/core/env");

var model_1 = require("../../util/model");

var inner = model_1.makeInner();
var each = zrUtil.each;

function register(key, api, handler) {
  if (env_1["default"].node) {
    return;
  }

  var zr = api.getZr();
  inner(zr).records || (inner(zr).records = {});
  initGlobalListeners(zr, api);
  var record = inner(zr).records[key] || (inner(zr).records[key] = {});
  record.handler = handler;
}

exports.register = register;

function initGlobalListeners(zr, api) {
  if (inner(zr).initialized) {
    return;
  }

  inner(zr).initialized = true;
  useHandler('click', zrUtil.curry(doEnter, 'click'));
  useHandler('mousemove', zrUtil.curry(doEnter, 'mousemove'));
  useHandler('globalout', onLeave);

  function useHandler(eventType, cb) {
    zr.on(eventType, function (e) {
      var dis = makeDispatchAction(api);
      each(inner(zr).records, function (record) {
        record && cb(record, e, dis.dispatchAction);
      });
      dispatchTooltipFinally(dis.pendings, api);
    });
  }
}

function dispatchTooltipFinally(pendings, api) {
  var showLen = pendings.showTip.length;
  var hideLen = pendings.hideTip.length;
  var actuallyPayload;

  if (showLen) {
    actuallyPayload = pendings.showTip[showLen - 1];
  } else if (hideLen) {
    actuallyPayload = pendings.hideTip[hideLen - 1];
  }

  if (actuallyPayload) {
    actuallyPayload.dispatchAction = null;
    api.dispatchAction(actuallyPayload);
  }
}

function onLeave(record, e, dispatchAction) {
  record.handler('leave', null, dispatchAction);
}

function doEnter(currTrigger, record, e, dispatchAction) {
  record.handler(currTrigger, e, dispatchAction);
}

function makeDispatchAction(api) {
  var pendings = {
    showTip: [],
    hideTip: []
  };

  var dispatchAction = function (payload) {
    var pendingList = pendings[payload.type];

    if (pendingList) {
      pendingList.push(payload);
    } else {
      payload.dispatchAction = dispatchAction;
      api.dispatchAction(payload);
    }
  };

  return {
    dispatchAction: dispatchAction,
    pendings: pendings
  };
}

function unregister(key, api) {
  if (env_1["default"].node) {
    return;
  }

  var zr = api.getZr();
  var record = (inner(zr).records || {})[key];

  if (record) {
    inner(zr).records[key] = null;
  }
}

exports.unregister = unregister;