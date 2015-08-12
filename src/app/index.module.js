(function () {
    'use strict';

    angular
        .module('webQuoteJson',
        [
            'ngSanitize',
            'restangular',
            'ui.router',
            'ui.bootstrap',
            'schemaForm',
            'mgcrea.ngStrap',
            'platform.geoCodeService',
            'platform.vinIsoService',
            'platform.tracking',
            'ngMessages',
            'quotes.persistence'
        ])
        .provider('NavigationService', NavigationService())
        .config(['NavigationServiceProvider', function (navigationServiceProvider) {
            var data = $('#journey').html();
            navigationServiceProvider.addJourney(JSON.parse(data));

        }]);
})();
