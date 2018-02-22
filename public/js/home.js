var app_home = new Vue({
    el: '#app-home',
    data: {
        username: ""
    },
    methods: {
        auth: function () {
            var vm = this
            var token = sessionStorage.getItem("token")
            if (token) {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "/api/me",
                    "method": "GET",
                    "headers": {
                        "x-access-token": token,
                        "cache-control": "no-cache",
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    if (response.name) vm.username = response.name
                })
            }
        },
        
        logout: function () {
            var vm = this
            var token = sessionStorage.getItem("token")
            if (token) {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "/api/logout",
                    "method": "GET",
                    "headers": {
                        "x-access-token": token,
                        "cache-control": "no-cache",
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    if (!response.auth) {
                        vm.username = ""
                        sessionStorage.removeItem("token")
                    }
                })
            }
        }
    },
    mounted: function () {
        var vm = this
        var token = sessionStorage.getItem("token")
        if (token) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/me",
                "method": "GET",
                "headers": {
                    "x-access-token": token,
                    "cache-control": "no-cache",
                }
            }
            $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.name) vm.username = response.name
            })
        }
    }
})