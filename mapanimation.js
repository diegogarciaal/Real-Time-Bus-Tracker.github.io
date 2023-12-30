 var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-71.091542,42.358862],
        zoom:13.5

    })

    var marker = new mapboxgl.Marker()
      .setLngLat ([-71.091542,42.358862])
      .addTo(map)

    const bus_stops = [
    [-71.093729,42.359244],
    [-71.094915,42.360175],
    [-71.095800,42.360698],
    [-71.099558,42.362953],
    [-71.103476,42.365248],
    [-71.106067,42.366806],
    [-71.108717,42.368355],
    [-71.110799,42.369192],
    [-71.113095,42.370218],
    [-71.115476,42.372085],
    [-71.117585,42.373016],
    [-71.118625,42.374863]
  ]

  

  function crearRuta(){
    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'coordinates': bus_stops,
                    'type': 'LineString'
                }
            }
        ]
    };

    map.on('load', () => {
        map.addSource('line', {
            type: 'geojson',
            data: geojson
        });

        // add a line layer without line-dasharray defined to fill the gaps in the dashed line
        map.addLayer({
            type: 'line',
            source: 'line',
            id: 'line-background',
            paint: {
                'line-color': 'green',
                'line-width': 6,
                'line-opacity': 0.4
            }
        });

        // add a line layer with line-dasharray set to the first value in dashArraySequence
        map.addLayer({
            type: 'line',
            source: 'line',
            id: 'line-dashed',
            paint: {
                'line-color': 'green',
                'line-width': 6,
                'line-dasharray': [0, 4, 3]
            }
        });

        // technique based on https://jsfiddle.net/2mws8y3q/
        // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
        const dashArraySequence = [
            [0, 4, 3],
            [0.5, 4, 2.5],
            [1, 4, 2],
            [1.5, 4, 1.5],
            [2, 4, 1],
            [2.5, 4, 0.5],
            [3, 4, 0],
            [0, 0.5, 3, 3.5],
            [0, 1, 3, 3],
            [0, 1.5, 3, 2.5],
            [0, 2, 3, 2],
            [0, 2.5, 3, 1.5],
            [0, 3, 3, 1],
            [0, 3.5, 3, 0.5]
        ];

        let step = 0;

        function animateDashArray(timestamp) {
            // Update line-dasharray using the next value in dashArraySequence. The
            // divisor in the expression `timestamp / 50` controls the animation speed.
            const newStep = parseInt(
                (timestamp / 50) % dashArraySequence.length
            );

            if (newStep !== step) {
                map.setPaintProperty(
                    'line-dashed',
                    'line-dasharray',
                    dashArraySequence[step]
                );
                step = newStep;
            }

            // Request the next frame of the animation.
            requestAnimationFrame(animateDashArray);
        }

        // start the animation
        animateDashArray(0);
    });
    

  }
  crearRuta()
  
  var counter = 0

  function move() {
    
    setTimeout(() => {
      if (counter >= bus_stops.length) return
      marker.setLngLat(bus_stops[counter])
      var reference_marker = new mapboxgl.Marker()
      .setLngLat ([bus_stops[counter][0],bus_stops[counter][1]])
      .addTo(map)
      counter += 1
      move()
    },1000)
    
  }
