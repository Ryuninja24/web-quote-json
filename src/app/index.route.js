(function () {
    'use strict';

    angular
        .module('webQuoteJson')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            })
            .state('quoteHome', {
                url: '/quotes',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: 'dahs schema',
                    form: 'dahs form'
                }
            })
            .state('postalCodeDetails', {
                url: '/postal-code',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: {
                        "type": "object",
                        "title": "Postal Code",
                        "properties": {
                            "postal": {
                                "title": "Please enter a postal code",
                                "type": "string"
                            }
                        },
                        "required": [
                            "postal"
                        ]
                    },
                    form: [
                        "postal",
                        {
                            "type": "submit",
                            "style": "btn-info",
                            "title": "OK"
                        }
                    ]
                }
            })
            .state('policyholder', {
                url: '/policy-holder',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: {
                        "type": "object",
                        "title": "Policy Holder",
                        "properties": {
                            "name": {
                                "title": "Please enter your first name",
                                "type": "string"
                            },
                            "middleName": {
                                "title": "Please enter your first name",
                                "type": "string"
                            }
                        },
                        "required": [
                            "name"
                        ]
                    },
                    form: [
                        "name",
                        {
                            "type": "submit",
                            "style": "btn-info",
                            "title": "OK"
                        }
                    ]
                }
            })
            .state('driver', {
                url: '/driver',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: 'dahs policy holder',
                    form: 'dahs policy form'
                }
            })
            .state('driverDetails', {
                url: '/driver-details',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: 'dahs policy holder',
                    form: 'dahs policy form'
                }
            });

        $urlRouterProvider.otherwise('/');
    }

})();
