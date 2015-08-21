/**
 * Created by gabello on 8/17/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'el_select_ngrequired',
        'app/directives/decorators/select_ngrequired/el_select_ngrequired.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'el_select_ngrequired',
        'app/directives/decorators/select_ngrequired/el_select_ngrequired.html'
      );

 }]);
