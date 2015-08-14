/**
 * Created by gabello on 8/5/2015.
 */
function NavigationService() {
    'use strict';

    var journeyStates = {};

    return {
        addJourney: function(metaDataObj) {
            angular.extend(journeyStates, metaDataObj);
        },

        $get: ['$parse', '$location', '$log',
            function( $parse, $location, $log ) {

                return {

                    states: journeyStates,

                    getCurrentPath: function(){
                        var urlPath = $location.path();
                        var currentPath = '';

                        var items = urlPath.split('/');
                        if(items.length > 2){
                            var index = urlPath.lastIndexOf("/");
                            currentPath = urlPath.substring(0,index + 1);
                        }else{
                            currentPath = urlPath;
                        }
                        return currentPath;
                    },

                    getAllStates: function(){
                        return journeyStates;
                    },
                    getNextStep: function(model, args){
                        var nextPage;
                        var currentPath = this.getCurrentPath();

                        try {
                            var currentState = _.findWhere(journeyStates.states, {pageUrl: currentPath});
                            nextPage = currentState.nextPage;
                            if (currentState.conditions.length > 0) {
                                if (!model || model == null) {
                                    //We need to throw an exception here cause we have conditions but no model to test
                                    throw String.format('NavigationService: navigating from {0} we have conditions but no model to test', currentPath);
                                }
                                _.each(currentState.conditions, function (condition) {
                                  if(_.has(model, condition.model)) {
                                    if (_.has(model[condition.model], condition.test)) {
                                      var testProp = model[condition.model][condition.test];
                                      if (testProp == condition.expected) {
                                        if (_.isBoolean(condition.includeArgs) && !condition.includeArgs) {
                                          args = null;
                                        }
                                        nextPage = condition.nextPage;
                                      }
                                    }
                                  }
                                });
                            }
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
                        catch(e){
                            $log.error('NavigationService: exception caught', e);
                            //TODO we need to navigate to an error screen
                        }
                    }

                };
            }]
    };
};
