/**
 * Created by fixopen on 3/2/15.
 */

g.types = new g.GenericProcessor({
    data: '/api/resources/types',
    dataPostprocess: function (data, index, params) {
        if (data.describe) {
            if (data.describe.length > 70) {
                data.describe = data.describe.slice(0, 70) + '...'
            }
        }
        return data
    },
    renderScenes: [
        {container: 'typeContainer', template: 'type-template', range: {lowerBound: 0, upperBound: 8}},
        {container: 'typeSelectId', template: 'select-item-template'}
    ],
    renderPreprocess: function (element, index, params) {
        if (params.activeIndex.contains(index)) {
            element.removeClass('margin-left-20')
        }
        element.querySelector('span').addEventListener('click', function (e) {
            g.resources.conditionProcess('stage', g.types.data[index])
        }, false)
        return element
    }, elementParams: {activeIndex: [0, 4]}
})

g.stages = new g.GenericProcessor({
    data: '/api/stages',
    dataPostprocess: function (data, index, params) {
        data.type = params.type
        data.title = data.caption
        return data
    },
    dataParams: {type: 'stage'},
    renderScenes: [
        {container: 'stageSelectId', template: 'select-item-template', preProcess: function(element, index, params) {return element}, elementParams: null},
        {container: 'stageContainer', template: 'condition-template'},
        {container: '', template: '', range: {lowerBound: 0, upperBound: 6}},
        {container: '', template: '', range: {lowerBound: 0, upperBound: 6}},
        {container: '', template: '', range: {predicate: function(data){return true}}}
    ],
    elementPreprocess: function (element, index, params) {
        element.querySelector('span').addEventListener('click', function (e) {
            g.resources.conditionProcess('stage', g.stages.data[index])
        }, false)
        return element
        var result = true
        if (index > 5) {
            element.addClass('more')
            /*
             interface CSSStyleDeclaration {
             attribute DOMString cssText;
             readonly attribute unsigned long length;
             getter DOMString item(unsigned long index);
             DOMString getPropertyValue(DOMString property);
             DOMString getPropertyPriority(DOMString property);
             void setProperty(DOMString property, [TreatNullAs=EmptyString] DOMString value, [TreatNullAs=EmptyString] optional DOMString priority = "");
             void setPropertyValue(DOMString property, [TreatNullAs=EmptyString] DOMString value);
             void setPropertyPriority(DOMString property, [TreatNullAs=EmptyString] DOMString priority);
             DOMString removeProperty(DOMString property);
             readonly attribute CSSRule? parentRule;
             [TreatNullAs=EmptyString] attribute DOMString cssFloat;
             };
             */
            element.style.setPropertyValue('display', 'none')
            result = false
        }
        return result
    }
})

g.subjects = new g.GenericProcessor({
    data: '/api/subjects',
    dataPostprocess: function (data, idnex, params) {
        data.type = params.type
        data.title = data.caption
        return data
    },
    dataParams: {type: 'subject'},
    renderScenes: [
        {container: 'subjectContainer', template: 'condition-template'},
        {container: 'subjectContainer', template: 'subject-template', range: {lowerBound: 0, upperBound: 6}},
        {container: 'subjectSelectId', template: 'select-item-template'}
    ],
    elementPreprocess: function (element, index, params) {
        var data = g.subjects.data[index]
        element.querySelector('span').addEventListener('click', function (e) {
            g.resources.conditionProcess('subject', data)
        }, false)
        return element
    }
})

g.schemas = new g.GenericProcessor({
    data: '/api/schemas',
    dataPostprocess: function (data, idnex, params) {
        data.type = params.type
        return data
    },
    dataParams: {type: 'schemas'},
    renderScenes: [
        {container: 'schemaContainer', template: 'schema-template', range: {lowerBound: 0, upperBound: 6}},
        {container: 'schemaSelectId', template: 'select-item-template'}
    ]
})

g.editions = new g.GenericProcessor({
    data: '/api/editions',
    dataPostprocess: function (data, index, params) {
        data.type = params.type
        return data
    },
    dataParams: {type: 'edition'},
    renderScenes: [
        {container: 'editionContainer', template: 'condition-template'},
        {container: 'editionContainer', template: 'edition-template', range: {lowerBound: 0, upperBound: 6}},
        {container: 'editionSelectId', template: 'select-item-template'}
    ],
    elementPreprocess: function(element, index, params) {
        var data = g.editions.data[index]
        element.querySelector('span').addEventListener('click', function (e) {
            g.resources.conditionProcess('version', data)
        }, false)
        return element
    }
})

