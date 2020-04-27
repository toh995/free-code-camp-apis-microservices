const express = require("express");
const router = express.Router();
const Helpers = require("/src/helpers/helpers");

router.get("/timestamp/:date_string?", (req, res) => {
    let { date_string } = req.params;

    // Convert date_string to a number, if appropriate
    date_string = Helpers.isNumeric(date_string) ? +date_string : date_string;
    
    // If date_string is non-empty, then parse it using new Date; otherwise, use the current date and time.
    const parsedDate = date_string || (date_string === 0) ? new Date(date_string) : new Date();
    
    let retObj;
    if (!Helpers.isValidDate(parsedDate)) {
      retObj = { error: "Invalid Date" };
    } else {
      retObj = {
        unix: parsedDate.getTime(),
        utc: parsedDate.toUTCString()
      };
    }
    
    res.json(retObj);
});

module.exports = router;