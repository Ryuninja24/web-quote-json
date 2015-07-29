/**
 * Created by gabello on 7/29/2015.
 */
angular.module('schemaForm')
    .controller('StrapSelectController', ['$scope', '$http', function ($scope, $http) {
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
            //            $http.post('http://www.networknt.com/api/rs', $scope.getItem)
            //                    .success(function (result, status, headers, config) {
            //                        $scope.items = result;
            //                        console.log('items', $scope.items);
            //                    })
        };
        $scope.fetchResult();
    }]);