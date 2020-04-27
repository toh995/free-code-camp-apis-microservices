const lodash = require("lodash");

module.exports = {
    /**
     * Checks if the given date is valid
     * @param {any} date the date the check
     * @returns {boolean} true if the given value is an instance of Date, AND the date is valid. False otherwise.
     */
    isValidDate(date) {
        return lodash.isDate(date) && !isNaN(date.getTime());
    },

    /**
     * Checks if the given string is a valid numeric value
     * @param {any} string the string to check
     * @returns {boolean} true if the given value is an instance of String, AND the string is a numberic value.
     */
    isNumeric(string) {
        return lodash.isString(string) && !isNaN(string);
    }
};