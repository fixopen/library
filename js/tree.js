/**
 * Created by fixopen on 23/3/15.
 */

g.buildTreeData = function (data, compareFn) {
    var result = []
    for (var i = 0, c = data.length; i < c; ++i) {
        var item = data[i]
        if (!item.parentId) { //root
            var node = g.getTreeNode(item, data, compareFn)
            result.push(node)
        }
    }
    result.sort(compareFn)
    return result
}

g.getTreeNode = function (item, data, compareFn) {
    var result = {
        id: item.id,
        text: item.name,
        tag: item,
        children: []
    }
    for (var i = 0, c = data.length; i < c; ++i) {
        var child = data[i]
        if (child.parentId == item.id) {
            var childNode = g.getTreeNode(child, data, compareFn)
            result.children.push(childNode)
        }
    }
    result.children.sort(compareFn)
    return result
}

g.convertToTree = function (root, data, compareFn) {
    var nodes = g.buildTreeData(data, compareFn)
    var treeData = [
        {
            id: root.id,
            text: root.name,
            children: nodes,
            tag: root,
            isRoot: true
        }
    ]
    return treeData
}

//查询children中最大的order
g.findMaxOrder = function (node) {
    var maxOrder = 0
    var childrenNodes = node.children
    if(childrenNodes)
        for (var i = 0, c = childrenNodes.length; i < c; ++i) {
            if (maxOrder < childrenNodes[i].tag.order) {
                maxOrder = childrenNodes[i].tag.order
            }
        }
    return maxOrder
}

//查询children中大于order的子集
g.findLitterBrother = function (children, order) {
    var childrenNodes = []
    for (var i = 0, c = children.length; i < c; ++i) {
        if (order < children[i].tag.order) {
            childrenNodes.push(children[i])
        }
    }
    return childrenNodes
}

g.renderTree = function(treeData, treeViewId, menuId) {
    $('#' + treeViewId).tree({
        data: treeData,
        //animate: true,
        method: 'get',
        dnd: true,
        lines: true,
        onClick: function (node) {
        },
        onContextMenu: function (e, node) {
            e.preventDefault();
            $(this).tree('select', node.target);
            $('#' + menuId).menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onDrop: function (target, source, point) {
            var node = $(this).tree('getNode', target);
            var data = source.tag;
            if (point == "append") {
                var m = g.findMaxOrder(node)
                data.order = m + 1
                data.parentId = node.tag.id
                g.patchData('/api/catalogs/' + data.id, data, function (result) {
                    if (result.state == 200) {
                    }
                })
            } else {
                var nodeParent = $(this).tree('getParent', target)
                if (!nodeParent || !nodeParent.isRoot) {
                    data.parentId = nodeParent ? nodeParent.id : ''
                } else {
                    data.parentId = null
                }
                if(point == "top") {
                    data.order = node.tag.order
                    g.patchData('/api/catalogs/' + data.id, data, function (result) {
                        if (result.state == 200) {
                        }
                    })
                    node.tag.order += 1
                    g.patchData('/api/catalogs/' + node.tag.id, node.tag, function (result) {
                        if (result.state == 200) {
                        }
                    })
                    //parentId = n AND order > m UPDATE order = order + 1
                    var lb = g.findLitterBrother(nodeParent.children, node.tag.order)
                    for (var i = 0, c = lb.length; i < c; ++i) {
                        lb[i].tag.order++;
                        g.patchData('/api/catalogs/' + lb[i].tag.id, lb[i].tag, function (result) {
                            if (result.state == 200) {
                            }
                        })
                    }
                } else if(point =="bottom") {
                    data.order = node.tag.order + 1
                    g.patchData('/api/catalogs/' + data.id, data, function (result) {
                        if (result.state == 200) {
                        }
                    })
                    var lb = g.findLitterBrother(nodeParent.children, node.tag.order)
                    for (var i = 0, c = lb.length; i < c; ++i) {
                        lb[i].tag.order++;
                        g.patchData('/api/catalogs/' + lb[i].tag.id, lb[i].tag, function (result) {
                            if (result.state == 200) {
                            }
                        })
                    }
                }
            }
        }
    })
}

g.registerTreeMenuHandler = function(treeViewId) {
    var doc = document
    var add = doc.getElementById('addItem')
    add.addEventListener('click', function(e) {
        //instance a child-node
        //add child-node to select node
        //bind child-node to detail-area
        //append to database
    }, false)
    var edit = doc.getElementById('editItem')
    edit.addEventListener('click', function(e) {
        //bind select node to detail-area
    }, false)
    var remove = doc.getElementById('removeItem')
    remove.addEventListener('click', function(e) {
        var node = $('#' + treeViewId).tree('getSelected')
        if (node) {
            if (node.children.length == 0) {
                if (window.confirm('你确定要删除吗？')) {
                    g.deleteData('/api/catalogs/' + node.id, function (result) {
                        if (result.state == 200) {
                            alert('删除成功')
                            $('#' + treeViewId).tree('remove', node.target)
                        }
                    })
                }
            } else {
                alert('非空目录，不能删除')
            }
        }
    }, false)
    var collapse = doc.getElementById('collapseItem')
    collapse.addEventListener('click', function(e) {
        var node = $('#' + treeViewId).tree('getSelected')
        $('#' + treeViewId).tree('collapse', node.target)
    }, false)
    var expand = doc.getElementById('expandItem')
    expand.addEventListener('click', function(e) {
        var node = $('#' + treeViewId).tree('getSelected')
        $('#' + treeViewId).tree('expand', node.target)
    }, false)
}
