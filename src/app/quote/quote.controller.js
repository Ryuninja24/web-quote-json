/**
 * Created by gabello on 7/27/2015.
 */
(function() {
    'use strict';

    angular
        .module('webQuoteJson')
        .controller('QuoteController', QuoteController);

    /** @ngInject */
    function QuoteController($scope, $state) {

        $scope.schema = $state.current.data.schema;
        $scope.form = $state.current.data.form;

        $scope.pretty = function(){
            return typeof $scope.modelData  === 'string' ? $scope.modelData  : JSON.stringify($scope.modelData , undefined, 2);
        };

        $scope.submitForm = function(form) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');
            // Then we check if the form is valid
            if (form.$valid) {
                alert('You did it!');
            }
        };
        $scope.modelData  = {};

        //$scope.schema = {
        //    "type": "object",
        //    "required": [
        //        "name",
        //        "shoesizeLeft"
        //    ],
        //    "properties": {
        //        "name": {
        //            "title": "Name",
        //            "description": "Gimme yea name lad",
        //            "type": "string",
        //            "pattern": "^[^/]*$",
        //            "minLength": 2
        //        },
        //        "invitation": {
        //            "type": "string",
        //            "format": "html",
        //            "title": "Invitation Design",
        //            "description": "Design the invitation in full technicolor HTML"
        //        },
        //        "favorite": {
        //            "title": "Favorite",
        //            "type": "string",
        //            "enum": [
        //                "undefined",
        //                "null",
        //                "NaN"
        //            ]
        //        },
        //        "shoesizeLeft": {
        //            "title": "Shoe size (left)",
        //            "default": 42,
        //            "type": "number"
        //        },
        //        "shoesizeRight": {
        //            "title": "Shoe size (right)",
        //            "default": 42,
        //            "type": "number"
        //        },
        //        "attributes": {
        //            "type": "object",
        //            "title": "Attributes",
        //            "required": [
        //                "eyecolor"
        //            ],
        //            "properties": {
        //                "eyecolor": {
        //                    "type": "string",
        //                    "format": "color",
        //                    "title": "Eye color",
        //                    "default": "pink"
        //                },
        //                "haircolor": {
        //                    "type": "string",
        //                    "title": "Hair color"
        //                },
        //                "shoulders": {
        //                    "type": "object",
        //                    "title": "Shoulders",
        //                    "properties": {
        //                        "left": {
        //                            "type": "string",
        //                            "title": "Left"
        //                        },
        //                        "right": {
        //                            "type": "string",
        //                            "title": "Right"
        //                        }
        //                    }
        //                }
        //            }
        //        },
        //        "things": {
        //            "type": "array",
        //            "title": "I like...",
        //            "items": {
        //                "type": "string",
        //                "enum": [
        //                    "clowns",
        //                    "compiling",
        //                    "sleeping"
        //                ]
        //            }
        //        },
        //        "dislike": {
        //            "type": "array",
        //            "title": "I dislike...",
        //            "items": {
        //                "type": "string",
        //                "title": "I hate"
        //            }
        //        },
        //        "soul": {
        //            "title": "Terms Of Service",
        //            "description": "I agree to sell my undying <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>soul</a>",
        //            "type": "boolean",
        //            "default": true
        //        },
        //        "soulserial": {
        //            "title": "Soul Serial No",
        //            "type": "string"
        //        },
        //        "date": {
        //            "title": "Date of party",
        //            "type": "string",
        //            "format": "date"
        //        },
        //        "radio": {
        //            "title": "Radio type",
        //            "type": "string",
        //            "enum": [
        //                "Transistor",
        //                "Tube"
        //            ]
        //        },
        //        "radio2": {
        //            "title": "My Second Radio",
        //            "type": "string",
        //            "enum": [
        //                "Transistor",
        //                "Tube"
        //            ]
        //        },
        //        "radiobuttons": {
        //            "type": "string",
        //            "enum": [
        //                "Select me!",
        //                "No me!"
        //            ]
        //        }
        //    }
        //};
        //
        //$scope.form = [
        //    {
        //        "type": "fieldset",
        //        "title": "Stuff",
        //        "items": [
        //            {
        //                "type": "tabs",
        //                "tabs": [
        //                    {
        //                        "title": "Simple stuff",
        //                        "items": [
        //                            {
        //                                "key": "name",
        //                                "placeholder": "Check the console",
        //                                "onChange": "log(modelValue)",
        //                                "feedback": "{'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-star': !hasSuccess() }"
        //                            },
        //                            {
        //                                "key": "favorite",
        //                                "feedback": false
        //                            }
        //                        ]
        //                    },
        //                    {
        //                        "title": "More stuff",
        //                        "items": [
        //                            "attributes.eyecolor",
        //                            "attributes.haircolor",
        //                            {
        //                                "key": "attributes.shoulders.left",
        //                                "title": "Left shoulder",
        //                                "description": "This value is copied to attributes.shoulders.right in the model",
        //                                "copyValueTo": [
        //                                    "attributes.shoulders.right"
        //                                ]
        //                            },
        //                            {
        //                                "key": "shoesizeLeft",
        //                                "feedback": false,
        //                                "copyValueTo": [
        //                                    "shoesizeRight"
        //                                ]
        //                            },
        //                            {
        //                                "key": "shoesizeRight"
        //                            },
        //                            {
        //                                "key": "invitation",
        //                                "tinymceOptions": {
        //                                    "toolbar": [
        //                                        "undo redo| styleselect | bold italic | link image",
        //                                        "alignleft aligncenter alignright"
        //                                    ]
        //                                }
        //                            },
        //                            "things",
        //                            "dislike"
        //                        ]
        //                    }
        //                ]
        //            }
        //        ]
        //    },
        //    {
        //        "type": "help",
        //        "helpvalue": "<hr>"
        //    },
        //    "soul",
        //    {
        //        "type": "conditional",
        //        "condition": "modelData.soul",
        //        "items": [
        //            {
        //                "key": "soulserial",
        //                "placeholder": "ex. 666"
        //            }
        //        ]
        //    },
        //    {
        //        "key": "date",
        //        "minDate": "2014-06-20"
        //    },
        //    {
        //        "key": "radio",
        //        "type": "radios",
        //        "titleMap": [
        //            {
        //                "value": "Transistor",
        //                "name": "Transistor <br> Not the tube kind."
        //            },
        //            {
        //                "value": "Tube",
        //                "name": "Tube <br> The tube kind."
        //            }
        //        ]
        //    },
        //    {
        //        "key": "radio2",
        //        "type": "radios-inline",
        //        "titleMap": [
        //            {
        //                "value": "Transistor",
        //                "name": "Transistor <br> Not the tube kind."
        //            },
        //            {
        //                "value": "Tube",
        //                "name": "Tube <br> The tube kind."
        //            }
        //        ]
        //    },
        //    {
        //        "key": "radiobuttons",
        //        "style": {
        //            "selected": "btn-success",
        //            "unselected": "btn-default"
        //        },
        //        "type": "radiobuttons",
        //        "notitle": true
        //    },
        //    {
        //        "type": "actions",
        //        "items": [
        //            {
        //                "type": "submit",
        //                "style": "btn-info",
        //                "title": "Do It!"
        //            },
        //            {
        //                "type": "button",
        //                "style": "btn-danger",
        //                "title": "Noooooooooooo",
        //                "onClick": "sayNo()"
        //            }
        //        ]
        //    }
        //];


    }
})();
