/**
 * Created by gabello on 10/8/2014.
 */
angular.module('quotes.vehicleModel', [])
  .factory('VehicleModel', ['$q', 'internalAPIDataService', 'quoteDataService',
    function ($q, internalAPIDataService, quoteDataService) {
      var clazz = function (attributes) {
        var defaults = {
          AntiTheftDevice: null,
          CostWhenNew: null,
          Coverages: [],
          CurrentOwner: null,
          CustomEquipment: null,
          DamageDescription: null,
          EstimatedAnnualMileage: null,
          Id: null,
          IdField: null,
          IsDamaged: null,
          IsInLien:null,
          LienHolder: null,
          Lienholders: null,
          Links: [
            {
              Href: null,
              Rel: null
            }
          ],
          Make: null,
          MakeId:null,
          Model: null,
          ModelId:null,
          Ownership: null,
          PrimaryDriverId: null,
          ProcessingId: null,
          RegistrationState: null,
          Usage: null,
          ValueOfCustomEquipment: null,
          Vin: null,
          Year: null,
          YearsOwned: null,
          YearStyleId:null
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {

        getVehicleRouteName: function () {
          return 'listed-vehicle';
        },

        getLienHolderRouteName: function () {
          return 'lienholder';
        },

        getCoverageRouteName: function () {
          return 'coverage';
        },

        getMake: function () {
          return this.Make;
        },

        setVehicleDefaults: function () {

          this.PrimaryDriverIdField = null;
          this.PrimaryVehicleIdField = null;

          //Default the RegistrationState from the p.o.s. api
          this.RegistrationState = quoteDataService.getAddressState();

          if(this.Ownership == 'PaidOff'){
            this.LienHolder = null;
            this.Lienholders = null;
          }
        },

        createRejectedPromise: function(e){
          var rejected = $q.defer();
          rejected.reject(e);
          return rejected.promise;
        },

        saveLienHolder: function(callGroup){
          try {
            var lienHolderRouteName = this.getLienHolderRouteName();
            var lienHolderLinkItem = _.find(this.Links, function (link) {
              return link.Rel == lienHolderRouteName
            });
            var lienHolderLink = lienHolderLinkItem.Href;
            var deferred = $q.defer();
            //In this case LienHolders (plural) is only populated after a get (see this.populateData). We should only ever
            //have one lienholder accourding to John S. so I move that into LienHolder (singular). We are bound to LienHolder
            //in the confirm-vehicle view
            if (this.LienHolder || this.Lienholders) {
              if (this.Lienholders && this.Lienholders.length > 0 && lienHolderLink) {
                return internalAPIDataService.putData(lienHolderRouteName, lienHolderLink, this.LienHolder)
              } else {
                return internalAPIDataService.postData(lienHolderRouteName, lienHolderLink, this.LienHolder)
              }
            } else {
              deferred.resolve('Notta to save');
              return deferred.promise;
            }
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        } ,

        saveDefaultCoverages: function(callGroup){
          try {

            var deferred = $q.defer();

            //Only save default coverages if we have not already quoted
            var quote = quoteDataService.getQuote();
            if(quote && quote.TotalPremium && quote.TotalPremium > 0){
              deferred.resolve('Already Quoted');
              return deferred.promise;
            }

            //Gets the state from the physical mailing address
            var state = quoteDataService.getAddressState();
            var policyHolder = quoteDataService.getPolicyHolder();
            var limit = 0;
            //If the policy holder has insurance then check the limit so we can set our defaults
            //otherwise use the basic defaults
            if(policyHolder.CurrentInsuranceLimits){
              var insuranceLimit = _.findWhere(insuranceLimits, {Value: policyHolder.CurrentInsuranceLimits}).Limit;
              if(insuranceLimit){
                limit = parseInt(insuranceLimit, 10);
              }
            }

            if(state && !isNaN(limit) && limit >= 0) {
              //Get the vehicle coverages if there are any
              var defaultVehicleCoverages = getDefaultVehicleCoverages(state, limit);
              if(defaultVehicleCoverages && defaultVehicleCoverages.length > 0) {
                var routeName = this.getCoverageRouteName();
                var linkItem = _.find(this.Links, function (link) {
                  return link.Rel == routeName
                });
                var coverageLink = linkItem.Href;
                if (coverageLink) {
                  return internalAPIDataService.postData(routeName, coverageLink, defaultVehicleCoverages, callGroup);
                }else {
                  deferred.resolve('Coverage routeName cannot be found in Links collection');
                }
              }else{
                deferred.resolve('No coverages could be found for CurrentInsurance limit');
              }
            }else{
              deferred.resolve('Could not determine State or CurrentInsuranceLimit');
            }
            return deferred.promise;
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        saveVehicle: function (callGroup) {
          try {
            var vehicleLink;
            var vehicleRouteName = this.getVehicleRouteName();
            if (!this.Id) {
              vehicleLink = quoteDataService.getLink(vehicleRouteName);
            } else {
              var urlLink = _.find(this.Links, function (link) {
                return link.Rel == vehicleRouteName
              });
              vehicleLink = urlLink.Href;
            }

            return this.sendVehicle(vehicleLink, callGroup);
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        sendVehicle: function (vehicleLink, callGroup) {
          try {
            var vehicleRouteName = this.getVehicleRouteName();
            //Set vehicle defaults
            this.setVehicleDefaults();

            var currentVehicle = this;
            var savePromise;
            if (!this.Id) {
              savePromise = internalAPIDataService.postData(vehicleRouteName, vehicleLink, currentVehicle, callGroup);
            }
            else {
              savePromise = internalAPIDataService.putData(vehicleRouteName, vehicleLink, currentVehicle, callGroup);
            }
            var deferred = $q.defer();
            $q.when(savePromise, function (response) {
              var savedVehicle = response.data;
              currentVehicle.Id = savedVehicle.Id;
              currentVehicle.IdField = savedVehicle.IdField;
              currentVehicle.Links = savedVehicle.Links;
              quoteDataService.saveVehicle(currentVehicle);

              deferred.resolve(savedVehicle.Id);
            }, function (error) {
              deferred.reject(error);
            });
            return deferred.promise;
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        getVehicle: function (callGroup) {
          try {
            var vehicleLink;
            var vehicleRouteName = this.getVehicleRouteName();
            if (!this.Id) {
              var rejected = $q.defer();
              rejected.reject({
                message: String.format('Cannot get vehicle with no ID')
              });
              return rejected.promise;
            } else {
               vehicleLink = _.find(this.Links, function (link) {
                return link.Rel == vehicleRouteName
              });
            }
            var queryParams = {'include': 'all'};
            var vehicleResponse = internalAPIDataService.getData(vehicleRouteName, vehicleLink.Href, null, queryParams);
            var deferred = $q.defer();
            var currentVehicle = this;
            $q.when(vehicleResponse, function (response) {
              var vehicleResults = JSON.parse(JSON.stringify(response.data));

              vehicleResults.PrimaryDriverIdField = null;

              currentVehicle.populateData(vehicleResults);

              quoteDataService.saveVehicle(currentVehicle);
              var responseMessage = {
                message: String.format("Retrieved vehicle {0} successfully", currentVehicle.Id),
                data: response.data.Id,
                status: false,
                httpStatus: response.status
              };
              deferred.resolve(responseMessage);
            }, function (error) {
              deferred.reject(error);
            });

            return deferred.promise;
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        removeVehicle: function (callGroup) {
          try {
            var vehicleRouteName = this.getVehicleRouteName();
            if (!this.Id) {
              var noVehicleResponse = $q.defer();
              noVehicleResponse.resolve({
                message: 'Vehicle has not been saved and does not contain an Id'
              });
              return noVehicleResponse.promise;
            }
            var vehicleLink = _.find(this.Links, function (link) {
              return link.Rel == vehicleRouteName;
            });
            if (vehicleLink.Href) {
              var currentVehicle = this;
              var deletePromise = internalAPIDataService.removeData(vehicleRouteName, vehicleLink.Href, callGroup);
              var deferred = $q.defer();
              $q.when(deletePromise, function (response) {
                  quoteDataService.removeVehicle(currentVehicle.Id);
                  var responseMessage = {
                    message: String.format("Removed Vehicle {0} successfully", currentVehicle.Id),
                    httpStatus: response.status
                  };
                  deferred.resolve(responseMessage);
                }, function (error) {
                  deferred.reject(error);
                });
              return deferred.promise;
            } else {
              var rejected = $q.defer();
              rejected.reject({
                message: 'Vehicle link not provided'
              });
              return rejected.promise;
            }
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        populateData: function (data) {
          _.extend(this, data);

          data.PrimaryDriverIdField = null;
          data.PrimaryVehicleIdField = null;

          if (data.Lienholders && data.Lienholders.length > 0) {
            this.LienHolder = data.Lienholders[0];
          }

          //Vin stub is being returned from pc this is bad
          //so delete
          if(this.Vin && this.Vin.length < 15){
            this.Vin = null;
          }

          //Default to null cause pc cannot
          if(!this.Vin){
            this.IsDamaged = null;
          }

        }

      });

      return clazz;
    }]);
