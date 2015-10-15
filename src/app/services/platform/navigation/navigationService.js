/**
 * Created by gabello on 8/5/2015.
 */
function NavigationService() {
  'use strict';

  var journeyStates = {};



  return {
    addJourney: function (metaDataObj) {
      angular.extend(journeyStates, metaDataObj);
    },

    $get: ['$parse', '$location', '$log',
      function ($parse, $location, $log) {

        return {
          states: journeyStates,

          testStateCondition: function (model, condition, dataModelService) {
            var testResult = false;
            var errorString;

            if (eval("typeof " + condition.test + " === 'function'")) {
              try {
                var response = eval(condition.test)();
                if (typeof response === 'object') {
                  if (_.has(response, 'args')) {
                    condition.args = response.args;
                  }
                  if (response.condition == condition.expected) {
                    testResult = true;
                  }
                }
                else if (typeof response === 'boolean') {
                  if (response == condition.expected) {
                    testResult = true;
                  }
                }
              }
              catch (e) {
                throw String.format('NavigationService: TestCondition caught an error attempting to eval {0}', condition.test);
              }
            }

            //Test model
            else if (model && _.has(model, condition.model)) {
              if (_.has(model[condition.model], condition.test)) {
                var testProp = model[condition.model][condition.test];
                if (testProp == condition.expected) {
                  testResult = true;
                }
              }
            }
            //Default navigation
            else if(typeof condition.test === 'boolean' && condition.test === true){
              testResult = true;
            }
            else {
              throw String.format("NavigationService: TestCondition, Test condition is invalid {0}", condition.test);
            }

            return testResult;
          },

          getCurrentPath: function () {
            var urlPath = $location.path();
            var currentPath = '';

            var items = urlPath.split('/');
            if (items.length > 2) {
              var index = urlPath.lastIndexOf("/");
              currentPath = urlPath.substring(0, index + 1);
            } else {
              currentPath = urlPath;
            }
            return currentPath;
          },

          getAllStates: function () {
            return journeyStates;
          },
          getNextStep: function (model, dataModelService, args) {
            var nextPage;
            var currentPath = this.getCurrentPath();

            try {
              var currentState = _.findWhere(journeyStates.states, {pageUrl: currentPath});
              nextPage = currentState.nextPage;

              if (currentState.conditions.length > 0) {
                //sort the conditions based on priority
                currentState.conditions.sort(function (a, b) {
                  if (a.priority > b.priority) {
                    return 1;
                  }
                  if (a.priority < b.priority) {
                    return -1;
                  }
                  return 0;
                });
                //return the first condition that matches
                var truthyCondition;
                try {
                  var testMethod = this.testStateCondition;
                  currentState.conditions.some(function (testCondition) {
                    if (testMethod(model, testCondition, dataModelService)) {
                      truthyCondition = testCondition;
                      return true;
                    }
                  });
                }catch(e){
                  $log.error(e);
                }

                if(!truthyCondition){
                  throw String.format("NavigationService: TestCondition found no truthy conditions for state {0}", currentState.pageName)
                }

                if (truthyCondition.description) {
                  $log.debug(String.format('NavigationService test {0}', truthyCondition.description))
                }
                nextPage = truthyCondition.nextPage;
                if(truthyCondition.args) {
                  args = truthyCondition.args;
                }

              }
              //_.each(currentState.conditions, function (condition) {
              //Test function first


              //  if (eval("typeof " + condition.test + " === 'function'")) {
              //  try {
              //    var response = eval(condition.test)();
              //    if (typeof response === 'object') {
              //      if (_.has(response, 'args')) {
              //        args = response.args;
              //      }
              //      if (response.condition == condition.expected) {
              //        if (condition.description) {
              //          $log.debug(String.format('NavigationService test {0}', condition.description))
              //        }
              //        if (_.isBoolean(condition.includeArgs) && !condition.includeArgs) {
              //          args = null;
              //        }
              //        nextPage = condition.nextPage;
              //      }
              //    }
              //    else if (typeof response === 'boolean') {
              //      if (response == condition.expected) {
              //        if (condition.description) {
              //          $log.debug(String.format('NavigationService test {0}', condition.description))
              //        }
              //        if (_.isBoolean(condition.includeArgs) && !condition.includeArgs) {
              //          args = null;
              //        }
              //        nextPage = condition.nextPage;
              //      }
              //    }
              //  }
              //  catch(e){
              //    $log.error(String.format('NavigationService caught an error attempting to eval {0}', condition.test), e);
              //    throw e.message;
              //  }
              //}
              //
              ////Test model
              //else if (_.has(model, condition.model)) {
              //  if (_.has(model[condition.model], condition.test)) {
              //    var testProp = model[condition.model][condition.test];
              //    if (testProp == condition.expected) {
              //      if (condition.description) {
              //        $log.debug(String.format('NavigationService test {0}', condition.description))
              //      }
              //      if (_.isBoolean(condition.includeArgs) && !condition.includeArgs) {
              //        args = null;
              //      }
              //      nextPage = condition.nextPage;
              //    }
              //  }
              //}
              //else {
              //  throw "Test condition is invalid";
              //}
              //});//_.each
              //} // currentState.conditions.length > 0


              if (nextPage) {
                var nextState = _.findWhere(journeyStates.states, {pageName: nextPage}).pageUrl;
                if (args != null) {
                  nextState += args;
                }
                // transition to the next view
                $location.path(nextState);
              } else {
                $log.error(String.format('NavigationService: navigating from {0} there was no nextPage defined', currentPath));
              }
            }
            catch (e) {
              $log.error('NavigationService: exception caught', e);
              //TODO we need to navigate to an error screen
            }
          }

        };
      }]
  };
};