g.regions = new g.GenericProcessor({
    data: '/api/regions',
    dataPostprocess: function (data, index, params) {
        data.type = params.type
        return data
    },
    dataParams: {type: 'region'},
    renderScenes: [
        {container: 'regionSelectId', template: 'select-item-template'}
    ]
})

g.terms = new g.GenericProcessor({
    data: [
        {id: 1, caption: '上学期'},
        {id: 2, caption: '下学期'}
    ],
    renderScenes: [
        {container: 'termSelectId', template: 'select-item-template'}
    ]
})

g.scopes = new g.GenericProcessor({
    data: [
        {id: 1, caption: '国家课程'},
        {id: 2, caption: '地方课程'},
        {id: 3, caption: '校本课程'},
        {id: 9, caption: '其它'}
    ],
    renderScenes: [
        {container: 'scopeSelectId', template: 'select-item-template'},
        {container: 'scopeContainer', template: 'condition-template'}
    ],
    elementPreprocess: function(element, index, params) {
        element.querySelector('span').addEventListener('click', function (e) {
            g.resources.conditionProcess('scope', g.scopes.data[index])
        }, false)
        return element
    }
})

g.system = new g.GenericProcessor({
    data: '/api/systems/parameter',
    renderScenes: [
        {
            container: 'systemLogo',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.name == 'systemLogo') {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'systemName',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.name == 'systemName') {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'systemUrl',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.name == 'systemUrl') {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'systemDescribe',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.name == 'systemDescribe') {
                        result = true
                    }
                    return result
                }
            }
        }
    ]
})

g.user = {
    currentUser: null,

    queryUser: function (userId, predicate) {
        var up = new g.GenericProcessor({
            data: '/api/users/{userId}',
            dataPostprocess: function (data, index, params) {
                var result = data
                if (predicate) {
                    result = predicate(data)
                }
                return result
            },
            renderScenes: [
                {container: 'currentUserContainer'}
            ],
            elementPreprocess: function (element, index, params) {
                element.getElementById('myCenter').addEventListener('click', function (e) {
                    //
                }, false)
                element.getElementById('myFavorite').addEventListener('click', function (e) {
                    //
                }, false)
                element.getElementById('myMessage').addEventListener('click', function (e) {
                    //
                }, false)
                element.getElementById('myLogout').addEventListener('click', function (e) {
                    g.user.logout()
                }, false)
                if (params.isSupportQueryMessage) {
                    setInterval(params.queryMessages, params.queryMessageTime)
                }
            },
            elementParams: {
                isSupportQueryMessage: predicate ? false : true,
                queryMessages: function () {
                    var userId = g.getCookie('userId')
                    var messages = new g.GenericProcessor({
                        data: '/api/users/' + userId + '/messages?filter=' + encodeURIComponent(JSON.stringify({"receiverId": userId})),
                        render: function () {
                            var badge = document.querySelector('.badge')
                            if (this.data.length > 0) {
                                badge.removeClass('hidden')
                                badge.textContent = this.data.length
                            } else {
                                badge.addClass('hidden')
                            }
                        }
                    })
                    messages.load()
                    messages.render()
                },
                queryMessageTime: 20 * 1000
            }
        })
        up.load()
        g.user.currentUser = up.data
        up.render()
    },

    login: function (name, password) {
        var p = new g.GenericProcessor({
            data: {password: password},
            saveMethod: 'POST',
            saveUri: '/api/users/' + name + '/sessions',
            saveDoneProcess: function (data) {
                if (data.state == 200) {
                    g.setCookie('sessionId', data.sessionId)
                    g.setCookie('userId', data.id)
                    g.setCookie('token', data.token)
                    g.user.queryUser(data.id)
                }
            }
        })
        p.save()
    },

    logout: function () {
        var userId = g.getCookie('userId')
        var sessionId = g.getCookie('sessionId')
        var p = new g.GenericProcessor({
            saveUri: '/api/users/' + userId + '/sessions/' + sessionId,
            saveMethod: 'DELETE',
            saveDoneProcess: function (data) {
                if (data.state == 200) {
                    g.setCookie('sessionId', '', -1)
                    g.setCookie('userId', '', -1)
                    g.setCookie('token', '', -1)
                    g.user.currentUser = null
                    location.replace("/login.html")
                }
            }
        })
        p.save()
    },

    queryLogin: function () {
        var result = false
        var userId = g.getCookie('userId')
        var sessionId = g.getCookie('sessionId')
        if (userId && sessionId) {
            var ql = new g.GenericProcessor({
                data: '/api/users/' + userId + '/sessions/' + sessionId
            })
            ql.load()
            if (ql.data.state == 200) {
                result = true
            }
        }
        return result
    },

    validUser: function (postProcess) {
        if (g.user.queryLogin()) {
            g.user.queryUser(g.getCookie('userId'))
            postProcess(g.user.currentUser)
        } else {
            var loc = location
            loc.replace("/login.html?url=" + encodeURI(loc.pathname))
        }
        document.querySelector('.navbar-form').querySelector('button').addEventListener('click', g.search, false)
    },

    validManagerUser: function (postProcess) {
        var loc = location
        var locPath = loc.pathname
        var isOk = true
        if (g.user.queryLogin()) {
            g.user.queryUser(g.getCookie('userId'), function (data) {
                var result = data
                if (g.user.currentUser.userType != 900 && g.user.currentUser.userType != 910 && g.user.currentUser.userType != 990) {
                    alert('请用系统管理员用户登陆!')
                    result = null
                    isOk = false
                }
                postProcess(g.user.currentUser)
                return result
            })
        } else {
            isOk = false
        }
        if (!isOk) {
            loc.replace("/login.html?url=" + encodeURI(locPath))
        }
    },

    star: new g.GenericProcessor({
        data: '/api/users/stars',
        dataPostprocess: function (data, index, params) {
            if (!data.summary) {
                data.summary = '暂无介绍'
            }
            return data
        },
        renderScenes: [
            {container: 'userStarContainer', template: 'user-star-template'}
        ]
    })
}

