var app = angular.module('app', ['ngRoute','ngResource']);
app.config(function($routeProvider){
    $routeProvider
        .when('/users',{
            templateUrl: '/views/users.html',
            controller: 'usersController'
        })
        .when('/roles',{
            templateUrl: '/views/roles.html',
            controller: 'rolesController'
        })
         .when('/hotel',{
            templateUrl: '/views/hotel.html',
            controller: 'hotelController'
        })
        .when('/newOrder',{
            //templateUrl: '/views/newOrder.html',
            controller: 'newOrderController'
        })
        .otherwise(
            { redirectTo: '/'}
        );
});

