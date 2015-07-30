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

        //$scope.selectedIcon = 'Globe';
        //$scope.selectedIcons = ['Globe','Heart'];
        //$scope.icons = [
        //    {'value':'Gear','label':'<i class=\'fa fa-gear\'></i> Gear'},
        //    {'value':'Globe','label':'<i class=\'fa fa-globe\'></i> Globe'},
        //    {'value':'Heart','label':'<i class=\'fa fa-heart\'></i> Heart'},
        //    {'value':'Camera','label':'<i class=\'fa fa-camera\'></i> Camera'}];

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


    }
})();
