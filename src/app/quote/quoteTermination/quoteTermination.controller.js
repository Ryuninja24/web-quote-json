/**
 * Created by gabello on 10/6/2015.
 */
(function() {
  'use strict';

  angular
    .module('webQuoteJson')
    .controller('QuoteTerminationController', QuoteTerminationController);


  function QuoteTerminationController($scope, $stateParams, elephantContactInfo) {

    $scope.quoteTerminationSummary = {
      state: $stateParams.state,
      errorId: $stateParams.id,
      salesPhone: elephantContactInfo.sales
    };




  }
})();
