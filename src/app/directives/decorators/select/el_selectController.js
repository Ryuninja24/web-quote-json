/**
 * Created by gabello on 9/1/2015.
 */
angular.module('schemaForm').config(
  ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

      var elephantSelector = function (name, schema, options) {
        if ((schema.type === 'string') && schema.format == 'postalCodeSelector') {
          var f = schemaFormProvider.stdFormObj(name, schema, options);
          f.key = options.path;
          f.type = 'elephantSelectPicker';
          options.lookup[sfPathProvider.stringify(options.path)] = f;
          return f;
        }
      };

      schemaFormProvider.defaults.string.unshift(elephantSelector);

      //Add to the bootstrap directive
      schemaFormDecoratorsProvider.addMapping(
        'bootstrapDecorator',
        'elephantSelectPicker',
        'app/directives/decorators/select/el_select.html'
      );
      schemaFormDecoratorsProvider.createDirective(
        'elephantSelectPicker',
        'app/directives/decorators/select/el_select.html'
      );
    }]);

angular.module('schemaForm')
  .controller('elephantSelectController', ['$scope', '$http', '$timeout', function ($scope, $http) {

    $scope.finalizeTitleMap = function (form, data, newOptions) {
      // Remap the data
      if(!data){
        return;
      }

      form.titleMap = [];

      if (newOptions && "map" in newOptions && newOptions .map) {
        var current_row = null;
        data.forEach(function (current_row) {
          current_row["value"] = current_row[newOptions .map.valueProperty];
          current_row["name"] = current_row[newOptions .map.nameProperty];
          form.titleMap.push(current_row);
        });

      }
      else {
        data.forEach(function (item) {
            if ("text" in item) {
              item.name = item.text
            }
          }
        );
        form.titleMap = data;
      }
    };

      $scope.getCallback = function (callback) {
        if (typeof(callback) == "string") {
          var _result = $scope.$parent.evalExpr(callback);
          //In the case where the control is in a child of the parent i.e. collapseable
          //this is probably not the best way to handle this but for now it will do
          if(!_result){
            _result = $scope.$parent.$parent.evalExpr(callback)
          }
          if (typeof(_result) == "function") {
            return _result;
          }
          else {
            throw("A callback string must match name of a function in the parent scope")
          }

        }
        else if (typeof(callback) == "function") {
          return callback;
        }
        else {
          throw("A callback must either be a string matching the name of a function in the parent scope or a " +
          "direct function reference")

        }
      };

      $scope.getOptions = function (options, search) {
        // If defined, let the a callback function manipulate the options
        if (options.httpPost && options.httpPost.optionsCallback) {
          newOptionInstance = $scope.clone(options);
          return $scope.getCallback(options.httpPost.optionsCallback)(newOptionInstance, search);
        }
        if (options.httpGet && options.httpGet.optionsCallback) {
          newOptionInstance = $scope.clone(options);
          return $scope.getCallback(options.httpGet.optionsCallback)(newOptionInstance, search);
        }
        else {
          return options;
        }
      };

      $scope.populateTitleMap = function (form, search) {

        if (form.schema && "enum" in form.schema) {
          form.titleMap = [];
          form.schema.enum.forEach(function (item) {
              form.titleMap.push({"value": item, "name": item})
            }
          );

        }
        else if (!form.options) {

          console.log("dynamicSelectController.populateTitleMap(key:" + form.key + ") : No options set, needed for dynamic selects");
        }
        else if (form.options.callback) {
          form.titleMap = $scope.getCallback(form.options.callback)(form.options, search);
          $scope.finalizeTitleMap(form,form.titleMap, form.options);
        }
        else if (form.options.asyncCallback) {
          return $scope.getCallback(form.options.asyncCallback)(form.options, search).then(
            function (_data) {
              $scope.finalizeTitleMap(form, _data.data, form.options);
            },
            function (data, status) {
              alert("Loading select items failed(Options: '" + String(form.options) +
                "\nError: " + status);
            });
        }
        else if (form.options.httpPost) {
          var finalOptions = $scope.getOptions(form.options, search);

          return $http.post(finalOptions.httpPost.url, finalOptions.httpPost.parameter).then(
            function (_data) {

              $scope.finalizeTitleMap(form, _data.data, finalOptions);
            },
            function (data, status) {
              alert("Loading select items failed (URL: '" + String(finalOptions.httpPost.url) +
                "' Parameter: " + String(finalOptions.httpPost.parameter) + "\nError: " + status);
            });
        }
        else if (form.options.httpGet) {
          var finalOptions = $scope.getOptions(form.options, search);
          return $http.get(finalOptions.httpGet.url, finalOptions.httpGet.parameter).then(
            function (data) {
              $scope.finalizeTitleMap(form, data.data, finalOptions);
            },
            function (data, status) {
              alert("Loading select items failed (URL: '" + String(finalOptions.httpGet.url) +
                "\nError: " + status);
            });
        }
      };

    }]);
