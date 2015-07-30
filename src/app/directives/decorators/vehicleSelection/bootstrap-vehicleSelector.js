/**
 * Created by gabello on 7/30/2015.
 */
angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

            var vehiclepicker = function(name, schema, options) {
                if (schema.type === 'string' && schema.format == 'vehicleSelector') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key  = options.path;
                    f.type = 'vehiclePicker';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(vehiclepicker);

            //Add to the bootstrap directive
            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'vehiclePicker',
                'app/directives/decorators/vehicleSelection/vehicleSelector.html'
            );
            schemaFormDecoratorsProvider.createDirective(
                'vehiclePicker',
                'app/directives/decorators/vehicleSelection/vehicleSelector.html'
            );
        }
    ]);