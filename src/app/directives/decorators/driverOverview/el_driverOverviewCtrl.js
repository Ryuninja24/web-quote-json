/**
 * Created by jholloman on 9/21/2015.
 */
'use strict';
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elDriverOverview = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'el_driverOverview') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'driverOverview';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elDriverOverview);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'driverOverview',
        'app/directives/decorators/driverOverview/el_driverOverview.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'driverOverview',
        'app/directives/decorators/driverOverview/el_driverOverview.html'
      );

    }])
  .controller('driverOverviewCtrl', ['$scope', 'dataModelService', '$location', 'NavigationService', function($scope, dataModelService, $location, NavigationService){
    $scope.driverOverviewSummary = {
      drivers: dataModelService.getAllDrivers(),
      formSubmitted: null
    };

    $scope.$on('schemaFormValidate', function() {
      $scope.driverOverviewSummary.formSubmitted = true;
      if(this.drivers.length == 1 && this.drivers[0].MaritalStatus == 'Married'){
        //  invalidate the form
        return $scope.driverOverviewForm.continue.$setValidity('required', false)
      }
      else if(this.drivers[0].MaritalStatus == 'Married' && !_.findWhere(this.drivers, {RelationToInsured: 'Spouse', MaritalStatus: 'Married'})){
        return $scope.driverOverviewForm.continue.$setValidity('required', false)
      }
      else{
        $scope.driverOverviewForm.continue.$setValidity('required', true);
        return NavigationService.getNextStep($scope.modelData, dataModelService, null);
      }
    });



  }]);
