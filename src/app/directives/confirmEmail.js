/**
 * Created by jholloman on 10/20/2015.
 */
'use strict';
function ConfirmEmail() {
  return function () {
    return {
      require: 'ngModel',
      link: function (sc, el, at, ctrl) {

        //save last input
        var inputArray = [];

        function ValidateEmail(input) {
          var email = sc.model.driver.EmailAddress || '';
          (email !== input) ? ctrl.$setValidity('email', false) : ctrl.$setValidity('email', true);

          inputArray = [];
          inputArray.push(input)
          return input;
        }

        ctrl.$parsers.push(ValidateEmail);
        sc.$watch('model.driver.EmailAddress', function (nv, ov) {
          if(nv !== ov){
            ValidateEmail(inputArray[0]);
          }
        })
      }
    }
  }
}
angular.module('platform.directives')
  .directive('confirmEmail', ConfirmEmail());
