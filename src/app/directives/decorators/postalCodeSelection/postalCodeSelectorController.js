/**
 * Created by gabello on 8/6/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var postalCodeSelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'postalCodeSelector') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'postalCodePicker';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(postalCodeSelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'postalCodePicker',
        'app/directives/decorators/postalCodeSelection/postalCodeSelector.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'postalCodePicker',
        'app/directives/decorators/postalCodeSelection/postalCodeSelector.html'
      );
    }]);

angular.module('schemaForm')
  .controller('PostalCodeSelectorController', ['$scope', 'geoCodeDataService', 'NavigationService', 'dataModelService',
    function ($scope, geoCodeDataService, navigationService, dataModelService) {

    $scope.postalSummary = {
      formSubmitted: false,
      zipCode: null
    };

    $scope.getZipCode = function ($valid, modelValue) {
      $scope.postalSummary.formSubmitted = true;
      $scope.autoZipForm.customerZip.$setValidity('invalidCode', true);
      //modelValue = $scope.autoZipForm.customerZip.$modelValue.toString();
      if ($valid) {

        geoCodeDataService.getPostalCodes($scope.autoZipForm.customerZip.$modelValue.toString()).then(function (results) {

          if (results.data.HasRatedLocations && results.data.RatedLocations && results.data.RatedLocations.length > 0) {
            $scope.autoZipForm.customerZip.$setValidity('invalidCode', true);

            //Save the counties by selecting unique TerritoryCodes
            var locations = _.uniq(results.data.RatedLocations, function (location) {
              return location.County;
            });

            var address = {
              City: locations[0].City,
              State: locations[0].StateAbbreviation,
              PostalCode: locations[0].PostalCode,
              AddressType: 'Physical',
              Counties: []
            };

            if (locations.length > 1) {
              _.each(locations, function (location) {
                address.Counties.push({
                  Name: location.County,
                  StateAbbreviation: location.StateAbbreviation
                })
              });
            } else {
              address.Counties.push({
                Name: locations[0].County,
                StateAbbreviation: locations[0].StateAbbreviation
              })
            }

            //$scope.$parent.$parent.$parent.model.address = address;
            dataModelService.saveAddress(address);
            navigationService.getNextStep(null, null);

          } else if (!results.data.HasRatedLocations) {
            $scope.autoZipForm.customerZip.$setValidity('invalidCode', false);
          } else {
            $scope.autoZipForm.customerZip.$setValidity('invalidCode', false);
          }
        });
      }
    }
  }]);
