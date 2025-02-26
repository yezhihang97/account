
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

var vec2 = require("zrender/lib/core/vector");

var scaleAndAdd = vec2.scaleAndAdd;

function forceLayout(inNodes, inEdges, opts) {
  var nodes = inNodes;
  var edges = inEdges;
  var rect = opts.rect;
  var width = rect.width;
  var height = rect.height;
  var center = [rect.x + width / 2, rect.y + height / 2];
  var gravity = opts.gravity == null ? 0.1 : opts.gravity;

  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];

    if (!n.p) {
      n.p = vec2.create(width * (Math.random() - 0.5) + center[0], height * (Math.random() - 0.5) + center[1]);
    }

    n.pp = vec2.clone(n.p);
    n.edges = null;
  }

  var initialFriction = opts.friction == null ? 0.6 : opts.friction;
  var friction = initialFriction;
  var beforeStepCallback;
  var afterStepCallback;
  return {
    warmUp: function () {
      friction = initialFriction * 0.8;
    },
    setFixed: function (idx) {
      nodes[idx].fixed = true;
    },
    setUnfixed: function (idx) {
      nodes[idx].fixed = false;
    },
    beforeStep: function (cb) {
      beforeStepCallback = cb;
    },
    afterStep: function (cb) {
      afterStepCallback = cb;
    },
    step: function (cb) {
      beforeStepCallback && beforeStepCallback(nodes, edges);
      var v12 = [];
      var nLen = nodes.length;

      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];

        if (e.ignoreForceLayout) {
          continue;
        }

        var n1 = e.n1;
        var n2 = e.n2;
        vec2.sub(v12, n2.p, n1.p);
        var d = vec2.len(v12) - e.d;
        var w = n2.w / (n1.w + n2.w);

        if (isNaN(w)) {
          w = 0;
        }

        vec2.normalize(v12, v12);
        !n1.fixed && scaleAndAdd(n1.p, n1.p, v12, w * d * friction);
        !n2.fixed && scaleAndAdd(n2.p, n2.p, v12, -(1 - w) * d * friction);
      }

      for (var i = 0; i < nLen; i++) {
        var n = nodes[i];

        if (!n.fixed) {
          vec2.sub(v12, center, n.p);
          scaleAndAdd(n.p, n.p, v12, gravity * friction);
        }
      }

      for (var i = 0; i < nLen; i++) {
        var n1 = nodes[i];

        for (var j = i + 1; j < nLen; j++) {
          var n2 = nodes[j];
          vec2.sub(v12, n2.p, n1.p);
          var d = vec2.len(v12);

          if (d === 0) {
            vec2.set(v12, Math.random() - 0.5, Math.random() - 0.5);
            d = 1;
          }

          var repFact = (n1.rep + n2.rep) / d / d;
          !n1.fixed && scaleAndAdd(n1.pp, n1.pp, v12, repFact);
          !n2.fixed && scaleAndAdd(n2.pp, n2.pp, v12, -repFact);
        }
      }

      var v = [];

      for (var i = 0; i < nLen; i++) {
        var n = nodes[i];

        if (!n.fixed) {
          vec2.sub(v, n.p, n.pp);
          scaleAndAdd(n.p, n.p, v, friction);
          vec2.copy(n.pp, n.p);
        }
      }

      friction = friction * 0.992;
      var finished = friction < 0.01;
      afterStepCallback && afterStepCallback(nodes, edges, finished);
      cb && cb(finished);
    }
  };
}

exports.forceLayout = forceLayout;