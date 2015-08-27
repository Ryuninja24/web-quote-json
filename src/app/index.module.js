(function () {
  'use strict';

  angular
    .module('webQuoteJson',
    [
      'ngSanitize',
      'restangular',
      'ui.router',
      'ui.bootstrap',
      'ui.validate',
      'ui.date',
      'ui.mask',
      'schemaForm',
      'mgcrea.ngStrap',
      'platform.geoCodeService',
      'platform.vinIsoService',
      'platform.tracking',
      'platform.logging',
      'platform.loading',
      'ngMessages',
      'quotes.persistence',
      'platform.directives',
      'platform.lookupDataService'
    ])
    .provider('NavigationService', NavigationService())
    .config(['NavigationServiceProvider', function (navigationServiceProvider) {
      var data = $('#journey').html();
      navigationServiceProvider.addJourney(JSON.parse(data))
    }]);
})();
