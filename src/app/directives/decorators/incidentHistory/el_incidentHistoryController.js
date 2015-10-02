/**
 * Created by gabello on 9/15/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elephantIncidentHistorySelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'incidentHistory') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'elephantIncidentSelector';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elephantIncidentHistorySelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'elephantIncidentSelector',
        'app/directives/decorators/incidentHistory/el_incidentHistory.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'elephantIncidentSelector',
        'app/directives/decorators/incidentHistory/el_incidentHistory.html'
      );
    }]);

angular.module('schemaForm')
  .controller('IncidentSelectorController', ['$scope', 'dataModelService', function ($scope, dataModelService) {
    "use strict";

    $scope.trueFalseOptions = [{value: true, description: 'Yes'},{value: false, description: 'No'}];

    $scope.$on('schemaFormValidate', function() {
      $scope.vehicleSummary.formSubmitted = true;
    });

  }]);
