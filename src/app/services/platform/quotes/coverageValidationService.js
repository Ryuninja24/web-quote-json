/**
 * Created by gabello on 12/19/2014.
 */

angular.module('platform.quotes', [])
  .factory('coverageValidationService', CoverageValidationService());

function CoverageValidationService() {
  'use strict';

  function HasValue(item){
    return !_.isUndefined(item) && !_.isNull(item) && item !== 'none' && item !== '@none';
  }

  function ParseValue(item){
    if(!isNaN(item)){
      return parseInt(item,10);
    }
    return 0;
  }

  //Rule #1 Uninsured/Underinsured Motorist Bodily Injury is required.
  function Rule1(lineCoverages) {
    var umbiCoverage = _.findWhere(lineCoverages, {Code: 'PAUMBICov'});

    return {
      errorElement: 'PAUMBICov',
      errorIdentifier: 'Rule1',
      isValid: HasValue(umbiCoverage.Value)
    };
  }

  //Rule #2 Uninsured/Underinsured Motorist Property Damage is required
  function Rule2(lineCoverages) {
    var umpdCoverage = _.findWhere(lineCoverages, {Code: 'PAUMPDCov'});

    return {
      errorElement: 'PAUMPDCov',
      errorIdentifier: 'Rule2',
      isValid: HasValue(umpdCoverage.Value)
    };
  }

  //Rule #100 Property Damage limit cannot exceed Per Person BI limit.
  function Rule100(lineCoverages) {
    var bodilyInjuryCoverage = _.findWhere(lineCoverages, {Code: 'EISPABodilyInjuryCov'});
    var propertyDamageCoverage = _.findWhere(lineCoverages, {Code: 'EISPAPropertyDamageCov'});
    var bodilyInjuryValue = bodilyInjuryCoverage.Value.split('/');
    return {
      errorElement: 'EISPAPropertyDamageCov',
      errorIdentifier: 'Rule100',
      isValid: ParseValue(propertyDamageCoverage.Value) <= ParseValue(bodilyInjuryValue[0])
    };
  }

  //Rule #101 Uninsured/Underinsured Motorist Bodily Injury limits may not exceed Bodily Injury Limits.
  function Rule101(lineCoverages){
    var biCoverage = _.findWhere(lineCoverages, {Code: 'EISPABodilyInjuryCov'});
    var umbiCoverage = _.findWhere(lineCoverages, {Code: 'PAUMBICov'});
    //The BI values are always xx/xx so we split them to get upper and lower values
    var biCoverageValues = biCoverage.Value.split('/');
    var umbiCoverageValues = umbiCoverage.Value.split('/');
    var biCoverageResult = ParseValue(biCoverageValues[0]) * ParseValue(biCoverageValues[1]);
    var umbiCoverageResult = ParseValue(umbiCoverageValues[0]) * ParseValue(umbiCoverageValues[1]);
    return{
      errorElement: 'PAUMBICov',
      errorIdentifier: 'Rule101',
      isValid: umbiCoverageResult <= biCoverageResult
    };
  }

  //Rule #103 Uninsured/Underinsured Motorist Property Damage  limits may not exceed Property Damage Limits.
  function Rule103(lineCoverages){
    var pdCoverage = _.findWhere(lineCoverages, {Code: 'EISPAPropertyDamageCov'});
    var umpdCoverage = _.findWhere(lineCoverages, {Code: 'PAUMPDCov'});
    return{
      errorElement: 'PAUMPDCov',
      errorIdentifier: 'Rule103',
      isValid: ParseValue(umpdCoverage.Value) <= ParseValue(pdCoverage.Value * 1000)
    };
  }

  //Rule #104 Uninsured/Underinsured Motorist Bodily Injury limits must be the same as Bodily Injury limits.
  function Rule104(lineCoverages){
    var biCoverage = _.findWhere(lineCoverages, {Code: 'EISPABodilyInjuryCov'});
    var umbiCoverage = _.findWhere(lineCoverages, {Code: 'PAUMBICov'});
    return{
      errorElement: 'PAUMBICov',
      errorIdentifier: 'Rule104',
      isValid: biCoverage.Value == umbiCoverage.Value
    };
  }

  //Rule #105 Uninsured/Underinsured Motorist Property Damage must be the same as Property Damage Liability limits
  function Rule105(lineCoverages){
    var pdCoverage = _.findWhere(lineCoverages, {Code: 'EISPAPropertyDamageCov'});
    var umpdCoverage = _.findWhere(lineCoverages, {Code: 'PAUMPDCov'});

    var isValid = true;
    if((HasValue(pdCoverage.Value) && !HasValue(umpdCoverage.Value)) || (!HasValue(pdCoverage.Value) && HasValue(umpdCoverage.Value))) {
      isValid = false;
    }
    if(ParseValue(umpdCoverage.Value) != ParseValue(pdCoverage.Value * 1000)){
      isValid = false;
    }

    return{
      errorElement: 'EISPAPropertyDamageCov',
      errorIdentifier: 'Rule105',
      isValid: isValid
    };
  }

  //Rule #106 Uninsured/Underinsured motorist property damage coverage is only available with uninsured motorist bodily injury coverage.
  function Rule106(lineCoverages){
    var umpdCoverage = _.findWhere(lineCoverages, {Code: 'PAUMPDCov'});
    var umbiCoverage = _.findWhere(lineCoverages, {Code: 'PAUMBICov'});

    var isValid = true;
    if((HasValue(umpdCoverage.Value) && !HasValue(umbiCoverage.Value)) ){
      isValid = false;
    }

    return{
      errorElement: 'PAUMPDCov',
      errorIdentifier: 'Rule106',
      isValid: isValid
    };
  }

  //Rule #107 Uninsured/Underinsured motorist bodily injury coverage is only available with uninsured motorist property damage coverage.
  function Rule107(lineCoverages){

    var umbiCoverage = _.findWhere(lineCoverages, {Code: 'PAUMBICov'});
    var umpdCoverage = _.findWhere(lineCoverages, {Code: 'PAUMPDCov'});

    var isValid = true;
    if((HasValue(umbiCoverage.Value) && !HasValue(umpdCoverage.Value)) ){
      isValid = false;
    }

    return{
      errorElement: 'PAUMBICov',
      errorIdentifier: 'Rule107',
      isValid: isValid
    };
  }

  //Rule #108 Users can only select collision or UMPD coverage; they cannot have both.
  function Rule108(vehicleId, vehicleCoverages){
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});
    var umpdCoverage = _.findWhere(vehicleCoverages, {Code: 'EISPAUMPD_ILCov', VehicleId: vehicleId});
    return{
      errorElement: 'EISPAUMPD_ILCov',
      errorIdentifier: 'Rule108',
      isValid: !(HasValue(collCoverage.Value) && HasValue(umpdCoverage.Value))
    };
  }

  //Rule #109 Collision coverage cannot be selected without comprehensive coverage
  function Rule109(vehicleId, vehicleCoverages)
  {
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});

    var isValid = true;
    if((HasValue(collCoverage.Value) && !HasValue(compCoverage.Value)) ){
      isValid = false;
    }

    return{
      errorElement: 'PACollisionCov',
      errorIdentifier: 'Rule109',
      isValid: isValid
    };
  }

  //Rule #110 Your comprehensive deductible cannot exceed your collision deductiblee
  function Rule110(vehicleId, vehicleCoverages){
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(collCoverage.Value) && (ParseValue(compCoverage.Value) > ParseValue(collCoverage.Value))){
      isValid = false;
    }

    return {
      errorElement: 'PAComprehensiveCov',
      errorIdentifier: 'Rule110',
      isValid: isValid
    };
  }

  //Rule #112 Loan/Lease Payoff Coverage cannot be selected without Comprehensive and Collision.
  function Rule112(vehicleId, vehicleCoverages)
  {
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});
    var eispALoanGapCoverage = _.findWhere(vehicleCoverages, {Code: 'EISPALoanGapCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(eispALoanGapCoverage.Value) && (!HasValue(collCoverage.Value) || !HasValue(compCoverage.Value))){
        isValid = false;
    }

    return{
      errorElement: 'EISPALoanGapCov',
      errorIdentifier: 'Rule112',
      isValid: isValid
    };
  }

  //Rule #113 Collision coverage is required for rental insurance to be added to a vehicle.
  function Rule113(vehicleId, vehicleCoverages){
    var rentalCoverage = _.findWhere(vehicleCoverages, {Code: 'PARentalCov', VehicleId: vehicleId});
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(rentalCoverage.Value) && (!HasValue(collCoverage.Value))){
      isValid = false;
    }

    return{
      errorElement: 'PACollisionCov',
      errorIdentifier: 'Rule113',
      isValid: isValid
    };
  }

  //Rule #114 Comprehensive coverage is required for rental insurance to be added to a vehicle.
  function Rule114(vehicleId, vehicleCoverages){
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var rentalCoverage = _.findWhere(vehicleCoverages, {Code: 'PARentalCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(rentalCoverage.Value) && (!HasValue(compCoverage.Value))){
      isValid = false;
    }

    return{
      errorElement: 'PAComprehensiveCov',
      errorIdentifier: 'Rule114',
      isValid: isValid
    };
  }

  //Rule #115 Additional Custom Parts or Equipment coverage may be purchased only for a vehicle covered by Comprehensive and Collision Coverages
  function Rule115(vehicleId, vehicleCoverages){
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var customEquipmentCoverage = _.findWhere(vehicleCoverages, {Code: 'EISPACustEquipCov', VehicleId: vehicleId});
    var collCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(customEquipmentCoverage.Value) && (!HasValue(collCoverage.Value) || !HasValue(compCoverage.Value))){
      isValid = false;
    }

    return{
      errorElement: 'EISPACustEquipCov',
      errorIdentifier: 'Rule115',
      isValid: isValid
    };
  }

  //Rule #116 Additional Custom Parts or Equipment coverage may be purchased only for a vehicle covered by Comprehensive coverage.
  function Rule116(vehicleId, vehicleCoverages){
    var compCoverage = _.findWhere(vehicleCoverages, {Code: 'PAComprehensiveCov', VehicleId: vehicleId});
    var customEquipmentCoverage = _.findWhere(vehicleCoverages, {Code: 'EISPACustEquipCov', VehicleId: vehicleId});

    var isValid = true;
    if(HasValue(customEquipmentCoverage.Value) && (!HasValue(compCoverage.Value))){
      isValid = false;
    }

    return{
      errorElement: 'EISPACustEquipCov',
      errorIdentifier: 'Rule116',
      isValid: isValid
    };
  }

  //Diminishing Deductible main rule
  function DDRule(vehicleId, vehicleCoverages){
    var collisionCoverage = _.findWhere(vehicleCoverages, {Code: 'PACollisionCov', VehicleId: vehicleId});
    var eligible = false;
    var collisionSelected = false;
    if(collisionCoverage.Value >=500){
      eligible = true;
    }
    if(collisionCoverage.Value > 0){
      collisionSelected = true;
    }
    return {DDTriggered: true, collisionSelected:collisionSelected, eligible: eligible, vehicleId: vehicleId}
  }

  return function() {
    return {

      validatePolicyCoverages: function (index, lineCoverages, currentState) {
        var validationResponse = [];
        var currentCoverage = lineCoverages[index];
        switch (currentCoverage.Code) {
          case 'EISPABodilyInjuryCov' :
            validationResponse.push(Rule100(lineCoverages));
            validationResponse.push(Rule101(lineCoverages));
            if(currentState != 'TX') {
              validationResponse.push(Rule104(lineCoverages));
            }
            break;
          case 'EISPAPropertyDamageCov':
            validationResponse.push(Rule100(lineCoverages));
            if(currentState === 'VA' || currentState === 'MD' || currentState == 'TX') {
              validationResponse.push(Rule103(lineCoverages));
            }
            if(currentState === 'VA' || currentState === 'MD') {
              validationResponse.push(Rule105(lineCoverages));
            }
            break;
          case 'PAUMBICov' :
            if(currentState != 'TX') {
              //Required for VA, MD, IL
              validationResponse.push(Rule1(lineCoverages));
            }
            validationResponse.push(Rule101(lineCoverages));
            if(currentState != 'TX') {
              validationResponse.push(Rule104(lineCoverages));
            }
            if(currentState != 'IL')
            {
              validationResponse.push(Rule106(lineCoverages));
              validationResponse.push(Rule107(lineCoverages));
            }else{

            }
            break;
          case 'PAUMPDCov':
            if(currentState == 'VA' || currentState == 'MD') {
              //Required for VA, MD
              validationResponse.push(Rule2(lineCoverages));
            }
            if(currentState === 'VA' || currentState === 'MD' || currentState == 'TX') {
              validationResponse.push(Rule103(lineCoverages));
            }
            if(currentState === 'VA' || currentState === 'MD') {
              validationResponse.push(Rule105(lineCoverages));
            }

            if(currentState != 'IL')
            {
              validationResponse.push(Rule106(lineCoverages));
              validationResponse.push(Rule107(lineCoverages));
            }else{

            }
            break;
          default:
        }//switch

        return validationResponse;
      },

      validateVehicleCoverages: function(vehicleFormItem, allVehicleCoverages, currentState){
        var validationResponse = [];

        //Gets the vehicle to validate
        var vehicleId = vehicleFormItem.coverage.VehicleId;
        var code = vehicleFormItem.coverage.Code;

        switch(code){
          case 'PAComprehensiveCov':
            validationResponse.push(Rule109(vehicleId, allVehicleCoverages));
            validationResponse.push(Rule110(vehicleId, allVehicleCoverages));
            validationResponse.push(Rule112(vehicleId, allVehicleCoverages));

            if(currentState !== 'VA') {
              validationResponse.push(Rule115(vehicleId, allVehicleCoverages));
            }
            if(currentState === 'VA') {
              validationResponse.push(Rule114(vehicleId, allVehicleCoverages));
              validationResponse.push(Rule116(vehicleId, allVehicleCoverages));
            }
            break;
          case 'PACollisionCov':
            if(currentState === 'IL') {
              validationResponse.push(Rule108(vehicleId, allVehicleCoverages));
            }
            validationResponse.push(Rule109(vehicleId, allVehicleCoverages));
            validationResponse.push(Rule110(vehicleId, allVehicleCoverages));
            validationResponse.push(Rule112(vehicleId, allVehicleCoverages));
            validationResponse.push(DDRule(vehicleId, allVehicleCoverages));
            if(currentState !== 'VA') {
              validationResponse.push(Rule113(vehicleId, allVehicleCoverages));
              validationResponse.push(Rule115(vehicleId, allVehicleCoverages));
            }
            break;
          case 'PATowingLaborCov':
            break;
          case 'PARentalCov':
            if(currentState !== 'VA') {
              validationResponse.push(Rule113(vehicleId, allVehicleCoverages));
            }
            if(currentState === 'VA') {
              validationResponse.push(Rule114(vehicleId, allVehicleCoverages));
            }
            break;
          case 'EISPALoanGapCov':
            validationResponse.push(Rule112(vehicleId, allVehicleCoverages));
            break;
          case 'EISPAUMPD_ILCov' :
            if(currentState === 'IL') {
              validationResponse.push(Rule108(vehicleId, allVehicleCoverages));
            }
            break;
          case 'EISPACustEquipCov' :
            if(currentState !== 'VA') {
              validationResponse.push(Rule115(vehicleId, allVehicleCoverages));
            }
            if(currentState === 'VA') {
              validationResponse.push(Rule116(vehicleId, allVehicleCoverages));
            }
            break;
          default:
        }//switch

        return validationResponse;
      }
    }
  };
}
