var layer = {};

function drawMap(){
	map = L.map('map').setView([47.62, -122.325], 11);
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	        }).addTo(map);
};

function renderData(shape, param) {


	var shape_lookup = 'hood';
	if (shape == "Neighborhoods") shape_lookup = 'hood';
	else if (shape == "Zips") shape_lookup = 'zip';
	else if (shape == "Zones") shape_lookup = 'zone';
	else if (shape == "Grid") shape_lookup = 'id';
	else if (shape == "Neighborhoods_Predict") shape_lookup = 'hood';

    $.getJSON('./' + shape,function(hoodData){
    	if (layer != undefined) {
              map.removeLayer(layer);
        };

        if (param == 'phd') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 40  ) fillColor = "#006837";
			        else if ( phd > 30 ) fillColor = "#31a354";
			        else if ( phd > 20 ) fillColor = "#78c679";
			        else if ( phd> 10 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'hs') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 40  ) fillColor = "#006837";
			        else if ( phd > 30 ) fillColor = "#31a354";
			        else if ( phd > 20 ) fillColor = "#78c679";
			        else if ( phd> 10 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'oldpop') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 5300  ) fillColor = "#006837";
			        else if ( phd > 4500 ) fillColor = "#31a354";
			        else if ( phd > 3500 ) fillColor = "#78c679";
			        else if ( phd> 2500 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'daytime_density') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 3700  ) fillColor = "#006837";
			        else if ( phd > 2400 ) fillColor = "#31a354";
			        else if ( phd > 1700 ) fillColor = "#78c679";
			        else if ( phd> 1200 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'daytime_pop') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 7500  ) fillColor = "#006837";
			        else if ( phd > 6000 ) fillColor = "#31a354";
			        else if ( phd > 4000 ) fillColor = "#78c679";
			        else if ( phd> 2500 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'medinc') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 120000  ) fillColor = "#006837";
			        else if ( phd > 100000 ) fillColor = "#31a354";
			        else if ( phd > 70000 ) fillColor = "#78c679";
			        else if ( phd> 50000 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'youngpop') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 600  ) fillColor = "#006837";
			        else if ( phd > 450 ) fillColor = "#31a354";
			        else if ( phd > 300 ) fillColor = "#78c679";
			        else if ( phd> 220 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'cafe_sum') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 4  ) fillColor = "#006837";
			        else if ( phd > 3 ) fillColor = "#31a354";
			        else if ( phd > 2 ) fillColor = "#78c679";
			        else if ( phd> 1 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'cafe') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 15  ) fillColor = "#006837";
			        else if ( phd > 10 ) fillColor = "#31a354";
			        else if ( phd > 6 ) fillColor = "#78c679";
			        else if ( phd > 3 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 if (param == 'brewery_sum') {
		    layer = L.geoJson( hoodData, {
		      style: function(feature){
		        var fillColor,
		           phd = eval("feature.properties." + param);
		           scale = Math.max(phd);
			        if ( phd > 4  ) fillColor = "#006837";
			        else if ( phd > 3 ) fillColor = "#31a354";
			        else if ( phd > 2 ) fillColor = "#78c679";
			        else if ( phd> 1 ) fillColor = "#c2e699";
			        else if ( phd > 0 ) fillColor = "#ffffcc";
			        else fillColor = "#f7f7f7";  // no data
			        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });
		 }

		 var myarr1 = ['pred_p', 'pred_6mo', 'pred_1yr', 'pred_2yr'];

		if (['pred_p', 'pred_6mo', 'pred_1yr', 'pred_2yr'].indexOf(param) >= 0) {
				    layer = L.geoJson( hoodData, {
				      style: function(feature){
				        var fillColor,
				           phd = eval("feature.properties." + param);
				           scale = Math.max(phd);
					        if ( phd > 4  ) fillColor = "#006837";
					        else if ( phd > 3 ) fillColor = "#31a354";
					        else if ( phd > 2 ) fillColor = "#78c679";
					        else if ( phd> 1 ) fillColor = "#c2e699";
					        else if ( phd > 0 ) fillColor = "#ffffcc";
					        else fillColor = "#f7f7f7";  // no data
					        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
					      },
				      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
				    });
				 }



		var myarr2 = ['change', 'change_p', 'change_6mo', 'change_1yr', 'change_2yr'];

		if (myarr2.indexOf(param) > -1) {
				    layer = L.geoJson( hoodData, {
				      style: function(feature){
				        var fillColor,
				           phd = eval("feature.properties." + param);
				           scale = Math.max(phd);
					        if ( phd > 4  ) fillColor = "#8c510a";
					        else if ( phd > 2 ) fillColor = "#d8b365";
					        else if ( phd > 0 ) fillColor = "#f6e8c3";
					        else if ( phd > -2 ) fillColor = "#c7eae5";
					        else if ( phd > -4 ) fillColor = "#5ab4ac";
					        else fillColor = "#01665e";  // no data
					        return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
					      },
				      onEachFeature: function( feature, layer ){
				      	
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)) + feature.properties.hood)

						}


				    });
				 }


	    map.addLayer(layer);

  	});

}

function onMapClick(e) {
	var data = {'lat': e.latlng.lat,
                'lng': e.latlng.lng}
    console.log(e.latlng)
    console.log(JSON.stringify(data))
    $.ajax({
    type: 'POST',
    contentType:"application/json",
    data: JSON.stringify(data), 
    dataType:'json',
    url: '/mini_win' // converts js value to JSON string
    });
}

$(function(){
    var form = $('form');
    $('#myRange').on('change mouseup', function(){
        $.ajax({
            type: "POST",
            url: form.action,
            data: form.serialize(),
        }).done(function(res){
            //do something with the response from the server
        });
    });
});

$(function() {	
    drawMap();
    renderData('Neighborhoods','cafe')
    $('#zone_class').change(function() {
        var val1 = $('#zone_class option:selected').val();
        var val2 = $('#type_class option:selected').val();
        renderData(val1, val2);
    });
    $('#type_class').change(function() {
        var val1 = $('#zone_class option:selected').val();
        var val2 = $('#type_class option:selected').val();
        renderData(val1, val2);
    });
    $('#myRange').mouseup(function() {
        var val1 = $('#zone_class option:selected').val();
        var val2 = $('#type_class option:selected').val();
        renderData(val1, val2);
    });
	map.on('click', onMapClick);

})



