/**
 * Created by gabello on 3/5/2015.
 */

angular.module('platform.apiservices', ['restangular'])
  .factory('vinIsoService', ['Restangular', 'environmentLink', function (Restangular, environmentLink) {
    return Restangular.withConfig(function (restangularConfigurer) {
      restangularConfigurer.setFullResponse(true);
      restangularConfigurer.setBaseUrl(environmentLink.vinIsoData);

    });
  }])
  .service('vinIsoDataService', ['$q', '$log', 'vinIsoService', 'segmentIoTrackingService', 'environmentLink',
    function ($q, $log, vinIsoService, segmentIoTrackingService, environmentLink) {

      var timeoutInMilliseconds = 60000;

      var vinIsoYears = [];

      this.getTimeout = function () {
        return timeoutInMilliseconds;
      };

      this.getVehicleRatings = function (vehicle) {
        if (!_.isObject(vehicle) || !vehicle.Vin) {
          var rejected = $q.defer();
          rejected.reject(false);
          return rejected.promise;
        }
        return this.getVINRatings(vehicle.Vin);
      },

        this.getVINRatings = function (vin) {
          $log.debug(String.format('vinIsoDataService: getVINRatings - calling get for vin {0}', vin));
          var s = segmentIoTrackingService.start();
          var newResDeferred = $q.defer();
          vinIsoService.one('ratings/vin', vin).withHttpConfig({timeout: this.getTimeout()}).get()
            .then(function (result) {
              newResDeferred.resolve(result.data.Ratings);
            }, function (error) {
              $log.error('vinIsoDataService: getVehicleRatings - call failed with error', error);
              segmentIoTrackingService.end(s, String.format('{0}/{1}', environmentLink.vehicleData, vin), 'error', 'getVin');
              newResDeferred.reject(error);
            }
          );
          return newResDeferred.promise;
        },

        //calls ancillary api to retrieve multiple ratings based on vins
        //synopsis: http://eaa-qa1.qa-elephant.com/api/viniso/ratings/vin    payload - ["1FMZU73K45UB29386"]
        this.getMultipleVinRatings = function (vins) {
          var s = segmentIoTrackingService.start();
          $log.debug(String.format('vinIsoDataService: calling get for vins {0}', JSON.stringify(vins)));
          var urlCall = String.format('{0}/ratings/vin', vinIsoService.configuration.baseUrl);
          var newResDeferred = $q.defer();
          vinIsoService.one('ratings/vin').withHttpConfig({timeout: this.getTimeout()}).post('', vins)
            .then(function (result) {
              newResDeferred.resolve(result.data.Ratings);
              segmentIoTrackingService.end(s, urlCall, 'success', 'get');
            }, function (error) {
              $log.error(String.format('vinIsoDataService: post for ratings/vin {0} failed with error', JSON.stringify(vins)));
              segmentIoTrackingService.end(s, urlCall, 'error', 'getVin');
              newResDeferred.reject(error);
            }
          );
          return newResDeferred.promise;
        },

        //calls ancillary api to retrieve available years
        //synopsis: http://eaa-qa1.qa-elephant.com/api/viniso/years
        this.getVinIsoYears = function () {
          var newResDeferred = $q.defer();

          //check to see if we already have years if so return them
          if (vinIsoYears && vinIsoYears.length > 0) {
            newResDeferred.resolve(vinIsoYears);
            return newResDeferred.promise;
          }
          var s = segmentIoTrackingService.start();
          $log.debug('vinIsoDataService: getVinIsoYears - calling get for years');

          vinIsoService.one('years').withHttpConfig({timeout: this.getTimeout()}).get()
            .then(function (result) {
              vinIsoYears = _.sortBy(result.data.YearMakeModelRecords, function(yearMakeModelItem){
                return yearMakeModelItem.Year;
              }).reverse();
              newResDeferred.resolve(vinIsoYears);
              segmentIoTrackingService.end(s, String.format('{0}/years', vinIsoService.configuration.baseUrl), 'success', 'get');
            }, function (error) {
              $log.error('vinIsoDataService: getVinIsoYears - failed calling get for years');
              newResDeferred.reject(error);
              segmentIoTrackingService.end(s, String.format('{0}/years', vinIsoService.configuration.baseUrl), 'error', 'getVinIsoYears');
            }
          );
          return newResDeferred.promise;
        },

        //calls ancillary api to retrieve available makes for year
        //synopsis: http://eaa-qa1.qa-elephant.com/api/viniso/year/2012
        this.getVinIsoMakes = function (year) {
          if (year != null) {
            var s = segmentIoTrackingService.start();
            $log.debug(String.format('vinIsoDataService: getVinIsoMakes - calling get for year {0}', year));
            var newResDeferred = $q.defer();
            vinIsoService.one('years', year).withHttpConfig({timeout: this.getTimeout()}).get()
              .then(function (result) {
                newResDeferred.resolve(result);
                segmentIoTrackingService.end(s, String.format('{0}/years/{1}', vinIsoService.configuration.baseUrl, year), 'success', 'get');
              }, function (error) {
                $log.debug(String.format('vinIsoDataService: getVinIsoMakes - failed calling get for year {0}', year));
                newResDeferred.reject(error);
                segmentIoTrackingService.end(s, String.format('{0}/years/{1}', vinIsoService.configuration.baseUrl, year), 'error', 'getVehicleMakes');
              }
            );
            return newResDeferred.promise;
          } else {
            var rejected = $q.defer();
            rejected.reject('Year is required for retrieving vehicle makes');
            return rejected.promise;
          }
        },

        //calls ancillary api to retrieve available models and bodystyles
        //synopsis: http://vadev-eaa-01/api/viniso/years/2012/makes/14
        //synopsis: http://vadev-eaa-01/api/viniso/years/2012/makes/1/models/52
        this.getVinIsoVehicleData = function (url, callGroup) {
          if (url) {
            $log.debug(String.format('vinIsoDataService: getVinIsoVehicleData - calling get for url {0}', url));
            var s = segmentIoTrackingService.start();
            var newResDeferred = $q.defer();
            vinIsoService.oneUrl('makes', url).withHttpConfig({timeout: this.getTimeout()}).get()
              .then(function (result) {
                newResDeferred.resolve(result);
                segmentIoTrackingService.end(s, url, 'success', 'get');
              }, function (error) {
                $log.debug(String.format('vinIsoDataService: getVinIsoVehicleData - failed calling get for url {0}', url));
                newResDeferred.reject(error);
                segmentIoTrackingService.end(s, url, 'error', 'getVehicleMakes');
              }
            );
            return newResDeferred.promise;
          } else {
            var rejected = $q.defer();
            rejected.reject('Year and Make are required for retrieving vehicle makes');
            return rejected.promise;
          }
        }
    }]);

