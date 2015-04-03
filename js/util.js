Array.prototype.find = function (filter) {
    var result = []
    if (filter) {
        var c = this.length
        for (var i = 0; i < c; ++i) {
            var item = this[i]
            var isMatch = true
            for (var key in filter) {
                if (item[key] != filter[key]) {
                    isMatch = false
                    break
                }
            }
            if (isMatch) {
                result.push(item)
            }
        }
    }
    return result;
}

Array.prototype.contains = function (item) {
    var result = false
    if (item) {
        var c = this.length
        for (var i = 0; i < c; ++i) {
            if (this[i] == item) {
                result = true
                break
            }
        }
    }
    return result
}

HTMLElement.prototype.hasClass = function (className) {
    return this.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

HTMLElement.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        this.className += " " + className
    }
}

HTMLElement.prototype.removeClass = function (className) {
    if (this.hasClass(className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        this.className = this.className.replace(reg, ' ')
    }
}

if (!window.JSON) {
    var JSON = {
        parse: function (s) {
            return eval('(' + s + ')')
        },
        stringify: function (o) {
            function stringifyValue(v) {
                var result = ''
                switch (typeof v) {
                    case 'string':
                        result = '"' + v + '"'
                        break
                    case 'boolean':
                        result = v ? 'true' : 'false'
                        break
                    case 'number':
                        result = '' + v
                        break
                    case 'object':
                        if (v instanceof String) {
                            result = '"' + v + '"'
                        } else if (v instanceof Boolean) {
                            result = v ? 'true' : 'false'
                        } else if (v instanceof Number) {
                            result = '' + v
                        } else {
                            result = JSON.stringify(v)
                        }
                        break
                    case 'undefined':
                        result = 'undefined'
                        break
                    default:
                        break
                }
                return result
            }

            var result = ''
            switch (typeof o) {
                case 'undefined':
                    break
                case 'object':
                    if (Array.isArray(o)) {
                        result += '['
                        var count = o.length
                        for (var i = 0; i < count; ++i) {
                            result += stringifyValue(o[i]) + ', '
                        }
                        result = result.substr(0, result.length - 2)
                        result += ']'
                    } else {
                        result += '{'
                        for (var prop in o) {
                            result += '"' + prop + '": ' + stringifyValue(o[prop]) + ', '
                        }
                        result = result.substr(0, result.length - 2)
                        result += '}'
                    }
                    break
                case 'boolean':
                    break
                case 'number':
                    break
                case 'string':
                    break
                case 'function':
                    break
                default:
                    break
            }
            return result
        }
    }
}

var g = function () {
    //do nothing, only a name
}

g.getTemplate = function (type) {
    var result = null
    var t = document.getElementById('template')
    var r = t.getElementsByClassName(type)
    if (r.length > 0) {
        result = r[0]
    }
    if (result == null) {
        var tc = document.getElementById('commonTemplate')
        var t = tc.getElementsByClassName(type)
        if (t.length > 0) {
            result = t[0]
        }
    }
    return result
}

g.ajaxProcess = function (method, url, data, postProcess) {
    if (!postProcess) {
        postProcess = data
        data = null
    }
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var result = null
            if (xhr.responseText[0] == '{' || xhr.responseText[0] == '[') {
                result = JSON.parse(xhr.responseText)
            } else {
                result = xhr.responseText
            }
            postProcess(result)
        }
    }
    xhr.open(method, url, false)
    var sendContent = null
    if (data != null) {
        sendContent = JSON.stringify(data)
    }
    xhr.send(sendContent)
}

