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
    .controller('PostalCodeSelectorController', ['$scope', 'geoCodeDataService', function ($scope, geoCodeDataService) {

        $scope.$on('schemaFormValidate', function() {
            $scope.postalSummary.formSubmitted = true;
        });

        $scope.postalSummary = {
            formSubmitted:false
        };

        $scope.updatePostalCode = function () {

            if (!$scope.autoZipForm.customerZip.$modelValue) {
                return;
            }

            if ($scope.autoZipForm.customerZip.$modelValue && $scope.autoZipForm.customerZip.$modelValue.length === 5) {
                geoCodeDataService.getPostalCodes($scope.autoZipForm.customerZip.$modelValue.toString()).then(function (results) {
                    //redirect if its a POBox zip code because some zips have rated POBox location
                    //if (_.contains(coveredStates, results.data.StateAbbreviation) && results.data.PostalCodeType == 'PoBox') {
                    //    callTrackerService.registerCallSuccess($scope.postalCodeSummary.callgroup);
                    //    return $window.location.href = 'http://www.elephant.com/lp/retry-zip-code?zip=' + $scope.zipCode;
                    //}

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
                    } else if (!results.data.HasRatedLocations) {
                        //callTrackerService.registerCallSuccess($scope.postalCodeSummary.callgroup);
                        ////Valid Zipcode but out of our territory
                        //ModalService.showMediaAlpha('We\'re not in your area yet', $scope.zipCode, 'Zip', 'Check out rates from these great companies')
                        //$scope.autoZipForm.customerZip.$setValidity('invalidCode', false);
                    } else {
                        //Invalid ZipCode
                        //callTrackerService.registerCallSuccess($scope.postalCodeSummary.callgroup);
                        //$scope.autoZipForm.customerZip.$setValidity('invalidCode', false);
                    }
                });
            }
        }
}]);
