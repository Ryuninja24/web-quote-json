/**
 * Created by gabello on 8/20/2015.
 */
function ValidDateFormatter() {
  'use strict';
  return ['$window','$filter', '$parse', '$timeout',  function ($window, $filter, $parse, $timeout) {
    return {
      priority:200,
      require: '?ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        var moment = $window.moment;

        if (!attrs.minAge) { attrs.minAge = 15; }
        if (!attrs.maxAge) { attrs.maxAge = 98; }

        ngModel.$formatters.push(formatter);
        ngModel.$parsers.push(parser);

        element.on('change', function (e) {
          var element = e.target;
          element.value = formatter(ngModel.$modelValue);
        });

        function parser(value) {
          if(!value){
            return value;
          }
          var m = moment.utc(value.substring(0,10),['MMDDYYYY','MM-DD-YYYY'], true);
          var valid = m.isValid();
          ngModel.$setValidity('datetime', valid);
          if (valid) {
            if(attrs.maxAge > 0 && attrs.minAge > 0) {
              var age = Math.abs(m.diff(new Date(), 'years'));
              var ageResult = age >= attrs.minAge && age <= attrs.maxAge;
              ngModel.$setValidity('agerange', ageResult);
            }
            return m.format("MM-DD-YYYY");
          }else {
            return value;
          }
        }

        function formatter(value) {
          if(!value){
            return value;
          }
          var m = moment.utc(value);
          var valid = m.isValid();
          if (valid) return m.format("MM-DD-YYYY");
          else return value;
        }

      } //link
    };
  }]
}
