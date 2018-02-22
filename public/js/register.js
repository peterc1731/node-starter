var app_register = new Vue({
    el: '#app-register',
    data: {
        username: "",
        email: "",
        password: ""
    },
    methods: {
        register: function (username,email,password) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/register",
                "method": "POST",
                "headers": {
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "name": username,
                    "email": email,
                    "password": password
                }
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.success) window.location.href = '/login'
            })
        }
    }
})