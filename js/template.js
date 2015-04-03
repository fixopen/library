/**
 * Created by fixopen on 23/3/15.
 */
var templateInfo = {
    editFlag: 0,
    bookId: 0
}

window.addEventListener('load', function (e) {
    g.user.validUser(function (user) {
        g.registerTreeMenuHandler()
        $('#btnEditOk').click(function (e) {
                var t = $('#treeContainer')
                var node = t.tree('getSelected')
                var maxOrder = g.findMaxOrder(node)
                var newCreatNodeOrder = maxOrder + 1
                var parentId = null
                if (!node || !node.isRoot) {
                    parentId = node.id
                }
                var title = $('#inputTitle').val()
                if (!title) {
                    alert('请输入名称')
                    return
                }
                if (templateInfo.editFlag == 0) {
                    var data = {
                        caption: title,
                        parentId: parentId,
                        bookId: templateInfo.bookId,
                        order: newCreatNodeOrder
                    }
                    g.postData('/api/catalogs', data, function (result) {
                        if (result.state == 200 || result.state == 201) {
                            data.id = result.id
                            t.tree('append', {
                                parent: (node ? node.target : null),
                                data: [
                                    {
                                        id: data.id,
                                        tag: data,
                                        text: title
                                    }
                                ]
                            })
                        }
                    })
                } else {
                    var data = node.tag
                    data.caption = title
                    if (data.parent && data.parent.id)
                        data.parentId = data.parent.id
                    data.bookId = templateInfo.bookId
                    g.patchData('/api/catalogs/' + data.id, data, function (result) {
                        if (result.state == 200) {
                            t.tree('update', {
                                target: node.target,
                                text: title
                            })
                        }
                    })
                }
                $('#editModal').modal('hide')
            }
        )
        templateInfo.bookId = g.getUrlParameter('id')

        var loginButton = document.getElementById('loginButton')
        loginButton.addEventListener('click', function(e) {
            var login = document.getElementById('login')
            var password = document.getElementById('password')
            g.postData('/api/users/' + login.value + '/sessions', {"password": password.value}, function(result) {
                //json object == user
                location.href = 'index.html'
            })
            g.deleteData('/api/users/me/sessions/' + sessionId, function(r) {
                location.href = 'login.html'
            })
            g.getData('/api/users/me/sessions/' + sessionId, function(r) {
                //
            })
        }, false)

        //filter orderBy offset count
        //baseUri?filter=...&orderBy=...&offset=...&count=...
        //encodeURIComponent(JSON.stringify(jsObject))
        g.getData('/api/users/' + id, function (result) {
            var detail = document.getElementById('detail')
            detail.innerHTML = ''
            var userTemplate = document.getElementById('userTemplate')
            var user = userTemplate.content.cloneNode(true)
            g.bind(user, result)
            detail.appendChild(user)
        })
    })
}, false)


