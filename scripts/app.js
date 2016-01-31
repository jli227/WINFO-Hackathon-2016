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
                controller: 'CheckOutController'
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

    .controller('CheckOutController', ['$scope', '$http', function($scope, $http) {
        $scope.request = $.ajax({
            headers: {
                Authorization: "Basic " + btoa("SKc7fd174be57696e8a6d158f81351e268:8UQ4tp6tl25M2fOLIn2VVA8EwiY6EFaq")
            },
            method: "POST",
            url: "https://api.twilio.com/2010-04-01/Accounts/SKc7fd174be57696e8a6d158f81351e268/Messages.json",
            data: {To: '2066500642', From: '+12065390466', Body: "YOU SEXYYYYYY!"}
        });
    }]);
