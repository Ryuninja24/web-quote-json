/**
 * Created by jholloman on 8/14/2015.
 */
'use strict';
angular.module('schemaForm')
  .config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider){
    var navSummary = function(name, schema, options){
      if((schema.type === 'string') && schema.format == 'el_navSummary'){
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key = options.path;
        f.type = 'navSummaryDisplay';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };
    schemaFormProvider.defaults.string.unshift(navSummary);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'navSummaryDisplay',
      'app/directives/decorators/navSummary/el_navSummary.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'navSummaryDisplay',
      'app/directives/decorators/navSummary/el_navSummary.html'
    );
  }]
)
  .controller('el_navSummaryController', ['$scope', 'dataModelService', '$state', function($scope, dataModelService, $state){
    $scope.navSummary = {
      masterModel: dataModelService.getQuoteModel(),
      router: $state
    };
  }])
