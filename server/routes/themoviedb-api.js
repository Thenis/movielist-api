const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = "87cdafe12d9bdca68ba01c573e34376f";


router.post("/get-movie", (req, res) => {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${req.body.queryString}&page=1&include_adult=false`).then((result) => {
        res.send(result.data);
    }).catch((err) => res.send(err));  
});

module.exports = router;