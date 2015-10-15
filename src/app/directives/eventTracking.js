/**
 * Created by jholloman on 4/21/2015.
 */
'use strict';
function EventTracking() {
  return ['segmentIoTrackingService', function (segmentIoTrackingService) {

    function isCommand(element) {
      return ['a:', 'button:', 'button:button', 'button:submit', 'input:button', 'input:submit'].indexOf(
          element.tagName.toLowerCase() + ':' + (element.type || '')) >= 0;
    }

    function inferEventType(element) {
      if (isCommand(element)) return 'click';
      return 'click';
    }

    function inferEventName(element) {
      if (isCommand(element)) return element.innerText || element.value;
      return element.id || element.name || element.tagName;
    }

    function isProperty(name) {
      return name.substr(0, 9) === 'analytics' && ['On', 'Event', 'If', 'Properties', 'EventType'].indexOf(name.substr(9)) === -1;
    }

    function propertyName(name) {
      var s = name.slice(9); // slice off the 'analytics' prefix
      if (typeof s !== 'undefined' && s !== null && s.length > 0) {
        return s.substring(0, 1).toLowerCase() + s.substring(1);
      }
      else {
        return s;
      }
    }

    return {
      restrict: 'A',
      scope: true,
      link: function ($scope, $element, $attrs) {
        var eventType = $attrs.analyticsOn || inferEventType($element[0]);

        $scope.$analytics = {};

        angular.forEach($attrs.$attr, function (attr, name) {
          if (isProperty(name)) {
            $scope.$analytics[propertyName(name)] = $attrs[name];
            $attrs.$observe(name, function (value) {
              $scope.$analytics[propertyName(name)] = value;
            });
          }
        });

        angular.element($element[0]).bind(eventType, function ($event) {
          var eventName = $attrs.analyticsEvent || inferEventName($element[0]);
          var properties = {};
          $scope.$analytics.eventType = $event.type;

          if ($attrs.analyticsIf) {
            if (!$scope.$eval($attrs.analyticsIf)) {
              return; // Cancel this event if we don't pass the analytics-if condition
            }
          }
          // Allow components to pass through an expression that gets merged on to the event properties
          // eg. analytics-properites='myComponentScope.someConfigExpression.$analyticsProperties'
          if ($attrs.analyticsProperties) {
            angular.extend($scope.$analytics, $scope.$eval($attrs.analyticsProperties));
          }
          segmentIoTrackingService.trackGeneralEvent(eventName, $scope.$analytics);
        });
      }
    };
  }]
}
angular.module('platform.directives')
  .directive('analyticsOn', EventTracking());
