const express = require("express");
const lodash = require("lodash");
const Url = require("/src/models/url");
const Helpers = require("/src/helpers/helpers");

const router = express.Router();

router.post("/new", async (req, res, next) => {
    const original_url = req.body.url;

    // Perform URL validation
    const isValidUrl = await Helpers.isValidUrl(original_url);
    if (!isValidUrl) {
        res.json({ error: "invalid URL" });
        return;
    }

    // Query URL in database
    const urlDocData = { original_url };
    let urlDoc = await Url.findOne(urlDocData).exec();

    if (!urlDoc) {
        urlDoc = new Url(urlDocData);
        await urlDoc.save();
    }

    // Send results
    const retObj = lodash.pick(urlDoc, ["original_url", "short_url"]);

    res.json(retObj);
});

router.get("/:short_url", async (req, res) => {
    const { short_url } = req.params;
    const urlDoc = await Url.findOne({ short_url }).exec();
    res.redirect(urlDoc.original_url);
});

module.exports = router;