
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

function parse(xml) {
  var doc;

  if (typeof xml === 'string') {
    var parser = new DOMParser();
    doc = parser.parseFromString(xml, 'text/xml');
  } else {
    doc = xml;
  }

  if (!doc || doc.getElementsByTagName('parsererror').length) {
    return null;
  }

  var gexfRoot = getChildByTagName(doc, 'gexf');

  if (!gexfRoot) {
    return null;
  }

  var graphRoot = getChildByTagName(gexfRoot, 'graph');
  var attributes = parseAttributes(getChildByTagName(graphRoot, 'attributes'));
  var attributesMap = {};

  for (var i = 0; i < attributes.length; i++) {
    attributesMap[attributes[i].id] = attributes[i];
  }

  return {
    nodes: parseNodes(getChildByTagName(graphRoot, 'nodes'), attributesMap),
    links: parseEdges(getChildByTagName(graphRoot, 'edges'))
  };
}

exports.parse = parse;

function parseAttributes(parent) {
  return parent ? zrUtil.map(getChildrenByTagName(parent, 'attribute'), function (attribDom) {
    return {
      id: getAttr(attribDom, 'id'),
      title: getAttr(attribDom, 'title'),
      type: getAttr(attribDom, 'type')
    };
  }) : [];
}

function parseNodes(parent, attributesMap) {
  return parent ? zrUtil.map(getChildrenByTagName(parent, 'node'), function (nodeDom) {
    var id = getAttr(nodeDom, 'id');
    var label = getAttr(nodeDom, 'label');
    var node = {
      id: id,
      name: label,
      itemStyle: {
        normal: {}
      }
    };
    var vizSizeDom = getChildByTagName(nodeDom, 'viz:size');
    var vizPosDom = getChildByTagName(nodeDom, 'viz:position');
    var vizColorDom = getChildByTagName(nodeDom, 'viz:color');
    var attvaluesDom = getChildByTagName(nodeDom, 'attvalues');

    if (vizSizeDom) {
      node.symbolSize = parseFloat(getAttr(vizSizeDom, 'value'));
    }

    if (vizPosDom) {
      node.x = parseFloat(getAttr(vizPosDom, 'x'));
      node.y = parseFloat(getAttr(vizPosDom, 'y'));
    }

    if (vizColorDom) {
      node.itemStyle.normal.color = 'rgb(' + [getAttr(vizColorDom, 'r') | 0, getAttr(vizColorDom, 'g') | 0, getAttr(vizColorDom, 'b') | 0].join(',') + ')';
    }

    if (attvaluesDom) {
      var attvalueDomList = getChildrenByTagName(attvaluesDom, 'attvalue');
      node.attributes = {};

      for (var j = 0; j < attvalueDomList.length; j++) {
        var attvalueDom = attvalueDomList[j];
        var attId = getAttr(attvalueDom, 'for');
        var attValue = getAttr(attvalueDom, 'value');
        var attribute = attributesMap[attId];

        if (attribute) {
          switch (attribute.type) {
            case 'integer':
            case 'long':
              attValue = parseInt(attValue, 10);
              break;

            case 'float':
            case 'double':
              attValue = parseFloat(attValue);
              break;

            case 'boolean':
              attValue = attValue.toLowerCase() === 'true';
              break;

            default:
          }

          node.attributes[attId] = attValue;
        }
      }
    }

    return node;
  }) : [];
}

function parseEdges(parent) {
  return parent ? zrUtil.map(getChildrenByTagName(parent, 'edge'), function (edgeDom) {
    var id = getAttr(edgeDom, 'id');
    var label = getAttr(edgeDom, 'label');
    var sourceId = getAttr(edgeDom, 'source');
    var targetId = getAttr(edgeDom, 'target');
    var edge = {
      id: id,
      name: label,
      source: sourceId,
      target: targetId,
      lineStyle: {
        normal: {}
      }
    };
    var lineStyle = edge.lineStyle.normal;
    var vizThicknessDom = getChildByTagName(edgeDom, 'viz:thickness');
    var vizColorDom = getChildByTagName(edgeDom, 'viz:color');

    if (vizThicknessDom) {
      lineStyle.width = parseFloat(vizThicknessDom.getAttribute('value'));
    }

    if (vizColorDom) {
      lineStyle.color = 'rgb(' + [getAttr(vizColorDom, 'r') | 0, getAttr(vizColorDom, 'g') | 0, getAttr(vizColorDom, 'b') | 0].join(',') + ')';
    }

    return edge;
  }) : [];
}

function getAttr(el, attrName) {
  return el.getAttribute(attrName);
}

function getChildByTagName(parent, tagName) {
  var node = parent.firstChild;

  while (node) {
    if (node.nodeType !== 1 || node.nodeName.toLowerCase() !== tagName.toLowerCase()) {
      node = node.nextSibling;
    } else {
      return node;
    }
  }

  return null;
}

function getChildrenByTagName(parent, tagName) {
  var node = parent.firstChild;
  var children = [];

  while (node) {
    if (node.nodeName.toLowerCase() === tagName.toLowerCase()) {
      children.push(node);
    }

    node = node.nextSibling;
  }

  return children;
}