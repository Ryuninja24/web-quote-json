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
            'platform.apiservices',
            'platform.tracking',
            'ngMessages'
        ])
        .provider('NavigationService', NavigationService())
        .config(['NavigationServiceProvider', function (navigationServiceProvider) {
            var data = $('#journey').html();
            navigationServiceProvider.addJourney(JSON.parse(data));

        }]);
})();
