
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

function generateNodeKey(id) {
  return '_EC_' + id;
}

var Graph = function () {
  function Graph(directed) {
    this.type = 'graph';
    this.nodes = [];
    this.edges = [];
    this._nodesMap = {};
    this._edgesMap = {};
    this._directed = directed || false;
  }

  Graph.prototype.isDirected = function () {
    return this._directed;
  };

  ;

  Graph.prototype.addNode = function (id, dataIndex) {
    id = id == null ? '' + dataIndex : '' + id;
    var nodesMap = this._nodesMap;

    if (nodesMap[generateNodeKey(id)]) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Graph nodes have duplicate name or id');
      }

      return;
    }

    var node = new GraphNode(id, dataIndex);
    node.hostGraph = this;
    this.nodes.push(node);
    nodesMap[generateNodeKey(id)] = node;
    return node;
  };

  ;

  Graph.prototype.getNodeByIndex = function (dataIndex) {
    var rawIdx = this.data.getRawIndex(dataIndex);
    return this.nodes[rawIdx];
  };

  ;

  Graph.prototype.getNodeById = function (id) {
    return this._nodesMap[generateNodeKey(id)];
  };

  ;

  Graph.prototype.addEdge = function (n1, n2, dataIndex) {
    var nodesMap = this._nodesMap;
    var edgesMap = this._edgesMap;

    if (typeof n1 === 'number') {
      n1 = this.nodes[n1];
    }

    if (typeof n2 === 'number') {
      n2 = this.nodes[n2];
    }

    if (!(n1 instanceof GraphNode)) {
      n1 = nodesMap[generateNodeKey(n1)];
    }

    if (!(n2 instanceof GraphNode)) {
      n2 = nodesMap[generateNodeKey(n2)];
    }

    if (!n1 || !n2) {
      return;
    }

    var key = n1.id + '-' + n2.id;
    var edge = new GraphEdge(n1, n2, dataIndex);
    edge.hostGraph = this;

    if (this._directed) {
      n1.outEdges.push(edge);
      n2.inEdges.push(edge);
    }

    n1.edges.push(edge);

    if (n1 !== n2) {
      n2.edges.push(edge);
    }

    this.edges.push(edge);
    edgesMap[key] = edge;
    return edge;
  };

  ;

  Graph.prototype.getEdgeByIndex = function (dataIndex) {
    var rawIdx = this.edgeData.getRawIndex(dataIndex);
    return this.edges[rawIdx];
  };

  ;

  Graph.prototype.getEdge = function (n1, n2) {
    if (n1 instanceof GraphNode) {
      n1 = n1.id;
    }

    if (n2 instanceof GraphNode) {
      n2 = n2.id;
    }

    var edgesMap = this._edgesMap;

    if (this._directed) {
      return edgesMap[n1 + '-' + n2];
    } else {
      return edgesMap[n1 + '-' + n2] || edgesMap[n2 + '-' + n1];
    }
  };

  ;

  Graph.prototype.eachNode = function (cb, context) {
    var nodes = this.nodes;
    var len = nodes.length;

    for (var i = 0; i < len; i++) {
      if (nodes[i].dataIndex >= 0) {
        cb.call(context, nodes[i], i);
      }
    }
  };

  ;

  Graph.prototype.eachEdge = function (cb, context) {
    var edges = this.edges;
    var len = edges.length;

    for (var i = 0; i < len; i++) {
      if (edges[i].dataIndex >= 0 && edges[i].node1.dataIndex >= 0 && edges[i].node2.dataIndex >= 0) {
        cb.call(context, edges[i], i);
      }
    }
  };

  ;

  Graph.prototype.breadthFirstTraverse = function (cb, startNode, direction, context) {
    if (!(startNode instanceof GraphNode)) {
      startNode = this._nodesMap[generateNodeKey(startNode)];
    }

    if (!startNode) {
      return;
    }

    var edgeType = direction === 'out' ? 'outEdges' : direction === 'in' ? 'inEdges' : 'edges';

    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].__visited = false;
    }

    if (cb.call(context, startNode, null)) {
      return;
    }

    var queue = [startNode];

    while (queue.length) {
      var currentNode = queue.shift();
      var edges = currentNode[edgeType];

      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        var otherNode = e.node1 === currentNode ? e.node2 : e.node1;

        if (!otherNode.__visited) {
          if (cb.call(context, otherNode, currentNode)) {
            return;
          }

          queue.push(otherNode);
          otherNode.__visited = true;
        }
      }
    }
  };

  ;

  Graph.prototype.update = function () {
    var data = this.data;
    var edgeData = this.edgeData;
    var nodes = this.nodes;
    var edges = this.edges;

    for (var i = 0, len = nodes.length; i < len; i++) {
      nodes[i].dataIndex = -1;
    }

    for (var i = 0, len = data.count(); i < len; i++) {
      nodes[data.getRawIndex(i)].dataIndex = i;
    }

    edgeData.filterSelf(function (idx) {
      var edge = edges[edgeData.getRawIndex(idx)];
      return edge.node1.dataIndex >= 0 && edge.node2.dataIndex >= 0;
    });

    for (var i = 0, len = edges.length; i < len; i++) {
      edges[i].dataIndex = -1;
    }

    for (var i = 0, len = edgeData.count(); i < len; i++) {
      edges[edgeData.getRawIndex(i)].dataIndex = i;
    }
  };

  ;

  Graph.prototype.clone = function () {
    var graph = new Graph(this._directed);
    var nodes = this.nodes;
    var edges = this.edges;

    for (var i = 0; i < nodes.length; i++) {
      graph.addNode(nodes[i].id, nodes[i].dataIndex);
    }

    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      graph.addEdge(e.node1.id, e.node2.id, e.dataIndex);
    }

    return graph;
  };

  ;
  return Graph;
}();

