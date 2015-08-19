/**
 * Created by gabello on 8/12/2015.
 */
angular.module('quotes.persistence')
  .factory('DriverModel', ['$q', function ($q) {
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

      init:function(){
        if(!this.Id){
          this.Id = String.createGuid();
        }
      },

      setAsPrimary: function(){
        this.RatingStatus = 'Rated';
        this.PrimaryDriver = true;
      },

      cleanDriverDefaults: function(){

      }

    });

    return clazz;
  }]);
