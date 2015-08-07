'use strict';

/**
 * @ngdoc service
 * @name webQuoteJson.Quotedataservice
 * @description
 * # Quotedataservice
 * Service in the webQuoteJson.
 */

function QuoteDataService() {

  return [function () {
    var addresses = [];
    var bind = {};
    var ancillaryPlans = [];
    var vehicles = [];
    var drivers = [];
    var policyCoverages = [];
    var quote = {};
    var quoteIntent = {};
    var incidents = [];
    var hasIncidents = null;
    var hasConvictions = null;
    var paymentPlan = {};
    var discounts = [];
    var policy = {};
    var brokerWebData = null;
    var ancillaryPurchaseResponse = null;
    var dmsData = {};
    var years = [];
    var LienHolders = [];
    var leadData = null;
    var previouslyReadLeadControllers = [];

    this.init = function () {
      addresses = [];
      bind = {};
      ancillaryPlans = {};
      vehicles = [];
      drivers = [];
      policyCoverages = [];
      quote = {};
      quoteIntent = {};
      incidents = [];
      hasIncidents = null;
      hasConvictions = null;
      paymentPlan = {};
      discounts = [];
      policy = {};
      var ancillaryPurchaseResponse = {};
      dmsData = {};
    };


    //--------------- Has Incidents  -------------------------------------------------
    this.hasIncidents = function () {
      return hasIncidents;
    };

    this.setHasIncidents = function (boolVal) {
      hasIncidents = boolVal;
    };
    //--------------- End Has Incidents ----------------------------------------------

    //--------------- Has Convictions  -------------------------------------------------
    this.hasConvictions = function () {
      return hasConvictions;
    };

    this.setHasConvictions = function (boolVal) {
      hasConvictions = boolVal;
    };
    //--------------- End Has Convictions ----------------------------------------------

    //--------------- Lead Data ----------------------------------------------
    this.saveLeadData = function (leadDataResult) {
      leadData = leadDataResult;
    };

    this.getLeadData = function () {
      return leadData;
    };

    //forces a one time read by controller name
    this.getLeadDataByController = function (controllerName) {
      if (!_.contains(previouslyReadLeadControllers, controllerName)) {
        previouslyReadLeadControllers.push(controllerName);
        return leadData;
      } else {
        return null;
      }
    };


    //--------------- End Lead Data ------------------------------------------

    //--------------- Lienholders ----------------------------------------------
    this.saveLienHolderData = function (lienHolderData) {
      if (lienHolderData && lienHolderData.length > 0) {
        LienHolders = lienHolderData;
      }
    };

    this.getLienHolderData = function () {
      return LienHolders;
    };

    this.getLienHolder = function (lienHolder) {
      return _.findWhere(LienHolders, {Name: lienHolder});
    };

    //--------------- End Lienholders ------------------------------------------


    //--------------- Broker Web ----------------------------------------------
    this.saveBrokerWebData = function (brokerData) {
      if (brokerData) {
        brokerWebData = brokerData;
      }
    };

    this.getBrokerWebData = function () {
      return brokerWebData;
    };
    //--------------- End Broker Web ------------------------------------------

    //--------------- Discounts ----------------------------------------------
    this.saveDiscounts = function (discountItems) {
      if (discountItems && discountItems.length > 0) {
        discounts = [];
      }
      discounts = discountItems;
    };


    this.saveDiscount = function (discountItem) {

      var discount = _.findWhere(discounts, {Id: discountItem.Id});
      if (discount) {
        var index = _.indexOf(discounts, discount);
        discounts[index] = discountItem;
      }
      else {
        discounts.push(discountItem);
      }

    };

    this.getDiscounts = function () {
      return discounts;
    };
    //--------------- End Discounts ------------------------------------------

    //--------------- QuoteIntent ----------------------------------------------
    this.saveQuoteIntent = function (quoteIntentData) {
      if (quoteIntentData) {
        quoteIntent = quoteIntentData;
      }
    };

    this.getQuoteIntent = function () {
      return angular.copy(quoteIntent);
    };

    this.getLink = function (linkName) {
      var link = _.findWhere(quoteIntent.Links, {Rel: linkName});
      if (link) {
        return link.Href;
      }
      else {
        return undefined;
      }
    };

    this.getQuoteRefId = function () {
      return quoteIntent.Id;
    };

    //--------------- Address ----------------------------------------------
    this.saveAddress = function (addressData) {
      if (!addressData) {
        return;
      }

      //default the County if there is only one
      if (!addressData.County && addressData.Counties && addressData.Counties.length == 1) {
        addressData.County = addressData.Counties[0].Name;
      }

      var address = _.findWhere(addresses, {AddressType: addressData.AddressType});
      if (address) {
        //we have found a matching address so replace it
        var index = _.indexOf(addresses, address);
        addresses[index] = addressData;
      }
      else {
        //this is a new address based on addressType so save it
        addresses.push(addressData);
      }
    };

    //Physical - 1, Mailing - 2
    this.getAddressByType = function (addressType) {
      return _.findWhere(addresses, {AddressType: addressType});
    };

    this.getAddresses = function () {
      return addresses;
    };

    this.getAddressState = function () {
      var address = this.getAddressByType('Physical');
      if (address) {
        return address.State;
      }
    };

    //--------------- Driver ----------------------------------------------

    //Removes the driver from the list of drivers and searches through the vehicles and
    //removes any reference to the deleted driver
    this.removeDriver = function (driverId) {
      drivers.splice(_.indexOf(drivers, _.findWhere(drivers, {Id: driverId})), 1);
      _.forEach(vehicles, function (vehicle) {
        if (vehicle.PrimaryDriverId === driverId) {
          vehicle.PrimaryDriverId = null;
        }
      })
    };

    //Saves the driver to the drivers array if one already exists
    //it is replaced
    this.saveDriver = function (driverData) {
      var driver = _.findWhere(drivers, {Id: driverData.Id});
      if (driver) {
        var index = _.indexOf(drivers, driver);
        drivers[index] = driverData;
      }
      else {
        drivers.push(driverData);
      }
    };

    //Returns the Driver with PrimaryDriver = true
    this.getPolicyHolder = function () {
      var driver = _.findWhere(drivers, {PrimaryDriver: true});
      if (driver) {
        return angular.copy(driver);
      }

    };

    this.getSpouse = function () {
      var driver = _.findWhere(drivers, {RelationToInsured: 'Spouse'});
      if (driver) {
        return angular.copy(driver);
      }
    };

    this.getDriverIncidentLink = function (driverId) {
      var driver = _.findWhere(drivers, {Id: driverId});
      return _.find(driver.Links, function (link) {
        return link.Rel == 'incident';
      });
    };

    //Returns a list of all the drivers
    this.getDrivers = function () {
      var driverCopies = [];
      _.each(drivers, function (driver) {
        driverCopies.push(angular.copy(driver));
      });
      return driverCopies;
    };

    //Returns the Driver found with the Id matching the id parameter
    this.getDriverById = function (id) {
      var driver = _.findWhere(drivers, {Id: id});
      if (driver) {
        return angular.copy(driver);
      }
    };

    this.updateDriverLicenseInfo = function (driverId, licenseNumber, licenseState) {
      var driver = _.findWhere(drivers, {Id: driverId});
      if (driver) {
        driver.LicenseNumber = licenseNumber;
        driver.LicenseState = licenseState;
      }
    };

    this.getRatedDrivers = function () {
      var ratedDriverCopies = [];
      var ratedDrivers = _.where(drivers, {RatingStatus: 'Rated'});
      _.each(ratedDrivers, function (driver) {
        ratedDriverCopies.push(angular.copy(driver));
      });
      return ratedDriverCopies;
    };

    this.getDriverAddressLink = function () {
      var driver = this.getPolicyHolder();
      if (driver) {
        return _.find(driver.Links, function (link) {
          return link.Rel == 'address';
        });
      }
    };

    //Returns all drivers for display purposes only
    this.getReadOnlyDriver = function () {
      return drivers;
    };

    //Returns the next available driver in the Drivers collection that is not the
    //primary driver.
    this.getNextDriver = function () {
      var nonPolicyHolderDrivers = _.filter(drivers, function (driver) {
        return driver.PrimaryDriver != true;
      });
      if (nonPolicyHolderDrivers) {
        var driver = nonPolicyHolderDrivers[0];
        if (driver) {
          return angular.copy(driver);
        }
      } else {
        return null;
      }
    };

    //--------------- Incidents ----------------------------------------------

    this.saveIncident = function (incidentData) {
      if (incidentData) {
        incidents.push(incidentData);
      }
    };

    this.removeIncident = function (incidentId) {
      incidents.splice(_.indexOf(incidents, _.findWhere(incidents, {Id: incidentId})), 1);
    };

    this.getIncidents = function () {
      return incidents;
    };

    this.getIncidentById = function (id) {
      return _.findWhere(incidents, {Id: id});
    };

    //--------------- Vehicle ----------------------------------------------

    this.saveVehicleYears = function (yearData) {
      if (yearData) {
        if (years && years.length > 0) {
          years = [];
        }
        var tempYears = [];
        _.each(yearData, function (yearItem) {
          tempYears.push(yearItem.Year);
        });

        years = _.sortBy(tempYears, function (year) {
          return year;
        });
      }
    };

    this.getVehicleYears = function () {
      return years;
    };

    this.getMinVehicleYear = function () {
      return _.min(years);
    };

    this.getMaxVehicleYear = function () {
      return _.max(years);
    };

    //Removes the specified vehicle from the vehicle list
    this.removeVehicle = function (vehicleId) {
      vehicles.splice(_.indexOf(vehicles, _.findWhere(vehicles, {Id: vehicleId})), 1);
      _.forEach(drivers, function (driver) {
        if (driver.PrimaryVehicleId === vehicleId) {
          driver.PrimaryVehicleId = null;
        }
      })
    };

    //Saves the vehicle to the vehicles array if one already exists
    //it is replaced
    this.saveVehicle = function (vehicleData) {

      var vehicle = _.findWhere(vehicles, {Id: vehicleData.Id});
      if (vehicle) {
        var index = _.indexOf(vehicles, vehicle);
        vehicles[index] = vehicleData;
      }
      else {
        vehicles.push(vehicleData);
      }
    };

    this.getVehicleCount = function () {
      if (vehicles && vehicles.length > 0) {
        return vehicles.length;
      } else {
        return 0;
      }
    };

    this.getVehicles = function () {
      var vehicleCopies = [];
      _.each(vehicles, function (vehicle) {
        vehicleCopies.push(angular.copy(vehicle));
      });
      return vehicleCopies;
    };

    //Returns the Vehicle found with the Id matching the id parameter
    this.getVehicleById = function (id) {
      var vehicle = _.findWhere(vehicles, {Id: id});
      if (vehicle) {
        return angular.copy(vehicle);
      }
    };

    this.updateVehicleVin = function (id, vin) {
      var vehicle = _.findWhere(vehicles, {Id: id});
      if (vehicle) {
        vehicle.Vin = vin;
      }
    };

    this.updateVehicleLienData = function (id, name, address1, city, state, zip) {
      var vehicle = _.findWhere(vehicles, {Id: id});
      if (vehicle) {
        vehicle.LienHolder = {
          Name: name,
          AddressLine1: address1,
          City: city,
          State: state,
          PostalCode: zip
        }
      }
    };

    this.getNextVehicle = function () {
      if (vehicles.length > 0) {
        return angular.copy(_.first(vehicles));
      } else {
        return null;
      }
    };

    //Returns all vehicles for display purposes only
    this.getReadOnlyVehicles = function () {
      return vehicles;
    };

    //--------------- PolicyCoverage ----------------------------------------------
    this.savePolicyCoverage = function (coverageData) {
      if (coverageData) {
        policyCoverages.push(coverageData);
      }
    };

    this.getPolicyCoverages = function () {
      return policyCoverages;
    };

    //--------------- Quote ----------------------------------------------
    this.saveQuote = function (quoteData) {
      if (quoteData) {
        quote = quoteData;
      }
    };

    this.getQuote = function () {
      return angular.copy(quote);
    };

    this.getQuotePaymentPlans = function () {
      return quote.PaymentPlans;
    };

    //--------------- PaymentPlan ----------------------------------------------

    this.savePaymentPlan = function (paymentPlanData) {
      if (paymentPlanData) {
        paymentPlan = paymentPlanData;
      }
    };

    this.getPaymentPlan = function () {
      return paymentPlan;
    };

    //---------------- Policy ---------------------------------------------------

    this.savePolicy = function (policyData) {
      if (policyData) {
        policy = policyData;
      }
    };

    this.getPolicy = function () {
      return angular.copy(policy);
    };

    //---------------- Bind -----------------------------------------------------

    this.saveBindRequest = function (bindRequest) {
      if (bindRequest) {
        bind = bindRequest;
      }
    };

    this.getBindRequest = function () {
      return angular.copy(bind);
    };

    //---------------- ancillaryPlans-------------------------------------------------

    this.saveAncillaryPlans = function (plans) {
      if (plans) {
        ancillaryPlans = plans;
      }
    };

    this.getLegalPlan = function () {
      var legalPlan = _.findWhere(ancillaryPlans, {PlanId: 2});
      if (legalPlan) {
        return legalPlan;
      }
    };

    this.getLifePlan = function () {
      var lifePlan = _.findWhere(ancillaryPlans, {PlanId: 4});
      if (lifePlan) {
        return angular.copy(lifePlan);
      }
    };

    this.getAncillaryPlans = function () {
      var ancillaryPlanCopies = [];
      _.each(ancillaryPlans, function (ancillaryPlan) {
        ancillaryPlanCopies.push(angular.copy(ancillaryPlan));
      });
      return ancillaryPlanCopies;
    };

    this.saveAncillaryPurchaseResponse = function (response) {
      ancillaryPurchaseResponse = response;
    };

    this.getAncillaryPlansResponse = function () {
      return angular.copy(ancillaryPurchaseResponse);
    };

    //---------------- Dms Data-------------------------------------------------

    this.saveDmsData = function (dataObject) {
      if (dataObject) {
        dmsData = dataObject;
      }
    };

    this.hasDmsRun = function () {
      return !_.isEmpty(dmsData);
    };

    this.getDmsDrivers = function () {
      return dmsData.Drivers;
    };

    this.getDmsVehicles = function () {
      return dmsData.Vehicles;
    };
  }]
}