var GraphNode = function () {
  function GraphNode(id, dataIndex) {
    this.inEdges = [];
    this.outEdges = [];
    this.edges = [];
    this.dataIndex = -1;
    this.id = id == null ? '' : id;
    this.dataIndex = dataIndex == null ? -1 : dataIndex;
  }

  GraphNode.prototype.degree = function () {
    return this.edges.length;
  };

  GraphNode.prototype.inDegree = function () {
    return this.inEdges.length;
  };

  GraphNode.prototype.outDegree = function () {
    return this.outEdges.length;
  };

  GraphNode.prototype.getModel = function (path) {
    if (this.dataIndex < 0) {
      return;
    }

    var graph = this.hostGraph;
    var itemModel = graph.data.getItemModel(this.dataIndex);
    return itemModel.getModel(path);
  };

  GraphNode.prototype.getAdjacentDataIndices = function () {
    var dataIndices = {
      edge: [],
      node: []
    };

    for (var i = 0; i < this.edges.length; i++) {
      var adjacentEdge = this.edges[i];

      if (adjacentEdge.dataIndex < 0) {
        continue;
      }

      dataIndices.edge.push(adjacentEdge.dataIndex);
      dataIndices.node.push(adjacentEdge.node1.dataIndex, adjacentEdge.node2.dataIndex);
    }

    return dataIndices;
  };

  return GraphNode;
}();

exports.GraphNode = GraphNode;

var GraphEdge = function () {
  function GraphEdge(n1, n2, dataIndex) {
    this.dataIndex = -1;
    this.node1 = n1;
    this.node2 = n2;
    this.dataIndex = dataIndex == null ? -1 : dataIndex;
  }

  GraphEdge.prototype.getModel = function (path) {
    if (this.dataIndex < 0) {
      return;
    }

    var graph = this.hostGraph;
    var itemModel = graph.edgeData.getItemModel(this.dataIndex);
    return itemModel.getModel(path);
  };

  GraphEdge.prototype.getAdjacentDataIndices = function () {
    return {
      edge: [this.dataIndex],
      node: [this.node1.dataIndex, this.node2.dataIndex]
    };
  };

  return GraphEdge;
}();

exports.GraphEdge = GraphEdge;

function createGraphDataProxyMixin(hostName, dataName) {
  return {
    getValue: function (dimension) {
      var data = this[hostName][dataName];
      return data.get(data.getDimension(dimension || 'value'), this.dataIndex);
    },
    setVisual: function (key, value) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemVisual(this.dataIndex, key, value);
    },
    getVisual: function (key) {
      return this[hostName][dataName].getItemVisual(this.dataIndex, key);
    },
    setLayout: function (layout, merge) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemLayout(this.dataIndex, layout, merge);
    },
    getLayout: function () {
      return this[hostName][dataName].getItemLayout(this.dataIndex);
    },
    getGraphicEl: function () {
      return this[hostName][dataName].getItemGraphicEl(this.dataIndex);
    },
    getRawIndex: function () {
      return this[hostName][dataName].getRawIndex(this.dataIndex);
    }
  };
}

;
;
;
zrUtil.mixin(GraphNode, createGraphDataProxyMixin('hostGraph', 'data'));
zrUtil.mixin(GraphEdge, createGraphDataProxyMixin('hostGraph', 'edgeData'));
exports["default"] = Graph;