g.uploader = {
    readFileContent: function (file) {
        var fileContent = null
        if (file.webkitSlice) {
            fileContent = file.webkitSlice(0, file.size, "application/octet-stream")
        } else if (file.mozSlice) {
            fileContent = file.mozSlice(0, file.size, "application/octet-stream")
        } else if (file.slice) {
            fileContent = file.slice(0, file.size, "application/octect-stream")
        } else {
            alert('browser not support')
        }
        var fileReader = new FileReader()
        fileReader.readAsBinaryString(fileContent)
        return fileContent
    },

    bareUploadFiles: function (uri, files, postProcess) {
        var fileCount = files.length
        var result = []
        for (var i = 0; i < fileCount; i++) {
            var content = g.uploader.readFileContent(files[i])
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var r = JSON.parse(xhr.responseText)
                    result.push(r)
                }
            }
            xhr.open("POST", uri, false)
            xhr.setRequestHeader("Content-Type", files[i].type)
            xhr.send(content)
        }
        postProcess(result)
    },

    uploadFile: function (uri, fileControl, postProcess) {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                postProcess(JSON.parse(xhr.responseText))
            }
        }
        xhr.open('POST', uri, false)
        var f = document.getElementById(fileControl).files[0]
        //xhr.setRequestHeader("Content-Type", f.type)
        //xhr.setRequestHeader("Content-Length", f.size)
        //xhr.setRequestHeader("Content-Type", 'multipart/form-data')
        var formData = new FormData();
        formData.append("file", f);
        //xhr.setRequestHeader("Content-Length", formData.size)
        xhr.send(formData)
    },

    uploadFiles: function (uri, fileControl, postProcess) {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                postProcess(JSON.parse(xhr.responseText))
            }
        }
        xhr.open('POST', uri, false)
        var files = document.getElementById(fileControl).files
        var formData = new FormData();
        for (var i = 0, c = files.length; i < c; ++i) {
            var f = files[i]
            formData.append("file", f)
        }
        xhr.send(formData)
    }
}

g.getData = function (url, postProcess) {
    g.ajaxProcess('GET', url, postProcess)
}

g.putData = function (url, data, postProcess) {
    g.ajaxProcess('PUT', url, data, postProcess)
}

g.patchData = function (url, data, postProcess) {
    g.ajaxProcess('PATCH', url, data, postProcess)
}

g.postData = function (url, data, postProcess) {
    g.ajaxProcess('POST', url, data, postProcess)
}

g.deleteData = function (url, postProcess) {
    g.ajaxProcess('DELETE', url, postProcess)
}

g.bind = function (element, data) {
    element.innerHTML = element.innerHTML.replace('%7B', '{').replace('%7D', '}').replace(/\$\{(\w+)\}/g, function (all, variable) {
        if (!variable) {
            return ""
        }
        // var parts = variable.split('.')
        // for (var i = 0, c = parts.length; i < c; ++i) {
        // 	if(data)
        // 		data = data[parts[i]]
        // 	else{
        // 		data=''
        // 		break
        // 	}
        // }
        // return data
        return data[variable];
    })
    return element
}

g.dataToElement = function (data, template) {
    var element = template.cloneNode(true)
    return g.bind(element, data)
}

g.getUrlParameter = function (name) {
    var result = null
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg) //匹配目标参数
    if (r != null) {
        result = decodeURI(r[2])
    }
    return result //返回参数值
}

g.setCookie = function (name, value, days) {
    if (!days) {
        days = 30
    }
    var exp = new Date()
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    //document.cookie[document.cookie.length] = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString()
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString()
}

g.getCookie = function (cookieName) {
    var result = ''
    if (document.cookie.length > 0) {
        var cookieValues = document.cookie
        var cookieItems = cookieValues.split(';')
        var cookieCount = cookieItems.length
        for (var i = 0; i < cookieCount; ++i) {
            var cookieItem = cookieItems[i].replace(/(^\s*)|(\s*$)/g, '')
            var nameValuePair = cookieItem.split('=')
            if (nameValuePair.length == 2) {
                var name = nameValuePair[0]
                var value = nameValuePair[1]
                if (name == cookieName) {
                    result = decodeURIComponent(value)
                    break
                }
            }
        }
    }
    return result
}

