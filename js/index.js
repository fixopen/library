/**
 * Created by fixopen on 7/4/15.
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
    doc.getElementById('timeNow').innerHTML = Date()
    var logout = doc.getElementById('logout')
    logout.addEventListener('click', function (e) {
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
            oldPage:1,
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
                    })
                }
            },
            render: function () {
                var books = data.books
                while (books.container.rows.length > 0) {
                    books.container.deleteRow(-1);
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
                        clickState.name = "book";
                        clickState.value =  e.target.dataset.id
                        //
                        var actionStats = data.actionStats
                        actionStats.reset()
                        actionStats.setProp('book', e.target.dataset.id)
                        actionStats.do()
                    }, false)
                    body.querySelector('.ban').addEventListener('click', function (e) {
                        //修改上下架状态
                        var patchData = {};
                        books.content.forEach(function(item,index){
                            if(item.id == e.target.dataset.id){
                                if(item.isBan == true){
                                    patchData = {"isBan": false}
                                }else{
                                    patchData = {"isBan": true}
                                }
                            }
                        })


                        g.patchData('/api/books/' + e.target.dataset.id, genericHeaders, patchData, function (r) {
                            //books.handler(books.currentPage)
                        })
                        books.total = -1
                        books.currentPage = 0
                        books.content = []
                        books.handler(books.oldPage)
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
                        g.postData('/api/systemParameters', genericHeaders, {name: "drmDuration", value: 90}, function(e) {
                            //
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
                    if(parseInt(v)>1&&parseInt(v)<366){
                        if (parseInt(v) == v) {
                            g.patchData('/api/systemParameters/drmDuration', genericHeaders, {value: v}, function (r) {
                                if (r.meta.code < 400) {
                                    alert('设置成功')
                                }
                            })
                        } else {
                            alert('必须填写正确的天数')
                        }
                    }else{
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
                    filter.setupTime = setupTimeValue
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
                    contents[i].state = '心跳'
                    var currentTime = new Date()
                    currentTime = currentTime.getTime() / 1000
                    if ((currentTime - contents[i].lastOperationTime) > 30 * 60) {
                        contents[i].state = '下线'
                    }
                    g.bind(body, contents[i])
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
                var obbbb = new Date(2015,01,01)
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
                    filter.fromTime = registerStartTimeValue
                    hasCondition = true
                }
                var registerStopTimeValue = registerStopTime.value
                if (registerStopTimeValue != '') {
                    filter.toTime = registerStopTimeValue
                    hasCondition = true
                }
                if (hasCondition) {
                    result = encodeURIComponent(JSON.stringify(filter))
                }
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
                    var url = '/api/users';
                    url += '?filter=' + filter + '&offset=' + offset + '&count=' + users.pageSize + '&orderBy=' + orderBy;
                    //alert(url)
                    g.getData(url, genericHeaders, function (d) {
                        if (d.meta.code == 200) {
                            users.content = d.data
                        }
                    })
                }
            },
            render: function () {
                var users = data.users
                while (users.container.rows.length > 0) {
                    users.container.deleteRow(-1);
                }
                var contents = users.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('userItem').content.cloneNode(true).children[0]
                    contents[i].state = '心跳'
                    var currentTime = new Date()
                    currentTime = currentTime.getTime() / 1000
                    if ((currentTime - contents[i].lastOperationTime) > 30 * 60) {
                        contents[i].state = '下线'
                    }
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
                    })
                }
            },
            render: function () {
                var actionStats = data.actionStats
                while (actionStats.container.rows.length > 0) {
                    actionStats.container.deleteRow(-1);
                }
                var contents = actionStats.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('statsItem').content.cloneNode(true).children[0]
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
                var changePasswordPanel = doc.getElementById('administratorInfo').content.cloneNode(true)
                var setPassword = changePasswordPanel.querySelector('#setPassword')
                setPassword.addEventListener('click', function (e) {
                    var oldPassword = document.querySelector('#oldPassword')
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
                data.do('统计信息', '', 'bookStatsHeader', bookStats, null, function () {
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
                    followButton.addEventListener('click', function (e) {
                        orderHandler(e.target, 'follow')
                    }, false)
                    var viewButton = doc.getElementById('viewOrder')
                    viewButton.addEventListener('click', function (e) {
                        orderHandler(e.target, 'view')
                    }, false)
                    var downloadButton = doc.getElementById('downloadOrder')
                    downloadButton.addEventListener('click', function (e) {
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
                    var body = doc.getElementById('bookStatsItem').content.cloneNode(true).children[0]
                    g.bind(body, dataInfo[i])
                    data.bookStats.container.appendChild(body)
                }

            }
        }
    }
    var firstPage = doc.getElementById('firstPage')
    firstPage.addEventListener('click', function (event) {
        data.switchTo(firstPage)
        data.baseInfo.do()
    }, false)
    var bookList = doc.getElementById('bookList')
    bookList.addEventListener('click', function (event) {
        data.switchTo(bookList)
        data.books.do()
    }, false)
    var deviceList = doc.getElementById('deviceList')
    deviceList.addEventListener('click', function (event) {
        data.switchTo(deviceList)
        data.devices.do()
    }, false)
    var userManagement = doc.getElementById('userManagement')
    userManagement.addEventListener('click', function (event) {
        data.switchTo(userManagement)
        data.users.do()
    }, false)
    var administratorManagement = doc.getElementById('administratorManagement')
    administratorManagement.addEventListener('click', function (event) {
        data.switchTo(administratorManagement)
        data.admin.do()
    }, false)
    var stats = doc.getElementById('stats')
    stats.addEventListener('click', function (event) {
        data.switchTo(stats)
        data.bookStats.do()
    }, false)
    var createDevice = doc.querySelector('#createDevice .btn-primary')
    createDevice.addEventListener('click', function (e) {
        var device = {}
        var no = doc.getElementById('newDeviceNo')
        var address = doc.getElementById('newDeviceAddress')
        var setupTime = doc.getElementById('newDeviceSetupTime')
        var controlNo = doc.getElementById('newDeviceControlNo')
        var controlPassword = doc.getElementById('newDeviceControlPassword')
        var ipAddress = doc.getElementById('newDeviceIPAddress')
        device.no = no.value.trim()
        device.address = address.value.trim()
        device.setupTime = setupTime.value.trim()
        device.controlNo = controlNo.value.trim()
        device.controlPassword = controlPassword.value.trim()
        device.ipAddress = ipAddress.value.trim()
        //alert(JSON.stringify(device))
        g.postData('/api/devices/' + device.no, genericHeaders, device, function (d) {
            var title = doc.querySelector('#createDevice h4')
            title.textContent = '借阅机创建成功'
            title.style.color = 0x0000FF
            setTimeout(function () {
                $('#createDevice').modal('hide')
                //add device to data.devices.content
            }, 2000)
            //alert('借阅机创建成功')
        })
    }, false)
    var e = doc.createEvent('Event')
    e.initEvent('click', false, false)
    firstPage.dispatchEvent(e)
}, false)
