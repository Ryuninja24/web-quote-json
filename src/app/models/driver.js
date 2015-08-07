/**
 * Created by gabello on 10/8/2014.
 */
angular.module('quotes.driverModel', [])
  .factory('DriverModel', ['$q', 'internalAPIDataService', 'quoteDataService', 'ResponseMessage', 'LookupDataService',
    function ($q, internalAPIDataService, quoteDataService, responseMessage, lookupDataService) {
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
          IdField: null,
          LastName: null,
          LicenseNumber: null,
          LicenseState: null,
          LicenseStatus: null,
          Links: [
            {
              Href: null,
              Rel: null
            }
          ],
          MaritalStatus: '',
          MiddleName: null,
          MilitaryBranch: null,
          MilitaryStatus: null,
          NumberOfCreditPulls: null,
          Occupation: null,
          OwnsOwnVehicle: null,
          PhoneNumber: {
            Primary: true,
            Value: null,
            PhoneNumberType: 'Home',
            Id: null,
            ProcessingId: null,
            Links: [
              {
                Href: null,
                Rel: null
              }
            ]
          },
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

        getFullName: function () {
          if (this.FirstName !== '' && this.LastName !== '') {
            return this.FirstName + ' ' + this.LastName;
          } else if (this.FirstName !== '') {
            return this.FirstName;
          } else if (this.LastName !== '') {
            return this.LastName;
          } else {
            return '';
          }
        },

        hasValue: function (item) {
          return !(typeof item === 'undefined' || item === null);
        },

        isPolicyHolderValid: function () {
          return !!(
          this.hasValue(this.FirstName) &&
          this.hasValue(this.LastName) &&
          this.hasValue(this.DateOfBirth) &&
          this.hasValue(this.Gender) &&
          this.hasValue(this.MaritalStatus) &&
          this.hasValue((this.EmploymentStatus)) &&
          this.hasValue(this.LicenseStatus) &&
          this.hasValue(this.AgeFirstLicensed) &&
          this.hasValue(this.CurrentlyInsured) &&
          this.hasValue(this.AdditionalDrivers) &&
          this.hasValue(this.CurrentZipCode));
        },

        isDriverValid: function () {
          return !!(
          this.hasValue(this.FirstName) &&
          this.hasValue(this.LastName) &&
          this.hasValue(this.DateOfBirth) &&
          this.hasValue(this.Gender) &&
          this.hasValue(this.MaritalStatus) &&
          this.hasValue((this.EmploymentStatus)) &&
          this.hasValue(this.LicenseStatus) &&
          this.hasValue(this.AgeFirstLicensed) &&
          this.hasValue(this.CurrentlyInsured));
        },

        getInsuredPersonRouteName: function () {
          return 'insured-person';
        },

        getListedDriverRouteName: function () {
          return 'listed-driver';
        },

        getAddressRouteName: function () {
          return 'address';
        },

        getPhoneRouteName: function () {
          return 'phone-number';
        },

        getMake: function () {
          return this.Make;
        },

        createRejectedPromise: function (e) {
          var rejected = $q.defer();
          rejected.reject(e);
          return rejected.promise;
        },

        saveDriverPrimaryVehicle: function (vehicleId) {
          if (!this.PrimaryVehicleId) {
            this.PrimaryVehicleId = vehicleId;
            return this.saveDriver()
          } else {
            var donata = $q.defer();
            donata.resolve('No need already equal');
            return donata.promise;
          }
        },

        driverAge: function(){
          if(this.DateOfBirth){
            return moment(new Date()).diff(moment(this.DateOfBirth, 'MM-DD-YYYY'), 'years');
          }else{
            return 0;
          }
        },

        isStudentAge: function(){
          return !!(this.driverAge() >= 16 && this.driverAge() <= 24);
        },

        saveDriver: function (callGroup) {
          //First determine if this is a primary driver by determining if there are any other drivers or if PrimaryDriver is set
          var driverRouteName;
          var driverLink;
          var drivers = quoteDataService.getDrivers();
          if (this.PrimaryDriver || drivers.length == 0) {
            this.RatingStatus = 'Rated';
            this.PrimaryDriver = true;
            driverRouteName = this.getInsuredPersonRouteName();

          } else {
            driverRouteName = this.getListedDriverRouteName();
          }
          //If this is a new insuredPerson or listed-driver then we need to get the link from quoteIntent model
          //otherwise if this is an update then the current entity has the link
          if (!this.Id) {
            driverLink = quoteDataService.getLink(driverRouteName);
          } else {
            var urlLink = _.find(this.Links, function (link) {
              return link.Rel == driverRouteName;
            });
            driverLink = urlLink.Href;
          }

          return this.sendDriver(driverRouteName, driverLink, callGroup);
        },



        setDriverDefaults: function () {

          //some fields that should not provided by api but are (bad design)
          this.PrimaryDriverIdField = null;
          this.PrimaryVehicleIdField = null;

          //some funky rule in pc
          this.OwnsOwnVehicle = this.CurrentlyInsured;

          //Policy Center requires social to have dashes, how stupid is that
          if (this.SocialSecurityNumber) {
            var tempSSN = this.SocialSecurityNumber.replace(/-/g, '');
            var updatedSSN = String.format('{0}-{1}-{2}', tempSSN.substring(0, 3),
              tempSSN.substring(3, 5), tempSSN.substring(5, 9));
            this.SocialSecurityNumber = updatedSSN;
          }

          if ((this.CurrentInsuranceStatus == 'PolicyExpiredOver30Days' || this.CurrentInsuranceStatus == 'NewVehicle') && !this.CurrentlyInsured) {
            this.PreviousLapse = null;
            this.CurrentInsurer = null;
            this.YearsWithCurrentInsurer = null;
            this.CurrentPremium = null;
            this.CurrentInsuranceLimits = null;
          }

          //Its a PC thing
          if (this.PrimaryDriver && this.CurrentlyInsured) {
            this.CurrentInsuranceStatus = 'OwnPolicy';
          }

         this.resolveGoodStudentDiscount();
        },

        sendDriver: function (driverRouteName, urlLink, callGroup) {
          try {
            if (urlLink) {
              this.setDriverDefaults();

              var currentDriver = this;
              if (!this.Id) {
                var postPromise = internalAPIDataService.postData(driverRouteName, urlLink, currentDriver, callGroup);
              }
              else {
                var postPromise = internalAPIDataService.putData(driverRouteName, urlLink, currentDriver, callGroup);
              }
              var deferred = $q.defer();
              $q.when(postPromise,
                function (response) {
                  currentDriver.Id = response.data.Id;
                  currentDriver.Links = response.data.Links;
                  quoteDataService.saveDriver(currentDriver);
                  deferred.resolve(currentDriver.Id);
                }, function (error) {
                  deferred.reject(error);
                });
              return deferred.promise;
            } else {
              var rejected = $q.defer();
              rejected.reject({
                message: String.format('RouteName {0} cannot be found in Links collection', driverRouteName)
              });
              return rejected.promise;
            }
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        updateDriver: function () {
          try {
            var primaryDriver = false;
            if (this.PrimaryDriver) {
              primaryDriver = true;
              var driverRouteName = this.getInsuredPersonRouteName();
            } else {
              var driverRouteName = this.getListedDriverRouteName();
            }
            var driverLink = _.find(this.Links, function (link) {
              return link.Rel == driverRouteName;
            });
            //This allows us to get a deep representation which includes address and phonenumber
            var queryParams = {'include': 'all'};
            var driverResponse = internalAPIDataService.getData(driverRouteName, driverLink.Href, null, queryParams);
            var deferred = $q.defer();
            var currentDriver = this;

            //--------------- Persist Variables between states -------------------------
            var CurrentlyEnrolled = this.CurrentlyEnrolled;
            var additionalDrivers = this.AdditionalDrivers;
            //----------------End Persist Variables between states ----------------------

            $q.when(driverResponse, function (response) {
              var driverResults = JSON.parse(JSON.stringify(response.data));

              currentDriver.populateData(driverResults);
              currentDriver.PrimaryDriver = primaryDriver;

              //Defaulting Currently Insured cause it comes from PC defaulted to false
              if (currentDriver.PrimaryDriver && !currentDriver.CurrentInsuranceStatus && !currentDriver.CurrentInsuranceLimits) {
                currentDriver.CurrentlyInsured = null;
              }


              //We need to convert the results of occupation to a string (just trust me)
              if (driverResults.Occupation > 0) {
                var occupation = driverResults.Occupation.toString();
                currentDriver.Occupation = occupation;
                //If current Employment status is military
                if (currentDriver.MilitaryStatus && currentDriver.MilitaryStatus > 0) {
                  var serviceStatus = lookupDataService.getMilitaryServiceById(currentDriver.MilitaryStatus.toString());
                  if (serviceStatus) {
                    currentDriver.MilitaryBranch = serviceStatus.Metadata.Branch;
                    currentDriver.MilitaryStatus = serviceStatus.Value;
                  }
                }
              }
              else {
                currentDriver.Occupation = null;
              }
              if (currentDriver.AgeFirstLicensed == 0) {
                currentDriver.AgeFirstLicensed = null;
              }

              //--------------- Restore Variables between states -------------------------
              currentDriver.CurrentlyEnrolled = CurrentlyEnrolled;
              currentDriver.AdditionalDrivers = additionalDrivers;
              //----------------End Restore Variables between states ----------------------

              //We need to convert the results of occupation to a string (just trust me)
              //var occupation = driverResults.Occupation.toString();
              //currentDriver.Occupation = occupation;
              //If current Employment status is military
              if (currentDriver.MilitaryStatus && currentDriver.MilitaryStatus > 0) {
                var serviceStatus = lookupDataService.getMilitaryServiceById(currentDriver.MilitaryStatus.toString());
                if (serviceStatus) {
                  currentDriver.MilitaryBranch = serviceStatus.Metadata.Branch;
                  currentDriver.MilitaryStatus = serviceStatus.Value;
                }
              }

              //some funky rule in pc
              currentDriver.OwnsOwnVehicle = currentDriver.CurrentlyInsured;

              quoteDataService.saveDriver(currentDriver);
              deferred.resolve(response.data.Id);
            }, function (error) {
              deferred.reject(error);
            });
            return deferred.promise;
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        savePhoneNumber: function () {
          try { //If there is no phone number don't go to the bother of saving it
            if (!this.PhoneNumber || !this.PhoneNumber.Value) {
              var completed = $q.defer();
              completed.resolve({
                message: 'Phone-number not found, save not called'
              });
              return completed.promise;
            }
            var phoneRouteName = this.getPhoneRouteName();
            var isNewPhone = false;
            if (!this.PhoneNumber || !this.PhoneNumber.Id) {
              //This is a new phonenumber so get the link from the driver
              var phoneLink = _.find(this.Links, function (link) {
                return link.Rel == phoneRouteName;
              });
              isNewPhone = true;
            }
            else {
              //This is an update condition so get the link for the PhoneNumber itself
              var phoneLink = _.find(this.PhoneNumber.Links, function (link) {
                return link.Rel == phoneRouteName;
              });
            }

            return this.sendPhoneNumber(phoneLink, isNewPhone);
          } catch (e) {
            return this.createRejectedPromise(e);
          }

        },

        sendPhoneNumber: function (phoneLink, isNew) {
          try {

            //Policy Center requires phone number to have dashes, how stupid is that
            var tempPhone = this.PhoneNumber.Value.replace(/-/g, '');
            this.PhoneNumber.Value = String.format('{0}-{1}-{2}', tempPhone.substring(0, 3), tempPhone.substring(3, 6), tempPhone.substring(6, 10));
            var currentPhone = this.PhoneNumber;

            if (phoneLink) {
              if (isNew) {
                var savePhonePromise = internalAPIDataService.postData(this.getPhoneRouteName(), phoneLink.Href, currentPhone);
              } else {
                //This is a post cause the put does not work for whatever reason.
                var savePhonePromise = internalAPIDataService.putData(this.getPhoneRouteName(), phoneLink.Href, currentPhone);
              }
              var deferred = $q.defer();
              $q.when(savePhonePromise, function (response) {
                currentPhone.Id = response.data.Id;
                currentPhone.Links = response.data.Links;
                currentPhone.ProcessingId = response.data.ProcessingId;
                var responseMessage = {
                  message: String.format("Phone number {0} saved successfully", currentPhone.Value),
                  data: response.data,
                  httpStatus: response.status
                };
                deferred.resolve(responseMessage);
              }, function (error) {
                deferred.reject(error);
              });
              return deferred.promise;
            } else {
              var deferred = $q.defer();
              deferred.resolve('Currently not updating phone number');
              //var rejected = $q.defer();
              //rejected.reject({
              //  message: 'Phone-number routeName cannot be found in Links collection'
              //});
              //return rejected.promise;
              return deferred.promise;
            }
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        removeDriver: function (callGroup) {
          try {
            var driverRouteName = this.getListedDriverRouteName();
            if (!this.Id) {
              var noDriverResponse = $q.defer();
              noDriverResponse.resolve({
                message: 'Driver has not been saved and does not contain an Id'
              });
              return noDriverResponse.promise;
            }
            var driverLink = _.find(this.Links, function (link) {
              return link.Rel == driverRouteName;
            });
            if (driverLink.Href) {
              var currentDriver = this;
              var deletePromise = internalAPIDataService.removeData(driverRouteName, driverLink.Href, callGroup);
              var deferred = $q.defer();
              $q.when(deletePromise,
                function (response) {
                  quoteDataService.removeDriver(currentDriver.Id);
                  var responseMessage = {
                    message: String.format("Removed Driver {0} successfully", currentDriver.Id),
                    httpStatus: response.status
                  };
                  deferred.resolve(responseMessage);
                }, function (error) {
                  deferred.reject(error);
                });
              return deferred.promise;
            } else {
              var rejected = $q.defer();
              rejected.reject({
                message: 'Driver link not provided'
              });
              return rejected.promise;
            }
          } catch (e) {
            return this.createRejectedPromise(e);
          }
        },

        populateData: function (data) {
          _.extend(this, data);

          // MUST convert date/time to utc b/c that's what the internal api returns
          if(data.DateOfBirth) {
            this.DateOfBirth = moment.utc(data.DateOfBirth).format('MM-DD-YYYY');
          }

          if (data.PhoneNumbers && data.PhoneNumbers.length > 0) {
            var phoneNumber = _.findWhere(data.PhoneNumbers, {PhoneNumberType: 'Home'});
            if (phoneNumber) {
              phoneNumber.Value = phoneNumber.Value.replace(/-/g, '');
              this.PhoneNumber = phoneNumber;
            }
          }

          if(data.PrimaryDriver) {
            if (data.EmploymentStatus !== 'FullTimeStudent') {
              this.GoodStudentDiscount = null;
            }
          }else{
            if (data.GoodStudentDiscount) {
              this.CurrentlyEnrolled = true;
            }
          }

        },//populateData

        resolveGoodStudentDiscount: function(){
          if(this.PrimaryDriver) {
            if (this.EmploymentStatus != 'FullTimeStudent' || !this.isStudentAge() ||
              (this.MaritalStatus != 'NeverMarried' && this.MaritalStatus != 'Widowed' && this.MaritalStatus != 'Divorced')) {
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
            }
          }else{
            if (!this.isStudentAge() ||
              (this.MaritalStatus != 'NeverMarried' && this.MaritalStatus != 'Widowed' && this.MaritalStatus != 'Divorced')) {
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
            }
          }
        },

        resolveEmploymentStatus: function () {
          switch (this.EmploymentStatus) {
            case "PrivatelyEmployed":
            case "Retired":
              this.MilitaryStatus = null;
              this.MilitaryBranch = null;
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
              break;
            case "Homemaker":
              this.Occupation = '424';
              this.MilitaryStatus = null;
              this.MilitaryBranch = null;
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
              break;
            case "Unemployed":
              this.Occupation = '425';
              this.MilitaryStatus = null;
              this.MilitaryBranch = null;
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
              break;
            case "FullTimeStudent":
              this.MilitaryStatus = null;
              this.MilitaryBranch = null;
              break;
            case "Military":
            case "RetiredMilitary":
              this.Occupation = null;
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
              break;
            default:
              this.Occupation = null;
              this.MilitaryStatus = null;
              this.MilitaryBranch = null;
              this.GoodStudentDiscount = null;
              this.CurrentlyEnrolled = null;
          }

          if (this.EmploymentStatus == 'FullTimeStudent') {
            switch (this.CurrentStudentEnrollment) {
              case 'HighSchool' :
                this.Occupation = '427';
                break;
              case 'TradeSchool' :
              case 'CollegeDegreeFor2Years':
                this.Occupation = '428';
                break;
              case 'GraduateSchool' :
                this.Occupation = '426';
                break;
              case 'CollegeDegreeFor4Years' :
                this.Occupation = '429';
                break;
            }
          }

          if (this.CurrentlyEnrolledStudent == 'No') {
            this.GoodStudentDiscount = 'false'
          }


        }
      });

      return clazz;
    }
  ]);