//config: {data: dataOrApi,
// dataPostprocess: function(data, index, params){}, dataParams: {},
// renderScenes: [{container: c, template: t, range: {lowerBound: 0, upperBound: 6}}, ...],
// renderPreprocess: function(element, index, params){}, elementParams: {},
// collectProcess: function(data, elementInfos, params){}, collectParams: {},
// saveMethod: 'PATCH', saveUri: '', saveDoneProcess: function(stateData){}}
g.GenericProcessor = function (config) {
    if (this == window) {
        return new g.GenericProcessor(config)
    }
    this.data = config.data
    this.saveUri = ''
    this.load = function () {
        var saveData = function (r) {
            if (r.state <= 400) {
                this.data = r.data
            }
        }
        if (typeof this.data == 'string') {
            var uriLength = this.data.indexOf('?')
            if (uriLength == -1) {
                this.saveUri = this.data
            } else {
                this.saveUri = this.data.substr(0, uriLength)
            }
            g.getData(this.data, saveData.bind(this))
        }
        if (config.dataPostprocess) {
            if (Array.isArray(this.data)) {
                for (var i = 0, c = this.data.length; i < c; ++i) {
                    this.data[i] = config.dataPostprocess(this.data[i], index, config.dataParams)
                }
            } else {
                this.data = [data]
                this.data[0] = config.dataPostprocess(this.data[0], 0, config.dataParams)
                this.data = this.data[0]
            }
        }
    }
    this.elementInfos = []
    this.render = function (index) {
        if (config.render) {
            config.render()
            return
        }
        var doc = document
        if (!index) {
            index = 0
        }
        var c = config.renderScenes.length
        if (index < c) {
            var scene = config.renderScenes[index]
            var container = scene.container
            if (typeof container == 'string') {
                container = doc.getElementById(container)
            }
            if (scene.template) {
                var template = scene.template
                if (typeof template == 'string') {
                    template = g.getTemplate(template)
                }
                this.elementInfos.push({container: container, template: template})
                var data = this.data
                var lowerBound = 0
                var upperBound = this.data.length
                if (scene.range) {
                    if (scene.range.lowerBound) {
                        lowerBound = scene.range.lowerBound > lowerBound ? scene.range.lowerBound : lowerBound
                    }
                    if (scene.range.upperBound) {
                        upperBound = scene.range.upperBound < upperBound ? scene.range.upperBound : upperBound
                    }
                    if (scene.range.predicate) {
                        data = []
                        this.data.forEach(function (item, index) {
                            if (scene.range.predicate(item)) {
                                data.push(item)
                            }
                        })
                        lowerBound = 0
                        upperBound = data.length
                    }
                }
                for (var i = lowerBound; i < upperBound; ++i) {
                    var element = g.dataToElement(data[i], template)
                    if (config.renderPreprocess) {
                        element = config.renderPreprocess(element, i, config.elementParams)
                    }
                    if (element) {
                        container.appendChild(element)
                    }
                }
            } else {
                if (config.renderPreprocess) {
                    container = config.renderPreprocess(container, 0, config.elementParams)
                }
                var bindedContainer = g.bind(container, this.data)
                this.elementInfos.push({container: bindedContainer})
            }
        }
    }
    this.collectProcess = config.collectProcess
    this.collectParams = config.collectParams
    this.collect = function () {
        if (this.collectProcess) {
            this.collectProcess(this.data, this.elementInfos, this.collectParams)
        }
    }
    this.saveMethod = config.saveMethod || 'PATCH'
    if (config.saveUri) {
        this.saveUri = config.saveUri
    }
    this.saveDoneProcess = config.saveDoneProcess
    this.save = function () {
        var process = function (self, saveFunction, hasPostfix) {
            var postfix = ''
            if (Array.isArray(self.data)) {
                self.data.forEach(function (item, index) {
                    if (hasPostfix) {
                        postfix = '/' + item.id
                    }
                    var uri = self.saveUri + postfix
                    saveFunction(uri, item, function (result) {
                        if (self.saveDoneProcess) {
                            self.saveDoneProcess(result)
                        }
                    })
                })
            } else {
                if (hasPostfix) {
                    postfix = '/' + self.data.id
                }
                var uri = self.saveUri + postfix
                saveFunction(uri, self.data, function (result) {
                    if (self.saveDoneProcess) {
                        self.saveDoneProcess(result)
                    }
                })
            }
        }
        switch (this.saveMethod) {
            case 'PATCH':
                process(this, g.patchData, true)
                break
            case 'PUT':
                process(this, g.putData, true)
                break
            case 'POST':
                process(this, g.postData, false)
                break
            case 'DELETE':
                process(this, g.deleteData, false)
                break
            default:
                break
        }
    }
}
