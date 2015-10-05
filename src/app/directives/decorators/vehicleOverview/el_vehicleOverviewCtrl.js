/**
 * Created by jholloman on 10/5/2015.
 */
'use strict';
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elVehicleOverview = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'el_vehicleOverview') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'vehicleOverview';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elVehicleOverview);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'vehicleOverview',
        'app/directives/decorators/vehicleOverview/el_vehicleOverview.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'vehicleOverview',
        'app/directives/decorators/vehicleOverview/el_vehicleOverview.html'
      );

    }])
  .controller('vehicleOverviewCtrl', ['$scope', 'dataModelService', '$location', 'NavigationService', function($scope, dataModelService, $location, NavigationService){
    $scope.vehicleOverviewSummary = {
      vehicles: dataModelService.getAllVehicles(),
      formSubmitted: null,
      validateForm: function(){
        this.formSubmitted = true;
        if($valid){
          return NavigationService.getNextStep($scope.modelData, dataModelService, null);
        }
      }
    }
  }])
