/**
 * Created by gabello on 8/20/2015.
 */
function DigitsOnly() {
  'use strict';
  return function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      priority: 99,
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }
        ctrl.$parsers.push(inputValue);
      }
    };
  }
}
angular.module('platform.directives')
  .directive('onlyDigits', DigitsOnly());
