(function() {
  'use strict';

  angular
    .module('webQuoteJson')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
