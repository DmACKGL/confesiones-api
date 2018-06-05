/**
  * @author Franco Sanllehi <franco@fsanllehi.me>
  * @package Confesiones
  * @version v0.1
  */

function updateConfesiones(confesionesData) {
    $('#contenido').html('');
    for (key in confesionesData['response']) {
        var htmlFinal = "";
        htmlFinal += '<div class="col-sm-6">';
        htmlFinal += ' <div class="card">';
        htmlFinal += '  <div class="card-body">';
        htmlFinal += '   <h5 class="card-title">'+confesionesData['response'][key]['titulo']+'</h5>';
        htmlFinal += '   <p class="card-text">'+confesionesData['response'][key]['confesion']+'</p>';
        htmlFinal += '   <button onclick="reaccionar('+confesionesData['response'][key]['id']+', 1)" class="btn btn-outline-secondary"><i class="em em-laughing"></i></button>';
        htmlFinal += '   <button onclick="reaccionar('+confesionesData['response'][key]['id']+', 2)" class="btn btn-outline-secondary"><i class="em em-anguished"></i></button>';
        htmlFinal += '   <button onclick="reaccionar('+confesionesData['response'][key]['id']+', 3)" class="btn btn-outline-secondary"><i class="em em-cry"></i></button>';
        htmlFinal += '   <button onclick="comentar('+confesionesData['response'][key]['id']+')" class="btn btn-outline-primary float-right"><i class="far fa-comments"></i></button>'
        htmlFinal += '  </div>';
        htmlFinal += ' </div>';
        htmlFinal += '</div>';
        $('#contenido').append(htmlFinal);
    }
}

function loadConfesiones() {
  $.ajax({
    cache: false,
    url: "/api/v1/confesiones",
    dataType: "json",
    success: function (confesionesData) {
      updateConfesiones(confesionesData);
    }
  });
}

loadConfesiones();
setInterval(function() {
  loadConfesiones()
}, 2000);

// Reacciones
function reaccionar(idconf, reaccion){
  console.log(idconf+" "+reaccion);
  //$.post( "/api/v1/reaccion", {"id": idconf, "reaccion": reaccion} );
  $.ajax({
    type: "POST",
    url: "/api/v1/reaccion",
    data: "id="+idconf+"&reaccion="+reaccion,
    success: function(data){

    }
  });
}

// Form
var $button = $('button[type="submit"]');

$button.on('click', function(e) {
  e.preventDefault();
	var $this = $(this);
	if($this.hasClass('active') || $this.hasClass('success')) {
		return false;
	}
	$this.addClass('active');
	setTimeout(function() {
		$this.addClass('loader');
	}, 130);
  $.ajax({
    type: "POST",
    url: "/api/v1/confesiones",
    data: $("form").serialize(),
    success: function(data){
      setTimeout(function() {
    		$this.removeClass('loader active');
    		$this.html('Posteado');
    		$this.addClass('success animated pulse');
    	}, 1600);
      loadConfesiones();
      setTimeout(function() {
        $('#confesion-titulo').val('');
        $('#confesion-texto').val('');
        $this.html('Go');
        $this.removeClass('success animated pulse');
        $this.blur();
        $('#confesarModal').delay(1600).modal('hide');
    	}, 3500);
    }
  });
});
