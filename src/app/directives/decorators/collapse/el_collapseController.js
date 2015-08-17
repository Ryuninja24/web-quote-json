/**
 * Created by gabello on 8/17/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'el_collapse',
        'app/directives/decorators/collapse/el_collapse.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'el_collapse',
        'app/directives/decorators/collapse/el_collapse.html'
      );

    }]);
