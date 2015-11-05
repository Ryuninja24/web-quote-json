/**
 * Created by gabello on 8/12/2015.
 */
angular.module('quotes.persistence')
  .factory('VehicleModel', ['$q', function ($q) {
    var clazz = function (attributes) {
      var defaults = {
        AddAnotherVehicle:null,
        AntiTheftDevice: null,
        CostWhenNew: null,
        Coverages: [],
        CurrentOwner: null,
        CustomEquipment: null,
        DamageDescription: null,
        EstimatedAnnualMileage: null,
        Id: null,
        IsDamaged: null,
        IsInLien:null,
        LienHolder: null,
        Lienholders: null,
        Make: null,
        MakeId:null,
        Model: null,
        ModelId:null,
        Ownership: null,
        PrimaryDriverId: null,
        ProcessingId: null,
        RegistrationState: null,
        Usage: null,
        ValueOfCustomEquipment: null,
        Vin: null,
        Year: null,
        YearsOwned: null,
        YearStyleId:null
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

      cleanVehicleDefaults: function(){
        if(!this.CustomEquipment){
          this.ValueOfCustomEquipment = null;
        }
      },
      getMakeModel: function(){
        return this.Make + ' ' + this.Model;
      }
    });

    return clazz;
  }]);
