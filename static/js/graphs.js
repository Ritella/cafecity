var layer = {};
var legend = {};

function drawMap(){
	map = L.map('map').setView([47.62, -122.325], 11);
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	        }).addTo(map);
};

function renderData(shape, param_lookup) {

	console.log(param_lookup)
	var param = 'cafe';
	if (param_lookup== "PhD education") param = 'phd';
	else if (param_lookup== "Number of cafes") param = 'cafe';
	else if (param_lookup== "Number of cafes predicted") param = 'cafe_model';
	else if (param_lookup== "Change in cafes from present") param = 'change';
	else if (param_lookup== "Daytime density") param = 'daytime_density';
	else if (param_lookup== "Daytime population") param = 'daytime_pop';
	else if (param_lookup== "Median income") param = 'medinc';
	else if (param_lookup== "High school education") param = 'hs';
	else if (param_lookup== "Population above 65yo") param = 'oldpop';
	else if (param_lookup== "Population below 25yo") param = 'youngpop';
	else if (param_lookup== "Number of breweries") param = 'brewery_sum';
	else if (param_lookup== "Number of cafes alt") param = 'cafe_sum';

    $.getJSON('./' + shape,function(hoodData){
    	if (layer != undefined) {
              map.removeLayer(layer);
        };
        console.log(legend)
        if (legend instanceof L.Control) {
              map.removeControl(legend);
        };

        if (param == 'phd') {
        	function getColor(d) {
			    return d > 40 ? '#810f7c' :
			           d > 30  ? '#8856a7' :
			           d > 20  ? '#8c96c6' :
			           d > 10  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 10, 20, 30, 40],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'hs') {
        	function getColor(d) {
			    return d > 40 ? '#810f7c' :
			           d > 30 ? '#8856a7' :
			           d > 20  ? '#8c96c6' :
			           d > 10  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 10, 20, 30, 40],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'oldpop') {
        	function getColor(d) {
			    return d > 5300 ? '#810f7c' :
			           d > 4500  ? '#8856a7' :
			           d > 3500  ? '#8c96c6' :
			           d > 2500  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 2500, 3500, 4500, 5300],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'daytime_density') {
        	function getColor(d) {
			    return d > 3700 ? '#810f7c' :
			           d > 2400  ? '#8856a7' :
			           d > 1700  ? '#8c96c6' :
			           d > 1200  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 1200, 1700, 2400, 3700],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'daytime_pop') {
        	function getColor(d) {
			    return d > 7500 ? '#810f7c' :
			           d > 6000  ? '#8856a7' :
			           d > 4000  ? '#8c96c6' :
			           d > 2500  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 2500, 4000, 6000, 7500],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'medinc') {
        	function getColor(d) {
			    return d > 120000 ? '#810f7c' :
			           d > 100000  ? '#8856a7' :
			           d > 70000  ? '#8c96c6' :
			           d > 50000  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 50000, 70000, 100000, 120000],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'youngpop') {
        	function getColor(d) {
			    return d > 600 ? '#810f7c' :
			           d > 450  ? '#8856a7' :
			           d > 300  ? '#8c96c6' :
			           d > 220  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 220, 300, 450, 600],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'cafe_sum') {
        	function getColor(d) {
			    return d > 4 ? '#810f7c' :
			           d > 3  ? '#8856a7' :
			           d > 2  ? '#8c96c6' :
			           d > 1  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 1, 2, 3, 4],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'cafe') {
        	function getColor(d) {
			    return d > 15 ? '#810f7c' :
			           d > 10  ? '#8856a7' :
			           d > 6  ? '#8c96c6' :
			           d > 3  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 3, 6, 10, 15],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

		 if (param == 'brewery_sum') {
        	function getColor(d) {
			    return d > 4 ? '#810f7c' :
			           d > 3  ? '#8856a7' :
			           d > 2  ? '#8c96c6' :
			           d > 1  ? '#9ebcda' :
			           d > 0   ? '#bfd3e6' :
			           			 '#edf8fb';
			}

		    layer = L.geoJson( hoodData, {
		      style: function(feature){
			        return {fillColor: getColor(eval("feature.properties." + param)),
			        color: "#999", 
			        weight: 1, 
			        fillOpacity: .8 };
			      },
		      onEachFeature: function( feature, layer ){
				        layer.bindPopup(param + ": " + Math.round(eval("feature.properties." + param)))
				      }
		    });

		    legend = L.control({position: 'topright'})

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 1, 2, 3, 4],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < grades.length; i++) {
				        div.innerHTML +=
				            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				    }
			    return div;
			};
			console.log(legend)
		 }

	    map.addLayer(layer);
		legend.addTo(map);

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

});

