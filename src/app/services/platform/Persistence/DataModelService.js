/**
 * Created by gabello on 8/12/2015.
 */
  angular.module('quotes.persistence', [])
    .service('dataModelService', ['DataModel', 'VehicleModel', 'DriverModel', 'PolicyHolderModel', function (dataModel, vehicleModel, driverModel, policyHolderModel) {
      'use strict';

      var quoteDataModel = {};

      this.init = function () {
        quoteDataModel = {}
      };

      //--------------- Quote Model  -------------------------------------------------
      this.getQuoteModel = function () {
        if (!quoteDataModel) {
          return new dataModel();
        }
        return quoteDataModel;
      };

      this.saveQuoteModel = function (quoteData) {
        if (quoteData) {
          quoteDataModel = quoteData;
        }
      };
      //--------------- End Quote ----------------------------------------------

      this.saveAddress = function(address) {
        if (!address) {
          return;
        }else{
          var dataModel = this.getQuoteModel();
          dataModel.address = address;
        }
      };

      this.getVehicle = function(id){
        var dataModel = this.getQuoteModel();
        var vehicle = _.findWhere(quoteDataModel.Vehicles, {Id:id});
        if(!vehicle){
          vehicle = new vehicleModel();
        }
        return vehicle;
      }

      this.getModels = function(){
        var models = {'vehicle':new vehicleModel(), 'driver':new driverModel()};
        //models.push({'policyHolder': new policyHolderModel()});
        //models.push({'vehicle': new vehicleModel()});
        return models;
      }



    }]);


