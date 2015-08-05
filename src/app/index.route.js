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
            .state('vehicle', {
                url: '/vehicle/{vehicleId}',
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
                            "condition": "modelData.vinyesno && modelData.vinyesno != null"
                        },
                        {
                            "key": "vehicleSelection",
                            "condition": "!modelData.vinyesno && modelData.vinyesno != null"
                        },
                        {
                            "key": "customEquipment",
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
                            "condition": "modelData.customEquipment && modelData.customEquipment != null"
                        },
                        "primaryUse",
                        "ownership",
                        "annualMileage",
                        {
                            "key": "orginalOwner",
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
                        "yearsOwned",
                        {
                            "key": "addAnotherVehicle",
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
