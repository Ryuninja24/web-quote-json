/* global malarkey:false, toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('webQuoteJson')
        .constant('malarkey', malarkey)
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('environmentLink', {
            //QA1
            internalApi: "http://eia-qa1.qa-elephant.com/api",
            //internalApi: "http://localhost:25640/api",
            vehicleData: "http://eaa-qa1.qa-elephant.com/api/manufactured-vehicle",
            geoCode: "http://eaa-qa1.qa-elephant.com/api/geodata-lookup/ratable-postal-codes",
            ancillaryData: "http://eaa-qa1.qa-elephant.com/api",
            vinIsoData: 'http://eaa-qa1.qa-elephant.com/api/viniso',
            //externalApi: 'http://localhost:24697/api',
            //externalApi: 'https://leadcloud.qa.qa-elephant.com/api',
            externalApi: 'http://vaprd-eea-01/api',

            //QA2
            //internalApi: "http://eia-qa2.qa-elephant.com/api",
            ////internalApi: "http://localhost:25640/api",
            //vehicleData: "http://eaa-qa2.qa-elephant.com/api/manufactured-vehicle",
            //geoCode: "http://eaa-qa2.qa-elephant.com/api/geodata-lookup/ratable-postal-codes",
            //ancillaryData: "http://eaa-qa2.qa-elephant.com/api/reference-data-lookup",
            //vinIsoData: 'http://eaa-qa2.qa-elephant.com/api/viniso',
            //externalApi: 'https://leadcloud.qa.qa-elephant.com/api',

            //Partner-Test
            //internalApi: "http://eia-partner-test.qa-elephant.com/api",
            //internalApi: "http://localhost:25640/api",
            //vehicleData: "http://eaa-partner-test.qa-elephant.com/api/manufactured-vehicle",
            //geoCode: "http://eaa-partner-test.qa-elephant.com/api/geodata-lookup/ratable-postal-codes",
            //vinIsoData: 'http://eaa-partner-test.qa-elephant.com/api/viniso',

            //Prod
            //internalApi: "http://vaprd-eia-01/api",
            //vehicleData: "http://vaprd-eaa-01/api/manufactured-vehicle",
            //geoCode: "http://vaprd-eaa-01/api/geodata-lookup/ratable-postal-codes",
            //ancillaryData: "http://vaprd-eaa-01/api/reference-data-lookup",
            //vinIsoData: 'http://vaprd-eaa-01/api/viniso',

            cdnBase: "http://ci.qa-elephant.com/journey.json",
            environment: 'dev'
        });
})();
