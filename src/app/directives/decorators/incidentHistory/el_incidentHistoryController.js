/**
 * Created by gabello on 9/15/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elephantIncidentHistorySelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'incidentHistory') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'elephantIncidentSelector';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elephantIncidentHistorySelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'elephantIncidentSelector',
        'app/directives/decorators/incidentHistory/el_incidentHistory.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'elephantIncidentSelector',
        'app/directives/decorators/incidentHistory/el_incidentHistory.html'
      );
    }]);

angular.module('schemaForm')
  .controller('IncidentSelectorController', ['$scope', 'dataModelService', 'lookupDataService', function ($scope, dataModelService, lookupDataService) {
    "use strict";


    dataModelService.prefillDrivers();

    $scope.driverInfractions = {
      trueFalseOptions: [{value: true, description: 'Yes'},{value: false, description: 'No'}],
      incidentTypes: lookupDataService.getLookups('IncidentType'),
      drivers: dataModelService.getRatedDrivers(),
      driverIncidents: dataModelService.getIncidents(),
      currentIncident: dataModelService.getIncidentById(),
      incidentSubmitted: false
    };

    //Default the DriverID for all incidents if there is only one driver
    if ($scope.driverInfractions.drivers.length == 1) {
      $scope.driverInfractions.currentIncident.DriverId = $scope.driverInfractions.drivers[0].Id;
    }


    $scope.$on('schemaFormValidate', function() {
      $scope.driverInfractions.incidentSubmitted = true;

      //Make sure the user selects an incident type
      if(!$scope.driverInfractions.currentIncident.isValidIncidentClassification()) {
        $scope.incidentForm.incidentType.$setValidity('required', false);
      }else{
        $scope.incidentForm.incidentType.$setValidity('required', true);
      }

      //Make Sure the user has selected a driver only if there are more than one otherwise it
      //gets defaulted
      if($scope.driverInfractions.drivers.length > 1) {
        if (!$scope.driverInfractions.currentIncident.isValidDriver()) {
          $scope.incidentForm.driver.$setValidity('required', false);
        } else {
          $scope.incidentForm.driver.$setValidity('required', true);
        }
      }

      //Make sure the user has entered a date
      if (!$scope.driverInfractions.currentIncident.isExistsDate()) {
        $scope.incidentForm.incidentDate.$setValidity('required', false);
      } else {
        $scope.incidentForm.incidentDate.$setValidity('required', true);
      }

      //Make sure incident date is valid
      if (!$scope.driverInfractions.currentIncident.isValidDate()) {
        $scope.incidentForm.incidentDate.$setValidity('datetime', false);
      } else {
        $scope.incidentForm.incidentDate.$setValidity('datetime', true);
      }

      //FutureDate
      if (!$scope.driverInfractions.currentIncident.isFutureDate()) {
        $scope.incidentForm.incidentDate.$setValidity('futureDate', false);
      } else {
        $scope.incidentForm.incidentDate.$setValidity('futureDate', true);
      }

      //PastDate
      if ($scope.driverInfractions.currentIncident.isPastDate()) {
        $scope.incidentForm.incidentDate.$setValidity('pastDate', true);
      } else {
        $scope.incidentForm.incidentDate.$setValidity('pastDate', false);
      }

      //Make sure the entire form is valid before saving
      if ($scope.incidentForm.$$parentForm && $scope.incidentForm.$$parentForm.$valid) {
        dataModelService.saveIncident($scope.driverInfractions.currentIncident);
      }

    });

  }]);