g.hotResources = new g.GenericProcessor({
    data: '/api/decorates?filter=' + encodeURIComponent(JSON.stringify({"kind": 1})),
    dataPostprocess: function (data, index, params) {
        var getResource = new g.GenericProcessor({
            data: '/api/resources/' + data.targetId
        })
        getResource.load()
        getResource.data.coverFile = data.imageFile;
        return getResource.data
    },
    renderScenes: [
        {
            container: 'electronicTeachingMaterialContainer',
            template: 'hotResource-col2-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 1) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'courseWareContainer',
            template: 'hotResource-col3-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 2) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'smallCourseContainer',
            template: 'small-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 3) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'teachingGameContainer',
            template: 'micro-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 4) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'teachingCaseContainer',
            template: 'micro-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 5) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'activityCaseContainer',
            template: 'micro-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 6) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'teachingToolContainer',
            template: 'micro-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 7) {
                        result = true
                    }
                    return result
                }
            }
        },
        {
            container: 'teachingMatterContainer',
            template: 'micro-course-template',
            range: {
                predicate: function (data) {
                    var result = false
                    if (data.kind == 8) {
                        result = true
                    }
                    return result
                }
            }
        }
    ]
})

g.resources = {
    offset: 0,
    condition: {},
    conditionElement: {},
    orderBy: [],
    getMore: function (count) {
        if (!count) {
            count = 12
        }
        var getData = new g.GenericProcessor({
            data: '/api/resources?filter=' + encodeURIComponent(JSON.stringify(g.resources.condition)) + '&offset=' + g.resources.offset + '&count=' + count,
            dataPostprocess: function (data, index, params) {
                data.href = 'resource-detail.html?id=' + data.id;
                data.typeCaption = g.types.data.find({
                    id: data.kind.toString()
                })[0].caption
                data.subjectCaption = data.subject.caption || ''
                data.ownerCaption = data.creator.userName || ''
                data.versionCaption = data.textbookVersion.Caption || ''
                data.gradeTermCaption = g.parseGradeCaption(data.gradeTerms)
            },
            renderScenes: [
                {
                    container: 'resourceContainer',
                    template: 'resource-template',
                    range: {
                        predicate: function (data) {
                            var result = false
                            if (data.kind == 1) { //resource
                                result = true
                            }
                            return result
                        }
                    }
                },
                {
                    container: 'resourceContainer',
                    template: 'video-template',
                    range: {
                        predicate: function (data) {
                            var result = false
                            if (data.kind == 2) { //resource
                                result = true
                            }
                            return result
                        }
                    }
                }
            ]
        })
        getData.load()
        g.resources.offset += count
        getData.render(0)
        getData.render(1)
    },
    conditionProcess: function (catalog, data) {
        g.resources.offset = 0
        g.resources.condition[catalog] = data.id
        var container = document.getElementById('selectedContainer')
        if (g.resources.conditionElement[catalog]) {
            container.removeChild(g.resources.conditionElement[catalog])
        }
        var template = g.getTemplate('selected-template');
        g.resources.conditionElement[catalog] = g.dataToElement(data, template);
        var remove = g.resources.conditionElement[catalog].querySelector('.glyphicon-remove')
        remove.addEventListener('click', function (e) {
            container.removeChild(g.resources.conditionElement[catalog])
            delete g.resources.condition[catalog]
            delete g.resources.conditionElement[catalog]
            g.resources.offset = 0
            document.getElementById('bookContainer').innerHTML = '';
            g.resources.getMore()
        })
        container.appendChild(g.resources.conditionElement[catalog]);
        document.getElementById('bookContainer').innerHTML = '';
        g.resources.getMore()
    },
    total: 0,
    renderResourcesTotal: function () {
        var s = new g.GenericProcessor({
            data: 'api/resources/statistics/count',
            dataPostprecess: function (data, index, params) {
                g.resources.total = data;
            },
            renderScenes: [
                {container: 'resourceTotal'}
            ]
        })
        s.load()
        s.render()
    }
}

