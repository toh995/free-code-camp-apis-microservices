const express = require("express");
const router = express.Router();

router.get("/whoami", (req, res) => {
    const retObj = {
        ipaddress: req.ip,
        language: req.headers["accept-language"],
        software: req.headers["user-agent"]
      };
      
      res.json(retObj);
});

module.exports = router;