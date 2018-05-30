/**
  * @author Franco Sanllehi <franco@fsanllehi.me>
  * @package Confesiones
  * @version v0.1
  */

function updateConfesiones(confesionesData) {
  var dataconf = confesionesData;
  console.log(confesionesData);
    $('#contenido').html('');
    for (key in confesionesData) {
        console.log(confesionesData['response'][key]['titulo']+"\n"+confesionesData['response'][key]['confesion']+"\n"+confesionesData);
        var thisHtml = "";
        thisHtml += '<div class="col-sm-6">';
        thisHtml += ' <div class="card">';
        thisHtml += '  <div class="card-body">';
        thisHtml += '   <h5 class="card-title">'+confesionesData['response'][key]['titulo']+'</h5>';
        thisHtml += '   <p class="card-text">'+confesionesData['response'][key]['confesion']+'</p>';
        thisHtml += '   <a href="#" class="btn btn-primary">Reaccion 1</a>';
        thisHtml += '   <a href="#" class="btn btn-primary">Reaccion 1</a>';
        thisHtml += '   <a href="#" class="btn btn-primary">Reaccion 1</a>';
        thisHtml += '  </div>';
        thisHtml += ' </div>';
        thisHtml += '</div>';
        $('#contenido').append(thisHtml);
    }
}

function loadConfesiones() {
  $.ajax({
    cache: false,
    url: "/api/v1/confesiones",
    dataType: "json",
    success: function (confesionesData) {
            updateConfesiones(confesionesData);
        //setTimeout(updateConfesiones, 30000); //30s
    }
  });
}

loadConfesiones();
