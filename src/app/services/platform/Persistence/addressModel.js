/**
 * Created by gabello on 8/13/2015.
 */
angular.module('quotes.persistence')
  .factory('AddressModel', ['$q',
    function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          AddressLine1:null,
          AddressLine2:null,
          AddressType:null,
          Apt:null,
          City:null,
          Country:null,
          Counties:[],
          County:null,
          Id:null,
          PostalCode:null,
          State:null
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {




        populateData: function (data) {
          _.extend(this, data);
        }
      });

      return clazz;
    }
  ]);
