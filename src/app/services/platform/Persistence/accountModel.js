/**
 * Created by gabello on 8/18/2015.
 */
angular.module('quotes.persistence')
  .factory('AccountModel', ['$q',
    function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          PolicyStartDate:null,
          Id:null
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {

        init:function(){
          if(!this.PolicyStartDate){
            this.PolicyStartDate = moment(new Date()).add(1, 'days').format('L');
          }
          if(!this.Id){
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