g.getBaseData = function () {
    g.regions.load()
    g.schemas.load()
    g.editions.load()
    g.subjects.load()
    g.stages.load()
    g.types.load()
}

g.ProgressController = function (id, steps) {
    this.id = id
    this.steps = steps
    this.currentStep = 0
    this.timeoutId = 0
    this.start = function () {
        this.control = document.getElementById(this.id)
        if (!this.steps) {
            this.steps = [3, 3, 3, 5, 5, 5, 8, 8, 8, 15, 15, 15, 3, 3, 3, 10, 10, 10, 20, 20, 20, 8, 8, 8, 15, 15, 15, 30, 30, 30, 3, 3, 3, 5, 5, 5, 8, 8, 8, 15, 15, 15, 3, 3, 3, 10, 10, 10, 20, 20, 20, 8, 8, 8, 15, 15, 15, 30, 30, 30, 3, 3, 3, 5, 5, 5, 8, 8, 8, 15, 15, 15, 3, 3, 3, 10, 10, 10, 20, 20, 20, 8, 8, 8, 15, 15, 15, 30, 30, 30, 60, 60, 60, 120, 120, 120, 360, 480, 600]
        }
        function progressing() {
            var currentValue = this.control.getAttribute('aria-valuenow')
            ++currentValue
            this.control.setAttribute('aria-valuenow', currentValue)
            this.control.style.setProperty('width', currentValue + '%')
            ++this.currentStep
            this.timeoutId = setTimeout(progressing, this.steps[this.currentStep])
        }
        progressing.bind(this)
        this.timeoutId = setTimeout(progressing, this.steps[this.currentStep])
    }
    this.over = function() {
        this.control.setAttribute('aria-valuenow', 100)
        this.control.style.setProperty('width', 100 + '%')
        clearTimeout(this.timeoutId)
    }
    this.clear = function() {
        this.control.setAttribute('aria-valuenow', 3)
        this.control.style.setProperty('width', 3 + '%')
        clearTimeout(this.timeoutId)
    }
}

$.fn.serializeJson = function () {
    var serializeObj = {}
    var array = this.serializeArray()
    var str = this.serialize()
    $(array).each(function () {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value)
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value]
            }
        } else {
            serializeObj[this.name] = this.value
        }
    })
    return serializeObj
}

//收藏资源
g.favoriteResource = function (id) {
    var fr = new g.GenericProcessor({
        data: {userId: g.user.currentUser.id, resourceId: id, kind: 2},
        saveMethod: 'POST',
        saveUri: '/api/users/' + g.user.currentUser.id + '/favorites',
        saveDoneProcess: function (stateData) {
            if (stateData.state == 201) {
                alert('favorite resource ok')
            }
        }
    })
    fr.save()
}

g.showSpinner = function (containerId) {
    var spinner = '<div class="message-loading-overlay"><span class=""><i class="icon-spin icon-spinner  bigger-160"></i>loading...</span></div>'
    //setTimeout("$('#"+containerId+"').append('" + spinner + "')", 1)
    $('#' + containerId).append(spinner)
}

