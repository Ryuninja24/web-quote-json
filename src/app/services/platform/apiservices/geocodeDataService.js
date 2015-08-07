/**
 * Created by gabello on 8/6/2015.
 */
angular.module('platform.apiservices', ['restangular'])
    .factory('geoCodeService', ['Restangular', 'environmentLink', function (Restangular, environmentLink) {
        return Restangular.withConfig(function (restangularConfigurer) {
            restangularConfigurer.setFullResponse(true);
            restangularConfigurer.setBaseUrl(environmentLink.geoCode);

        });
    }])
    .service('geoCodeDataService', ['$q', '$log', 'geoCodeService', 'segmentIoTrackingService', 'environmentLink',
        function ($q, $log, geoCodeService, segmentIoTrackingService, environmentLink) {

            this.getPostalCodes = function ( postalCode) {
                if (postalCode) {
                    $log.debug(String.format('geoCodeDataService: getPostalCodes - calling geodata-lookup for postal code {0}', postalCode));
                    var s = segmentIoTrackingService.start();
                    var newResDeferred = $q.defer();
                    geoCodeService.one(postalCode).withHttpConfig({timeout:30000}).get()
                        .then(function(result) {
                            newResDeferred.resolve(result);
                            segmentIoTrackingService.end(s,environmentLink.geoCode, 'success', 'get');
                        }, function(error) {
                            newResDeferred.reject('GeoCode data service call failed with http status ' + error.status);
                            $log.debug(String.format('geoCodeDataService: getPostalCodes - failed calling geodata-lookup for postal code {0} with http status {1}', postalCode, error.status));
                            segmentIoTrackingService.end(s,environmentLink.geoCode, 'error', 'get');
                        }
                    );
                    return newResDeferred.promise;
                } else {
                    var rejected = $q.defer();
                    rejected.reject('Url and PostalCode is required for postal code lookup');
                    return rejected.promise;
                }
            }
        }]);
;