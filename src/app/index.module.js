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
            'ngMessages',
        ]);
})();
