var express = require('express');
var router = express.Router();
var obje = {tree: 0}

router.get('/trees', function(req, res) {
  //res.send(obje);
  console.log('treerequest was executed!')
});

module.exports = router;