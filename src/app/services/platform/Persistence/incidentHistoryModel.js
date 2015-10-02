/**
 * Created by gabello on 9/15/2015.
 */
angular.module('quotes.persistence')
  .factory('IncidentHistoryModel', ['$q',
    function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          HasIncidents: null,
          HasConvictions:null,
          Infractions: [
            {
              Id:null,
              DriverId: null,
              IncidentClassificationId: null,
              DateOfIncident: null
            }
          ]
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {

        init: function () {
          if (!this.Id) {
            this.Id = String.createGuid();
          }
        },


        populateData: function (data) {
          _.extend(this, data);
        }
      });

      return clazz;
    }
  ]);
