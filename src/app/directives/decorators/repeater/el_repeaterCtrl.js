/**
 * Created by jholloman on 11/2/2015.
 */
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elRepeater = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'el_repeater') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'repeater';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elRepeater);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'repeater',
        'app/directives/decorators/repeater/el_repeater.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'repeater',
        'app/directives/decorators/repeater/el_repeater.html'
      );

    }])
  .controller('elRepeaterCtrl', ['$scope', 'dataModelService', '$location', 'NavigationService',
    function ($scope, dataModelService, $location, NavigationService) {
      //would love to get this back into the parent scope and handle saving there
      $scope.repeatSummary = {
        dataModel: null,
        saveItems: function(valid){
          if(valid) {
            dataModelService.saveQuoteModel(this.dataModel);
            NavigationService.getNextStep($scope.$parent.modelData, dataModelService, null);
          }
        }
      };
      var form = $scope.$parent.form;
      if(form.repeater){
        $scope.repeatSummary.dataModel = dataModelService.getQuoteModel();
      }

  }])
