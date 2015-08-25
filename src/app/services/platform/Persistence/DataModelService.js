/**
 * Created by gabello on 8/12/2015.
 */
angular.module('quotes.persistence', [])
  .service('dataModelService', [
    'DataModel',
    'VehicleModel',
    'DriverModel',
    'AddressModel',
    'AccountModel',
    function (dataModel, vehicleModel, driverModel, addressModel, accountModel) {
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

      //--------------- Account Model  -------------------------------------------------
      this.saveAccount = function (account) {
        if (!account) {
          return;
        } else {
          var dataModel = this.getQuoteModel();
          dataModel.Account = account;
        }
      };

      this.getAccount = function () {
        var dataModel = this.getQuoteModel();
        var account = dataModel.Account;
        if (!account) {
          account = new accountModel();
          account.init();
        }
        return angular.copy(account);
      };

      //--------------- Address Model  -------------------------------------------------
      this.saveAddress = function (address) {
        if (!address) {
          return;
        } else {
          var dataModel = this.getQuoteModel();
          dataModel.Address = address;
        }
      };

      this.getAddress = function () {
        var dataModel = this.getQuoteModel();
        var address = dataModel.Address;
        if (!address) {
          address = new addressModel();
          address.init();
        }
        return angular.copy(address);
      };

      //--------------- Driver Functions  -------------------------------------------------
      this.createDriver = function(){
        var driver = new driverModel();
        driver.init();
        return driver;
      };

      this.getDriver = function (id) {
        var dataModel = this.getQuoteModel();
        //Making some assumptions at this point if no id then return policyHolder, if no policyholder then create and return
        //a new driver. If id is 0 return a new driver
        var driver = null;
        if(!id){
          // No Id was passed so either return the policyholder or if there are no drivers return a new one
          if(!dataModel.Drivers || dataModel.Drivers.length == 0){
            driver = this.createDriver();
          }else {
            driver = _.findWhere(dataModel.Drivers, {PrimaryDriver: true});
            if (!driver) {
              driver = this.createDriver();
            }
          }
        }else if(id == 0){
          // Creates a new driver
          driver = this.createDriver();
        }else {
          // We do have a driverID so find it and return
          driver = _.findWhere(dataModel.Drivers, {Id: id});
          if (!driver) {
            driver = this.createDriver();
          }
        }
        return angular.copy(driver);
      };

      this.saveDriver = function (modelData, quoteDataModel) {
        var driverCopy = modelData.driver;
        if (driverCopy) {
          //Find the original if it exists
          driverCopy.cleanDriverDefaults();
          var driver = _.findWhere(quoteDataModel.Drivers, {Id: driverCopy.Id});
          if (driver) {
            //we have found a matching driver so replace it
            var index = _.indexOf(quoteDataModel.Drivers, driver);
            quoteDataModel.Drivers[index] = driverCopy;
          }
          else {
            //Primer so we will never try to add a driver without a collection
            if (!quoteDataModel.Drivers) {
              quoteDataModel.Drivers = [];
              //this is the first driver so set as primary
              driverCopy.setAsPrimary();
            }
            //could not find matching driver so add new one
            quoteDataModel.Drivers.push(driverCopy);
          }
        }
      };
      //--------------- End Driver Functions  -------------------------------------------------

      //--------------- Vehicle Functions  -------------------------------------------------
      this.getVehicle = function (id) {
        if(id == undefined || id == null){
          return;
        }
        var vehicle = null;
        if(id == 0){
          vehicle = new vehicleModel();
          vehicle.init();
          return angular.copy(vehicle);
        }else {
          var dataModel = this.getQuoteModel();
          if(dataModel.Vehicles && dataModel.Vehicles.length > 0) {
            var vehicle = _.findWhere(quoteDataModel.Vehicles, {Id: id});
            if (!vehicle) {
              vehicle = new vehicleModel();
              vehicle.init();
            }
            return angular.copy(vehicle);
          }
        }
      };

      this.saveVehicle = function (modelData, quoteDataModel) {
        var vehicleCopy = modelData.vehicle;
        if (vehicleCopy) {
          //Find the original if it exists
          vehicleCopy.cleanVehicleDefaults();
          var vehicle = _.findWhere(quoteDataModel.Vehicles, {Id: vehicleCopy.Id});
          if (vehicle) {
            //we have found a matching vehicle so replace it
            var index = _.indexOf(quoteDataModel.Vehicles, vehicle);
            quoteDataModel.Vehicles[index] = vehicleCopy;
          }
          else {
            //Primer so we will never try to add a vehicle without a collection
            if (!quoteDataModel.Vehicles) {
              quoteDataModel.Vehicles = [];
            }
            //could not find matching vehicle so add new one
            quoteDataModel.Vehicles.push(vehicleCopy);
          }
        }
      };
      //--------------- End Vehicle Functions  -------------------------------------------------

      //--------------- Model Functions  -------------------------------------------------------
      this.getModels = function (IdObject) {
        var models = {
          'vehicle': this.getVehicle(IdObject.vehicleId),
          'driver': this.getDriver(IdObject.driverId),
          'address': this.getAddress(),
          'account': this.getAccount()
        };
        return models;
      };

      this.saveModelData = function (modelData) {
        var quoteModel = this.getQuoteModel();
        this.saveVehicle(modelData, quoteModel);
        this.saveDriver(modelData, quoteModel);
        this.saveAddress(modelData.address);
        this.saveAccount(modelData.account)
      };

      this.validateModelData = function(modelData){
        var validationResponse = [];
        if(modelData.driver){
          var driverElements = modelData.driver.validate();
          if(driverElements){
            validationResponse.push(driverElements);
          }
        }

        return validationResponse;
      };

      //--------------- End Model Functions  ---------------------------------------------------
    }]);


