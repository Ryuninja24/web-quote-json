/**
 * Created by gabello on 8/19/2015.
 */
angular.module('schemaForm')
  .config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var inputMaskSelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'inputMask') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'el_inputMask';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(inputMaskSelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'el_inputMask',
        'app/directives/decorators/input_mask/el_input_mask.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'el_inputMask',
        'app/directives/decorators/input_mask/el_input_mask.html'
      );
    }])
  .directive('dynamicDirectives', ['$compile',
    function ($compile) {

      var addDirectiveToElement = function (scope, element, dir) {
        var propName;
        if (dir.if) {
          propName = Object.keys(dir)[1];
          var addDirective = scope.$eval(dir.if);
          if (addDirective) {
            element.attr(propName, dir[propName]);
          }
        } else { // No condition, just add directive
          propName = Object.keys(dir)[0];
          element.attr(propName, dir[propName]);
        }
      };

      var linker = function (scope, element, attrs) {
        var directives = scope.$eval(attrs.dynamicDirectives);

        if (!directives || !angular.isArray(directives)) {
          return $compile(element)(scope);
        }

        // Add all directives in the array
        angular.forEach(directives, function (dir) {
          addDirectiveToElement(scope, element, dir);
        });

        // Remove attribute used to add this directive
        element.removeAttr(attrs.$attr.dynamicDirectives);
        // Compile element to run other directives
        $compile(element)(scope);
      };

      return {
        //priority: 1001, // Run before other directives e.g.  ng-repeat
        terminal: true, // Stop other directives running
        link: linker
      };
    }
  ]);
//.directive('listMasks', function ($compile) {
//  return {
//    restrict: 'A',
//    replace: false,
//    terminal: true, //this setting is important, see explanation below
//    priority: 1000, //this setting is important, see explanation below
//    compile: function compile(element, attrs) {
//      element.removeAttr("list-masks");
//      element.removeAttr("ui-masks");
//      element.attr('ui-mask',"(999)-999-9999");
//
//      return {
//        pre: function preLink(scope, iElement, iAttrs, controller) {  },
//        post: function postLink(scope, iElement, iAttrs, controller) {
//          $compile(iElement)(scope);
//        }
//      };
//    }
//  };
//});

//  return {
//    restrict: 'A',
//    replace: false,
//    terminal: true,
//    priority: 1000,
//    require: '?ngModel',
//    scope: {
//      ngModel: '=',
//      uiMasks: '='
//    },
//    link: function (scope, element, attrs, ngModel) {
//      var fun = attrs;
//
//      element.removeAttr("list-masks");
//      element.removeAttr("ui-masks");
//      element.attr('ui-mask',"(999)-999-9999");
//      //
//      $compile(element)(scope);
//    }
//  };
//});
