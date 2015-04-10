/**
 * Created by fixopen on 7/4/15.
 */

window.addEventListener('load', function(e) {
    var data = {}
    var genericHeaders = [{'name': 'Content-Type', 'value': 'application/json'}, {'name': 'Accept', 'value': 'application/json'}]
    var doc = document
    var contentTitle = doc.getElementById('contentTitle')
    var mainContainer = doc.getElementById('mainContainer')
    var firstPage = doc.getElementById('firstPage')
    firstPage.addEventListener('click', function(event) {
        contentTitle.textContent = '管理首页'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
        //if (!data.baseInfo) {
        //    g.getData('/api/baseInfo', function(d) {
        //        data.baseInfo = d
        //    }, genericHeaders)
        //}
        //g.bind(firstPageContent, data.baseInfo)
        mainContainer.appendChild(firstPageContent)
    }, false)
    //var importBooks = doc.getElementById('importBooks')
    //importBooks.addEventListener('click', function(event) {
    //    mainContainer.innerHTML = ''
    //    var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
    //    mainContainer.appendChild(firstPageContent)
    //}, false)
    //var DRM = doc.getElementById('DRM')
    //DRM.addEventListener('click', function(event) {
    //    mainContainer.innerHTML = ''
    //    var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
    //    mainContainer.appendChild(firstPageContent)
    //}, false)
    var bookList = doc.getElementById('bookList')
    bookList.addEventListener('click', function(event) {
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
        ////load data
        //if (!data.books) {
        //    data.books = {}
        //    data.books.currentPage = 1
        //    g.getData('/api/books/statistics/count', function(d) {
        //        data.books.total = d
        //    }, genericHeaders)
        //    g.getData('/api/books', function(d) {
        //        data.books.content = d
        //    }, genericHeaders)
        //}
        ////render
        //for (var i = 0, c = data.books.total; i < c; ++i) {
        //    var body = doc.getElementById('bookItem').content.cloneNode(true)
        //    g.bind(body, data.books.content[i])
        //    tableBody.appendChild(body)
        //}
        //var handler = function(pageNo) {
        //    //loadData(pageNo)
        //    //render()
        //}
        //g.renderPageNavigator('pageIndex', 20, data.books.currentPage, data.books.total, handler)
        mainContainer.appendChild(table)
    }, false)
    var deviceList = doc.getElementById('deviceList')
    deviceList.addEventListener('click', function(event) {
        contentTitle.textContent = '借阅机管理'
        mainContainer.innerHTML = ''
        var filter = doc.getElementById('deviceFilter').content.cloneNode(true)
        mainContainer.appendChild(filter)
        var hr = doc.createElement('hr')
        mainContainer.appendChild(hr)
        var table = doc.getElementById('tableFramework').content.cloneNode(true)
        var header = doc.getElementById('deviceItemHeader').content.cloneNode(true)
        table.querySelector('#header').appendChild(header)
        var body = doc.getElementById('deviceItem').content.cloneNode(true)
        table.querySelector('#body').appendChild(body)
        mainContainer.appendChild(table)
    }, false)
    var userManagement = doc.getElementById('userManagement')
    userManagement.addEventListener('click', function(event) {
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
    administratorManagement.addEventListener('click', function(event) {
        contentTitle.textContent = '管理员信息'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('firstPageContent').content.cloneNode(true)
        mainContainer.appendChild(firstPageContent)
    }, false)
    var stats = doc.getElementById('stats')
    stats.addEventListener('click', function(event) {
        contentTitle.textContent = '统计信息'
        mainContainer.innerHTML = ''
        var firstPageContent = doc.getElementById('statsContent').content.cloneNode(true)
        mainContainer.appendChild(firstPageContent)
    }, false)
}, false)