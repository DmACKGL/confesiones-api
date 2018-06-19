var express = require('express');
var router = express.Router();
var Raven = require('raven');
var RateLimit = require('express-rate-limit');
var cache = require('memory-cache');

var postconfe = new RateLimit({
	 windowMs: 5*60*1000,
   delayAfter: 1,
   delayMs: 3*1000,
   max: 1,
   message: "Ya posteaste una confesion, vuelve a postear en 5 minutos"
});

router.get('/', function(req, res) {
	res.send("Sin datos");
});

router.post('/', function(req, res) {
	ip  = req.headers['x-real-ip'] || req.connection.remoteAddress;
	// Vacio
	if(Object.keys(req.body).length === 0 || !req.body.titulo || !req.body.confesion) {
  	res.send(JSON.stringify({"status": 500, "error": "Sin datos", "response": null}));
		return false;
	}
	try{
		connection.query("INSERT INTO `confesiones` (`id`, `titulo`, `confesion`, `fecha`, `ip`) VALUES (NULL, '"+req.body.titulo+"', '"+req.body.confesion+"', CURRENT_TIME(), '"+ip+"')", function (error, results) {
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
