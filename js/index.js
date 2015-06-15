/**
 * Created by fixopen on 7/4/15.
 */

window.addEventListener('load', function (e) {
    var genericHeaders = [
        {
            'name': 'Content-Type',
            'value': 'application/json'
        }, {
            'name': 'Accept',
            'value': 'application/json'
        }
    ]
    var doc = document
    var data = {
        currentItem: null,
        switchTo: function(item) {
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
        fillRadio: function(radioName, value) {
            var radios = doc.querySelectorAll('input[name="' + radioName + '"]')
            for (var i = 0, c = radios.length; i < c; ++i) {
                if (radios.item(i).value == value) {
                    radios.item(i).checked = true
                    break
                }
            }
        },
        getRadio: function(radioName) {
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
        baseInfo: {
            isInit: false,
            userCount: 0,
            bookCount: 0, normalBookCount: 0,
            deviceCount: 0, liveDeviceCount: 0
        },
        books: {
            pageSize: 4,
            total: -1,
            currentPage: 0,
            standardClassifierIsInit: false,
            standardClassifier: [],
            classifierIsInit: false,
            classifier: [],
            drmDuration: 0,
            content: [],
            container: null,
            setContainer: function (c) {
                data.books.container = c
            },
            getStandardClassifier: function () {
                var uri = '/api/books/groups/standardClassify'
                g.getData(uri, genericHeaders, function (d) {
                    data.books.standardClassifier = d
                    data.books.standardClassifierIsInit = true
                })
            },
            getClassifier: function () {
                var uri = '/api/books/groups/firstLevelClassify'
                g.getData(uri, genericHeaders, function (d) {
                    data.books.classifier = d
                    data.books.classifierIsInit = true
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
                var bookState = 0; //radio group
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
                    data.books.total = d.value
                })
            },
            //load data
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
                        books.content = d
                    })
                }
            },
            //render
            render: function () {
                var books = data.books
                var contents = books.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('bookItem').content.cloneNode(true).children[0]
                    contents[i].state = '正常'
                    if (contents[i].isBan) {
                        contents[i].state = '下架'
                    }
                    g.bind(body, contents[i])
                    books.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var books = data.books
                books.loadData(pageNo)
                books.render()
            }
        },
        devices: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
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
                    data.devices.total = d.value
                })
            },
            //load data
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
                        devices.content = d
                    })
                }
            },
            //render
            render: function () {
                var devices = data.devices
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
                    devices.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var devices = data.devices
                devices.loadData(pageNo)
                devices.render()
            }
        },
        users: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
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
                    //@@filter.registerTime >= registerStartTimeValue
                    hasCondition = true
                }
                var registerStopTimeValue = registerStopTime.value
                if (registerStopTimeValue != '') {
                    //@@filter.registerTime <= registerStopTimeValue
                    hasCondition = true
                }
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
                    data.users.total = d.value
                })
            },
            //load data
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
                    g.getData('/api/users?filter=' + filter + '&offset=' + offset + '&count=' + users.pageSize + '&orderBy=' + orderBy, genericHeaders, function (d) {
                        users.content = d
                    })
                }
            },
            //render
            render: function () {
                var users = data.users
                var contents = users.content
                for (var i = 0, c = contents.length; i < c; ++i) {
                    var body = doc.getElementById('deviceItem').content.cloneNode(true).children[0]
                    contents[i].state = '心跳'
                    var currentTime = new Date()
                    currentTime = currentTime.getTime() / 1000
                    if ((currentTime - contents[i].lastOperationTime) > 30 * 60) {
                        contents[i].state = '下线'
                    }
                    g.bind(body, contents[i])
                    users.container.appendChild(body)
                }
            },
            handler: function (pageNo) {
                var users = data.users
                users.loadData(pageNo)
                users.render()
            }
        },
        actionStats: {
            //
        }
    }
    var contentTitle = doc.getElementById('contentTitle')
    var mainContainer = doc.getElementById('mainContainer')
    var firstPage = doc.getElementById('firstPage')
    firstPage.addEventListener('click', function (event) {
        data.switchTo(firstPage)

        contentTitle.textContent = '管理首页'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true).children[0]
        var baseInfo = data.baseInfo
        if (!baseInfo.isInit) {
            g.getData('/api/devices/statistics/count', genericHeaders, function (d) {
                baseInfo.deviceCount = d.value
            })
            g.getData('/api/devices/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isOnline: true})), genericHeaders, function (d) {
                baseInfo.liveDeviceCount = d.value
            })
            g.getData('/api/books/statistics/count', genericHeaders, function (d) {
                baseInfo.bookCount = d.value
            })
            g.getData('/api/books/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isBan: true})), genericHeaders, function (d) {
                baseInfo.normalBookCount = d.value
            })
            g.getData('/api/users/statistics/count', genericHeaders, function (d) {
                baseInfo.userCount = d.value
            })
            baseInfo.isInit = true
        }
        g.bind(firstPageContent, baseInfo)
        mainContainer.appendChild(firstPageContent)
    }, false)
    var bookList = doc.getElementById('bookList')
    bookList.addEventListener('click', function (event) {
        data.switchTo(bookList)

        contentTitle.textContent = '数字图书管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('bookFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var books = data.books
        if (!books.standardClassifierIsInit) {
            books.getStandardClassifier()
        }
        if (!books.classifierIsInit) {
            books.getClassifier()
        }
        g.getData('/api/systemParameters?filter=' + encodeURIComponent(JSON.stringify({name: 'drmDuration'})), genericHeaders, function(d) {
            if (d.length == 1) {
                var param = d[0]
                books.drmDuration = param.value
            } else {
                books.drmDuration = 90
                alert('DRM duration use default value : 90')
            }
        })
        data.fillSelect('bookStandardClassifier', books.standardClassifier, true)
        data.fillSelect('bookClassifier', books.classifier, true)
        data.fillRadio('bookState', 'normal')
        var drmDuration = doc.getElementById('drmDuration')
        drmDuration.value = books.drmDuration
        var setDrmDuration = doc.getElementById('setDrmDuration')
        setDrmDuration.addEventListener('click', function(e) {
            var drmDuration = doc.getElementById('drmDuration')
            var v = drmDuration.value.trim()
            if (parseInt(v) == v) {
                g.patchData('/api/systemParameters/drmDuration', genericHeaders, {value: v}, function(r) {
                    alert('设置成功')
                })
            } else {
                alert('必须填写正确的天数')
            }
        }, false)
        var hr = doc.createElement('hr')
        mainContainer.appendChild(hr)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('bookItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var tableBody = table.querySelector('#body')
        books.setContainer(tableBody)
        books.loadData(1)
        books.render()
        mainContainer.appendChild(table)
        g.renderPageNavigator('pageIndex', books.pageSize, books.currentPage, books.total, books.handler)
    }, false)
    var deviceList = doc.getElementById('deviceList')
    deviceList.addEventListener('click', function (event) {
        data.switchTo(deviceList)

        contentTitle.textContent = '借阅机管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('deviceFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var hr = doc.createElement('hr')
        mainContainer.appendChild(hr)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('deviceItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var tableBody = table.querySelector('#body')
        var devices = data.devices
        devices.setContainer(tableBody)
        devices.loadData(1)
        devices.render()
        mainContainer.appendChild(table)
        g.renderPageNavigator('pageIndex', devices.pageSize, devices.currentPage, devices.total, devices.handler)
    }, false)
    var userManagement = doc.getElementById('userManagement')
    userManagement.addEventListener('click', function (event) {
        data.switchTo(userManagement)

        contentTitle.textContent = '用户管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('userFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var hr = doc.createElement('hr')
        mainContainer.appendChild(hr)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('userItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var body = doc.getElementById('userItem').content.cloneNode(true)
        table.querySelector('#body').appendChild(body)
        mainContainer.appendChild(table)
    }, false)
    var administratorManagement = doc.getElementById('administratorManagement')
    administratorManagement.addEventListener('click', function (event) {
        data.switchTo(administratorManagement)

        contentTitle.textContent = '管理员信息'
        mainContainer.innerHTML = ''
        var admin = doc.getElementById('administratorInfo').content.cloneNode(true)
        mainContainer.appendChild(admin)
    }, false)
    var stats = doc.getElementById('stats')
    stats.addEventListener('click', function (event) {
        data.switchTo(stats)

        contentTitle.textContent = '统计信息'
        mainContainer.innerHTML = ''
        var statsInfo = doc.getElementById('statsContent').content.cloneNode(true)
        mainContainer.appendChild(statsInfo)
    }, false)
    var createDevice = doc.querySelector('#createDevice .btn-primary')
    createDevice.addEventListener('click', function(e) {
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
        g.postData('/api/devices/' + device.no, genericHeaders, device, function(d) {
            var title = doc.querySelector('#createDevice h4')
            title.textContent = '借阅机创建成功'
            title.style.color = 0x0000FF
            setTimeout(function() {
                $('#createDevice').modal('hide')
                //add device to data.devices.content
            }, 2000)
            //alert('借阅机创建成功')
        })
    }, false)
    firstPage.dispatchEvent(doc.createEvent('click'))
}, false)