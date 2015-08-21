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
        resolve: {
          modelData: function ($q, $stateParams) {
            var model = {};
            var deferred = $q.defer();
            deferred.resolve(model);
            return deferred.promise;
          }
        },
        data: {
          schema: {
            "type": "object",
            "properties": {
              "postalCode": {
                type: 'string',
                format: 'postalCodeSelector',
                minLength: 5,
                maxLength: 5
              }
            },
            "required": [
              "postalCode"
            ]
          },
          form: [
            {
              key: "postalCode",
              placeholder: "Zip Code",
              notitle: true
            }
          ]
        }
      })
      .state('vehicle', {
        url: '/vehicle/{vehicleId}',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var vehicleId = $stateParams.vehicleId;
            if (!vehicleId) {
              vehicleId = 0;
            }
            var fun = dataModelService.getModels({vehicleId: vehicleId, driverId: null});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          schema: {
            "type": "object",
            "title": "Vehicle Entry",
            "properties": {
              "vehicle": {
                type: "object",
                properties: {
                  "CustomEquipment": {
                    "title": "Custom equipment",
                    "type": "boolean",
                    default: null
                  },
                  "ValueOfCustomEquipment": {
                    "title": "Custom equipment amount",
                    "type": "string",
                    "enum": ["Up to $1000", "$1001 - $1500", "$1501 - $1999"]
                  },
                  "Usage": {
                    "title": "Primary use",
                    "type": "string",
                    "enum": ["Work/School", "Business", "Pleasure"]
                  },
                  "Ownership": {
                    "title": "Ownership",
                    "type": "string",
                    "enum": ["Paid Off", "Lease/Financed"]
                  },
                  "EstimatedAnnualMileage": {
                    "title": "Annual mileage",
                    "type": "string",
                    "enum": ["Less than 4000", "4000 - 5999", "6000 - 7999"]
                  },
                  "OrginalOwner": {
                    "title": "Are you the original owner?",
                    "type": "boolean",
                    default: null
                  },
                  "YearsOwned": {
                    "title": "Years of ownership",
                    "type": "string",
                    "enum": ["Less than 4000", "4000 - 5999", "6000 - 7999"]
                  },
                  "AddAnotherVehicle": {
                    "title": "Add another vehicle?",
                    "type": "boolean",
                    default: null
                  }
                },
                "required": [
                  "CustomEquipment",
                  "Usage",
                  'EstimatedAnnualMileage',
                  "Ownership",
                  "OrginalOwner",
                  "YearsOwned",
                  "AddAnotherVehicle"
                ]
              }
            }
          },
          form: [
            {
              "type": "section",
              "htmlClass": "row",
              "items": [
                {
                  "type": "section",
                  "items": [{
                    "key": "vehicle.CustomEquipment",
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
                      "key": "vehicle.ValueOfCustomEquipment",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "condition": "modelData.vehicle.CustomEquipment == true"
                    },
                    {
                      "key": "vehicle.Usage",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test"
                    },
                    {
                      "key": "vehicle.Ownership",
                      "fieldHtmlClass": "float-right form-50"
                    },
                    {
                      "key": "vehicle.EstimatedAnnualMileage",
                      "fieldHtmlClass": "float-right form-50"
                    },
                    {
                      "key": "vehicle.OrginalOwner",
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
                      "key": "vehicle.YearsOwned",
                      "fieldHtmlClass": "float-right form-50"
                    },

                    {
                      "key": "vehicle.AddAnotherVehicle",
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
                    }
                  ]
                }
              ]
            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      })
      .state('policyholder', {
        url: '/policy-holder',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var fun = dataModelService.getModels({vehicleId: null, driverId: null});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          schema: {
            "type": "object",
            "title": "Policy Holder",
            "properties": {
              "driver": {
                type: "object",
                "required": [
                  "FirstName",
                  "LastName",
                  "DateOfBirth"
                ],
                properties: {
                  "FirstName": {
                    "type": "string",
                    "format": "inputMask",
                    "pattern": "[\sa-zA-Z.-/]",
                    "minLength": 2,
                    "maxLength": 30
                  },
                  "MiddleName": {
                    "type": "string",
                    "minLength": 0,
                    "maxLength": 1
                  },
                  "LastName": {
                    "type": "string",
                    "format": "inputMask",
                    "pattern": "[\sa-zA-Z.-/]",
                    "minLength": 2,
                    "maxLength": 30
                  },
                  "Suffix": {
                    "type": "string",
                    "enum": ["Jr.", "Sr.", "I"]
                  },
                  "DateOfBirth": {
                    "type": "string",
                    "format": "inputMask"
                  },
                  "PhoneNumber": {
                    "type": "string",
                    "format": "inputMask"
                  },
                  "EmailAddress": {
                    "type": "string",
                    "minLength": 5
                  }
                }
              },//driver
              "address": {
                type: "object",
                "title": "Address",
                "required": [
                  "AddressLine1",
                  "City",
                  "State",
                  "PostalCode"
                ],
                properties: {
                  "AddressLine1": {
                    type: 'string',
                    "pattern": "[0-9]+\s*([a-zA-Z]+\s*[a-zA-Z]+\s)*[0-9]*"
                  },
                  "Apt": {
                    type: 'string'
                  },
                  "City": {
                    type: 'string'
                  },
                  "State": {
                    type: 'string'
                  },
                  "PostalCode": {
                    type: 'string'
                  }
                }
              }//address
            }
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
                    type: "el_inputMask",
                    key: "driver.FirstName",
                    placeholder: "First Name",
                    title: "First name",
                    directives: "[ { 'ucase-first' : '' } ]"
                  }]
                },
                {
                  "type": "section",
                  "htmlClass": "col-xs-2",
                  "items": [{
                    key: "driver.MiddleName",
                    placeholder: "M",
                    title: "Middle name",
                    notitle: true
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
                    type: "el_inputMask",
                    key: "driver.LastName",
                    placeholder: "Last Name",
                    title: "Last name",
                    directives: "[ { 'ucase-first' : '' } ]"
                  }]
                },
                {
                  "type": "section",
                  "htmlClass": "col-xs-2",
                  "items": [{
                    key: "driver.Suffix",
                    placeholder: "Suffix",
                    title: "Suffix"
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
                    key: "address.AddressLine1",
                    title: "Garaging Address",
                    placeholder: "Address"

                  }]
                },
                {
                  "type": "section",
                  "htmlClass": "col-xs-2",
                  "items": [{
                    key: "address.Apt",
                    notitle: true,
                    placeholder: "Apt #"
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
                  "items": [{
                    key: "address.City",
                    "labelHtmlClass": "float-left",
                    "fieldHtmlClass": "float-right form-50",
                    placeholder: "City",
                    title: "City"
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
                  "items": [{
                    key: "driver.DateOfBirth",
                    type: "el_inputMask",
                    "labelHtmlClass": "float-left",
                    "fieldHtmlClass": "float-right form-50",
                    title: "Birth date",
                    directives: "[ { 'ui-mask' : '99-99-9999' }, {'valid_date':''}, {'min-age':'18'}, {'max-age':'98'} ]"
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
                  "items": [{
                    key: "driver.PhoneNumber",
                    type: "el_inputMask",
                    "labelHtmlClass": "float-left",
                    "fieldHtmlClass": "float-right form-50",
                    title: "Phone number",
                    directives: "[{ 'ui-mask' : '(999)-999-9999' }]"
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
                  "items": [{
                    type: "email",
                    key: "driver.EmailAddress",
                    "labelHtmlClass": "float-left",
                    "fieldHtmlClass": "float-right form-50",
                    placeholder: "Email address",
                    title: "Email",
                    copyValueTo: ["driver.EmailAddressConfirm"]
                  }]
                }
              ]
            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      })
      .state('driver', {
        url: '/driver',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var driverId = $stateParams.driverId;
            var fun = dataModelService.getModels({vehicleId: null, driverId: null});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          schema: {
            "type": "object",
            "title": "Driver Stuff",
            "properties": {
              "driver": {
                type: "object",
                properties: {
                  "Gender": {
                    "title": "Gender",
                    "type": "string",
                    default: null
                  },
                  "MaritalStatus": {
                    "title": "Marital status",
                    "type": "string"
                  },
                  "ResidenceOwnership": {
                    "title": "Residence type",
                    "type": "string"
                  },
                  "YearsAtCurrentResidence": {
                    "title": "Years at residence",
                    "type": "string"
                  },
                  "HighestLevelOfEducation": {
                    "title": "Custom equipment amount",
                    "type": "string"
                  },
                  "EmploymentStatus": {
                    "title": "Employment status",
                    "type": "string"
                  }
                },
                "required": [
                  "Gender",
                  "MaritalStatus",
                  "ResidenceOwnership",
                  "HighestLevelOfEducation",
                  "EmploymentStatus"
                ]
              }
            }
          },
          form: [
            {
              "type": "section",
              "htmlClass": "row",
              "items": [
                {
                  "type": "section",
                  "items": [{
                    "key": "driver.Gender",
                    "labelHtmlClass": "float-left",
                    "type": "radiobuttons",
                    "titleMap": [
                      {
                        "value": "Male",
                        "name": "Male"
                      },
                      {
                        "value": "Female",
                        "name": "Female"
                      }
                    ]
                  },
                    {
                      "key": "driver.MaritalStatus",
                      "type": "select",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Divorced"
                        },
                        {
                          "value": "1",
                          "name": "Married"
                        },
                        {
                          "value": "2",
                          "name": "Never Married"
                        },
                        {
                          "value": "3",
                          "name": "Separated"
                        },
                        {
                          "value": "4",
                          "name": "Widowed"
                        }
                      ]
                    },
                    {
                      "key": "driver.ResidenceOwnership",
                      "type": "select",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Own condo"
                        },
                        {
                          "value": "1",
                          "name": "Own home"
                        },
                        {
                          "value": "2",
                          "name": "Own mobile home"
                        },
                        {
                          "value": "3",
                          "name": "Rent"
                        },
                        {
                          "value": "4",
                          "name": "Other"
                        }
                      ]
                    },
                    {
                      "key": "driver.YearsAtCurrentResidence",
                      "type": "select",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Less than 1 year"
                        },
                        {
                          "value": "1",
                          "name": "1 year"
                        },
                        {
                          "value": "2",
                          "name": "2 years"
                        },
                        {
                          "value": "3",
                          "name": "3 years"
                        },
                        {
                          "value": "4",
                          "name": "4 years"
                        },
                        {
                          "value": "5",
                          "name": "5 or more years"
                        }
                      ]
                    },
                    {
                      "key": "driver.HighestLevelOfEducation",
                      "type": "select",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Lower than High School"
                        },
                        {
                          "value": "1",
                          "name": "High School/GED"
                        },
                        {
                          "value": "2",
                          "name": "Vocational"
                        },
                        {
                          "value": "3",
                          "name": "Associates"
                        },
                        {
                          "value": "4",
                          "name": "Bachelors"
                        },
                        {
                          "value": "5",
                          "name": "Masters"
                        },
                        {
                          "value": "6",
                          "name": "Doctorate"
                        }
                      ]
                    },
                    {
                      "key": "driver.EmploymentStatus",
                      "type": "select",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Employed"
                        },
                        {
                          "value": "1",
                          "name": "Homemaker"
                        },
                        {
                          "value": "2",
                          "name": "Retired"
                        },
                        {
                          "value": "3",
                          "name": "Full-time student"
                        },
                        {
                          "value": "4",
                          "name": "Unemployed"
                        },
                        {
                          "value": "5",
                          "name": "Military - active"
                        },
                        {
                          "value": "6",
                          "name": "Military - retired"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      })
      .state('driverDetails', {
        url: '/driver-details/',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var driverId = $stateParams.driverId;
            var fun = dataModelService.getModels({vehicleId: null, driverId: null});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          schema: {
            "type": "object",
            "title": "Driver Details",
            "properties": {
              "driver": {
                type: "object",
                properties: {
                  "LicenseStatus": {
                    "type": "string",
                    default: null
                  },
                  "AgeFirstLicensed": {
                    "type": "string"
                  },
                  "CurrentlyInsured": {
                    "type": "boolean",
                    default: null
                  },
                  "CurrentInsuranceStatus": {
                    default: null,
                    "type": "string"
                  },
                  "PreviousLapse": {
                    "type": "string",
                    default: null
                  },
                  "CurrentInsurer": {
                    "type": "string",
                    default: null
                  },
                  YearsWithCurrentInsurer: {
                    "type": "string",
                    default: null
                  },
                  "CurrentPremium": {
                    "type": "string",
                    default: null
                  },
                  CurrentInsuranceLimits: {
                    "type": "string",
                    default: null
                  },
                  "PolicyStartDate": {
                    type: 'string',
                    format: 'el_policyStartDate'
                  },
                  "HasMotorcycle": {
                    "type": "boolean",
                    default: null
                  },
                  "AdditionalDrivers": {
                    "type": "boolean",
                    default: null
                  },
                  "CurrentZipCode": {
                    "type": "boolean",
                    default: null
                  }
                },
                "required": [
                  "LicenseStatus",
                  "AgeFirstLicensed",
                  "CurrentlyInsured",
                  "AdditionalDrivers",
                  "CurrentZipCode"
                ]
              }
            }
          },
          form: [
            {
              "type": "section",
              "htmlClass": "row",
              "items": [
                {
                  "type": "section",
                  "items": [
                    {
                      "key": "driver.LicenseStatus",
                      "title": "Current license status",
                      "type": "select",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test",
                      "titleMap": [
                        {
                          "value": "",
                          "name": "Select One"
                        },
                        {
                          "value": "0",
                          "name": "Valid"
                        },
                        {
                          "value": "1",
                          "name": "Expired"
                        },
                        {
                          "value": "2",
                          "name": "Non-licensed"
                        },
                        {
                          "value": "3",
                          "name": "Non-US"
                        },
                        {
                          "value": "4",
                          "name": "Permit"
                        },
                        {
                          "value": "5",
                          "name": "Surrendered"
                        },
                        {
                          "value": "6",
                          "name": "Suspended"
                        },
                        {
                          "value": "7",
                          "name": "Restricted"
                        },
                        {
                          "value": "8",
                          "name": "Revoked"
                        }
                      ]
                    },
                    {
                      key: "driver.AgeFirstLicensed",
                      placeholder: "",
                      title: "Age first licensed",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test"
                    },
                    {
                      "key": "driver.CurrentlyInsured",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Currently have auto insurance",
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
                      "type": "el_collapse",
                      collapseCondition: "model['driver']['CurrentlyInsured'] == null || model['driver']['CurrentlyInsured']",
                      "htmlClass": "form-group",
                      "items": [
                        {
                          "key": "driver.CurrentInsuranceStatus",
                          "title": "Reason",
                          "type": "el_select_ngrequired",
                          "requiredCondition": "!model['driver']['CurrentlyInsured']",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "titleMap": [
                            {
                              "value": "",
                              "name": "Select One"
                            },
                            {
                              "value": "0",
                              "name": "Deployed overseas with the military"
                            },
                            {
                              "value": "1",
                              "name": "My policy expired 30 days ago or less"
                            },
                            {
                              "value": "2",
                              "name": "My policy expired more than 30 days ago"
                            },
                            {
                              "value": "3",
                              "name": "No insurance required"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "el_collapse",
                      collapseCondition: "!(model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days')",
                      "htmlClass": "form-group",
                      "items": [
                        {
                          "key": "driver.PreviousLapse",
                          title: "Were you uninsured at any time in the past 3 years?",
                          "type": "el_select_ngrequired",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "titleMap": [
                            {
                              "value": "",
                              "name": "Select One"
                            },
                            {
                              "value": "0",
                              "name": "No"
                            },
                            {
                              "value": "1",
                              "name": "Yes, 30 days or less"
                            },
                            {
                              "value": "2",
                              "name": "Yes, more than 30 days"
                            }
                          ]
                        },
                        {
                          "key": "driver.CurrentInsurer",
                          title: "Current insurance company",
                          "type": "el_select_ngrequired",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "titleMap": [
                            {
                              "value": "",
                              "name": "Select One"
                            },
                            {
                              "value": "0",
                              "name": "AAA Auto Insurance"
                            },
                            {
                              "value": "1",
                              "name": "ACE Group"
                            },
                            {
                              "value": "2",
                              "name": "AIG"
                            },
                            {
                              "value": "3",
                              "name": "Allstate"
                            },
                            {
                              "value": "4",
                              "name": "American Family Insurance"
                            },
                            {
                              "value": "5",
                              "name": "Auto-Owners Insurance"
                            },
                            {
                              "value": "6",
                              "name": "CNA Financial Group"
                            }
                          ]
                        },
                        {
                          "key": "driver.YearsWithCurrentInsurer",
                          title: "Years with current company",
                          "type": "el_select_ngrequired",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "titleMap": [
                            {
                              "value": "",
                              "name": "Select One"
                            },
                            {
                              "value": "0",
                              "name": "Less than 1 year"
                            },
                            {
                              "value": "1",
                              "name": "1 year"
                            },
                            {
                              "value": "2",
                              "name": "2 years"
                            },
                            {
                              "value": "3",
                              "name": "3 years"
                            },
                            {
                              "value": "4",
                              "name": "4 years"
                            },
                            {
                              "value": "5",
                              "name": "5 or more years"
                            }
                          ]
                        },
                        {
                          key: "driver.CurrentPremium",
                          "type": "default",
                          fieldAddonLeft: "$",
                          fieldAddonRight: ".00",
                          placeholder: "",
                          title: "Current monthly premium",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test"
                        },
                        {
                          "key": "driver.CurrentInsuranceLimits",
                          title: "Current bodily injury coverage limits",
                          "type": "el_select_ngrequired",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "titleMap": [
                            {
                              "value": "",
                              "name": "Select One"
                            },
                            {
                              "value": "0",
                              "name": "Don't know"
                            },
                            {
                              "value": "1",
                              "name": "Minimum limit"
                            },
                            {
                              "value": "2",
                              "name": "More than minimum but less than 50/100"
                            },
                            {
                              "value": "3",
                              "name": "50/100 or more but less than 100/300"
                            },
                            {
                              "value": "4",
                              "name": "100/300 or more"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      key: "account.PolicyStartDate",
                      type: "el_policyStartDate",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "New policy start date",
                      "dateOptions": {minDate: +1, maxDate: "+2M"}
                    },
                    {
                      "key": "driver.HasMotorcycle",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Do you own a motorcycle",
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
                      "key": "driver.AdditionalDrivers",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Other drivers in your home?",
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
                      "key": "driver.CurrentZipCode",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Are all vehicles kept in ZIP ?????",
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
                    }
                  ]
                }
              ]
            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      })
      .state('additionalDriver', {
        url: '/additional-driver/{driverId}',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var driverId = $stateParams.driverId;
            var fun = dataModelService.getModels({vehicleId: null, driverId: null});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          "schema": {
            "type": "object",
            "required": [
              "name",
              "shoesizeLeft"
            ],
            "properties": {
              "name": {
                "title": "Name",
                "description": "Gimme yea name lad",
                "type": "string",
                "pattern": "^[^/]*$",
                "minLength": 2
              },
              "invitation": {
                "type": "string",
                "format": "html",
                "title": "Invitation Design",
                "description": "Design the invitation in full technicolor HTML"
              },
              "favorite": {
                "title": "Favorite",
                "type": "string",
                "enum": [
                  "undefined",
                  "null",
                  "NaN"
                ]
              },
              "shoesizeLeft": {
                "title": "Shoe size (left)",
                "default": 42,
                "type": "number"
              },
              "shoesizeRight": {
                "title": "Shoe size (right)",
                "default": 42,
                "type": "number"
              },
              "attributes": {
                "type": "object",
                "title": "Attributes",
                "required": [
                  "eyecolor"
                ],
                "properties": {
                  "eyecolor": {
                    "type": "string",
                    "format": "color",
                    "title": "Eye color",
                    "default": "pink"
                  },
                  "haircolor": {
                    "type": "string",
                    "title": "Hair color"
                  },
                  "shoulders": {
                    "type": "object",
                    "title": "Shoulders",
                    "properties": {
                      "left": {
                        "type": "string",
                        "title": "Left"
                      },
                      "right": {
                        "type": "string",
                        "title": "Right"
                      }
                    }
                  }
                }
              },
              "things": {
                "type": "array",
                "title": "I like...",
                "items": {
                  "type": "string",
                  "enum": [
                    "clowns",
                    "compiling",
                    "sleeping"
                  ]
                }
              },
              "dislike": {
                "type": "array",
                "title": "I dislike...",
                "items": {
                  "type": "string",
                  "title": "I hate"
                }
              },
              "soul": {
                "title": "Terms Of Service",
                "description": "I agree to sell my undying <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>soul</a>",
                "type": "boolean",
                "default": true
              },
              "soulserial": {
                "title": "Soul Serial No",
                "type": "string"
              },
              "date": {
                "title": "Date of party",
                "type": "string",
                "format": "date"
              },
              "radio": {
                "title": "Radio type",
                "type": "string",
                "enum": [
                  "Transistor",
                  "Tube"
                ]
              },
              "radio2": {
                "title": "My Second Radio",
                "type": "string",
                "enum": [
                  "Transistor",
                  "Tube"
                ]
              },
              "radiobuttons": {
                "type": "string",
                "enum": [
                  "Select me!",
                  "No me!"
                ]
              }
            }
          },
          "form": [
            {
              "type": "fieldset",
              "title": "Stuff",
              "items": [
                {
                  "key": "name",
                  "placeholder": "Check the console",
                  "onChange": "log(modelValue)",
                  "feedback": "{'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-star': !hasSuccess() }"
                },
                "attributes.eyecolor",
                "attributes.haircolor",
                {
                  "key": "attributes.shoulders.left",
                  "title": "Left shoulder",
                  "description": "This value is copied to attributes.shoulders.right in the model",
                  "copyValueTo": ["attributes.shoulders.right"]
                },
                {
                  "key": "shoesizeLeft",
                  "feedback": false,
                  "copyValueTo": ["shoesizeRight"]
                },
                {
                  "key": "shoesizeRight"
                }
              ]

            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      });

    $urlRouterProvider.otherwise('/postal-code');
  }

})();
