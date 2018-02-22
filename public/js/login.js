var app_login = new Vue({
    el: '#app-login',
    data: {
        username: "",
        email: "",
        password: ""
    },
    methods: {
        login: function (email,password) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/login",
                "method": "POST",
                "headers": {
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "email": email,
                    "password": password
                }
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.auth) {
                    sessionStorage.setItem("token", response.token)
                    window.location.href = '/home'
                }
            })
        }
    }
})