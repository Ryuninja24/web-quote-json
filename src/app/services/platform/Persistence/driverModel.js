/**
 * Created by gabello on 8/12/2015.
 */
angular.module('quotes.persistence')
  .factory('DriverModel', ['$q', '$log', function ($q, $log) {
    var clazz = function (attributes) {
      var defaults = {
        AdditionalDrivers: null,
        AgeFirstLicensed: null,
        CurrentInsuranceLimits: null,
        CurrentInsuranceStatus: null,
        CurrentInsurer: null,
        CurrentlyInsured: null,
        CurrentPolicyExpirationDate: null,
        CurrentPremium: null,
        CurrentStudentEnrollment: null,
        CurrentlyEnrolled: null,
        CurrentZipCode: null,
        DateOfBirth: null,
        DrivesAnyListedVehicles: null,
        EmailAddress: null,
        EmailAddressConfirm: null,
        EmploymentStatus: null,
        FirstName: null,
        Gender: null,
        GoodStudentDiscount: null,
        HasIncidents: null,
        HighestLevelOfEducation: null,
        Id: null,
        LastName: null,
        LicenseNumber: null,
        LicenseState: null,
        LicenseStatus: null,
        MaritalStatus: '',
        MiddleName: null,
        MilitaryBranch: null,
        MilitaryStatus: null,
        NumberOfCreditPulls: null,
        Occupation: null,
        OwnsOwnVehicle: null,
        PreviousLapse: null,
        PrimaryDriver: null,
        PrimaryInsured: null,
        PrimaryVehicleId: null,
        ProcessingId: null,
        RatingStatus: null,
        RelationToInsured: null,
        ResidenceOwnership: null,
        Retired: null,
        SocialSecurityNumber: null,
        Suffix: null,
        Title: null,
        YearsAtCurrentResidence: null,
        YearsWithCurrentInsurer: null
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

      setAsPrimary: function () {
        this.RatingStatus = 'Rated';
        this.PrimaryDriver = true;
      },

      cleanDriverDefaults: function () {

      },

      //--------------- Validation Functions  -------------------------------------------------------

      //Validate the Age first licensed question, we need to have DateOfBirth to make this work
      validateAgeFirstLicensed: function (validationStates) {
        $log.debug('Validation age first licensed');
        if (this.DateOfBirth && this.AgeFirstLicensed) {
          if (isNaN(this.AgeFirstLicensed)) {
            validationStates.push({property:'AgeFirstLicensed', message:'notANumber', state:false});
          }else{
            validationStates.push({property:'AgeFirstLicensed', message:'notANumber', state:true});
          }
          var birthDate = new Date(this.DateOfBirth.replace(/-/g, "/"));
          var currentDate = new Date();
          var age = moment(currentDate).diff(birthDate, 'years');
          validationStates.push({property:'AgeFirstLicensed', message:'ageLowerRange', state:parseInt(this.AgeFirstLicensed, 10) >= 14});
          validationStates.push({property:'AgeFirstLicensed', message:'ageUpperRange', state:parseInt(this.AgeFirstLicensed, 10) <= age});
        }
      },

      validate: function () {
        var validationStates = [];
        this.validateAgeFirstLicensed(validationStates);
        return {model:'driver', validationItems: validationStates};
      }

      //--------------- End Validation Functions  -------------------------------------------------------

    });

    return clazz;
  }]);
