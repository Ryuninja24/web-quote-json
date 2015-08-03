/**
 * Created by gabello on 7/29/2015.
 */
angular.module('schemaForm')
    .controller('StrapSelectController', ['$scope', function ($scope) {
        $scope.getItem = {
            readOnly: true
        };

        $scope.init = function (category, name) {
            console.log('init is called', category);
            $scope.getItem.category = category;
            $scope.getItem.name = name;
        };

        $scope.items = [];

        $scope.fetchResult = function () {
            $scope.items = [
                {value: 'single1', label: 'single test'},
                {value: 'single2', label: 'single funner'},
                {value: 'single3', label: 'single stuff'}
            ];
        };
        $scope.fetchResult();
    }]);