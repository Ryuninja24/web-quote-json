/**
 * Created by gabello on 8/18/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var policyStartDateSelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'el_policyStartDate') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'el_policyStartDate';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(policyStartDateSelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'el_policyStartDate',
        'app/directives/decorators/policyStartDate/el_policyStartDate.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'el_policyStartDate',
        'app/directives/decorators/policyStartDate/el_policyStartDate.html'
      );
    }]);

angular.module('schemaForm')
  .controller('el_policyStartDateController', ['$scope',
    function ($scope) {

      $scope.dateOptions = {
        minDate: +1,
        maxDate: "+2M"
      };

      $scope.validatePolicyStartDate = function (startDate) {
        if(startDate){
          var dateToTest = moment(startDate).format('L');
          var valid = moment.utc(dateToTest.substring(0,10),['MM/DD/YYYY', 'MMDDYYYY','MM-DD-YYYY','YYYY-MM-DD'], true).isValid();
          return valid;
        }
        return false;
      };


    }]);
