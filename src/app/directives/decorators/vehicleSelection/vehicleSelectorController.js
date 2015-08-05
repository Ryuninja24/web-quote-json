/**
 * Created by gabello on 7/29/2015.
 */
angular.module('schemaForm')
    .controller('VehicleSelectorController', ['$scope', '$q', 'vinIsoDataService', function ($scope, $q, vinIsoDataService) {
        "use strict";

        $scope.$on('schemaFormValidate', function() {
            $scope.vehicleSummary.formSubmitted = true;
        });

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

        var getVinIsoMakes = function (year) {
            return vinIsoDataService.getVinIsoMakes(year);
        };

        var getVinIsoVehicleStuff = function (href) {
            return vinIsoDataService.getVinIsoVehicleData(href);
        };

        var fillMakes = function (vehicleYear) {
            var newResDeferred = $q.defer();
            getVinIsoMakes(vehicleYear).then(function (yearResponse) {
                var fun = yearResponse.data.YearMakeModelRecords;
                _.each(yearResponse.data.YearMakeModelRecords, function (item) {
                    if (!item.DoNotInsure) {
                        $scope.vehicleMakes.push({value:item.MakeId.toString(), label:item.Links[0].Rel.toString(), item:item});
                    }
                });
                newResDeferred.resolve(true);
            }, function (error) {
                errorService.showModalError('VinIsoVehicle: VinIso data service call to retrieve makes failed with error', error);
                newResDeferred.reject(false);
            });
            return newResDeferred.promise;
        };

        var fillModels = function (href, collection) {
            var newResDeferred = $q.defer();
            getVinIsoVehicleStuff(href).then(function (makeResponse) {
                _.each(makeResponse.data.YearMakeModelRecords, function (item) {
                    if (!item.DoNotInsure) {
                        collection.push({value:item.ModelId.toString(), label:item.Links[0].Rel.toString(), item:item});
                    }
                });
                newResDeferred.resolve(true);
            }, function (error) {
                errorService.showModalError('VinIsoVehicle: VinIso data service call to retrieve vehicle items failed with error', error);
                newResDeferred.reject(false);
            });
            return newResDeferred.promise;
        };

        var fillBodyStyles = function (href, collection) {
            var newResDeferred = $q.defer();
            getVinIsoVehicleStuff(href).then(function (makeResponse) {
                _.each(makeResponse.data.YearMakeModelRecords, function (item) {
                    if (!item.DoNotInsure) {
                        collection.push({value:item.YearStyleId.toString(), label:item.Links[0].Rel.toString(), item:item});
                    }
                });
                newResDeferred.resolve(true);
            }, function (error) {
                errorService.showModalError('VinIsoVehicle: VinIso data service call to retrieve vehicle items failed with error', error);
                newResDeferred.reject(false);
            });
            return newResDeferred.promise;
        };

        $scope.vehicle = {};

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
            formSubmitted:false
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

            if (!$scope.vehicleForm.vehicleYear.$modelValue) {
                return;
            }
            $scope.initializeScope();

            //clear out any exotic messages
            if ($scope.vehicleSummary.vehicleDNQs && $scope.vehicleSummary.vehicleDNQs.length > 0) {
                $scope.vehicleSummary.vehicleDNQs = [];
            }

            if ($scope.vehicleForm.vehicleYear.$modelValue && $scope.vehicleForm.vehicleYear.$modelValue.length === 4) {
                $scope.vehicleForm.vehicleYear.$setValidity('invalidYear', true);

                if ($scope.vehicleForm.vehicleYear.$modelValue >= getMinVehicleYear() && $scope.vehicleForm.vehicleYear.$modelValue<= getMaxVehicleYear()) {
                    $scope.vehicleForm.vehicleYear.$setValidity('vehicleAge', true);
                    $scope.alerts = [];
                       fillMakes($scope.vehicleForm.vehicleYear.$modelValue);
                }
                else if ($scope.vehicleForm.vehicleYear.$modelValue < getMinVehicleYear()) {
                    $scope.vehicleForm.vehicleYear.$setValidity('vehicleAge', false);
                    $scope.alerts.push({msg: String.format('Sorry, we do not insure pre-{0} vehicles online. Please call {1} to continue your quote.', getMinVehicleYear(), elephantContactInfo.exoticVehiclePhone)});
                }
                else {
                    $scope.vehicleForm.vehicleYear.$setValidity('vehicleAge', false);
                    $scope.alerts.push({msg: String.format('Please select a year between {0} and {1}.', getMinVehicleYear(), getMaxVehicleYear())});
                }
            }
        };

        $scope.setInsideModel = function(someValue){
          var fun = someValue;
        };

        $scope.getVinIsoModels = function (makeId) {
            $scope.vehicleModels = [];
            $scope.vehicleBodyStyles = [];
            $scope.vehicle.Model = null;
            $scope.vehicle.ModelId = null;
            $scope.vehicle.YearStyleId = null;
            $scope.vehicle.Vin = null;
            if (!makeId) {
                return;
            }
            var makeObj = _.findWhere($scope.vehicleMakes, {value: makeId});
            if (makeObj) {
                $scope.vehicle.Make = makeObj.label;
                $scope.vehicle.ModelId = null;
                $scope.vehicle.YearStyleId = null;
                fillModels(makeObj.item.Links[0].Href, $scope.vehicleModels);
            }
        };

        $scope.getVinIsoBodyStyles = function (parentScope, modelId) {
            $scope.vehicleBodyStyles = [];
            $scope.vehicle.YearStyleId = null;
            $scope.vehicle.Vin = null;
            if (!modelId) {
                return;
            }
            var modelObj = _.findWhere($scope.vehicleModels, {value: modelId});
            if (modelObj) {
                $scope.vehicle.Model = modelObj.label;
                fillBodyStyles(modelObj.item.Links[0].Href, $scope.vehicleBodyStyles).then(function(response){
                    var fun = response;
                    if($scope.vehicleBodyStyles && $scope.vehicleBodyStyles.length == 1){
                        parentScope.vehicle.Style = $scope.vehicleBodyStyles[0].item.Links[0].Rel;
                        parentScope.vehicle.YearStyleId = $scope.vehicleBodyStyles[0].value;
                    }
                });
            }
        };

        $scope.saveVinIsoBodyStyle = function (parentScope, bodyStyleId) {
            if (!bodyStyleId) {
                return;
            }
            var bodyStyleObj = _.findWhere($scope.vehicleBodyStyles, {YearStyleId: bodyStyleId});
            if (bodyStyleObj) {
                parentScope.vehicle.Style = bodyStyleObj.Links[0].Rel;
            }
        };
    }]);