g.hideSpinner = function (containerId) {
    $("#" + containerId + "").find('.message-loading-overlay').remove()
}

g.showInfo = function (t) {
    $('#' + t + 'Container').find('.more').toggle()
}

//按类型导航
g.navigateByType = function (type) {
    var url = 'resource-search.html?type=' + encodeURIComponent(type)
    location.replace(url)
}

g.search = function (evt) {
    var key = document.getElementById('searchKey').value
    if (key) {
        location.href = 'resource-search.html?caption=' + encodeURIComponent(key)
    }
}

g.generateStarLevel = function (value, prefix) {
    var result = ''
    var intLevel = 0
    for (var i = 0; i < value - 1; ++i) {
        result += '<img src="' + prefix + 'images/star.png" alt="" />'
        ++intLevel
    }
    if (intLevel < value) {
        result += '<img src="' + prefix + 'images/half-star.png" alt="" />'
    }
    return result
}

g.renderPageNavigator = function (id, pageSize, currentPage, total, handler) {
    var pageIndexContainer = document.getElementById(id)
    pageIndexContainer.innerHTML = ''

    var firstItemTemplate = g.getTemplate('first-page')
    var firstItem = g.dataToElement({}, firstItemTemplate);
    pageIndexContainer.appendChild(firstItem)

    var itemTemplate = g.getTemplate('page-item')
    var totalPage = Math.ceil(total / pageSize)
    var beginPageNo = 1
    if (currentPage > 5) {
        if (currentPage > totalPage - 5) {
            beginPageNo = totalPage - 10
        } else {
            beginPageNo = currentPage - 5
        }
    }
    if (beginPageNo < 1) {
        beginPageNo = 1
    }
    var endPageNo = beginPageNo + 9
    for (var i = beginPageNo; i <= Math.min(endPageNo, totalPage); ++i) {
        var data = {
            pn: i
        }
        var item = g.dataToElement(data, itemTemplate)
        if (i == currentPage) {
            item.className = 'active'
        }
        pageIndexContainer.appendChild(item)
    }

    var lastItemTemplate = g.getTemplate('last-page')
    var lastItem = g.dataToElement({pn: totalPage}, lastItemTemplate)
    pageIndexContainer.appendChild(lastItem)

    var anchors = pageIndexContainer.querySelectorAll('a')
    for (var i = 0, c = anchors.length; i < c; ++i) {
        anchors.item(i).addEventListener('click', function (e) {
            var pageNo = e.target.attributes['data-pageNo'].value
            handler(pageNo)
        })
    }
}

g.importHeader = function () {
    var headerContainer = document.getElementById('header')
    var type = headerContainer.getAttribute('type')
    g.getData('/header.html' + '?type=' + type, function (data) {
        headerContainer.innerHTML = data
        var item = headerContainer.querySelector('#' + type)
        if (item) {
            item.addClass('active')
        }
    })
}

g.importFooter = function () {
    g.getData('/footer.html', function (data) {
        var footerContainer = document.getElementById('footer')
        footerContainer.innerHTML = data
    })
}

g.parseGrade = function (gradeTerm) {
    var result = []
    if (gradeTerm) {
        var paths = gradeTerm.split(',')
        for (var i = 0, c = paths.length; i < c; ++i) {
            if (paths[i] != '') {
                var parts = paths[i].split(':')
                if (parts.length == 2) {
                    var obj = {grade: parts[0], term: parts[1]}
                    result.push(obj)
                }
            }
        }
    }
    return result
}

g.parseGradeCaption = function (gradeTerm) {
    var gradeTerms = g.parseGrade(gradeTerm)
    var caption = ''
    for (var i = 0; i < gradeTerms.length; i++) {
        var item = gradeTerms[i]
        if (item.grade) {
            var stage = g.stages.data.find({id: item.grade})
            if (stage.length > 0) {
                caption += stage[0].caption
            }
        }
        if (item.term) {
            var term = g.terms.data.find({id: item.term})
            if (term.length > 0) {
                caption += term[0].caption
            }
        }
        if (caption) {
            caption += ' '
        }
    }
    return caption
}

g.parseResourceCaption = function (data) {
    data.typeCaption = g.types.data.find({
        id: data.kind.toString()
    })[0].caption
    data.subjectCaption = data.subject.caption || ''
    data.ownerCaption = data.creator.userName || ''
    data.versionCaption = data.textbookVersion.Caption || ''
    data.gradeTermCaption = g.parseGradeCaption(data.gradeTerms)
}

