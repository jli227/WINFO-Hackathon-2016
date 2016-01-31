var BASE_URL = "https://api.twilio.com/2010-04-01/";

angular.module('Pizza', ['ui.router', 'firebase'])
    .constant('ref', new Firebase("https://pizza-service.firebaseio.com/"))
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('pizza', {
                url: '/pizza',
                templateUrl: 'views/pizza.html'
            })
            .state('order', {
                url: '/order',
                templateUrl: 'views/order.html',
                controller: 'PizzaOrderController'
            })
            .state('checkout', {
                url: '/checkout',
                templateUrl: 'views/checkout.html',
                controller: 'CheckoutController'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'views/account.html'
            });
        $urlRouterProvider.otherwise('/pizza');
    })
    .controller('AccountHandler', function($scope, ref) {
        $scope.authData = ref.getAuth();
        $scope.userAccount = {};
        $scope.signup = function() {
            // TBI $scope.toggleLoading();
            $scope.errorMessage = '';
            ref.createUser({
                username   : $scope.userAccount.username,
                password   : $scope.userAccount.password
            }, function(error, userData) {
                if (error) {
                    $scope.errorMessage = error.message;
                } else {
                    $scope.createAccount = true;
                    $scope.success = true;
                    ref.child(userData.uid)
                        .set({
                            firstName  : $scope.userAccount.firstName,
                            lastName   : $scope.userAccount.lastName,
                            email      : $scope.userAccount.email,
                            address    : $scope.userAccount.address,
                            city       : $scope.userAccount.city,
                            state      : $scope.userAccount.state,
                            zip        : $scope.userAccount.zip,
                            orders     : ''
                        });
                }
                // TBI $scope.toggleLoading
                $scope.$apply();
            });
        };

        $scope.login = function() {
            // TBI $scope.toggleLoading();
            $scope.errorMessage = '';
            ref.authWithPassword({
                username : $scope.userAccount.username,
                password : $scope.userAccount.password
            }, function(error, authData) {
                if (error) {
                    $scope.errorMessage = error.message;
                } else {
                    $scope.authData = authData;
                    window.location.href = '#/order';
                }
                // TBI $scope.toggleLoading();
                $scope.$apply();
            });
        };

        $scope.logout = function() {
            ref.unauth();
            location.reload();
        };

        $scope.redirectToLogin = function() {
            $scope.errorMessage = '';
            $scope.createAccount = true;
        };

        $scope.redirectToSignUp = function() {
            $scope.errorMessage = '';
            $scope.createAccount = false;
        };
    })                                                                                                       

    .controller('CheckoutController', function($scope) {
        $scope.request = $.ajax({
            headers: {
                Authorization: "Basic " + btoa("ACb69edd884b4252ce5ef5d3a268413e53:62fb61967584d8a5e1387d2b7f5e8bbf")
            },
            method: "POST",
            url: BASE_URL + "Accounts/ACb69edd884b4252ce5ef5d3a268413e53/Messages.json",
            data: {To: '2066500642', From: '+12065390466', Body: "This is an emergency notification sent from NAME. NAME is in an emergency, please call 911 and send them to this address: ADDRESS"}
        });

        $scope.submit = function() {
            console.log("hello");
        }
    });
