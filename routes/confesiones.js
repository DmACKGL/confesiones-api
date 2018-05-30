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
	try {
		results = cache.get('CacheConfesiones');
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	}catch (error) {
		Raven.captureException(error)
    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
  }

});

router.post('/', postconfe, function(req, res) {
	// Vacio
	if(Object.keys(req.body).length === 0 || !req.body.titulo || !req.body.confesion) {
  	res.send(JSON.stringify({"status": 500, "error": "Sin datos", "response": null}));
		return false;
	}
	try{
		connection.query("INSERT INTO `confesiones` (`id`, `titulo`, `confesion`, `fecha`) VALUES (NULL, '"+req.body.titulo+"', '"+req.body.confesion+"', CURRENT_TIME())", function (error, results) {
			if(error){
				Raven.captureException(error);
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			} else {
				res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
				try {
					connection.query('SELECT * from confesiones ORDER BY `confesiones`.`id` DESC', function (error, results) {
							if(error){
								Raven.captureException(error);
							} else {
								cache.put('CacheConfesiones', results);
							}
					});
				}catch (error) {
					Raven.captureException(error)
				}
			}
		});
		connection.end();
	}catch (error) {
		Raven.captureException(error)
    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
  }
});

module.exports = router;