g.getFileIcon = function (file) {
    switch (file.mimeType) {
        case 'application/pdf':
        case 'application/rtf':
        case 'text/html':
            file.coverFile = '/images/file_pdf.png'
            break
        case 'image/bmp':
        case 'image/gif':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/tiff':
            file.coverFile = '/images/file_image.png'
            break
        case 'application/msword':
        case 'application/doc':
        case 'application/vnd.ms-works':
            file.coverFile = '/images/file_word.png'
            break
        case 'application/vnd.ms-excel':
            file.coverFile = '/images/file_excel.png'
            break
        case 'application/vnd.ms-powerpoint':
        case 'application/ppt':
            file.coverFile = '/images/file_ppt.png'
            break
        case 'text/plain':
        case 'text/richtext':
            file.coverFile = '/images/file_txt.png'
            break
        case 'application/zip':
        case 'application/rar':
        case 'application/x-compress':
        case 'application/bin':
            file.coverFile = '/images/file_zip.png'
            break
        case 'audio/basic':
        case 'audio/mpeg':
        case 'audio/x-mpeg':
        case 'audio/x-wav':
            file.coverFile = '/images/file_zip.png'
            break
        case 'video/mp4':
        case 'application/mpg':
        case 'application/swf':
        case 'video/x-msvideo':
        case 'application/x-shockwave-flash':
        case 'video/quicktime':
        case 'video/mpeg':
        case 'video/x-sgi-movie':
            file.coverFile = '/images/file_vedio.png'
            break
        default:
            file.coverFile = '/images/file_unknown.png'
            break
    }
}

function loadRes(pn) {
    if (!pn)
        pn = 1;
    var filter = {}
    filter.recommend = 0
    var txtQuery = document.getElementById("txtQuery").value
    if (txtQuery) {
        filter.caption = txtQuery
    }
	var filterString = 'filter=' + encodeURIComponent(JSON.stringify(filter))
    var url = '/api/resources/statistics/count?' + filterString
    g.getData(url, function (result) {
        if (result.state == 200) {
            var total = result.data;
            if (total == 0) {
                alert("未找到相关资源！")
                $("#txtQuery").val('');
            }
            var offset = _ps * (pn - 1);
            var url = '/api/resources?offset=' + offset + '&count=' + _ps;
            url += '&' + filterString
            g.getData(url, function (result2) {
                if (result2.state == 200) {
                    _resources = result2.data
                    render(result2.data, total, pn);
                }
            });
        }
    });
}

