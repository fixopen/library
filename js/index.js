/**
 * Created by fixopen on 7/4/15.
 * getTime() / 1000.0
 */

window.addEventListener('load', function (e) {
    if (g.getCookie('sessionId') == '') {
        location.href = 'login.html'
    }
    var genericHeaders = [
        {
            'name': 'Content-Type',
            'value': 'application/json'
        }, {
            'name': 'Accept',
            'value': 'application/json'
        }
    ]
    var clickState = {}
    var doc = document
    //new Date().getTime() / 1000.0
    //var d = Date(s * 1000.0)
    var userName = location.href.split('=')[1];
    doc.getElementById('loginName').innerHTML = userName
    doc.getElementById('timeNow').innerHTML = Date()
    var logout = doc.getElementById('logout')
    logout.addEventListener('click', function (e) {
        //g.deleteData('/api/administrators/'+userName+'/sessions/' + g.getCookie('sessionId'), genericHeaders, function (r) {
        g.deleteData('/api/administrators/admin/sessions/' + g.getCookie('sessionId'), genericHeaders, function (r) {
            if (r.meta.code < 400) {
                alert('logout ok!')
                //clear sessionId
                g.setCookie('sessionId', '', -1)
                location.href = 'login.html'
            }
        })
    }, false)
    var contentTitle = doc.getElementById('contentTitle')
    var mainContainer = doc.getElementById('mainContainer')
    var data = {
        currentItem: null,
        switchTo: function (item) {
            if (data.currentItem) {
                data.currentItem.removeClass('active-menu-item')
            }
            data.currentItem = item
            data.currentItem.addClass('active-menu-item')
        },
        fillSelect: function (selectId, optionArray, useAll) {
            var s = doc.getElementById(selectId)
            if (useAll) {
                var option = doc.createElement('option')
                option.textContent = '全部'
                option.label = '全部'
                option.value = '全部'
                option.selected = true
            }
            s.appendChild(option);
            for (var i = 0, c = optionArray.length; i < c; ++i) {
                var option = doc.createElement('option')
                option.textContent = optionArray[i]
                option.label = optionArray[i]
                option.value = optionArray[i]
                s.appendChild(option);
            }
        },
        fillRadio: function (radioName, value) {
            var radios = doc.querySelectorAll('input[name="' + radioName + '"]')
            for (var i = 0, c = radios.length; i < c; ++i) {
                if (radios.item(i).value == value) {
                    radios.item(i).checked = true
                    break
                }
            }
        },
        getRadio: function (radioName) {
            var result = null
            var radios = doc.querySelectorAll('input[name="' + radioName + '"]')
            for (var i = 0, c = radios.length; i < c; ++i) {
                if (radios.item(i).checked == true) {
                    result = radios.item(i).value
                    break
                }
            }
            return result
        },
        do: function (title, filterTemplate, headerTemplate, currentData, filterPostProcessor, headerOperationProcessor) {
            contentTitle.textContent = title
            mainContainer.innerHTML = ''
            if (filterTemplate != "") {
                var filter = doc.getElementById(filterTemplate).content.cloneNode(true).children[0]
                filter.addEventListener('change', function (e) {
                    currentData.total = -1
                    currentData.currentPage = 0
                    currentData.content = []
                    currentData.handler(1)
                }, false)
                mainContainer.appendChild(filter)
                var hr = doc.createElement('hr')
                mainContainer.appendChild(hr)
            }
            if (filterPostProcessor) {
                filterPostProcessor()
            }
            var table = doc.getElementById('tableFramework').content.cloneNode(true).children[0]
            var header = doc.getElementById(headerTemplate).content.cloneNode(true).children[0]
            table.querySelector('#header').appendChild(header)
            var tableBody = table.querySelector('#body')
            currentData.pageIndexContainer = table.querySelector('#pageIndex')
            currentData.setContainer(tableBody)
            currentData.handler(1)
            mainContainer.appendChild(table)
            if (headerOperationProcessor) {
                headerOperationProcessor()
            }
        },
        baseInfo: {
            isInit: false,
            userCount: 0,
            bookCount: 0, normalBookCount: 0,
            deviceCount: 0, liveDeviceCount: 0,
            do: function () {
                contentTitle.textContent = '管理首页'
                mainContainer.innerHTML = ''
                var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true).children[0]
                var baseInfo = data.baseInfo
                if (!baseInfo.isInit) {
                    g.getData('/api/devices/statistics/count', genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            baseInfo.deviceCount = d.data.value
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                    g.getData('/api/devices/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isOnline: true})), genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            baseInfo.liveDeviceCount = d.data.value
                        }
                    })
                    g.getData('/api/books/statistics/count', genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            baseInfo.bookCount = d.data.value
                        }
                    })
                    g.getData('/api/books/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isBan: false})), genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            baseInfo.normalBookCount = d.data.value
                        }
                    })
                    g.getData('/api/users/statistics/count', genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            baseInfo.userCount = d.data.value
                        }
                    })
                    baseInfo.isInit = true
                }
                g.bind(firstPageContent, baseInfo)
                mainContainer.appendChild(firstPageContent)
            }
        },
        books: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            oldPage: 1,
            standardClassifierIsInit: false,
            standardClassifier: [],
            classifierIsInit: false,
            classifier: [],
            drmDuration: 0,
            content: [],
            container: null,
            pageIndexContainer: null,
            setContainer: function (c) {
                data.books.container = c
            },
            getStandardClassifier: function () {
                var uri = '/api/books/groups/standardClassify'
                g.getData(uri, genericHeaders, function (d) {
                    data.books.standardClassifier = d.data
                    data.books.standardClassifierIsInit = true
                })
            },
            getClassifier: function () {
                var uri = '/api/books/groups/firstLevelClassify'
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.books.classifier = d.data
                        data.books.classifierIsInit = true
                    }
                    //else if(d.meta.code == 401){
                    //    alert('该用户没有访问权限')
                    //}
                })
            },
            getFilter: function () {
                var result = null
                var bookId = doc.getElementById('bookId')
                var bookName = doc.getElementById('bookName')
                var author = doc.getElementById('author')
                var publisher = doc.getElementById('publisher')
                var bookStandardClassifier = doc.getElementById('bookStandardClassifier')
                var bookClassifier = doc.getElementById('bookClassifier')
                var bookState = data.getRadio('bookState') //radio group
                var hasCondition = false
                var filter = {}
                var bookIdValue = bookId.value
                if (bookIdValue != '') {
                    filter.id = bookIdValue
                    hasCondition = true
                }
                var bookNameValue = bookName.value
                if (bookNameValue != '') {
                    filter.name = bookNameValue
                    hasCondition = true
                }
                var authorValue = author.value
                if (authorValue != '') {
                    filter.author = authorValue
                    hasCondition = true
                }
                var publisherValue = publisher.value
                if (publisherValue != '') {
                    filter.publisher = publisherValue
                    hasCondition = true
                }
                var bookStandardClassifierValue = bookStandardClassifier.value
                if (bookStandardClassifierValue != '全部') {
                    filter.standardClassify = bookStandardClassifierValue
                    hasCondition = true
                }
                var bookClassifierValue = bookClassifier.value
                if (bookClassifierValue != '全部') {
                    filter.firstLevelClassify = bookClassifierValue
                    //secondLevelClassify
                    hasCondition = true
                }
                var stateValue = bookState
                filter.isBan = stateValue
                hasCondition = true
                if (hasCondition) {
                    result = encodeURIComponent(JSON.stringify(filter))
                }
                //alert(result)
                return result
            },
            getTotal: function (filter) {
                var uri = '/api/books/statistics/count'
                if (filter) {
                    uri += '?filter=' + filter
                }
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.books.total = d.data.value
                    }
                    //else if(d.meta.code == 401){
                    //    alert('该用户没有访问权限');
                    //}
                })
            },
            loadData: function (pageNo) {
                var books = data.books
                var filter = books.getFilter()
                if (books.total == -1) {
                    books.getTotal(filter)
                }
                if (books.currentPage != pageNo) {
                    books.currentPage = pageNo
                    var offset = books.pageSize * (books.currentPage - 1)
                    var orderBy = encodeURIComponent(JSON.stringify({id: 'asc'}))
                    g.getData('/api/books?filter=' + filter + '&offset=' + offset + '&count=' + books.pageSize + '&orderBy=' + orderBy, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            books.content = d.data
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                }
            },
            render: function () {
                var books = data.books
                while (books.container.rows.length > 0) {
                    books.container.deleteRow(-1)
                }
                var contents = books.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('bookItem').content.cloneNode(true).children[0]
                    //显示上下架状态
                    contents[i].state = '上架'
                    if (contents[i].isBan) {
                        contents[i].state = '下架'
                    }
                    //点击上下架操作
                    contents[i].checkState = '下架'
                    if (contents[i].isBan) {
                        contents[i].checkState = '上架'
                    }
                    g.bind(body, contents[i])
                    body.querySelector('.biz').addEventListener('click', function (e) {
                        //图书详情点击状态
                        clickState.name = "book"
                        clickState.value = e.target.dataset.id
                        //
                        var actionStats = data.actionStats
                        actionStats.reset()
                        actionStats.setProp('book', e.target.dataset.id)
                        actionStats.do()
                    }, false)
                    body.querySelector('.ban').addEventListener('click', function (e) {
                        //修改上下架状态
                        var patchData = {}
                        var info = ""
                        books.content.forEach(function (item, index) {
                            if (item.id == e.target.dataset.id) {
                                if (item.isBan == true) {
                                    patchData = {"isBan": false}
                                    info = "是否上架图书ID为（" + e.target.dataset.id + ")的书籍"
                                } else {
                                    patchData = {"isBan": true}
                                    info = "是否下架图书ID为（" + e.target.dataset.id + ")的书籍"
                                }
                            }
                        })
                        var r = confirm(info)
                        if (r == true) {
                            g.patchData('/api/books/' + e.target.dataset.id, genericHeaders, patchData, function (r) {
                                //books.handler(books.currentPage)
                            })
                            books.total = -1
                            books.currentPage = 0
                            books.content = []
                            books.handler(books.oldPage)
                        }

                    }, false)
                    //body.querySelector('.remove').addEventListener('click', function (e) {
                    //    g.deleteData('/api/books/' + e.target.dataset.id, genericHeaders, function (r) {
                    //        books.handler(books.currentPage)
                    //    })
                    //}, false)
                    books.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var books = data.books
                books.oldPage = pageNo
                books.loadData(pageNo)
                books.render()
                g.renderPageNavigator(books.pageIndexContainer, books.pageSize, books.currentPage, books.total, books.handler)
            },
            do: function () {
                contentTitle.textContent = '数字图书管理'
                mainContainer.innerHTML = ''
                var books = data.books
                var filter = doc.getElementById('bookFilter').content.cloneNode(true).children[0]
                filter.addEventListener('change', function (e) {
                    books.total = -1
                    books.currentPage = 0
                    books.content = []
                    books.handler(1)
                }, false)
                mainContainer.appendChild(filter)
                if (!books.standardClassifierIsInit) {
                    books.getStandardClassifier()
                }
                if (!books.classifierIsInit) {
                    books.getClassifier()
                }
                g.getData('/api/systemParameters/drmDuration', genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        var param = d.data
                        books.drmDuration = param.value
                    } else {
                        books.drmDuration = 90
                        g.postData('/api/systemParameters', genericHeaders, {
                            name: "drmDuration",
                            value: 90
                        }, function (e) {
                            //
                            //if(e.meta.data==401){
                            //    alert('用户没有修改权限')
                            //}
                        })
                        alert('DRM duration use default value : 90')
                    }
                })
                data.fillSelect('bookStandardClassifier', books.standardClassifier, true)
                data.fillSelect('bookClassifier', books.classifier, true)
                data.fillRadio('bookState', 'normal')
                var drmDuration = doc.getElementById('drmDuration')
                drmDuration.value = books.drmDuration
                var setDrmDuration = doc.getElementById('setDrmDuration')
                setDrmDuration.addEventListener('click', function (e) {
                    var drmDuration = doc.getElementById('drmDuration')
                    var v = drmDuration.value.trim()
                    if (parseInt(v) > 1 && parseInt(v) < 366) {
                        if (parseInt(v) == v) {
                            g.patchData('/api/systemParameters/drmDuration', genericHeaders, {value: v}, function (r) {
                                if (r.meta.code < 400) {
                                    alert('设置成功')
                                }
                                //else if(r.meta.data==401){
                                //    alert('用户没有修改权限')
                                //}
                            })
                        } else {
                            alert('必须填写正确的天数')
                        }
                    } else {
                        alert('请输入1-365数字')
                    }
                }, false)
                var hr = doc.createElement('hr')
                mainContainer.appendChild(hr)
                var table = doc.getElementById('tableFramework').content.cloneNode(true)
                var header = doc.getElementById('bookItemHeader').content.cloneNode(true)
                table.querySelector('#header').appendChild(header)
                var tableBody = table.querySelector('#body')
                books.pageIndexContainer = table.querySelector('#pageIndex')
                books.setContainer(tableBody)
                books.handler(1)
                mainContainer.appendChild(table)
            }
        },
        devices: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            pageIndexContainer: null,
            setContainer: function (c) {
                data.devices.container = c
            },
            getFilter: function () {
                var result = null
                var deviceNo = doc.getElementById('deviceNo')
                var deviceAddress = doc.getElementById('deviceAddress')
                var deviceId = doc.getElementById('deviceId')
                var deviceIp = doc.getElementById('deviceIp')
                var setupTime = doc.getElementById('setupTime')
                var stopTime = doc.getElementById('setupStopTime')
                var deviceState = data.getRadio('deviceState')
                var hasCondition = false
                var filter = {}
                var deviceNoValue = deviceNo.value
                if (deviceNoValue != '') {
                    filter.no = deviceNoValue
                    hasCondition = true
                }
                var deviceAddressValue = deviceAddress.value
                if (deviceAddressValue != '') {
                    filter.address = deviceAddressValue
                    hasCondition = true
                }
                var deviceIdValue = deviceId.value
                if (deviceIdValue != '') {
                    filter.id = deviceIdValue
                    hasCondition = true
                }
                var deviceIpValue = deviceIp.value
                if (deviceIpValue != '') {
                    filter.ipAddress = deviceIpValue
                    hasCondition = true
                }
                var setupTimeValue = setupTime.value
                if (setupTimeValue != '') {
                    filter.fromTime = setupTimeValue
                    hasCondition = true
                }
                var toTimeValue = stopTime.value
                if (toTimeValue != '') {
                    filter.toTime = toTimeValue
                    hasCondition = true
                }
                var stateValue = deviceState
                filter.isOnline = stateValue
                hasCondition = true
                if (hasCondition) {
                    result = encodeURIComponent(JSON.stringify(filter))
                }
                return result
            },
            getTotal: function (filter) {
                var uri = '/api/devices/statistics/count'
                if (filter) {
                    uri += '?filter=' + filter
                }
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.devices.total = d.data.value
                    }
                    //else if(d.meta.code == 401){
                    //    alert('该用户没有访问权限')
                    //}
                })
            },
            loadData: function (pageNo) {
                var devices = data.devices
                var filter = devices.getFilter()
                if (devices.total == -1) {
                    devices.getTotal(filter)
                }
                if (devices.currentPage != pageNo) {
                    devices.currentPage = pageNo
                    var offset = devices.pageSize * (devices.currentPage - 1)
                    var orderBy = encodeURIComponent(JSON.stringify({id: 'asc'}))
                    g.getData('/api/devices?filter=' + filter + '&offset=' + offset + '&count=' + devices.pageSize + '&orderBy=' + orderBy, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            devices.content = d.data
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                }
            },
            render: function () {
                var devices = data.devices
                while (devices.container.rows.length > 0) {
                    devices.container.deleteRow(-1);
                }
                var contents = devices.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('deviceItem').content.cloneNode(true).children[0]
                    if (contents[i].setupTime != null) {
                        contents[i].setupTime = contents[i].setupTime.substr(0, 10)
                    }
                    contents[i].state = '心跳'
                    var currentTime = new Date()
                    currentTime = currentTime.getTime() / 1000
                    if ((currentTime - contents[i].lastOperationTime) > 30 * 60) {
                        contents[i].state = '下线'
                    }
                    g.bind(body, contents[i])
                    body.querySelector('.remove').addEventListener('click', function (e) {
                        g.deleteData('/api/devices/' + e.target.dataset.id, genericHeaders, function (r) {
                            if (r.meta.code == 200) {
                                data.devices.currentPage = 0;
                                data.devices.content = []
                                data.devices.total = -1
                                data.switchTo(deviceList)
                                data.devices.do()
                            } else {
                                alert("删除借阅机ID（" + e.target.dataset.id + "）失败，请查看是否存在借阅信息")
                            }
                            //books.handler(books.currentPage)
                        })
                    }, false)
                    body.querySelector('button').addEventListener('click', function (e) {
                        var actionStats = data.actionStats
                        actionStats.reset()
                        actionStats.setProp('device', e.target.dataset.id)
                        actionStats.do()
                    }, false)
                    devices.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var devices = data.devices
                devices.loadData(pageNo)
                devices.render()
                g.renderPageNavigator(devices.pageIndexContainer, devices.pageSize, devices.currentPage, devices.total, devices.handler)
            },
            do: function () {
                data.do('借阅机管理', 'deviceFilter', 'deviceItemHeader', data.devices, function () {
                    data.fillRadio('deviceState', 'heartbeat')
                })
            }
        },
        users: {
            pageSize: 15,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            pageIndexContainer: null,
            setContainer: function (c) {
                data.users.container = c
            },
            getFilter: function () {
                var result = null
                var userNo = doc.getElementById('userNo')
                var registerStartTime = doc.getElementById('registerStartTime')
                var registerStopTime = doc.getElementById('registerStopTime')
                var hasCondition = false
                var filter = {}
                var userNoValue = userNo.value
                if (userNoValue != '') {
                    filter.no = userNoValue
                    hasCondition = true
                }
                var registerStartTimeValue = registerStartTime.value
                if (registerStartTimeValue != '') {
                    filter.fromTime = (new Date(registerStartTime.value)).getTime() / 1000
                    hasCondition = true
                }
                var registerStopTimeValue = registerStopTime.value
                if (registerStopTimeValue != '') {
                    //filter.toTime = registerStopTimeValue
                    filter.toTime = (new Date(registerStopTime.value)).getTime() / 1000
                    hasCondition = true
                }
                //if (hasCondition) {
                result = encodeURIComponent(JSON.stringify(filter))
                //}
                return result
            },
            getTotal: function (filter) {
                var uri = '/api/users/statistics/count'
                if (filter) {
                    uri += '?filter=' + filter
                }
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.users.total = d.data.value
                    }
                    //else if (d.meta.code == 401) {
                    //    alert('该用户没有访问权限')
                    //}
                })
            },
            loadData: function (pageNo) {
                var users = data.users
                var filter = users.getFilter()
                if (users.total == -1) {
                    users.getTotal(filter)
                }
                if (users.currentPage != pageNo) {
                    users.currentPage = pageNo
                    var offset = users.pageSize * (users.currentPage - 1)
                    var orderBy = encodeURIComponent(JSON.stringify({id: 'asc'}))
                    var url = '/api/users'
                    url += '?filter=' + filter + '&offset=' + offset + '&count=' + users.pageSize + '&orderBy=' + orderBy
                    //alert(url)
                    g.getData(url, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            users.content = d.data
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                }
            },
            render: function () {
                var users = data.users
                while (users.container.rows.length > 0) {
                    users.container.deleteRow(-1)
                }
                var contents = users.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('userItem').content.cloneNode(true).children[0]
                    contents[i].state = '心跳'
                    //if (contents[i].registerTime != null) {
                    //    var registerDate = new Date(contents[i].registerTime * 1000.0)
                    //    contents[i].registerDate = registerDate.getFullYear() + '-' + (registerDate.getMonth() + 1) + '-' + registerDate.getDay()
                    //}
                    //var currentTime = new Date()
                    //currentTime = currentTime.getTime() / 1000
                    //if ((currentTime - contents[i].lastOperationTime) > 30 * 60) {
                    //    contents[i].state = '下线'
                    //}
                    g.bind(body, contents[i])
                    body.querySelector('button').addEventListener('click', function (e) {
                        var actionStats = data.actionStats
                        actionStats.reset()
                        actionStats.setProp('user', e.target.dataset.id)
                        actionStats.do()
                    }, false)
                    users.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var users = data.users
                users.loadData(pageNo)
                users.render()
                g.renderPageNavigator(users.pageIndexContainer, users.pageSize, users.currentPage, users.total, users.handler)
            },
            do: function () {
                data.do('用户管理', 'userFilter', 'userItemHeader', data.users)
            }
        },
        actionStats: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            pageIndexContainer: null,
            userId: 0,
            deviceId: 0,
            bookId: 0,
            startTime: null,
            stopTime: null,
            action: null,
            currentProps: null,
            props: {
                user: {
                    title: '用户图书借阅详情',
                    readonlyFilterItem: 'bizUserId',
                    attributeName: 'userId'
                },
                device: {
                    title: '借阅机图书借阅详情',
                    readonlyFilterItem: 'bizDeviceId',
                    attributeName: 'deviceId'
                },
                book: {
                    title: '图书借阅详情',
                    readonlyFilterItem: 'bizBookId',
                    attributeName: 'bookId'
                }
            },
            setContainer: function (c) {
                data.actionStats.container = c
            },
            reset: function () {
                var actionStats = data.actionStats
                actionStats.total = -1
                actionStats.currentPage = 0
                actionStats.content = []
                actionStats.userId = 0
                actionStats.deviceId = 0
                actionStats.bookId = 0
                actionStats.startTime = null
                actionStats.stopTime = null
                actionStats.action = null
            },
            setProp: function (name, value) {
                var actionStats = data.actionStats
                actionStats.currentProps = name
                actionStats[actionStats.props[name].attributeName] = value
            },
            getFilter: function () {
                var result = null
                var actionStats = data.actionStats
                var bizUserId = doc.getElementById('bizUserId')
                var bizDeviceId = doc.getElementById('bizDeviceId')
                var bizBookId = doc.getElementById('bizBookId')
                var bizAction = doc.getElementById('bizAction')
                var startTime = doc.getElementById('startTime')
                var stopTime = doc.getElementById('startTime')
                var filter = {}
                var hasFilter = false
                if (actionStats.currentProps != 'user') {
                    var userId = bizUserId.value
                    if (userId != '') {
                        filter.userId = userId
                        hasFilter = true
                    }
                } else {
                    if (actionStats.userId != 0) {
                        filter.userId = actionStats.userId
                        hasFilter = true
                    }
                }
                if (actionStats.currentProps != 'device') {
                    var deviceId = bizDeviceId.value
                    if (deviceId != '') {
                        filter.deviceId = deviceId
                        hasFilter = true
                    }
                } else {
                    if (actionStats.deviceId != 0) {
                        filter.deviceId = actionStats.deviceId
                        hasFilter = true
                    }
                }
                if (actionStats.currentProps != 'book') {
                    var bookId = bizBookId.value
                    if (bookId != '') {
                        filter.bookId = bookId
                        hasFilter = true
                    }
                } else {
                    if (actionStats.bookId != 0) {
                        filter.bookId = actionStats.bookId
                        hasFilter = true
                    }
                }
                var startTimeValue = startTime.value
                if (startTimeValue != '') {
                    filter.startTime = startTimeValue
                    hasFilter = true
                }
                //if (actionStats.startTime != null) {
                //    filter.startTime = actionStats.startTime
                //    hasFilter = true
                //}
                var stopTimeValue = stopTime.value
                if (stopTimeValue != '') {
                    filter.stopTime = stopTimeValue
                    hasFilter = true
                }
                //if (actionStats.stopTime != null) {
                //    filter.stopTime = actionStats.stopTime
                //    hasFilter = true
                //}
                var actionValue = bizAction.value
                if (actionValue != '') {
                    filter.action = actionValue
                    hasFilter = true
                }
                //if (actionStats.action != null) {
                //    filter.action = actionStats.action
                //    hasFilter = true
                //}
                if (hasFilter) {
                    result = encodeURIComponent(JSON.stringify(filter))
                }
                return result
            },
            getTotal: function (filter) {
                var uri = '/api/business/statistics/count'
                if (filter) {
                    uri += '?filter=' + filter
                }
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.actionStats.total = d.data.value
                    }
                    //else if(d.meta.code == 401){
                    //    alert('该用户没有访问权限')
                    //}
                })
            },
            loadData: function (pageNo) {
                var actionStats = data.actionStats
                var filter = actionStats.getFilter()
                if (actionStats.total == -1) {
                    actionStats.getTotal(filter)
                }
                if (actionStats.currentPage != pageNo) {
                    actionStats.currentPage = pageNo
                    var offset = actionStats.pageSize * (actionStats.currentPage - 1)
                    var orderBy = encodeURIComponent(JSON.stringify({time: 'desc'}))
                    g.getData('/api/business?filter=' + filter + '&offset=' + offset + '&count=' + actionStats.pageSize + '&orderBy=' + orderBy, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            actionStats.content = d.data
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                }
            },
            render: function () {
                var actionStats = data.actionStats
                while (actionStats.container.rows.length > 0) {
                    actionStats.container.deleteRow(-1)
                }
                var contents = actionStats.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('statsItem').content.cloneNode(true).children[0]
                    if (contents[i].time != null) {
                        contents[i].time = contents[i].time.substr(0, 10)
                    }
                    if (contents[i].action == "Download") {
                        contents[i].action = "下载"
                    } else if (contents[i].action == "View") {
                        contents[i].action = "阅读"
                    } else if (contents[i].action == "Follow") {
                        contents[i].action = "关注"
                    }
                    g.bind(body, contents[i])
                    actionStats.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var actionStats = data.actionStats
                actionStats.loadData(pageNo)
                actionStats.render()
                g.renderPageNavigator(actionStats.pageIndexContainer, actionStats.pageSize, actionStats.currentPage, actionStats.total, actionStats.handler)
            },
            do: function () {
                var actionStats = data.actionStats
                var prop = actionStats.props[actionStats.currentProps]
                contentTitle.textContent = prop.title
                mainContainer.innerHTML = ''
                var filter = doc.getElementById('statsFilter').content.cloneNode(true).children[0]
                var readOnlyItem = filter.querySelector('#' + prop.readonlyFilterItem)
                readOnlyItem.setAttribute('readonly', 'readonly')
                readOnlyItem.setAttribute('value', actionStats[actionStats.currentProps + 'Id'])
                filter.addEventListener('change', function (e) {
                    actionStats.total = -1
                    actionStats.currentPage = 0
                    actionStats.content = []
                    actionStats.handler(1)
                }, false)
                mainContainer.appendChild(filter)
                var hr = doc.createElement('hr')
                mainContainer.appendChild(hr)
                var table = doc.getElementById('tableFramework').content.cloneNode(true).children[0]
                var header = doc.getElementById('statsItemHeader').content.cloneNode(true).children[0]
                table.querySelector('#header').appendChild(header)
                var tableBody = table.querySelector('#body')
                actionStats.pageIndexContainer = table.querySelector('#pageIndex')
                actionStats.setContainer(tableBody)
                actionStats.handler(1)
                mainContainer.appendChild(table)
            }
        },
        admin: {
            do: function () {
                contentTitle.textContent = '管理员信息'
                mainContainer.innerHTML = ''
                var changePasswordPanel = doc.getElementById('administratorInfoP').content.cloneNode(true)
                var setPassword = changePasswordPanel.querySelector('#setPassword')
                setPassword.addEventListener('click', function (e) {
                    var oldPassword = document.querySelector('#oldPassword')
                    //var u = {name: userName, password: oldPassword.value.trim()}
                    var u = {name: "admin", password: oldPassword.value.trim()}
                    g.getData('/api/administrators?filter=' + encodeURIComponent(JSON.stringify(u)), genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            if (d.data.length == 1) {
                                var newPassword = document.querySelector('#newPassword')
                                var retryNewPassword = document.querySelector('#retryNewPassword')
                                if (newPassword.value == retryNewPassword.value) {
                                    u.password = newPassword.value
                                    g.patchData('/api/administrators/' + u.name, genericHeaders, u, function (d) {
                                        if (d.meta.code < 400) {
                                            //alert('Your password changed!')
                                            alert('修改成功')
                                            oldPassword.value = ''
                                            newPassword.value = ''
                                            retryNewPassword.value = ''
                                        }
                                        // else if(d.meta.data==401){
                                        //    alert('用户没有修改权限')
                                        //}
                                    })
                                } else {
                                    //alert('new password not same')
                                    alert('新密码输入不相同')
                                }
                            } else {
                                alert('server internal error')
                            }
                        } else {
                            //alert('old password incorrect')
                            alert('旧密码错误，请重新输入')
                        }
                    })
                }, false)
                mainContainer.appendChild(changePasswordPanel)
                //var n = changePasswordPanel.querySelector('#oldPassword')
            }
        },
        bookStats: {
            followBooks: [],
            isFollowBooksGet: false,
            viewBooks: [],
            isViewBooksGet: false,
            downloadBooks: [],
            isDownloadBooksGet: false,
            currentBookType: 'download', //follow, view
            total: 10,
            container: null,
            currentPage: 1,
            pageIndexContainer: null,
            setContainer: function (c) {
                data.bookStats.container = c
            },
            handler: function (pageNo) {
                var bookStats = data.bookStats
                switch (bookStats.currentBookType) {
                    case 'follow':
                        if (!bookStats.isFollowBooksGet) {
                            g.getData('/api/business/top/follow', genericHeaders, function (d) {
                                if (d.meta.code == 200) {
                                    bookStats.followBooks = d.data
                                    bookStats.isFollowBooksGet = true
                                }
                                //else if(d.meta.code == 401){
                                //    alert('该用户没有访问权限')
                                //}
                            })
                        }
                        break
                    case 'view':
                        if (!bookStats.isViewBooksGet) {
                            g.getData('/api/business/top/view', genericHeaders, function (d) {
                                if (d.meta.code == 200) {
                                    bookStats.viewBooks = d.data
                                    bookStats.isViewBooksGet = true
                                }
                                //else if(d.meta.code == 401){
                                //    alert('该用户没有访问权限')
                                //}
                            })
                        }
                        break
                    case 'download':
                        if (!bookStats.isDownloadBooksGet) {
                            g.getData('/api/business/top/download', genericHeaders, function (d) {
                                if (d.meta.code == 200) {
                                    bookStats.downloadBooks = d.data
                                    bookStats.isDownloadBooksGet = true
                                }
                                //else if(d.meta.code == 401){
                                //    alert('该用户没有访问权限')
                                //}
                            })
                        }
                        break
                    default:
                        break
                }
                bookStats.render()
            },
            do: function () {
                var bookStats = data.bookStats
                bookStats.currentBookType = 'download'
                data.do('排行榜', '', 'bookStatsHeader', bookStats, null, function () {
                    var orderHandler = function (button, type) {
                        var button = e.target
                        switch (button.dataset.order) {
                            case 'any':
                                button.dataset.order = 'down'
                                break
                            case 'down':
                                button.dataset.order = 'up'
                                break
                            case 'up':
                                button.dataset.order = 'down'
                                break
                            default:
                                button.dataset.order = 'any'
                                break
                        }
                        bookStats.currentBookType = type
                        bookStats.handler(1)
                    }
                    var followButton = doc.getElementById('followOrder')
                    var viewButton = doc.getElementById('viewOrder')
                    var downloadButton = doc.getElementById('downloadOrder')
                    downloadButton.addClass('button-click ')

                    followButton.addEventListener('click', function (e) {
                        viewButton.removeClass('button-click ')
                        downloadButton.removeClass('button-click ')
                        followButton.addClass('button-click ')
                        orderHandler(e.target, 'follow')
                    }, false)

                    viewButton.addEventListener('click', function (e) {
                        viewButton.addClass('button-click ')
                        downloadButton.removeClass('button-click ')
                        followButton.removeClass('button-click ')
                        orderHandler(e.target, 'view')
                    }, false)

                    downloadButton.addEventListener('click', function (e) {
                        viewButton.removeClass('button-click ')
                        downloadButton.addClass('button-click ')
                        followButton.removeClass('button-click ')
                        orderHandler(e.target, 'download')
                    }, false)
                })
            },
            render: function () {
                var dataInfo = null
                switch (data.bookStats.currentBookType) {
                    case 'follow':
                        dataInfo = data.bookStats.followBooks
                        break
                    case 'view':
                        dataInfo = data.bookStats.viewBooks
                        break
                    case 'download':
                        dataInfo = data.bookStats.downloadBooks
                        break
                    default:
                        break
                }
                while (data.bookStats.container.rows.length > 0) {
                    data.bookStats.container.deleteRow(-1);
                }
                for (var i = 0, c = dataInfo.length; i < c; ++i) {
                    if (dataInfo[i].name.length > 20) {
                        dataInfo[i].shortName = dataInfo[i].name.substr(0, 15) + "..."
                    } else {
                        dataInfo[i].shortName = dataInfo[i].name
                    }
                    var body = doc.getElementById('bookStatsItem').content.cloneNode(true).children[0]
                    g.bind(body, dataInfo[i])
                    data.bookStats.container.appendChild(body)
                }

            }
        },
        bookStatsInfo: {
            selectDevice: [],
            classifierIsInit: false,
            classifier: [],
            followBooks: [],
            isFollowBooksGet: false,
            viewBooks: [],
            isViewBooksGet: false,
            downloadBooks: [],
            isDownloadBooksGet: false,
            currentBookType: 'download', //follow, view
            total: -1,
            pageSize: 10,
            container: null,
            content: [],
            currentPage: 0,
            pageIndexContainer: null,
            tableName: 'users',
            setContainer: function (c) {
                data.bookStatsInfo.container = c
            },
            handler: function (pageNo) {
                var bookStatsInfo = data.bookStatsInfo
                bookStatsInfo.loadData(pageNo)
                //bookStatsInfo.render()
                g.renderPageNavigator(bookStatsInfo.pageIndexContainer, bookStatsInfo.pageSize, bookStatsInfo.currentPage, bookStatsInfo.total, bookStatsInfo.handler)
            },
            getTotal: function (filter) {
                var bookStatsInfo = data.bookStatsInfo
                if (bookStatsInfo.tableName == 'users') {
                    var uri = '/api/' + bookStatsInfo.tableName + '/top/count'
                    if (!filter) {
                        //uri += '?filter=' + filter
                        g.getData(uri, genericHeaders, function (d) {
                            if (d.meta.code == 200) {
                                bookStatsInfo.total = d.data[0].count
                            }
                            //else if(d.meta.code == 401){
                            //    alert('该用户没有访问权限')
                            //}
                        })
                    } else {
                        bookStatsInfo.total = 1
                    }

                } else if (bookStatsInfo.tableName == "books") {
                    var uri = '/api/books/groups/firstLevelClassify'
                    if (!filter) {
                        uri += '?filter=' + filter
                        g.getData(uri, genericHeaders, function (d) {
                            if (d.meta.code == 200) {
                                bookStatsInfo.classifier = d.data
                                bookStatsInfo.total = d.data.length
                            }
                            //else if(d.meta.code == 401){
                            //    alert('该用户没有访问权限')
                            //}
                        })
                    } else {
                        bookStatsInfo.total = 1
                    }

                } else if (data.bookStatsInfo.tableName == "devices") {
                    var uri = '/api/devices'
                    if (!filter) {
                        uri += '?filter=' + filter
                        g.getData(uri, genericHeaders, function (d) {
                            if (d.meta.code == 200) {
                                bookStatsInfo.selectDevice = d.data
                                bookStatsInfo.total = d.data.length
                            }
                            //else if(d.meta.code == 401){
                            //    alert('该用户没有访问权限');
                            //}
                        })
                    } else {
                        bookStatsInfo.total = 1
                    }

                }

            },
            getFilter: function () {
                var result = null
                var userFrom = doc.getElementById('fromTimeUser')
                var userTo = doc.getElementById('toTimeUser')
                var bookSelect = doc.getElementById('selectBook')
                var bookFrom = doc.getElementById('fromTimeBook')
                var bookTo = doc.getElementById('toTimeBook')
                var deviceSelect = doc.getElementById('selectDevice')
                var deviceFrom = doc.getElementById('fromTimeDevice')
                var deviceTo = doc.getElementById('toTimeDevice')
                var hasCondition = false
                var filter = {}
                if (data.bookStatsInfo.tableName == "users") {
                    var userFromValue = userFrom.value
                    var userToValue = userTo.value
                    if (userFromValue != '') {
                        filter.userFrom = userFromValue
                        hasCondition = true
                    }
                    if (userToValue != '') {
                        filter.userTo = userToValue
                        hasCondition = true
                    }
                } else if (data.bookStatsInfo.tableName == "books") {
                    var bookSelectValue = bookSelect.value
                    var bookFromValue = bookFrom.value
                    var bookToValue = bookTo.value
                    if (bookSelectValue != '' && bookSelectValue != '全部') {
                        filter.bookSelect = bookSelectValue
                        hasCondition = true
                    }
                    if (bookFromValue != '') {
                        filter.bookFrom = bookFromValue
                        hasCondition = true
                    }
                    if (bookToValue != '') {
                        filter.bookTo = bookToValue
                        hasCondition = true
                    }
                } else if (data.bookStatsInfo.tableName == "devices") {
                    var deviceSelectValue = deviceSelect.value
                    var deviceFromValue = deviceFrom.value
                    var deviceToValue = deviceTo.value
                    if (deviceSelectValue != '' && deviceSelectValue != '全部') {
                        filter.deviceSelect = deviceSelectValue
                        hasCondition = true
                    }
                    if (deviceFromValue != '') {
                        filter.deviceFrom = deviceFromValue
                        hasCondition = true
                    }
                    if (deviceToValue != '') {
                        filter.deviceTo = deviceToValue
                        hasCondition = true
                    }
                }
                if (hasCondition) {
                    result = encodeURIComponent(JSON.stringify(filter))
                }
                return result
            },
            loadData: function (pageNo) {
                var bookStatsInfo = data.bookStatsInfo
                var filter = bookStatsInfo.getFilter()
                //if(filter){
                bookStatsInfo.getTotal(filter)
                //}
                var filterChange = doc.getElementById('filterChange')
                filterChange.addEventListener('change', function (e) {
                    bookStatsInfo.total = -1
                    bookStatsInfo.currentPage = 0
                    bookStatsInfo.content = []
                    bookStatsInfo.handler(1)
                }, false)
                bookStatsInfo.currentPage = pageNo
                if (data.bookStatsInfo.tableName == "users") {
                    var uri = '/api/' + bookStatsInfo.tableName + '/top/page'
                    if (filter) {
                        uri += '?filter=' + filter + '&offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    } else {
                        uri += '?offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    }
                    g.getData(uri, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            bookStatsInfo.content = d.data
                            bookStatsInfo.render("userStateInfo")
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                } else if (data.bookStatsInfo.tableName == "books") {
                    var uri = '/api/' + bookStatsInfo.tableName + '/counted'
                    if (filter) {
                        uri += '?filter=' + filter + '&offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    } else {
                        uri += '?offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    }
                    g.getData(uri, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            bookStatsInfo.content = d.data
                            bookStatsInfo.render("bookStateInfo")
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                } else if (data.bookStatsInfo.tableName == "devices") {
                    var uri = '/api/' + bookStatsInfo.tableName + '/counted'
                    if (filter) {
                        uri += '?filter=' + filter + '&offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    } else {
                        uri += '?offset=' + bookStatsInfo.pageSize * (pageNo - 1) + '&count=' + bookStatsInfo.pageSize
                    }
                    g.getData(uri, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            bookStatsInfo.content = d.data
                            bookStatsInfo.render("deviceStateInfo")
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限');
                        //}
                    })
                }
            },
            render: function (elementId) {
                var dataInfo = data.bookStatsInfo.content
                while (data.bookStatsInfo.container.rows.length > 0) {
                    data.bookStatsInfo.container.deleteRow(-1);
                }
                for (var i = 0, c = dataInfo.length; i < c; ++i) {
                    var body = doc.getElementById(elementId).content.cloneNode(true).children[0]
                    if (data.bookStatsInfo.tableName == "users") {
                        if (!dataInfo[i].date) {
                            if (dataInfo[i].from) {
                                dataInfo[i].date = dataInfo[i].from + "--"
                            } else {
                                dataInfo[i].date = "...." + "--"
                            }
                            if (dataInfo[i].to) {
                                dataInfo[i].date += dataInfo[i].to
                            } else {
                                dataInfo[i].date += "...."
                            }
                        }

                    }
                    g.bind(body, dataInfo[i])
                    data.bookStatsInfo.container.appendChild(body)
                }

            },
            do: function (name, filter, header, info) {
                data.do(name, filter, header, info)
                if (data.bookStatsInfo.tableName == "books") {
                    data.fillSelect('selectBook', data.bookStatsInfo.classifier, true)
                } else if (data.bookStatsInfo.tableName == "devices") {
                    var deviceNo = []
                    data.bookStatsInfo.selectDevice.forEach(function (e) {
                        deviceNo.push(e.no);
                    })
                    data.fillSelect('selectDevice', deviceNo, true)
                }
                var userInfo = doc.getElementById('userInfo')
                userInfo.addEventListener('click', function (event) {
                    data.bookStatsInfo.total = -1
                    data.bookStatsInfo.tableName = 'users'
                    data.switchTo(userInfo)
                    data.bookStatsInfo.do('统计信息', 'bookStatsInfoFilter', 'userInfoHeader', data.bookStatsInfo)
                    $('.change').removeClass("active")
                    doc.getElementById('userLi').addClass('active')
                    //$('#userInfo').parentNode.class="active"
                    //var aaa = userInfo.parentNode
                    //userInfo.parentNode.class="active"

                }, false)
                var bookInfo = doc.getElementById('bookInfo')
                bookInfo.addEventListener('click', function (event) {
                    data.bookStatsInfo.total = -1
                    data.bookStatsInfo.tableName = 'books'
                    data.switchTo(bookInfo)
                    data.bookStatsInfo.do('统计信息', 'bookStatsInfoFilter', 'bookInfoHeader', data.bookStatsInfo)
                    $('.change').removeClass("active")
                    doc.getElementById('bookLi').addClass('active')
                    //$('#bookInfo').parentNode.class="active"
                    //var aaa = bookInfo.parentNode
                    //bookInfo.parentNode.class="active

                }, false)
                var deviceInfo = doc.getElementById('deviceInfo')
                deviceInfo.addEventListener('click', function (event) {
                    data.bookStatsInfo.total = -1
                    data.bookStatsInfo.tableName = 'devices'
                    data.switchTo(deviceInfo)
                    data.bookStatsInfo.do('统计信息', 'bookStatsInfoFilter', 'deviceInfoHeader', data.bookStatsInfo)
                    $('.change').removeClass("active")
                    doc.getElementById('deviceLi').addClass('active')
                    //$('#deviceInfo').parentNode.class="active"
                    //var aaa = deviceInfo.parentNode
                    //deviceInfo.parentNode.class="active"

                }, false)
            }
        },
        administrator: {
            pageSize: 15,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            pageIndexContainer: null,
            setContainer: function (c) {
                data.administrator.container = c
            },
            getFilter: function () {
                var result = null
                var userNo = doc.getElementById('userNo')
                var registerStartTime = doc.getElementById('registerStartTime')
                var registerStopTime = doc.getElementById('registerStopTime')
                var hasCondition = false
                var filter = {}
                var userNoValue = userNo.value
                if (userNoValue != '') {
                    filter.no = userNoValue
                    hasCondition = true
                }
                var registerStartTimeValue = registerStartTime.value
                if (registerStartTimeValue != '') {
                    filter.fromTime = (new Date(registerStartTime.value)).getTime() / 1000
                    hasCondition = true
                }
                var registerStopTimeValue = registerStopTime.value
                if (registerStopTimeValue != '') {
                    //filter.toTime = registerStopTimeValue
                    filter.toTime = (new Date(registerStopTime.value)).getTime() / 1000
                    hasCondition = true
                }
                //if (hasCondition) {
                result = encodeURIComponent(JSON.stringify(filter))
                //}
                return result
            },
            getTotal: function (filter) {
                var uri = '/api/administrators/statistics/count'
                if (filter) {
                    uri += '?filter=' + filter
                }
                g.getData(uri, genericHeaders, function (d) {
                    if (d.meta.code == 200) {
                        data.administrator.total = d.data.value
                    }
                    //else if(d.meta.code == 401){
                    //    alert('该用户没有访问权限');
                    //}
                })
            },
            loadData: function (pageNo) {
                var administrator = data.administrator
                //var filter = privilege.getFilter()
                if (administrator.total == -1) {
                    administrator.getTotal()
                }
                if (administrator.currentPage != pageNo) {
                    administrator.currentPage = pageNo
                    var offset = administrator.pageSize * (administrator.currentPage - 1)
                    var orderBy = encodeURIComponent(JSON.stringify({id: 'asc'}))
                    var url = '/api/administrators';
                    url += '?offset=' + offset + '&count=' + administrator.pageSize + '&orderBy=' + orderBy;
                    //alert(url)
                    g.getData(url, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            administrator.content = d.data
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限');
                        //}
                    })
                }
            },
            render: function () {
                var administrator = data.administrator
                while (administrator.container.rows.length > 0) {
                    administrator.container.deleteRow(-1)
                }
                var contents = administrator.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('administratorInfo').content.cloneNode(true).children[0]
                    var date = new Date(contents[i].lastOperationTime * 1000)
                    contents[i].lastOperationTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    g.bind(body, contents[i])
                    //修改用户权限
                    body.querySelector('.changePrivilege').addEventListener('click', function (e) {
                        data.createAdmin.userId = e.target.dataset.id
                        data.switchTo(doc.getElementById('createAdmin'))
                        data.createAdmin.do()
                    }, false)

                    //注销用户
                    body.querySelector('.changeOut').addEventListener('click', function (e) {
                        var value = e.target.dataset.id
                        data.administrator.changeOut(value)
                    }, false)
                    administrator.container.appendChild(body)
                }
            },
            changeOut: function (value) {
                g.deleteData()
            },
            handler: function (pageNo) {
                var administrator = data.administrator
                administrator.loadData(pageNo)
                administrator.render()
                g.renderPageNavigator(administrator.pageIndexContainer, administrator.pageSize, administrator.currentPage, administrator.total, administrator.handler)
            },
            do: function () {
                data.do('权限管理', 'administratorInfoFilter', 'administratorInfoHeader', data.administrator)
            }
        },
        createAdmin: {
            isInit: false,
            userCount: 0,
            bookCount: 0, normalBookCount: 0,
            deviceCount: 0, liveDeviceCount: 0,
            userInfo: {},
            userId: 0,
            getInfo: function () {
                //var userName = doc.getElementById('userName')
                var result = false;
                var userName = doc.getElementById('userName').value.trim()
                var userPassword = doc.getElementById('userPassword').value.trim()
                if (userName != "" && userPassword != "") {
                    data.createAdmin.userInfo.userName = userName
                    data.createAdmin.userInfo.userPassword = userPassword
                    data.createAdmin.userInfo.stage = [15001]
                    var stageChks = $("[name='select']:checked").each(function (c) {
                        data.createAdmin.userInfo.stage.push($(this).val())
                    });
                    return result = data.createAdmin.userInfo
                } else {
                    alert("请输入用户名，密码")
                }
                return result
            },
            do: function () {
                contentTitle.textContent = '用户信息'
                mainContainer.innerHTML = ''
                var firstPageContent = doc.getElementById('createAdminInfo').content.cloneNode(true).children[0]
                mainContainer.appendChild(firstPageContent)
                if (data.createAdmin.userId == 0) {
                    //保存用户，privilege关联
                    doc.getElementById('createUser').addEventListener('click', function () {
                        var dataInfo = data.createAdmin.getInfo()
                        if (dataInfo != false) {
                            g.getData('/api/administrators?filter=' + encodeURIComponent(JSON.stringify({name: dataInfo.userName})), genericHeaders, function (user) {
                                if (user.meta.code == 404) {
                                    g.postData('/api/administrators/full', genericHeaders, dataInfo, function (d) {
                                        if (d.meta.code == 200) {
                                            alert("创建成功")
                                            data.createAdmin.userId = 0
                                            data.switchTo(doc.getElementById('administrator'))
                                            data.administrator.do()
                                        }
                                        //else if(d.meta.data==401){
                                        //    alert('用户没有修改权限')
                                        //}
                                    })
                                } else {
                                    alert("用户名已存在")
                                }
                            })

                        }
                    }, false)
                } else {
                    //输出姓名   编辑用户信息
                    g.getData('/api/administrators/' + data.createAdmin.userId, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            doc.getElementById('userName').value = d.data.name
                            doc.getElementById('userName').readOnly = true
                            doc.getElementById('userPassword').value = d.data.password
                            doc.getElementById('userPassword').readOnly = true
                            //添加勾选信息
                            g.getData('/api/privileges/byMap/privilegeId/administratorPrivilegeMap/administratorId/' + d.data.id, genericHeaders, function (e) {
                                if (e.meta.code == 200) {
                                    e.data.forEach(function (a) {
                                        if (doc.getElementById(a.id)) {
                                            doc.getElementById(a.id).checked = true
                                        }

                                    })
                                }
                            })
                        }
                        //else if(d.meta.code == 401){
                        //    alert('该用户没有访问权限')
                        //}
                    })
                    //修改用户，privilege关联
                    doc.getElementById('createUser').addEventListener('click', function () {
                        var dataInfo = []
                        var result = data.createAdmin.getInfo()
                        result.stage.forEach(function (s) {
                            dataInfo.push({"administratorId": data.createAdmin.userId, "privilegeId": s})
                        })
                        g.deleteData('/api/administratorPrivilegeMaps?filter=' + encodeURIComponent(JSON.stringify({administratorId: data.createAdmin.userId})), genericHeaders, function (d) {
                            if (d.meta.code == 200 || d.meta.code == 404) {
                                g.postData('/api/administratorPrivilegeMaps', genericHeaders, dataInfo, function (d) {
                                    if (d.meta.code == 201) {
                                        alert("创建成功")
                                        data.createAdmin.userId = 0
                                        data.switchTo(doc.getElementById('administrator'))
                                        data.administrator.do()
                                    }
                                })
                            }
                            //else if(d.meta.data==401){
                            //    alert('用户没有修改权限')
                            //}
                        })
                    }, false)
                }


            }
        }
    }
    var firstPage = doc.getElementById('firstPage')
    firstPage.addEventListener('click', function (event) {
        data.baseInfo.isInit = false
        data.switchTo(firstPage)
        data.baseInfo.do()
    }, false)
    var bookList = doc.getElementById('bookList')
    bookList.addEventListener('click', function (event) {
        data.books.currentPage = 0
        data.books.total = -1
        data.switchTo(bookList)
        data.books.do()
    }, false)
    var deviceList = doc.getElementById('deviceList')
    deviceList.addEventListener('click', function (event) {
        data.devices.currentPage = 0
        data.devices.content = []
        data.devices.total = -1
        data.switchTo(deviceList)
        data.devices.do()
    }, false)
    var userManagement = doc.getElementById('userManagement')
    userManagement.addEventListener('click', function (event) {
        data.users.currentPage = 0
        data.users.total = -1
        data.switchTo(userManagement)
        data.users.do()
    }, false)
    var administratorManagement = doc.getElementById('administratorManagement')
    administratorManagement.addEventListener('click', function (event) {
        data.switchTo(administratorManagement)
        data.admin.do()
        doc.getElementById('changeName').innerHTML = userName
    }, false)
    //用户权限
    var administrator = doc.getElementById('administrator')
    administrator.addEventListener('click', function (event) {
        data.switchTo(administrator)
        data.administrator.do()
        //创建用户
        var createUser = doc.getElementById('createAdmin')
        createUser.addEventListener('click', function (event) {
            data.createAdmin.userId = 0
            data.switchTo(createUser)
            data.createAdmin.do()
        }, false)
    }, false)
    var stats = doc.getElementById('stats')
    stats.addEventListener('click', function (event) {
        data.switchTo(stats)
        data.bookStats.do()
    }, false)
    var statsInfo = doc.getElementById('statsInfo')
    statsInfo.addEventListener('click', function (event) {
        data.switchTo(statsInfo)
        data.bookStatsInfo.do('统计信息', 'bookStatsInfoFilter', 'userInfoHeader', data.bookStatsInfo)
        doc.getElementById('userLi').addClass('active')
        //doc.getElementById('userLi').style.color='white'
    }, false)
    var createDevice = doc.querySelector('#createDevice .btn-primary')
    createDevice.addEventListener('click', function (e) {
        var device = {}
        var id = doc.getElementById('newDeviceId')
        var no = doc.getElementById('newDeviceNo')
        var address = doc.getElementById('newDeviceAddress')
        var setupTime = doc.getElementById('newDeviceSetupTime')
        var controlNo = doc.getElementById('newDeviceControlNo')
        var controlPassword = doc.getElementById('newDeviceControlPassword')
        var ipAddress = doc.getElementById('newDeviceIPAddress')
        device.id = id.value.trim()
        device.no = no.value.trim()
        device.address = address.value.trim()
        device.setupTime = setupTime.value.trim()
        device.controlNo = controlNo.value.trim()
        device.controlPassword = controlPassword.value.trim()
        device.ipAddress = ipAddress.value.trim()
        //alert(JSON.stringify(device))
        var sameOrNot = encodeURIComponent(JSON.stringify({'id': device.id}));
        //验证时间格式   与  id是否唯一
        if (device.setupTime != "") {
            if (device.id.match(/^[0-9]*[1-9][0-9]*$/)) {
                g.getData('/api/devices?filter=' + sameOrNot, genericHeaders, function (d) {
                    if (d.meta.code == 200 && d.data.length > 0) {
                        alert(device.id + "已存在")
                    } else {
                        g.postData('/api/devices/' + device.id, genericHeaders, device, function (d) {
                            var title = doc.querySelector('#createDevice h4')
                            title.textContent = '借阅机创建成功'
                            title.style.color = 0x0000FF
                            setTimeout(function () {
                                $('#createDevice').modal('hide')
                                //add device to data.devices.content
                            }, 2000)
                            data.devices.currentPage = 0
                            data.devices.total = -1
                            data.devices.content = []
                            data.switchTo(deviceList)
                            data.devices.do()
                            //alert('借阅机创建成功')
                        })
                    }
                })

            } else {
                alert("请输入正确ID(数字)")
            }
        } else {
            alert("时间不能为空")
        }
    }, false)
    var e = doc.createEvent('Event')
    e.initEvent('click', false, false)
    firstPage.dispatchEvent(e)
}, false)
