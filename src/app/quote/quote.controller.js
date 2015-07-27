/**
 * Created by gabello on 7/27/2015.
 */
(function() {
    'use strict';

    angular
        .module('webQuoteJson')
        .controller('QuoteController', QuoteController);

    /** @ngInject */
    function QuoteController($scope) {
        $scope.schema = {
            type: "object",
            properties: {
                name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
                title: {
                    type: "string",
                    enum: ['dr','jr','sir','mrs','mr','NaN','dj']
                }
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.model = {};
    }
})();
