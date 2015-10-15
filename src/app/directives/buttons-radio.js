///**
// * Created by gabello on 9/15/2015.
// */
//function ButtonsRadio(){
//  'use strict';
//  return function(){
//    return {
//      restrict: 'E',
//      scope: { model: '=', options:'='},
//      controller: ['$scope', function($scope){
//        $scope.activate = function(option){
//          $scope.model = option['value'];
//        };
//
//        $scope.isActive = function(option) {
//          return option['value'] == $scope.model;
//        };
//
//        $scope.getDescription = function(option){
//          return option['description']
//        }
//      }],
//      template: "<label class='btn btn-default btn-sm form-50' "+
//      "ng-class='{active: isActive(option)}'"+
//      "ng-repeat='option in options' "+
//      "ng-click='activate(option)'analytics-on='click' analytics-event='primary driver {{getDescription(option)}}'>{{getDescription(option)}} "+
//      "</label>"
//    };
//  }
//}
//angular.module('platform.directives')
//  .directive('buttonsRadio', ButtonsRadio());
