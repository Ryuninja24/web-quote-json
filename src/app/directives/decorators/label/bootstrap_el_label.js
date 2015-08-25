/**
 * Created by gabello on 8/24/2015.
 */
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elLabelSelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'label') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'el_label';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elLabelSelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'el_label',
        'app/directives/decorators/label/el_label.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'el_label',
        'app/directives/decorators/label/el_label.html'
      );
    }]);
