/**
 * Created by jholloman on 10/7/2015.
 */
'use strict';
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elDriverAssignment = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'el_driverAssignment') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'driverAssignment';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elDriverAssignment);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'driverAssignment',
        'app/directives/decorators/driverAssignment/el_driverAssignment.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'driverAssignment',
        'app/directives/decorators/driverAssignment/el_driverAssignment.html'
      );

    }])
  .controller('driverAssignmentCtrl', ['$scope', 'dataModelService', '$location', 'NavigationService', '$q',
    function($scope, dataModelService, $location, NavigationService, $q){

    $scope.driverAssignmentSummary = {
      drivers: [],
      vehicles: dataModelService.getAllVehicles(),
      assignedList: dataModelService.getRatedDrivers(),
      loadingMessage: 'loadingAssignments',
      getDriverFailedCalls: false,
      formSubmitted: null,
      validateForm: function(isValid){
        var assignmentObj = this;
        this.formSubmitted = true;
        if(isValid){
          if($scope.driverAssignmentForm.driverAssignment.$modelValue === null){
            $scope.driverAssignmentForm.driverAssignment.$setValidity('required', false);
          }else {
            $scope.driverAssignmentForm.driverAssignment.$setValidity('required', true);
            dataModelService.saveMultipleDrivers(this.assignedList);
            NavigationService.getNextStep()
          }
        }
        console.log('working')
      }
    }
  }])
