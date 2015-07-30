/**
 * Created by gabello on 7/29/2015.
 */
angular.module('schemaForm')
    .controller('VehicleSelectorController', ['$scope', 'vinIsoDataService', function ($scope, vinIsoDataService) {

        var initialize = function (scopeInstance) {
            scopeInstance.vehicleMakes = [];
            scopeInstance.vehicleModels = [];
            scopeInstance.vehicleBodyStyles = [];
            scopeInstance.alerts = [];

            if (scopeInstance.vehicle) {
                scopeInstance.vehicle.Make = null;
                scopeInstance.vehicle.MakeId = null;
                scopeInstance.vehicle.Model = null;
                scopeInstance.vehicle.ModelId = null;
                scopeInstance.vehicle.YearStyleId = null;
                scopeInstance.vehicle.Vin = null;
            }
        };

        var getMinVehicleYear = function(){
            return _.min($scope.vehicleSummary.years);
        };

        var getMaxVehicleYear = function(){
            return _.max($scope.vehicleSummary.years);
        };

        $scope.init = function (object, form) {
            $scope.vehicleSummary.vehicleForm = object;
        };

        $scope.vehicleSummary = {
            removeCall: 'removingVehicle',
            saveCall: 'savingVehicle',
            loadingCall: 'loadingVehicles',
            vehicleDNQs: [],
            currentYear: new Date().getFullYear(),
            vehicleEdit: false,
            vehicleToEdit: null,
            useNewVinIso: true,
            years: [],
            yearsDisabled:true,
            vehicleForm:null
        };

        vinIsoDataService.getVinIsoYears().then(function(yearData) {
            var years = $scope.vehicleSummary.years ;
            if(!years || years.length < 1) {
                _.each(yearData, function(yearItem){
                    $scope.vehicleSummary.years.push(yearItem.Year);
                });
            }
            $scope.vehicleSummary.yearsDisabled = false;
        });

        $scope.initializeScope = function () {
            initialize($scope);
        };

        $scope.formSubmitted = false;

        $scope.updateYear = function () {

            if (!$scope.vehicle.Year) {
                return;
            }
            $scope.initializeScope();

            //clear out any exotic messages
            if ($scope.vehicleSummary.vehicleDNQs && $scope.vehicleSummary.vehicleDNQs.length > 0) {
                $scope.vehicleSummary.vehicleDNQs = [];
            }

            if ($scope.vehicle.Year && $scope.vehicle.Year.length == 4) {
                $scope.vehicleSummary.vehicleForm.vehicleYear.$setValidity('invalidYear', true);

                if ($scope.vehicle.Year >= getMinVehicleYear() && $scope.vehicle.Year <= getMaxVehicleYear()) {
                    $scope.vehicleSummary.vehicleForm.vehicleYear.$setValidity('vehicleAge', true);
                    $scope.alerts = [];
                    //if ($scope.vehicleSummary.useNewVinIso) {
                    //    fillMakes($scope.vehicle.Year);
                    //} else {
                    //    getMakes(vehicleDataService, $scope.vehicle.Year).then(function (yearResponse) {
                    //        _.each(yearResponse.data, function (yearItem) {
                    //            $scope.vehicleMakes.push(yearItem.Value);
                    //        });
                    //    }, function (error) {
                    //        errorService.showModalError('VehicleCtrl: Vehicle data service call to retrieve makes failed with error', error);
                    //    });
                    //}
                }
                else if ($scope.vehicle.Year < getMinVehicleYear()) {
                    $scope.vehicleSummary.vehicleForm.vehicleYear.$setValidity('vehicleAge', false);
                    $scope.alerts.push({msg: String.format('Sorry, we do not insure pre-{0} vehicles online. Please call {1} to continue your quote.', quoteDataService.getMinVehicleYear(), elephantContactInfo.exoticVehiclePhone)});
                }
                else {
                    $scope.vehicleSummary.vehicleForm.vehicleYear.$setValidity('vehicleAge', false);
                    $scope.alerts.push({msg: String.format('Please select a year between {0} and {1}.', quoteDataService.getMinVehicleYear(), quoteDataService.getMaxVehicleYear())});
                }
            }
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