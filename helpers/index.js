const lodash = require("lodash");
const dns = require("dns");

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
    },

    /**
     * Checks if the given string is a valid URL (i.e. starts with "http://" or "https://", AND is a valid URL
     * according to dns.promises.lookup)
     * @param {string} string the string to check
     * @returns {boolean} true if the given value is an instance of String, starts with "http://" or "https://", and
     * is a valid URL according to dns.promises.lookup
     */
    async isValidUrl(string) {
        if (!lodash.isString(string)) {
            return false;
        }

        // Check if url begins with the appropriate "http(s)://" protocol
        const protocolRegex = /^https?:\/\//;
        const hasProtocol = protocolRegex.test(string);

        if (!hasProtocol) {
            return false;
        }

        // Strip away the protocol from beginning of string
        string = string.replace(protocolRegex, "");

        // Use dns.lookup to check the URL
        let lookupVal;
        try {
            lookupVal = await dns.promises.lookup(string);    
        } catch (err) {
            if (err.code === "ENOTFOUND") {
                return false;
            } else {
                throw err;
            }
        }

        return !!lookupVal;
    }
};