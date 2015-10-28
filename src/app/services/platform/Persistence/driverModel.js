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
      getFullName: function(){
        return this.FirstName + ' ' + this.LastName;
      },
      setAsPrimary: function () {
        this.RatingStatus = 'Rated';
        this.PrimaryDriver = true;
      },

      cleanDriverDefaults: function () {

      },

      driverAge: function(model){
        if(model.DateOfBirth){
          return moment(new Date()).diff(moment(model.DateOfBirth, 'MM-DD-YYYY'), 'years');
        }else{
          return 0;
        }
      },

      isStudentAge: function(model){
        return !!(model.driverAge(model) >= 16 && model.driverAge(model) <= 24);
      },

      resetMilitaryStatus: function(model){
        model.MilitaryStatus = null;
      },

      showCurrentStudentEnrollment: function(model){
        return model.EmploymentStatus == 'FullTimeStudent';
      },

      showMilitaryBranch: function(model){
        return model.EmploymentStatus == 'Military' || model.EmploymentStatus == 'RetiredMilitary'
      },

      showMilitaryStatus: function(model){
        return model.MilitaryBranch && model.EmploymentStatus == 'Military' || model.EmploymentStatus == 'RetiredMilitary'
      },

      showOccupation: function(model){
        return model.EmploymentStatus == 'PrivatelyEmployed' || model.EmploymentStatus == 'Retired'
      },

      showGoodStudentDiscount: function(model){
        return (model.CurrentStudentEnrollment && (model.MaritalStatus == 'Widowed' || model.MaritalStatus == 'Divorced' || model.MaritalStatus == 'NeverMarried')
          && model.isStudentAge(model) && model.EmploymentStatus == 'FullTimeStudent');
      },
      showAdditionalDriverQuestions: function(model){
        return (model.LicenseStatus == 'Valid' || model.LicenseStatus == 'Restricted' || model.LicenseStatus == 'Expired'
          || model.LicenseStatus == 'Foreign' || model.LicenseStatus == 'Suspended' || model.LicenseStatus == 'Permit')
          && (model.RelationToInsured == 'Spouse' || model.CurrentlyInsured == false || (model.CurrentlyInsured == true && model.DrivesAnyListedVehicles == true))
      },

      resolveGoodStudentDiscount: function(model){
        if(model.PrimaryDriver) {
          if (model.EmploymentStatus != 'FullTimeStudent' || !this.isStudentAge(model) ||
            (model.MaritalStatus != 'NeverMarried' && model.MaritalStatus != 'Widowed' && model.MaritalStatus != 'Divorced')) {
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
          }
        }else{
          if (!model.isStudentAge(model) ||
            (model.MaritalStatus != 'NeverMarried' && model.MaritalStatus != 'Widowed' && model.MaritalStatus != 'Divorced')) {
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
          }
        }
      },

      resolveEmploymentStatus: function (model) {
        switch (this.EmploymentStatus) {
          case "PrivatelyEmployed":
          case "Retired":
            model.MilitaryStatus = null;
            model.MilitaryBranch = null;
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
            break;
          case "Homemaker":
            model.Occupation = '424';
            model.MilitaryStatus = null;
            model.MilitaryBranch = null;
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
            break;
          case "Unemployed":
            model.Occupation = '425';
            model.MilitaryStatus = null;
            model.MilitaryBranch = null;
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
            break;
          case "FullTimeStudent":
            model.MilitaryStatus = null;
            model.MilitaryBranch = null;
            break;
          case "Military":
          case "RetiredMilitary":
            model.Occupation = null;
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
            break;
          default:
            model.Occupation = null;
            model.MilitaryStatus = null;
            model.MilitaryBranch = null;
            model.GoodStudentDiscount = null;
            model.CurrentlyEnrolled = null;
        }

        if (model.EmploymentStatus == 'FullTimeStudent') {
          switch (model.CurrentStudentEnrollment) {
            case 'HighSchool' :
              model.Occupation = '427';
              break;
            case 'TradeSchool' :
            case 'CollegeDegreeFor2Years':
              model.Occupation = '428';
              break;
            case 'GraduateSchool' :
              model.Occupation = '426';
              break;
            case 'CollegeDegreeFor4Years' :
              model.Occupation = '429';
              break;
          }
        }

        if (model.CurrentlyEnrolledStudent === 'No') {
          model.GoodStudentDiscount = 'false'
        }
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
