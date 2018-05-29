var express = require('express');
var router = express.Router();
var RateLimit = require('express-rate-limit');

var postconfe = new RateLimit({
	windowMs: 5*60*1000,
   delayAfter: 1,
   delayMs: 3*1000,
   max: 1,
   message: "Ya posteaste una confesion, vuelve a postear en 1 hora"
});

router.get('/', function(req, res, next) {
	connection.query('SELECT * from confesiones', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	  	}
  	});
});

router.post('/', postconfe, function(req, res, next) {
	// Vacio
	if(Object.keys(req.body).length === 0 || !req.body.titulo || !req.body.confesion) {
  	res.send(JSON.stringify({"status": 500, "error": "Sin datos", "response": null}));
		return false;
	}
	connection.query("INSERT INTO `confesiones` (`id`, `titulo`, `confesion`, `fecha`) VALUES (NULL, '"+req.body.titulo+"', '"+req.body.confesion+"', CURRENT_TIME())", function (error, results, fields) {
		if(error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
		} else {
			console.log(results);
			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
		}
	});
});

module.exports = router;
