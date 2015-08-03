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
                    schema: {
                        "type": "object",
                        "properties": {
                            "birthDate": {
                                "title": "Bday",
                                "type": "string",
                                "format": "date"
                            }
                        },
                        "required": [
                            "birthDate"
                        ]
                    },
                    form: [
                        {
                            "key": "birthDate",
                            "minDate": "1995-09-01",
                            "maxDate": new Date(),
                            "format": "yyyy-mm-dd"
                        },
                        {
                            "type": "submit",
                            "style": "btn-info",
                            "title": "OK"
                        }
                    ]
                }
            })
            .state('vehicle-entry', {
                url: '/vehicle',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                data: {
                    schema: {
                        "type": "object",
                        "title": "Vehicle Entry",
                        "properties": {
                            "vinyesno": {
                                "title": "Do you have a VIN?",
                                "type": "boolean",
                                default: null
                            },
                            "vin": {
                                "title": "Vehicle Identification number",
                                "type": "string"
                            },
                            "vehicleSelection": {
                                "title": "Vehicle Year Make and Model",
                                type: 'string',
                                format: 'vehicleSelector'
                            },
                        },
                        "required": [
                            "vinyesno"
                        ]
                    },
                    form: [
                        {
                            "key": "vinyesno",
                            "type": "radiobuttons",

                            "titleMap": [
                                {
                                    "value": false,
                                    "name": "No"
                                },
                                {
                                    "value": true,
                                    "name": "Yes"
                                }
                            ]
                        },
                        {
                            "key": "vin",
                            "condition": "modelData.vinyesno && modelData.vinyesno != null"
                        },
                        {
                            "key": "vehicleSelection",
                            "condition": "!modelData.vinyesno && modelData.vinyesno != null"
                        },
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
                            },
                            "noenum": {
                                "type": "string",
                                "title": "No enum, but forms says it's a select"
                            },
                            "funSelect": {
                                title: 'Single Select',
                                type: 'string',
                                format: 'strapselect',
                                description: 'Only single item is allowed',
                                placeholder: 'Select One',
                                items: [
                                    {value: 'value1', label: 'Single1'},
                                    {value: 'value2', label: 'Single2'},
                                    {value: 'value3', label: 'Single3'}
                                ]
                            },
                            "multiselect": {
                                title: 'Multi Select',
                                type: 'array',
                                format: 'strapselect',
                                description: 'Multi single items are allowed',
                                placeholder: 'Select One',
                                items: [
                                    {value: 'value1', label: 'Multi1'},
                                    {value: 'value2', label: 'Multi2'},
                                    {value: 'value3', label: 'Multi3'}
                                ]
                            },
                            "selectDynamic": {
                                title: 'Single Select Dynamic',
                                type: 'string',
                                format: 'strapselectdynamic',
                                placeholder: 'Select One',
                                description: 'Only single item is allowed'
                            },
                            "multiselectDynamic": {
                                title: 'Multi Select Dynamic',
                                type: 'array',
                                format: 'strapselectdynamic',
                                placeholder: 'Select One',
                                description: 'Multi single items are allowed'
                            }
                        },
                        "required": [
                            "name"
                        ]
                    },
                    form: [
                        "name",
                        {
                            "key": "noenum",
                            "type": "select",
                            "titleMap": [
                                {
                                    "value": "a",
                                    "name": "A"
                                },
                                {
                                    "value": "b",
                                    "name": "B"
                                },
                                {
                                    "value": "c",
                                    "name": "C"
                                }
                            ]
                        },
                        {
                            key: 'funSelect'
                        },
                        {
                            key: 'multiselect'
                        },
                        {
                            key: 'selectDynamic'
                        },
                        {
                            key: 'multiselectDynamic'
                        },
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