/*{"appraiseCount":0,
"caption":"数学六年级上册",
"checkState":2,
"checker":{"approved":0,
	"avatarUri":"/ndefined",
	"canChangePassword":1,
	"cardType":"0",
	"creator":{"$ref":"@"},
	"dateCreated":"2014-09-03 12:41:46",
	"email":"154643940@qq.com",
	"gender":-1,
	"id":"15761872542489861",
	"ipAddressCreated":"0.0.0.0",
	"ipAddressLastLogin":"127.0.0.1",
	"lastUpdated":"2015-02-12 09:25:05",
	"loginTimes":3404,
	"password":"21232f297a57a5a743894a0e4a801fc3",
	"passwordFieldCount":0,
	"passwordQuestionFieldCount":0,
	"pinyin":"admin",
	"realName":"System Administrator",
	"rowState":-1,
	"rowVersion":3448,
	"score":485,
	"summary":"哈哈",
	"telephone":"",
	"timeLastLogin":"2014-09-03 12:41:46",
	"updater":{"$ref":"@"},
	"userName":"admin",
	"userRank":2,
	"userType":990},
"coverFile":"/cover/default.jpg",
"downloadCount":6,
"favoriteCount":3,
"files":[{"creator":{"$ref":"$.checker"},
	"dateCreated":"2015-01-07 23:17:38",
	"downlaodTimes":1,
	"fileKind":0,
	"fileName":"http://filedata.am985.net/201501/43040422609289315.pdf",
	"id":"43040422609289315",
	"lastUpdated":"2015-01-07 23:17:38",
	"mimeType":"application/pdf",
	"previewFile":"http://filedata.am985.net/null",
	"resource":{"appraiseCount":0,
		"caption":"数学六年级上册",
		"checkState":2,
		"checker":{"$ref":"$.checker"},
		"coverFile":"/cover/default.jpg",
		"creator":{"$ref":"$.checker"},
		"dateCreated":"2015-01-07 23:17:38",
		"downloadCount":6,
		"favoriteCount":3,
		"gradeTerms":",6:0,",
		"id":"43040422609223779",
		"keywords":"数学\n\t\t\n\t\t六年级\n\t\t\n\t\t北京版",
		"kind":1,
		"lastUpdated":"2015-01-07 23:17:38",
		"metaScheme":{"caption":"633学制",
			"creator":{"$ref":"$.checker"},
			"dateCreated":"2014-09-03 12:41:47",
			"disable":0,
			"id":"15761872542752005",
			"lastUpdated":"2014-09-03 12:41:47",
			"rowState":1,
			"rowVersion":1,
			"updater":{"$ref":"$.checker"}},
		"owner":"北京教科院课程中心",
		"recommend":0,
		"rowState":1,
		"rowVersion":11,
		"scope":9,
		"score01":-1,
		"score02":-1,
		"score03":-1,
		"score04":-1,
		"score05":-1,
		"score06":-1,
		"score07":-1,
		"score08":-1,
		"score09":-1,
		"subject":{"caption":"数学",
			"code":"SX",
			"creator":{"$ref":"$.checker"},
			"dateCreated":"2014-10-18 16:38:45",
			"id":"15761872542883077",
			"lastUpdated":"2014-10-18 16:38:45",
			"rowState":1,
			"rowVersion":1,
			"updater":{"$ref":"$.checker"}},
		"summary":"在数学之旅中你会遇到很多数学问题和能够运用数学知识解决的实际问题。开动脑筋，认真思考，你就会成功地解决这些问题，相信你一定会在这个过程中感受到快乐的！",
		"targetUser":0,
		"textBook":{"caption":"数学六年级上册",
			"creator":{"$ref":"$.checker"},
			"dateCreated":"2015-01-07 13:02:16",
			"gradeTerms":",6:1,",
			"id":"42961133184090211",
			"lastUpdated":"2015-01-07 13:02:16",
			"metaScheme":{"$ref":"$.files[0].resource.metaScheme"},
			"rowState":1,"rowVersion":1,
			"subject":{"$ref":"$.files[0].resource.subject"},
			"textbookVersion":{"caption":"北京版",
				"creator":{"$ref":"$.checker"},
				"dateCreated":"2014-10-18 16:33:53",
				"disable":0,
				"id":"15761872543374597",
				"lastUpdated":"2014-12-04 13:55:27",
				"press":"全部",
				"rowState":1,
				"rowVersion":4,
				"updater":{"$ref":"$.checker"}},
			"updater":{"$ref":"$.checker"}},
		"textbookVersion":{"$ref":"$.files[0].resource.textBook.textbookVersion"},
		"timeCheck":"2015-01-07 23:22:18",
		"timeUpload":"2015-01-07 23:17:38",
		"updater":{"$ref":"$.checker"},
		"uploader":{"$ref":"$.checker"},
		"versionString":"BERMS北京市教育委员会增补版",
		"viewCount":0,"xmlFile":"201501/43040422609223779.xml",
		"zipFile":"201501/43040422609223779.zip"},
	"rowState":1,
	"rowVersion":2,
	"showOrder":0,
	"size":6787568,
	"storeName":"201501/43040422609289315.pdf",
	"updater":{"$ref":"$.checker"},
	"viewTimes":0}],
"gradeTerms":",6:0,","id":"43040422609223779",
"keywords":"数学\n\t\t\n\t\t六年级\n\t\t\n\t\t北京版",
"kind":1,
"metaScheme":{"$ref":"$.files[0].resource.metaScheme"},
"owner":"北京教科院课程中心",
"recommend":0,
"rowState":1,
"rowVersion":1,
"scope":9,
"score01":-1,
"score02":-1,
"score03":-1,
"score04":-1,
"score05":-1,
"score06":-1,
"score07":-1,
"score08":-1,
"score09":-1,
"subject":{"$ref":"$.files[0].resource.subject"},
"summary":"在数学之旅中你会遇到很多数学问题和能够运用数学知识解决的实际问题。开动脑筋，认真思考，你就会成功地解决这些问题，相信你一定会在这个过程中感受到快乐的！",
"targetUser":0,
"textBook":{"$ref":"$.files[0].resource.textBook"},
"textbookVersion":{"$ref":"$.files[0].resource.textBook.textbookVersion"},
"timeCheck":"2015-01-07 23:22:18",
"timeUpload":"2015-01-07 23:17:38",
"uploader":{"$ref":"$.checker"},
"versionString":"BERMS北京市教育委员会增补版",
"viewCount":0,
"xmlFile":"201501/43040422609223779.xml",
"zipFile":"201501/43040422609223779.zip"}*/
g.parseRef = function(data) {
	function p(whole, part, result) {
		for (var propertyName in part) {
			var propertyValue = part[propertyName]
			result[propertyName] = propertyValue
			if (typeof propertyValue == 'object') {
				if (propertyValue['$ref']) {
					var now = part
					var ref = propertyValue['$ref']
					while (true) {
						var chr = ref[0]
						ref = ref.substr(1)
						switch (chr) {
						case '@':
							now = part
							break
						case '[':
                            var len = ref.indexOf(']')
                            var index = ref.substr(0, len)
                            now = now[index]
                            ref = ref.substr(len + 1)
							break
						case '.':
                            var dotLen = ref.indexOf('.')
                            var squareLen = ref.indexOf('[')
                            var len = dotLen < squareLen ? dotLen : squareLen
                            if (len == -1) {
                                now = now[ref]
                                ref = ''
                            } else {
                                var key = ref.substr(0, len)
                                now = now[key]
                                ref = ref.substr(len)
                            }
							break
						}
						if (ref == '') {
							break
						}
					}
					result[propertyName] = now
				} else {
					p(whole, part[propertyName], result[propertyName])
				}
			}
		}
	}
	var parsePart = data
	var result = {}
	p(data, parsePart, result)
	return result
}

