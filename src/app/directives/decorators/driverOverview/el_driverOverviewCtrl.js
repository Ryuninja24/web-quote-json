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
  .controller('driverOverviewCtrl', ['$scope', 'dataModelService', '$location', function($scope, dataModelService, $location){
    //$scope.driverOverviewSummary = {
    //  drivers: dataModelService.getAllDrivers()
    //}
    //if($scope.driverOverviewSummary.drivers.length == 1 &&
    //  $scope.driverOverviewSummary.drivers[0].MaritalStatus == 'Married'){
    //  var modalData = {driver: dataModelService.createDriver()};
    //  modalData.driver.MaritalStatus = 'Married';
    //  modalData.driver.RelationToInsured = 'Spouse';
    //  dataModelService.saveDriver(modalData)
    //  return $location.path('/additional-driver/' + modalData.driver.Id);
    //}
  }])
