/**
 * Created by gabello on 10/7/2014.
 */
String.format = function() {
    "use strict"
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
};

String.prototype.trim = function() {
    "use strict";
    return this.replace(/^\s+|\s+$/g,"");
};

String.prototype.trimRight = function(charlist) {
    "use strict";
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

String.randomString = function randomString(len, charSet) {
    "use strict";
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};

String.getString = function(item){
    "use strict";
    if(_.isString(item)){
        return item.trim();
    }else if(_.isArray(item) && item.length > 0){
        return item[0];
    }else{
        return undefined;
    }
};

String.capitalizeFirst = function(item){
    "use strict";
    if(item && item.length > 0) {
        var trimedString = item.trim().toLowerCase();
        return trimedString.charAt(0).toUpperCase() + trimedString.substring(1)
    }else{
        return '';
    }
};

String.createGuid = function (separator) {
    /// <summary>
    ///    Creates a unique id for identification purposes.
    /// </summary>
    /// <param name="separator" type="String" optional="true">
    /// The optional separator for grouping the generated segmants: default "-".
    /// </param>

    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};