g.parseDataRef = function (data, parsePart, self) {
    for (var propertyName in parsePart) {
        var property = parsePart[propertyName]
        switch (typeof property) {
            case 'object':
                self[propertyName] = {}
                if (Array.isArray(property)) {
                    self[propertyName] = []
                }
                g.parseDataRef(data, property, self[propertyName])
                break
            case 'string':
                if (propertyName == '$ref') {
                    var now = data
                    while (true) {
                        var chr = property[0]
                        property = property.substr(1)
                        switch (chr) {
                            case '[':
                                var len = property.indexOf(']')
                                var index = property.substr(0, len)
                                now = now[index]
                                property = property.substr(len + 1)
                                break
                            case '.':
                                var dotLen = property.indexOf('.')
                                var squareLen = property.indexOf('[')
                                var len = dotLen < squareLen ? dotLen : squareLen
                                if (len == -1) {
                                    now = now[property]
                                    property = ''
                                } else {
                                    var key = property.substr(0, len)
                                    now = now[key]
                                    property = property.substr(len)
                                }
                                break
                        }
                        if (property == '') {
                            break
                        }
                    }
                    for (var propertyName in now) {
                        self[propertyName] = now[propertyName]
                    }
                } else {
                    self[propertyName] = property
                }
                break
            default:
                self[propertyName] = property
                break
        }
    }
}

g.getJsonRefObject = function (data, paths) {
    if (!data || data.length == 0) {
        return null
    }
    if (paths == '$.files[0].subject') {
        return data.files[0].subject
    }
    if (!data || data.length == 0) {
        return null
    }
    if (paths == '$.files[0].resource.subject') {
        return data.files[0].resource.subject
    }
    if (paths == '$.checker') {
        return  data.checker
    }
    if (paths == '$.files[0].resource.textBook.textbookVersion') {
        return data.files[0].resource.textBook.textbookVersion
    }
    if (paths =='$.textBook.textbookVersion') {
        return data.textBook.textbookVersion
    }
    var pathAry = paths.split('.')
    for (var i = 0; i < pathAry.length; i++) {
        var path = pathAry[i]
        if (path.indexOf('$[') == 0) {
            var index = path.substr(2, path.length - 3)
            data = data[parseInt(index)]
        } else {
            data = data[path]
        }
    }
    return data
}

g.sample = function () {
    function addComment(containerId, data) {
        var t = document.querySelector("#commentTemplate")
        var comment = t.content.cloneNode(true)

        comment.querySelector('img').src = data.imageUrl
        comment.querySelector('.comment-text').textContent = data.text

        var container = document.getElementById(containerId)
        container.appendChild(comment);
    }

    addComment('content', {imageUrl: "123.png", text: "hello, world"})

    var link = document.querySelector('link[rel=import]')
    var heart = link.import
    // Access DOM of the document in header.html
    var pulse = heart.querySelector('div.pulse')
}
