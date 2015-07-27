(function() {
  'use strict';

  angular
    .module('webQuoteJson')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
        .state('quoteHome', {
          url: '/quotes',
          templateUrl: 'app/quote/quote.html',
          controller: 'QuoteController',
          controllerAs: 'quote'
        });

    $urlRouterProvider.otherwise('/');
  }

})();
