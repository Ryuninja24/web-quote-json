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
      .state('quoteTermination', {
        url: '/quote-termination?state&id',
        templateUrl: 'app/quote/quoteTermination/quoteTermination.html',
        controller: 'QuoteTerminationController'
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
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
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
            },
            {
              key: "el_navSummary"
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
        onEnter: function (callTrackerService) {
          callTrackerService.registerCallSuccess('waitScreen');
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
                    type: 'string',
                    format: 'label'
                  },
                  "PostalCode": {
                    type: 'string',
                    format: 'label'
                  }
                }
              },//address
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
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
                  key: "address.City",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  placeholder: "City",
                  title: "City"
                },
                {
                  "type": "template",
                  "template": "<div>{{model.address.State}}</div>"
                },
                {
                  "type": "template",
                  "template": "<div>{{model.address.PostalCode}}</div>"
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
            },
            {
              key: "el_navSummary"
            },
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
                    title: "Marital Status",
                    type: "string"
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
                    "title": "Education completed",
                    "type": "string"
                  },
                  "EmploymentStatus": {
                    "title": "Employment status",
                    "type": "string"
                  },
                  "MilitaryBranch": {
                    "title": "Branch",
                    "type": "string"
                  },
                  "MilitaryStatus": {
                    "title": "Rank",
                    "type": "string"
                  },
                  "Occupation": {
                    "title": "Occupation",
                    "type": "string"
                  },
                  "CurrentStudentEnrollment": {
                    "title": "Currently attend",
                    "type": "string"
                  },
                  "GoodStudentDiscount": {
                    "title": "Have they maintained a 3.0 GPA or better?",
                    "type": "boolean",
                    default: null
                  }
                },
                "required": [
                  "Gender",
                  "MaritalStatus",
                  "ResidenceOwnership",
                  "HighestLevelOfEducation",
                  "EmploymentStatus",
                  "MilitaryBranch"
                ]
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          form: [
            {
              "type": "section",
              "title": "john",
              "htmlClass": "row",
              "items": [
                {
                  "type": "section",
                  "items": [
                    {
                      //<!-- Gender -->
                      "key": "driver.Gender",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
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
                      //<!-- Marital Status -->
                      "key": "driver.MaritalStatus",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "onChange": "onChange(modelValue, 'driver', 'resolveGoodStudentDiscount')",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "MaritalStatus",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      }
                    },
                    {
                      //<!-- Residence -->
                      "key": "driver.ResidenceOwnership",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "ResidenceOwnershipType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      }
                    },
                    {
                      //<!-- Years at residence -->
                      "key": "driver.YearsAtCurrentResidence",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "YearsAt",
                        "map": {valueProperty: "Value", nameProperty: "Description"}
                      }
                    },
                    {
                      //<!-- Education Level -->
                      "key": "driver.HighestLevelOfEducation",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "EducationLevelType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      }
                    },
                    {
                      //<!-- Employment Status -->
                      "key": "driver.EmploymentStatus",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "onChange": "onChange(modelValue, 'driver', 'resolveEmploymentStatus')",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "EmploymentStatusType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      }
                    },
                    {
                      //<!-- Military Branch -->
                      "key": "driver.MilitaryBranch",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "MilitaryBranch",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      },
                      "condition": "ShowIf(ngform, 'driver','showMilitaryBranch')"
                    },
                    {
                      //<!-- Military Rank -->
                      "key": "driver.MilitaryStatus",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "MilitaryServiceType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      },
                      "condition": "ShowIf(ngform, 'driver','showMilitaryStatus')"
                    },
                    {
                      //<!-- Occupation -->
                      "key": "driver.Occupation",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "Occupation",
                        "map": {valueProperty: "Value", nameProperty: "Description"}
                      },
                      "condition": "ShowIf(ngform, 'driver','showOccupation')"
                    }
                    ,
                    {
                      //<!-- Currently Attending School -->
                      "key": "driver.CurrentStudentEnrollment",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "onChange": "onChange(modelValue, 'driver', 'resolveEmploymentStatus')",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "StudentEnrollmentType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      },
                      "condition": "ShowIf(ngform, 'driver','showCurrentStudentEnrollment')"
                    },
                    {
                      //<!-- Good Student Discount -->
                      "key": "driver.GoodStudentDiscount",
                      "type": "radiobuttons",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "titleMap": [
                        {
                          "value": true,
                          "name": "Yes"
                        },
                        {
                          "value": false,
                          "name": "No"
                        }
                      ],
                      "condition": "ShowIf(ngform, 'driver','showGoodStudentDiscount')"
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
            },
            {
              key: "el_navSummary"
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
                    "type": "string"
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
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
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
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "type": "elephantSelectPicker",
                      "placeholder": "Select One",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "DriversLicenseStatusType",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      }
                    },
                    {
                      key: "driver.AgeFirstLicensed",
                      placeholder: "",
                      title: "Age first licensed",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test",
                      validationMessage: {
                        "notANumber": "Please enter a valid first licensed age.",
                        "ageLowerRange": "Sorry, first licensed age cannot be lower than 14 years.",
                        "ageUpperRange": "Sorry, first licensed age cannot exceed driver's current age."
                      }
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
                      condition: "model['driver']['CurrentlyInsured'] != null && model['driver']['CurrentlyInsured'] == false",
                      "htmlClass": "form-group",
                      "items": [
                        {
                          "key": "driver.CurrentInsuranceStatus",
                          "title": "Reason",
                          "type": "elephantSelectPicker",
                          //"requiredCondition": "!model['driver']['CurrentlyInsured']",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "options": {
                            "callback": "getLookup",
                            "lookupType": "InsuranceStatusType",
                            "map": {valueProperty: "Name", nameProperty: "Description"}
                          }
                        }
                      ]
                    },
                    {
                      "type": "el_collapse",
                      condition: "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                      "htmlClass": "form-group",
                      "items": [
                        {
                          "key": "driver.PreviousLapse",
                          title: "Were you uninsured at any time in the past 3 years?",
                          "type": "elephantSelectPicker",
                          // "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "options": {
                            "callback": "getLookup",
                            "lookupType": "InsuranceLapseCodeType",
                            "map": {valueProperty: "Name", nameProperty: "Description"}
                          }
                        },
                        {
                          "key": "driver.CurrentInsurer",
                          title: "Current insurance company",
                          "type": "elephantSelectPicker",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "options": {
                            "callback": "getLookup",
                            "lookupType": "CurrentCarrierType",
                            "map": {valueProperty: "Value", nameProperty: "Description"}
                          }
                        },
                        {
                          "key": "driver.YearsWithCurrentInsurer",
                          title: "Years with current company",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "type": "elephantSelectPicker",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "options": {
                            "callback": "getLookup",
                            "lookupType": "YearsAt",
                            "map": {valueProperty: "Value", nameProperty: "Description"}
                          }
                        },
                        //{
                        //  "key": "driver.CurrentPremium",
                        //  "fieldAddonLeft": "$",
                        //  "fieldAddonRight": ".00",
                        //  //placeholder: "",
                        //  "title": "Current monthly premium",
                        //  //"labelHtmlClass": "float-left",
                        //  //"fieldHtmlClass": "float-right form-50"
                        //},
                        {
                          "key": "driver.CurrentInsuranceLimits",
                          title: "Current bodily injury coverage limits",
                          "type": "elephantSelectPicker",
                          "requiredCondition": "model['driver']['CurrentlyInsured'] || model['driver']['CurrentInsuranceStatus'] == 'Military' || model['driver']['CurrentInsuranceStatus'] == 'PolicyExpiredWithin30Days'",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "htmlClass": "test",
                          "options": {
                            "callback": "getLookup",
                            "lookupType": "InsuranceLimitType",
                            "map": {valueProperty: "Value", nameProperty: "Description"}
                          }
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
                      "type": "section",
                      "htmlClass": "row",
                      "items": [
                        {
                          "type": "template",
                          "template": "<div>Are all vehicles kept in ZIP {{model.address.PostalCode}}?</div>"
                        },
                        {
                          "key": "driver.CurrentZipCode",
                          "labelHtmlClass": "float-left",
                          "fieldHtmlClass": "float-right form-50",
                          "notitle": true,
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
                }
              ]
            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })
      .state('driverOverview', {
        url: '/driver-overview',
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
            "properties": {
              "el_driverOverview": {
                "type": "string",
                "format": "el_driverOverview"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_driverOverview"
            },
            {
              key: "el_navSummary"
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
            var fun = dataModelService.getModels({vehicleId: null, driverId: driverId});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          "schema": {
            "type": "object",
            "properties": {
              "driver": {
                "type": "object",
                "required": [
                  "FirstName",
                  "LastName",
                  "RelationToInsured",
                  "CurrentlyInsured",
                  "LicenseStatus",
                  "DrivesAnyListedVehicles",
                ],
                "properties": {
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
                  "Gender": {
                    "title": "Gender",
                    "type": "string",
                    "default": null
                  },
                  "RelationToInsured": {
                    "title": "Relationship to policy holder",
                    "type": "string",
                    "default": null
                  },
                  "CurrentlyInsured": {
                    "title": "Do they have their own vehicle and insurance?",
                    "type": "boolean",
                    "default": null
                  },
                  "LicenseStatus": {
                    "title": "License status",
                    "type": "string",
                    "default": null
                  },
                  "DrivesAnyListedVehicles": {
                    "title": "Do they drive any of your vehicles twice a month or more?",
                    "type": "boolean",
                    "default": null
                  },
                  "DateOfBirth": {
                    "title": "Date of birth",
                    "format": "inputMask",
                    "type": "string",
                    "default": null
                  },
                  "AgeFirstLicensed": {
                    "title": "Age first licensed",
                    "type": "string",
                    "default": null
                  },
                  "MaritalStatus": {
                    "title": "Marital Status",
                    "type": "string",
                    "default": null
                  },
                  "HighestLevelOfEducation": {
                    "title": "Education completed",
                    "type": "string",
                    "default": null
                  },
                  "EmploymentStatus": {
                    "title": "Employment status",
                    "type": "string",
                    "default": null
                  },
                  "MilitaryBranch": {
                    "title": "Branch",
                    "type": "string",
                    "default": null
                  },
                  "Occupation": {
                    "title": "Occupation",
                    "type": "string",
                    "default": null
                  },
                  "CurrentStudentEnrollment": {
                    "title": "Currently attend",
                    "type": "string",
                    "default": null
                  },
                  "CurrentlyEnrolled": {
                    "title": "Are they currently a student or have a Bachelor's degree?",
                    "type": "string",
                    "default": null
                  },
                  "GoodStudentDiscount": {
                    "title": "Have they maintained a 3.0 GPA or better?",
                    "type": "string",
                    "default": null
                  },
                  "addDriver": {
                    "title": "Add another driver?",
                    "type": "string",
                    "default": null
                  }
                }
              }
            }
          },
          "form": [
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
              "items": [
                {
                  //<!-- Gender -->
                  "key": "driver.Gender",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
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
                  //<!-- Relationship to Insured -->
                  "key": "driver.RelationToInsured",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "RelationshipToInsuredCode",
                    "map": {valueProperty: "Name", nameProperty: "Description"}
                  }
                },
                {
                  //<!-- License Status -->
                  "key": "driver.LicenseStatus",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "DriversLicenseStatusType",
                    "map": {valueProperty: "Name", nameProperty: "Description"}
                  }
                },
                {
                  //<!-- Have insurance -->
                  "key": "driver.CurrentlyInsured",
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
                  //<!-- Drives Listed Vehicles -->
                  "key": "driver.DrivesAnyListedVehicles",
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
                  "type": "section",
                  "title": "Additional Questions",
                  "collapseCondition": "(driver.LicenseStatus == 'Valid' || driver.LicenseStatus == 'Restricted' " +
                  "|| driver.LicenseStatus == 'Expired' || driver.LicenseStatus == 'Foreign' || driver.LicenseStatus" +
                  " == 'Suspended' || driver.LicenseStatus == 'Permit') && (driver.RelationToInsured == 'Spouse' || " +
                  "driver.CurrentlyInsured == false || (driver.CurrentlyInsured == true && driver.DrivesAnyListedVehicles == true))",
                  "items": [
                    {
                      "key": "driver.DateOfBirth",
                      "type": "el_inputMask",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Birth date",
                      "directives": "[ { 'ui-mask' : '99-99-9999' }, {'valid_date':''}, {'min-age':'15'}, {'max-age':'98'} ]",
                      "condition": "ShowIf(ngform, 'driver','showAdditionalDriverQuestions')",
                      "requiredCondition": "true"

                    },
                    {
                      key: "driver.AgeFirstLicensed",
                      placeholder: "",
                      title: "Age first licensed",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test",
                      validationMessage: {
                        "notANumber": "Please enter a valid first licensed age.",
                        "ageLowerRange": "Sorry, first licensed age cannot be lower than 14 years.",
                        "ageUpperRange": "Sorry, first licensed age cannot exceed driver's current age."
                      },
                      "condition": "ShowIf(ngform, 'driver','showAdditionalDriverQuestions')",
                      "requiredCondition": "true"
                    },
                    {
                      //<!-- Marital Status -->
                      "key": "driver.MaritalStatus",
                      "type": "inputOrString",
                      "inputType": "select",
                      //"displayString": "driver"
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "onChange": "onChange(modelValue, 'driver', 'resolveGoodStudentDiscount')",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "MaritalStatus",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      },
                      "condition": "ShowIf(ngform, 'driver','showAdditionalDriverQuestions')",
                      "requiredCondition": "true"
                    },
                    {
                      //<!-- Marital Rank -->
                      "key": "driver.MilitaryRank",
                      "type": "elephantSelectPicker",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "onChange": "onChange(modelValue, 'driver', 'resolveGoodStudentDiscount')",
                      "options": {
                        "callback": "getLookup",
                        "lookupType": "MaritalStatus",
                        "map": {valueProperty: "Name", nameProperty: "Description"}
                      },
                      "condition": "driver.EmploymentStatus == 'Military' || driver.EmploymentStatus == 'RetiredMilitary'",
                      "requiredCondition": "true"
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
      .state('spouse', {
        url: '/spouse/{driverId}',
        templateUrl: 'app/quote/quote.html',
        controller: 'QuoteController',
        resolve: {
          modelData: function ($q, $stateParams, dataModelService) {
            var driverId = $stateParams.driverId;
            var fun = dataModelService.getModels({vehicleId: null, driverId: driverId, spouse: true});
            var deferred = $q.defer();
            deferred.resolve(fun);
            return deferred.promise;
          }
        },
        data: {
          "schema": {
            "type": "object",
            "properties": {
              "driver": {
                "type": "object",
                "required": [
                  "FirstName",
                  "LastName",
                  "Gender",
                  "LicenseStatus",
                  "HighestLevelOfEducation",
                  "EmploymentStatus",
                  "Occupation",
                  "CurrentStudentEnrollment",
                  "MilitaryBranch"
                ],
                "properties": {
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
                  "Gender": {
                    "title": "Gender",
                    "type": "string",
                    "default": null
                  },
                  "RelationToInsured": {
                    "Relationship to Insured": "Gender",
                    "type": "string",
                    "default": null
                  },
                  "LicenseStatus": {
                    "title": "Current license status",
                    "type": "string",
                    "default": null
                  },
                  "DateOfBirth": {
                    "title": "Date of birth",
                    "format": "inputMask",
                    "type": "string",
                    "default": null
                  },
                  "AgeFirstLicensed": {
                    "title": "Age first licensed",
                    "type": "string",
                    "default": null
                  },
                  "HighestLevelOfEducation": {
                    "title": "Education completed",
                    "type": "string",
                    "default": null
                  },
                  "EmploymentStatus": {
                    "title": "Employment status",
                    "type": "string",
                    "default": null
                  },
                  "MilitaryBranch": {
                    "title": "Branch",
                    "type": "string",
                    "default": null
                  },
                  "MilitaryStatus": {
                    "title": "Rank",
                    "type": "string",
                    "default": null
                  },
                  "Occupation": {
                    "title": "Occupation",
                    "type": "string",
                    "default": null
                  },
                  "CurrentStudentEnrollment": {
                    "title": "Currently attend",
                    "type": "string",
                    "default": null
                  }
                }
              }
            }
          },
          "form": [
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
                    directives: "[ { 'ucase-first' : '' } ]",
                    validationMessage: {
                      "302": "Please enter a first name.",
                      "202": "First name is in an invalid format."
                    }
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
                    directives: "[ { 'ucase-first' : '' } ]",
                    validationMessage: {
                      "302": "Please enter a last name.",
                      "202": "Last name is in an invalid format."
                    }
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
              "items": [
                {
                  //<!-- Gender -->
                  "key": "driver.Gender",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
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
                  ],
                  validationMessage: {
                    "302": "Please choose a gender."
                  }
                },
                {
                  "key": "driver.RelationToInsured",
                  "type": "template",
                  "template": "<div class='form-group'><label class='control-label form-left'>Relationship to policyholder</label>" +
                  "<div class='control-label form-right'>{{ model['driver']['RelationToInsured'] }}</div></div>"
                },
                {
                  //<!-- License Status -->
                  "key": "driver.LicenseStatus",
                  "type": "select",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "titleMap": [
                    { "value":null, "name": "Select One" },
                    { "value":"1", "name": "Valid" },
                    { "value":"2", "name":"Expired" },
                    { "value":"3", "name":"Unlicensed" },
                    { "value":"4", "name": "Foreign" },
                    { "value":"5", "name":"LearnersPermit" },
                    { "value":"6", "name":"Surrendered" },
                    { "value":"7", "name":"Suspended" },
                    { "value":"8", "name":"Restricted" },
                    { "value":"9", "name":"Revoked" }
                  ],
                  validationMessage: {
                    "302": "Please choose a license status."
                  }
                },
                //{
                //  "type": "template",
                //  "template": "<div class='form-group'>{{'License status is ' + model.driver.LicenseStatus}}</div>"
                //},
                {
                  "type": "el_collapse",
                  "htmlClass": "form-group",
                  condition: "model['driver']['LicenseStatus'] == '1' || model['driver']['LicenseStatus'] == '8' || model['driver']['LicenseStatus'] == '2' || model['driver']['LicenseStatus'] == '4' || model['driver']['LicenseStatus'] == '7' || model['driver']['LicenseStatus'] == '5'",
                  "items": [
                    {
                      "key": "driver.DateOfBirth",
                      "type": "el_inputMask",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "title": "Birth date",
                      "directives": "[ { 'ui-mask' : '99-99-9999' }, {'valid_date':''}, {'min-age':'15'}, {'max-age':'98'} ]",
                      "requiredCondition": "true",
                      validationMessage: {
                        "required": "Please enter a birthdate.",
                        "datetime": "Please enter a valid date.",
                        "agerange": "Driver age must be between 16 and 98."
                      }
                    },
                    {
                      key: "driver.AgeFirstLicensed",
                      placeholder: "",
                      title: "Age first licensed",
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "htmlClass": "test",
                      validationMessage: {
                        "notANumber": "Please enter a valid first licensed age.",
                        "ageLowerRange": "Sorry, first licensed age cannot be lower than 15 years.",
                        "ageUpperRange": "Sorry, first licensed age cannot exceed driver's current age."
                      },
                      "requiredCondition": "true"
                    }
                  ]
                },
                {
                  //<!-- Education Level -->
                  "key": "driver.HighestLevelOfEducation",
                  "type": "select",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "titleMap": [
                    { "value":null, "name": "Select One" },
                    { "value":"1", "name": "Lower than High School" },
                    { "value":"2", "name": "High School/GED" },
                    { "value":"3", "name": "Vocational" },
                    { "value":"4", "name": "Associates" },
                    { "value":"5", "name": "Bachelors" },
                    { "value":"6", "name": "Masters" },
                    { "value":"7", "name": "Doctorate" }
                  ],
                  validationMessage: {
                    "302": "Please choose an education level."
                  }
                },
                {
                  //<!-- Employment Status -->
                  "key": "driver.EmploymentStatus",
                  "type": "select",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "onChange": "onChange(modelValue, 'driver', 'resolveEmploymentStatus')",
                  "titleMap": [
                    { "value":null, "name": "Select One" },
                    { "value":"1", "name": "Employed" },
                    { "value":"2", "name": "Homemaker" },
                    { "value":"3", "name": "Retired" },
                    { "value":"4", "name": "Full-time student" },
                    { "value":"5", "name": "Unemployed" },
                    { "value":"6", "name": "Military - active" },
                    { "value":"7", "name": "Military - retired" }
                  ],
                  validationMessage: {
                    "302": "Please choose an employment status."
                  }
                },
                {
                  //<!-- Military Branch -->
                  "key": "driver.MilitaryBranch",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "onChange": "onChange(modelValue, 'driver', 'resetMilitaryStatus')",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "MilitaryBranch",
                    "map": {valueProperty: "Value", nameProperty: "Description"}
                  },
                  "condition": "model['driver']['EmploymentStatus'] == '6' || model['driver']['EmploymentStatus'] == '7'",
                  validationMessage: {
                    "302": "Please choose a military branch."
                  }
                },
                {
                  //<!-- Military Rank -->
                  "key": "driver.MilitaryStatus",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "watcher": "model['driver']['MilitaryBranch']",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "MilitaryServiceType",
                    "map": {valueProperty: "Value", nameProperty: "Description"}
                  },
                  "condition": "model['driver']['MilitaryBranch'] && model['driver']['EmploymentStatus'] == '6' || model['driver']['EmploymentStatus'] == '7'",
                  "requiredCondition": "true",
                  validationMessage: {
                    "302": "Please choose a military rank."
                  }
                },
                {
                  //<!-- Occupation -->
                  "key": "driver.Occupation",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "Occupation",
                    "map": {valueProperty: "Value", nameProperty: "Description"}
                  },
                  "condition": "model['driver']['EmploymentStatus'] == '1' || model['driver']['EmploymentStatus'] == '3'",
                  validationMessage: function(ctx) {
                    return "Please enter an occupation";
                  }
                },
                {
                  //<!-- Currently Attending School -->
                  "key": "driver.CurrentStudentEnrollment",
                  "type": "elephantSelectPicker",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50",
                  "onChange": "onChange(modelValue, 'driver', 'resolveEmploymentStatus')",
                  "options": {
                    "callback": "getLookup",
                    "lookupType": "StudentEnrollmentType",
                    "map": {valueProperty: "Name", nameProperty: "Description"}
                  },
                  "condition": "model['driver']['EmploymentStatus'] == '4'",
                  "requiredCondition": "true",
                  validationMessage: {
                    "302": "Your answer is required."
                  }
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
      .state('vehicleOverview', {
        url: '/vehicle-overview',
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
            "properties": {
              "el_vehicleOverview": {
                "type": "string",
                "format": "el_vehicleOverview"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_vehicleOverview"
            },
            {
              key: "el_navSummary"
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
      .state('incidentOverview', {
        url: '/incident-overview',
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
        data:{
          "schema": {
            "type": "object",
            "properties": {
              "el_incidentOverview": {
                "type": "string",
                "format": "el_incidentOverview"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_incidentOverview"
            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })
      .state('incidents', {
        url: '/driver-history',
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
            "title": "Comment",
            "properties": {
              "quoteIntent": {
                type: "object",
                "properties": {
                  "HasIncidents": {
                    "title": "Have any drivers had any accidents, violations or claims during the past 5 years?",
                    "type": "boolean",
                    default: null
                  },
                  "HasConvictions": {
                    "title": "Have any drivers been convicted of any non-traffic related crimes in the past 7 years?",
                    "type": "string",
                    default: null
                  },
                  "AdditionalIncidents": {
                    "title": "More incidents to add?",
                    "type": "boolean",
                    default: null
                  }
                },
                "required": [
                  "HasIncidents",
                  "HasConvictions"
                ]
              },
              "incidents": {
                "notitle": true,
                "type": "string",
                "format": "incidentHistory",
                default: null
              }
            }
          },
          "form": [
            {
              "key": "quoteIntent.HasIncidents",
              "type": "radiobuttons",
              "disableSuccessState": true,
              "labelHtmlClass": "float-left",
              "fieldHtmlClass": "float-right form-50",
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
              "type": "help",
              "helpvalue": "<hr/>"
            },
            {
              "key": "quoteIntent.HasConvictions",
              "type": "radiobuttons",
              "disableSuccessState": true,
              "labelHtmlClass": "float-left",
              "fieldHtmlClass": "float-right form-50",
              "titleMap": [
                {
                  "value": "Yes",
                  "name": "Yes"
                },
                {
                  "value": "No",
                  "name": "No"
                },
                {
                  "value": "Unsure",
                  "name": "Unsure"
                }
              ]
            },
            {
              "key": "incidents",
              "condition": "modelData.quoteIntent.HasIncidents == true"
            },
            {
              "key": "quoteIntent.AdditionalIncidents",
              "condition": "modelData.quoteIntent.HasIncidents == true",
              "type": "radiobuttons",
              "disableSuccessState": true,
              "labelHtmlClass": "float-left",
              "fieldHtmlClass": "float-right form-50",
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
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              onClick: "submitForm(ngform)"
            }
          ]
        }
      })
      .state('additionalHistory', {
        url: '/additional-history',
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
            "title": "Comment",
            "properties": {
              "quoteIntent": {
                type: "object",
                "properties": {
                  "Misdemeanors": {
                    "title": "Number of misdemeanors",
                    "type": "string"
                  },
                  "Felonies": {
                    "title": "Number of felonies",
                    "type": "string"
                  }
                },
                "required": []
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
                    "key": "quoteIntent.Misdemeanors",
                    "type": "select",
                    "disableSuccessState": true,
                    "labelHtmlClass": "float-left",
                    "fieldHtmlClass": "float-right form-50",
                    "titleMap": [
                      {
                        "value": "0",
                        "name": "0"
                      },
                      {
                        "value": "1",
                        "name": "1"
                      },
                      {
                        "value": "2",
                        "name": "2"
                      },
                      {
                        "value": "3+",
                        "name": "3+"
                      },
                      {
                        "value": "Unsure",
                        "name": "Unsure"
                      }
                    ]
                  },
                    {
                      "key": "quoteIntent.Felonies",
                      "type": "select",
                      "disableSuccessState": true,
                      "labelHtmlClass": "float-left",
                      "fieldHtmlClass": "float-right form-50",
                      "titleMap": [
                        {
                          "value": "0",
                          "name": "0"
                        },
                        {
                          "value": "1",
                          "name": "1"
                        },
                        {
                          "value": "2",
                          "name": "2"
                        },
                        {
                          "value": "3+",
                          "name": "3+"
                        },
                        {
                          "value": "Unsure",
                          "name": "Unsure"
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
      .state('driverAssignment', {
        url: '/driver-assignment',
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
        data:{
          "schema": {
            "type": "object",
            "properties": {
              "el_driverAssignment": {
                "type": "string",
                "format": "el_driverAssignment"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_driverAssignment"
            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })
      .state('discounts', {
        url: '/discounts',
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
            "properties": {
              "drivers": {
                "type": "object",
                "properties": {
                  "Email": {
                    "type": "string",
                    "minLength": 5
                  },
                  "EmailAddressConfirm": {
                    "type": "string",
                    "format": "inputMask",
                    "minLength": 5
                  }
                }
              }
            }

          },
          "form": [
            {
              "type": "email",
              "key": "driver.EmailAddress",
              "labelHtmlClass": "float-left",
              "fieldHtmlClass": "float-right form-50",
              "placeholder": "Email address",
              "title": "Email"
            },
            {
              "type": "el_inputMask",
              "key": "driver.EmailAddressConfirm",
              "labelHtmlClass": "float-left",
              "fieldHtmlClass": "float-right form-50",
              "placeholder": "Confirm email address",
              "title": "Confirm email address",
              "directives": "[ { 'confirm-email' : '' } ]"


            },
            {
              "type": "button",
              "style": "btn-info",
              "title": "OK",
              "onClick": "submitForm(ngform)"
            },
            {
              "key": "el_navSummary"
            },
          ]
        }
      })
      .state('quote', {
        url: '/quote',
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
            "properties": {
              "el_quotePrice": {
                "type": "string",
                "format": "el_quotePrice"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_quotePrice"
            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })
      .state('confirmDriver', {
        url: '/confirm-driver',
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
            "properties": {
              "el_repeater": {
                "type": "string",
                "format": "el_repeater"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_repeater",
              "repeater": "Drivers",
              "heading": "getFullName",
              "properties": [
                {
                  "label":"License Number",
                  "name": "LicenseNumber",
                  "type": "input",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50"
                }
              ]

            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })
      .state('confirmVehicle', {
        url: '/confirm-vehicle',
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
            "properties": {
              "el_repeater": {
                "type": "string",
                "format": "el_repeater"
              },
              "el_navSummary": {
                type: 'string',
                format: 'el_navSummary'
              }
            }
          },
          "form": [
            {
              "key": "el_repeater",
              "repeater": "Vehicles",
              "heading": "getMakeModel",
              "properties": [
                {
                  "label":"Vin Number",
                  "name": "Vin",
                  "type": "input",
                  "labelHtmlClass": "float-left",
                  "fieldHtmlClass": "float-right form-50"
                }
              ]

            },
            {
              key: "el_navSummary"
            }
          ]
        }
      })

    $urlRouterProvider.otherwise('/postal-code');
  }

})();
