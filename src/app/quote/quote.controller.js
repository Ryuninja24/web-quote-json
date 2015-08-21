/**
 * Created by gabello on 7/27/2015.
 */
(function() {
  'use strict';

  angular
    .module('webQuoteJson')
    .controller('QuoteController', QuoteController);


    function QuoteController($scope, $state, NavigationService, dataModelService, modelData) {
      $scope.isCollapsed = false;
      $scope.schema = $state.current.data.schema;
      $scope.form = $state.current.data.form;
      $scope.modelData = modelData;
      //$scope.modelData = {};

      $scope.masterModel = dataModelService.getQuoteModel();

      $scope.prettyMaster = function () {
        return typeof $scope.masterModel === 'string' ? $scope.masterModel : JSON.stringify($scope.masterModel, undefined, 2);
      };

      //$scope.prettyMaster = function () {
      //  return typeof modelData === 'string' ? modelData : JSON.stringify(modelData, undefined, 2);
      //};

      $scope.pretty = function () {
        return typeof $scope.modelData === 'string' ? $scope.modelData : JSON.stringify($scope.modelData, undefined, 2);
      };

      $scope.submitForm = function (form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        var data = {};
        angular.forEach(form, function (value, key) {
          if (typeof value === 'object' && value.hasOwnProperty('$modelValue'))
            data[key] = value.$modelValue;
        });

        var modelElements = dataModelService.validateModelData($scope.modelData);

        // Then we check if the form is valid
        if (form.$valid) {
          dataModelService.saveModelData($scope.modelData);
          NavigationService.getNextStep($scope.modelData, null);
        }
      };


    }
})();
