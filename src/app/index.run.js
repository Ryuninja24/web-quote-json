(function() {
  'use strict';

  angular
    .module('webQuoteJson')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, lookupDataService) {

    lookupDataService.loadLookups();
    $log.debug('lookupDataService loaded');
  }

})();
