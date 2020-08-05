const express = require('express');
const router = express.Router();

// localhost:3000/movie, get
router.get("/", (req, res) => {
    res.send("movie get");
});

router.post("/", (req, res) => {
    res.send("movie post");
});

router.put("/", (req, res) => {
    res.send("movie put");
});

router.delete("/", (req, res) => {
    res.send("movie delete");
});

module.exports = router;
