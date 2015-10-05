/**
 * Created by gabello on 10/5/2015.
 */
angular.module('quotes.persistence')
  .factory('IncidentModel', ['$q',
    function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          DateOfIncident: null,
          DriverId: null,
          Id: null,
          IncidentClassificationId: null
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

        isExistsDate: function(){
          return this.DateOfIncident;
        },

        //Checks to see if this is a valid date format
        isValidDate: function(){
          if(!this.DateOfIncident){return false;}
          var m = moment(this.DateOfIncident.substring(0, 10), ['MMDDYYYY', 'MM-DD-YYYY'], true);
          return m.isValid();
        },

        //Gets the current date in seconds
        getDateInSeconds: function(){
          var cleanDate = this.DateOfIncident.trimRight('_');
          var currentDate = new Date();
          var incDate = new Date(cleanDate.replace(/-/g, "/"));
          var seconds = moment(currentDate).diff(incDate, 'seconds');
          return seconds;
        },

        //Nothing older than 5 years
        isPastDate: function(){
          if(this.isValidDate()) {
            return this.getDateInSeconds() <= 157871030;
          }else{
            return false;
          }
        },

        //Cannot be a future date
        isFutureDate: function(){
          if(this.isValidDate()) {
            return this.getDateInSeconds() >= 0;
          }else{
            return false;
          }
        },

        //Do we have a driverId
        isValidDriver: function(){
          return this.DriverId;
        },

        //Do we have a valid IncidentId
        isValidIncidentClassification: function(){
          return !(!this.IncidentClassificationId || this.IncidentClassificationId === '');

        },

        populateData: function (data) {
          _.extend(this, data);
        }
      });

      return clazz;
    }
  ]);
