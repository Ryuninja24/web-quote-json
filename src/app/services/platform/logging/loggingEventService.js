/**
 * Created by gabello on 8/24/2015.
 */
angular.module('platform.logging', [])
  .config(['$provide', function ($provide) {
    $provide.decorator('$log', ['$delegate', 'loggingService', function ($delegate, loggingService) {
      $delegate.debug = function (msg) {
        loggingService.logDebug(msg);
      };
      $delegate.info = function (msg) {
        loggingService.logInfo(msg);
      };
      $delegate.warn = function (msg) {
        loggingService.logWarn(msg);
      };
      $delegate.error = function (msg, exception) {
        loggingService.logError(msg, exception);
      };

      return $delegate;
    }]);
  }])
  .provider('$exceptionHandler',
  {
    $get: ['loggingService', function (loggingService) {
      return (loggingService.logError);
    }]
  })
  .factory('loggingService', LoggingEventService());


function LoggingEventService() {
  'use strict';
  function hasOwnProperty(obj, prop) {
    var proto = obj.constructor.prototype;
    return (prop in obj) &&
      (!(prop in proto) || proto[prop] !== obj[prop]);
  }

  function logToConsole(message) {
    if (window && window.console && typeof window.console.log === 'function') {
      console.log(message);
    }
  }

  function logMessage ($window, message, level, exception) {

    // Now, we need to try and log the error the server.
    try {

      var error = {
        ll: level,
        url: $window.location.href,
        userAgent: $window.navigator.userAgent,
        exception: '',
        stackTrace: {},
        pcErrorCode: {}
      };

      try {
        if (exception !== null && exception !== undefined) {
          if (exception instanceof Error) {
            if (hasOwnProperty(exception, 'message')) {
              error.exception = exception.message.toString();
            }
          } else if (_.isString(exception)) {
            error.exception = exception.toString();
          } else if (_.isObject(exception)) {
            if (exception.constructor === Array) {
              error.exception = 'Undefined exception of type Array caught';
            } else if (exception.constructor === Object) {
              var stackTrace = {};
              if (hasOwnProperty(exception, 'config')) {
                stackTrace.url = exception.config.url;
                if (hasOwnProperty(exception.config, 'method')) {
                  stackTrace.method = exception.config.method;
                }
              }
              if (hasOwnProperty(exception, 'status')) {
                stackTrace.status = exception.status;
              }
              if (hasOwnProperty(exception, 'data')) {
                if (typeof (exception.data) === 'string') {
                  error.exception = exception.data;
                } else if (_.isObject(exception.data)) {
                  if (hasOwnProperty(exception.data, 'message')) {
                    error.exception = JSON.stringify(exception.data.message);
                  }
                  if (hasOwnProperty(exception.data, 'errors')) {
                    if (_.isObject(exception.data.errors)) {
                      if (exception.data.errors.constructor === Array) {
                        var dataErrors = [];
                        var pcErrorCodes = [];
                        _.each(exception.data.errors, function (errorItem) {
                          if (hasOwnProperty(errorItem, 'Message')) {
                            dataErrors.push(errorItem.Message);
                          }
                          if (hasOwnProperty(errorItem, 'PCErrorCode')) {
                            pcErrorCodes.push(errorItem.PCErrorCode);
                          }
                        });
                        error.exception = dataErrors.join();
                        error.pcErrorCode = pcErrorCodes.join();
                      }
                    }
                  }
                }
              }
              error.stackTrace = stackTrace;
            } else if (exception.constructor === Function) {
              error.exception = exception.toString;
            } else if (exception.constructor === String) {
              error.exception = exception;
            } else if (exception.constructor === Number) {
              error.exception = exception;
            }
          }
        }
      } catch (exceptionError) {
        logToConsole(exceptionError);
      }

      if (message) {
        error.message = message;
        logToConsole(message);
      }

      if (error.exception) {
        logToConsole(error.exception);
      }

    } catch (loggingError) {
      logToConsole(exceptionError);
    }
  }


  return ['$window', 'logLevel', function ($window, logLevel) {
    return {

      logDebug: function (message) {
        if (logLevel.level === 'debug') {
          logMessage($window, message, 'debug', null);
        }
      },
      logInfo: function (message) {
        if (logLevel.level === 'info') {
          logMessage($window, message, 'info', null);
        }
      },
      logWarn: function (message) {
        if (logLevel.level === 'error' || logLevel.level === 'warn') {
          logMessage($window, message, 'warn', null);
        }
      },
      logError: function (message, exception) {
        if (message || exception) {
          logMessage($window, message, 'error', exception);
        }
      }
    };
  }];
}