$(function() {	
    drawMap();
    renderData('Neighborhoods','cafe');
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
	map.on('click', onMapClick);
	var form = $('form');
	
    $('#type_class').change(function() {
    val2 = $('#type_class option:selected').val();
	})

    $('#myRange').on('mouseup', function(){


        if (legend instanceof L.Control) {
              map.removeControl(legend);
        };

		console.log(val2)
		if (val2 == 'Number of cafes predicted') {

		console.log(val2)
        $.ajax({
            type: "POST",
            url: './Neighborhoods',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {			
			    	if (layer != undefined) {
			              map.removeLayer(layer);
			        };
					function getColor(d) {
								    return d > 15 ? '#810f7c' :
								           d > 10  ? '#8856a7' :
								           d > 6  ? '#8c96c6' :
								           d > 3  ? '#9ebcda' :
								           d > 0   ? '#bfd3e6' :
								           			 '#edf8fb';
								}

							    layer = L.geoJson( hoodData, {
							      style: function(feature){
								        return {fillColor: getColor(eval("feature.properties.cafe")),
								        color: "#999", 
								        weight: 1, 
								        fillOpacity: .8 };
								      },
							      onEachFeature: function( feature, layer ){
									        layer.bindPopup(Math.round(eval("feature.properties.cafe")))
									      }
							    });

							    legend = L.control({position: 'topright'})

								legend.onAdd = function (map) {

								    var div = L.DomUtil.create('div', 'info legend'),
								        grades = [0, 3, 6, 10, 15],
								        labels = [];

								    // loop through our density intervals and generate a label with a colored square for each interval
									    for (var i = 0; i < grades.length; i++) {
									        div.innerHTML +=
									            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
									            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
									    }
								    return div;
								};
								console.log(legend)

	    			map.addLayer(layer);
					legend.addTo(map);
					 }
			})
    	};

		if (val2 == 'Change in cafes from present') {
		    $.ajax({
	            type: "POST",
	            url: './Neighborhoods',
	            data: form.serialize(),
	            dataType: 'json',
	            success: function(response) {		

					    	if (layer != undefined) {
					              map.removeLayer(layer);
					        };	

						    function getColor(d) {
							    return d > 15 ? '#7f3b08' :
							           d > 7  ? '#b35806' :
							           d > 5  ? '#e08214' :
							           d > 3  ? '#fdb863' :
							           d > -1   ? '#fee0b6' :
							           d > -2   ? '#f7f7f7' :
							           d > -3   ? '#d8daeb' :
							           d > -7   ? '#b2abd2' :
							           			 '#542788';
							}

						    layer = L.geoJson( response, {
						      style: function(feature){
							        return {fillColor: getColor(eval("feature.properties.change")),
							        color: "#999", 
							        weight: 1, 
							        fillOpacity: .8 };
							      },
						      onEachFeature: function( feature, layer ){
								        layer.bindPopup(Math.round(eval("feature.properties.change")))
								      }
						    });

	    						
						    legend = L.control({position: 'topright'})

							legend.onAdd = function (map) {

							    var div = L.DomUtil.create('div', 'info legend'),
							        grades = [-7, -3, -2, -1, 3, 5, 7, 15],
							        labels = [];

							    // loop through our density intervals and generate a label with a colored square for each interval
								    for (var i = 0; i < grades.length; i++) {
								        div.innerHTML +=
								            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
								            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
								    }
							    return div;
							};
					console.log(legend)

				map.addLayer(layer);
			    
				legend.addTo(map);
				 }
	    })

    };
    });
})



