/**
 * Created by gabello on 12/15/2014.
 */
function SegmentIoTrackingService() {
  'use strict';

  return [ function () {
    return {

      start: function () {
        return new Date().getTime();
      },
      end: function (startTime, url, stat, type) {
      },
      trackCustomEvent: function (event, eventData) {

      },
      trackValidationEvent: function (event, passed, eventData) {

      },

      trackGeneralEvent: function (event, eventData) {

      },

      trackPage: function(){

      }
    };
  }];
}
