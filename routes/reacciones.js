var express = require('express');
var router = express.Router();
var Raven = require('raven');
var RateLimit = require('express-rate-limit');
var cache = require('memory-cache');
var CircularJSON = require('circular-json'), str;

router.post('/', function(req, res) {
  str = CircularJSON.stringify(req.body);
  str = JSON.parse(str);
  ip  = req.headers['x-real-ip'] || req.connection.remoteAddress;
	// Vacio
	if(Object.keys(str).length === 0 || !str.id || !str.reaccion) {
  	res.send(JSON.stringify({"status": 500, "error": "Sin datos", "response": null}));
		return false;
	}
  try{
    connection.query("INSERT INTO `reacciones` (`id`, `idconf`, `reaccion`, `ip`) SELECT NULL, '"+str.id+"', '"+str.reaccion+"', '"+ip+"' FROM dual WHERE NOT EXISTS (SELECT * FROM `reacciones` WHERE idconf='"+str.id+"' AND ip='"+ip+"')", function (error, results) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        Raven.captureException(error);
      } else {
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      }
    });
  }catch (error) {
    Raven.captureException(error)
    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
  }
});

module.exports = router;
