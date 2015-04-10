/**
 * Created by fixopen on 7/4/15.
 */

window.addEventListener('load', function (e) {
    var genericHeaders = [{'name': 'Content-Type', 'value': 'application/json'}, {
        'name': 'Accept',
        'value': 'application/json'
    }]
    var doc = document
    var data = {
        baseInfo: {
            isInit: false,
            userCount: 0,
            bookCount: 0, notBanBookCount: 0,
            deviceCount: 0, liveDeviceCount: 0
        },
        books: {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            setContainer: function(c) {
                data.books.container = c
            },
            getFilter: function() {
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
                if (bookStandardClassifierValue != '') {
                    filter.standardClassify = bookStandardClassifierValue
                    hasCondition = true
                }
                var bookClassifierValue = bookClassifier.value
                if (bookClassifierValue != '') {
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
                return result
            },
            getTotal: function(filter) {
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
                    var orderBy = encodeURIComponent(JSON.stringify({id : 'asc'}))
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
        devices : {
            pageSize: 10,
            total: -1,
            currentPage: 0,
            content: [],
            container: null,
            setContainer: function(c) {
                data.devices.container = c
            },
            getFilter: function() {
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
                if (bookStandardClassifierValue != '') {
                    filter.standardClassify = bookStandardClassifierValue
                    hasCondition = true
                }
                var bookClassifierValue = bookClassifier.value
                if (bookClassifierValue != '') {
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
                return result
            },
            getTotal: function(filter) {
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
                    var orderBy = encodeURIComponent(JSON.stringify({id : 'asc'}))
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
            setContainer: function(c) {
                data.users.container = c
            },
            getFilter: function() {
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
                if (bookStandardClassifierValue != '') {
                    filter.standardClassify = bookStandardClassifierValue
                    hasCondition = true
                }
                var bookClassifierValue = bookClassifier.value
                if (bookClassifierValue != '') {
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
                return result
            },
            getTotal: function(filter) {
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
                    var orderBy = encodeURIComponent(JSON.stringify({id : 'asc'}))
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
        contentTitle.textContent = '管理首页'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
        var baseInfo = data.baseInfo
        if (!baseInfo.isInit) {
            g.getData('/api/devices/statistics/count', genericHeaders, function(d) {
                baseInfo.deviceCount = d.value
            })
            g.getData('/api/books/statistics/count', genericHeaders, function(d) {
                baseInfo.bookCount = d.value
            })
            g.getData('/api/users/statistics/count', genericHeaders, function(d) {
                baseInfo.userCount = d.value
            })
            g.getData('/api/devices/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isOnline: true})), genericHeaders, function(d) {
                baseInfo.liveDeviceCount = d.value
            })
            g.getData('/api/books/statistics/count?filter=' + encodeURIComponent(JSON.stringify({isBan: true})), genericHeaders, function(d) {
                baseInfo.notBanBookCount = d.value
            })
            baseInfo.isInit = true
        }
        g.bind(firstPageContent, baseInfo)
        mainContainer.appendChild(firstPageContent)
    }, false)
    var bookList = doc.getElementById('bookList')
    bookList.addEventListener('click', function (event) {
        contentTitle.textContent = '数字图书管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('bookFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var hr = doc.createElement('hr')
        mainContainer.appendChild(hr)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('bookItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var tableBody = table.querySelector('#body')
        var books = data.books
        books.setContainer(tableBody)
        books.loadData(1)
        books.render()
        mainContainer.appendChild(table)
        g.renderPageNavigator('pageIndex', books.pageSize, books.currentPage, books.total, books.handler)
    }, false)
    var deviceList = doc.getElementById('deviceList')
    deviceList.addEventListener('click', function (event) {
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
        contentTitle.textContent = '用户管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('userFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('userItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var body = doc.getElementById('userItem').content.cloneNode(true)
        table.querySelector('#body').appendChild(body)
        mainContainer.appendChild(table)
    }, false)
    var administratorManagement = doc.getElementById('administratorManagement')
    administratorManagement.addEventListener('click', function (event) {
        contentTitle.textContent = '管理员信息'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
        mainContainer.appendChild(firstPageContent)
    }, false)
    var stats = doc.getElementById('stats')
    stats.addEventListener('click', function (event) {
        contentTitle.textContent = '统计信息'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('statsContent').content.cloneNode(true)
        mainContainer.appendChild(firstPageContent)
    }, false)
}, false)