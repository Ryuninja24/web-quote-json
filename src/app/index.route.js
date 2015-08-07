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
            .state('postalCodeDetails', {
                url: '/postal-code',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                resolve:{
                    modelData: function($q, $stateParams){
                        var model = {};
                        var deferred = $q.defer();
                        deferred.resolve(model);
                        return deferred.promise;
                    }
                },
                onExit: function(modelData){
                    console.dir(modelData);
                },
                data: {
                    schema: {
                        "type": "object",
                        "properties": {
                            "address": {
                                type: 'string',
                                format: 'postalCodeSelector',
                               // pattern: "/\d{5}/",
                                minLength: 5,
                                maxLength: 5
                            }
                        },
                        "required": [
                            "address"
                        ]
                    },
                    form: [
                        {
                            key:"address",
                            placeholder:"Zip Code",
                            notitle:true
                        },
                        {
                            "type": "submit",
                            "style": "btn-info",
                            "title": "OK"
                        }
                    ]
                }
            })
            .state('vehicle', {
                url: '/vehicle/{vehicleId}',
                templateUrl: 'app/quote/quote.html',
                controller: 'QuoteController',
                resolve:{
                    modelData: function($q, $stateParams){
                        var model = {};
                        var deferred = $q.defer();
                        deferred.resolve(model);
                        return deferred.promise;
                    }
                },
                onExit: function(modelData){
                    console.dir(modelData);
                },
                //resolve:{
                //    greeting: function($q, $stateParams){
                //        var vehicleId = $stateParams.vehicleId;
                //        if(!vehicleId || vehicleId == '0'){
                //            vehicleId = String.createGuid();
                //        }
                //        var deferred = $q.defer();
                //        deferred.resolve(String.format('Vehicle {0}', vehicleId));
                //        return deferred.promise;
                //    }
                //},
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
                            "customEquipment": {
                                "title": "Custom equipment",
                                "type": "boolean",
                                default: null
                            },
                            "customEquipmentAmount": {
                                "title": "Custom equipment amount",
                                "type": "string",
                                "enum": ["Up to $1000","$1001 - $1500","$1501 - $1999"]
                            },
                            "primaryUse": {
                                "title": "Primary use",
                                "type": "string",
                                "enum": ["Work/School","Business","Pleasure"]
                            },
                            "ownership": {
                                "title": "Ownership",
                                "type": "string",
                                "enum": ["Paid Off","Lease/Financed"]
                            },
                            "annualMileage": {
                                "title": "Annual mileage",
                                "type": "string",
                                "enum": ["Less than 4000","4000 - 5999","6000 - 7999"]
                            },
                            "orginalOwner": {
                                "title": "Are you the original owner?",
                                "type": "boolean",
                                default: null
                            },
                            "yearsOwned": {
                                "title": "Years of ownership",
                                "type": "string",
                                "enum": ["Less than 4000","4000 - 5999","6000 - 7999"]
                            },
                            "addAnotherVehicle": {
                                "title": "Add another vehicle?",
                                "type": "boolean",
                                default: null
                            },
                        },
                        "required": [
                            "vinyesno",
                            "vin",
                            "customEquipment",
                            "primaryUse",
                            "ownership",
                            "annualMileage",
                            "addAnother"
                        ]
                    },
                    form: [
                        {
                            "key": "vinyesno",
                            "type": "radiobuttons",
                            "labelHtmlClass": "float-left",

                            "titleMap": [
                                {
                                    "value": true,
                                    "name": "Yes"
                                },
                                {
                                    "value": false,
                                    "name": "No"
                                }
                            ]
                        },
                        {
                            "key": "vin",
                            "labelHtmlClass": "float-left",
                            "fieldHtmlClass": "float-right form-50",
                            "condition": "modelData.vinyesno && modelData.vinyesno != null"
                        },
                        {
                            "key": "vehicleSelection",
                            "labelHtmlClass": "float-left",
                            "condition": "!modelData.vinyesno && modelData.vinyesno != null",
                        },
                        {
                            "key": "customEquipment",
                            "labelHtmlClass": "float-left",
                            "type": "radiobuttons",

                            "titleMap": [
                                {
                                    "value": true,
                                    "name": "Yes"
                                },
                                {
                                    "value": false,
                                    "name": "No"
                                }

                            ]
                        },
                        {
                            "key": "customEquipmentAmount",
                            "labelHtmlClass": "float-left",
                            "fieldHtmlClass": "float-right form-50",
                            "condition": "modelData.customEquipment && modelData.customEquipment != null"
                        },
                        {
                          "key": "primaryUse",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test"
                        },
                        {
                          "key": "ownership",
                          "fieldHtmlClass": "float-right form-50"
                        },
                        {
                          "key": "annualMileage",
                          "fieldHtmlClass": "float-right form-50"
                        },
                        {
                            "key": "orginalOwner",
                            "labelHtmlClass": "float-left",
                            "fieldHtmlClass": "float-right form-50",
                            "type": "radiobuttons",

                            "titleMap": [
                                {
                                    "value": true,
                                    "name": "Yes"
                                },
                                {
                                    "value": false,
                                    "name": "No"
                                }

                            ]
                        },
                        {
                          "key": "yearsOwned",
                          "fieldHtmlClass": "float-right form-50"
                        },

                        {
                            "key": "addAnotherVehicle",
                            "labelHtmlClass": "float-left",
                            "type": "radiobuttons",

                            "titleMap": [
                                {
                                    "value": true,
                                    "name": "Yes"
                                },
                                {
                                    "value": false,
                                    "name": "No"
                                }

                            ]
                        },

                        {
                            "htmlClass": "float-right",
                            "type": "submit",
                            "style": "btn-info",
                            "title": "OK"
                        },

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
                            "firstName": {
                                "type": "string",
                                "pattern": "^[^/]*$",
                                "minLength": 2
                            },
                            "middleName": {
                                "type": "string",
                                "minLength": 0,
                                "maxLength": 1
                            },
                            "lastName": {
                                "type": "string",
                                "pattern": "^[^/]*$",
                                "minLength": 2
                            },
                            "suffix": {
                                "type": "string",
                                "enum": ["Jr.","Sr.","I"]
                            },
                            "garagingAddress": {
                                type: 'string',
                                "pattern": "/^(?=.*(\d))(?=.*[a-zA-Z])(?=.*(\W)).{5,64}$/"
                            },
                            "garagingApt": {
                                type: 'string'
                            },
                            "garagingCity": {
                                type: 'string'
                            },
                            "garagingState": {
                                type: 'string'
                            },
                            "garagingPostalCode":{
                              type: 'string'
                            },
                            "birthDate": {
                                "type": "string",
                                "pattern": "^[^/]*$"
                            },
                            "phoneNumber": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string",
                                "minLength": 5
                            }

                        },
                        "required": [
                            "firstName",
                            "lastName",
                            "garagingAddress",
                            "garagingCity"
                        ]
                    },
                    form: [
                        {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"firstName",
                                        placeholder:"First Name",
                                        title:"First name"
                                    }]

                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-2",
                                    "items": [{
                                        key:"middleName",
                                        placeholder:"M",
                                        title:"Middle name",
                                        notitle:true
                                    }]
                                }
                            ]
                        },
                        {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"lastName",
                                        placeholder:"Last Name",
                                        title:"Last name"
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-2",
                                    "items": [{
                                        key:"suffix",
                                        placeholder:"Suffix",
                                        title:"Suffix"
                                    }]
                                }
                            ]
                        },
                        {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"garagingAddress",
                                        title:"Garaging Address",
                                        placeholder:"Address"

                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-xs-2",
                                    "items": [{
                                        key:"garagingApt",
                                        notitle:true,
                                        placeholder:"Apt #"
                                    }]
                                }
                            ]
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
