angular.module('schemaForm')
    .config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

            var select = function (name, schema, options) {
                if (schema.type === 'string' && schema.format == 'strapselect') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'strapselect';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(select);

            var multiselect = function (name, schema, options) {
                if (schema.type === 'array' && schema.format == 'strapselect') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'strapmultiselect';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.array.unshift(multiselect);

            var selectdynamic = function (name, schema, options) {
                if (schema.type === 'string' && schema.format == 'strapselectdynamic') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'strapselectdynamic';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(selectdynamic);

            var multiselectdynamic = function (name, schema, options) {
                if (schema.type === 'array' && schema.format == 'strapselectdynamic') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'strapmultiselectdynamic';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.array.unshift(multiselectdynamic);

            //Add to the bootstrap directive
            schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'strapselect',
                'app/directives/decorators/bootstrap/strapselect.html');
            schemaFormDecoratorsProvider.createDirective('strapselect',
                'app/directives/decorators/bootstrap/strapselect.html');

            schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'strapmultiselect',
                'app/directives/decorators/bootstrap/strapmultiselect.html');
            schemaFormDecoratorsProvider.createDirective('strapmultiselect',
                'app/directives/decorators/bootstrap/strapmultiselect.html');

            schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'strapselectdynamic',
                'app/directives/decorators/bootstrap/strapselectdynamic.html');
            schemaFormDecoratorsProvider.createDirective('strapselectdynamic',
                'app/directives/decorators/bootstrap/strapselectdynamic.html');

            schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'strapmultiselectdynamic',
                'app/directives/decorators/bootstrap/strapmultiselectdynamic.html');
            schemaFormDecoratorsProvider.createDirective('strapmultiselectdynamic',
                'app/directives/decorators/bootstrap/strapmultiselectdynamic.html');

        }]);
