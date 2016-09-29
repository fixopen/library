/**
 * Created by fixopen on 13/4/15.
 */

window.addEventListener('load', function (e) {
    var doc = document
    var rememberPassword = doc.getElementById('rememberPassword')
    rememberPassword.addEventListener('click', function(e) {
        if (e.target.checked) {
            //remember to local storage
        } else {
            //clear from local storage
        }
    }, false)
    var login = doc.getElementById('login')
    login.addEventListener('click', function(e) {
        var name = doc.getElementById('name')
        var password = doc.getElementById('password')
        g.postData('/api/administrators/' + name.value.trim() + '/sessions', [
            {name: 'Content-Type', value: 'application/json'},
            {name: 'Accept', value: 'application/json'}
        ], {password: password.value.trim()}, function(r) {
            if (r.meta.code == 200) {
                //ok
                //store sessionId
                g.setCookie('sessionId', r.data.sessionId)
                location.href = 'index.htm?name=' + r.data.name
            } else {
                //error
            }
        })
    }, false)
}, false)
