const express = require("express");
const multer = require("multer");

const router = express.Router();

router.post("/", multer().single("upfile"), (req, res) => {
    res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    });
});

module.exports = router;