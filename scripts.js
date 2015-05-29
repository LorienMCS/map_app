// Declare map as a global variable
// so it can be accessed everywhere in the program
var map;
var elevationSvc;
// add a window to display the elevation info
var elevWindow = new google.maps.InfoWindow();

/*To initialize a Map, we first create a Map options object to contain
map initialization variables. This object is not constructed (using a constructor,
for multiple instances); instead it is created as an object literal (just one).

There are two required options for every map: center and zoom.
The initial resolution at which to display the map is set by the zoom property,
where zoom 0 corresponds to a map of the Earth fully zoomed out,
and higher zoom levels zoom in at a higher resolution.

You modify the map type in use by the Map by setting its mapTypeId property,
either within the constructor via setting its Map options object,
or by calling the map's setMapTypeId() method.
The following map types are available in the Google Maps API:
MapTypeId.ROADMAP displays the default road map view. This is the default map type.
MapTypeId.SATELLITE displays Google Earth satellite images
MapTypeId.HYBRID displays a mixture of normal and satellite views
MapTypeId.TERRAIN displays a physical map based on terrain information.

Because we want to center the map on a specific point, we create a LatLng object
to hold this location by passing the location's coordinates in the order: latitude, longitude:
Instead of creating a new google.maps.LatLng object each time you'd like to add a geographic
coordinate, you can use a LatLng object literal.
LatLng object literals are supported from version 3.16 and later.
They provide a convenient way to add a coordinate, and can be used interchangably with a
LatLng object in most places in the API. When you create an object, or call a method,
using a LatLng object literal, the Google Maps JavaScript API will replace
it with a new google.maps.LatLng behind the scenes.

The Maps API comes with a handful of built-in controls you can use in your maps.
By default, your map and the associated map controls will match the
standard look and feel of the Google Maps interface.
You don't access or modify these map controls directly. Instead, you modify the map's
MapOptions fields which affect the visibility and presentation of controls.
You can adjust control presentation upon instantiating your map (with appropriate MapOptions)
or modify a map dynamically by calling setOptions() to change the map's options.
Not all of these controls are enabled by default.
If you wish to only add or modify existing behavior, you need to ensure
that the control is explicitly added to your application.
Several controls are configurable, allowing you to alter their behavior or change their appearance. 
As well as modifying the style and position of existing API controls,
you can create your own controls to handle interaction with the user.*/

function initialize() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(37.768120, -122.441875),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };


  /* The JavaScript class that represents a map is the Map class.
  Objects of this class define a single map on a page. (You may create more than one
  instance of this class - each object will define a separate map on the page.)
  We create a new instance of this class using the JavaScript new operator.
  The Map constructor creates a new map using any optional parameters that are
  passed (the zoom, center, and mapTypeId parameters stored in the mapOptions variable).
  We also get the div element to put the map in.*/
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


  /*The ElevationService object provides you with a simple interface
  to query locations on the earth for elevation data.
  The ElevationService object communicates with the Google Maps API Elevation
  Service which receives elevation requests and returns elevation data.
  Note that these requests are rate-limited to discourage abuse of the service,
  and may be changed in the future without notice.
  The free Elevation API has the following limits in place:
  2500 requests per 24 hour period.
  512 locations per request.
  5 requests per second. */
  elevationSvc = new google.maps.ElevationService();
  // Add a listener for the click event and call getElevation on that location
  google.maps.event.addListener(map, 'click', getElevation);


  /* The Google Maps API allows you to display the public transit network of a
  city on your map using the TransitLayer object. When the Transit Layer is enabled,
  and the map is centered on a city that supports transit information, the map will
  display major transit lines as thick, colored lines. The color of the line is set
  based upon information from the transit line operator. Enabling the Transit Layer
  will alter the style of the base map to better emphasize transit routes.

  Transit information is only available in select locations. To see a list of cities
  where public transit information is currently available, please consult
  (https://www.google.com/landing/transit/cities/index.html). */
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);


  /* The google.maps.Marker constructor takes a single Marker options
  object literal, specifying the initial properties of the marker.

  The following fields are particularly important and commonly set when constructing a marker:

  position (required) specifies a LatLng identifying the initial location of the marker.
  map (optional) specifies the Map on which to place the marker.
  The marker's title will appear as a tooltip.
  If you do not specify the map on construction of the marker,
  the marker is created but is not attached to (or displayed on) the map.
  You may add the marker later by calling the marker's setMap() method.

  You can animate markers so that they exhibit dynamic movement. To specify the way a
  marker is animated, use the marker's animation property, of type google.maps.Animation.
  DROP indicates that the marker should drop from the top of the map to its
  final location when first placed on the map. Animation will cease once the marker
  comes to rest and animation will revert to null.
  This type of animation is usually specified during creation of the Marker.

  In the most basic case, an icon can simply indicate an image to use instead of
  the default Google Maps pushpin icon.
  To specify such an icon, set the marker's icon property to the URL of an image.

  Place IDs are stable values (meaning that once you've identified the place ID
  for a location, you can reuse that value when you next look up that location)
  that uniquely reference a place on a Google Map.
  Traditionally, developers reference locations on a map as latitudinal and longitudinal
  coordinates. However, different APIs can translate the same latlng to different
  addresses, and the translation from latlngs to addresses can also change over time.
  By using Place IDs in your app, the locations you reference become more consistent
  and apps become more reliable and user-friendly.
  When you add a marker using a Place instead of a location, the Maps API
  will automatically add a 'Save to Google Maps' link to any info window
  associated with that marker.
  Attributions help users find your site again. In the attribution object, specify:
  The source of the save. Typically the name of your site or app.
  An optional webUrl to include as a link back to your site.
  An optional iosDeepLinkId, specified as a URL Scheme, that will be displayed in place
  of the webUrl when viewed on iOS. */

  var mclarMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Uncle John\'s Tree',
    icon: 'tree.png',
    place: {
      placeId: 'ChIJIdBXNk6HhYAR9kpG6JmvS5k',
      location: {
        lat: 37.771862,
        lng: -122.454716
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var mclarInfo = '<h1>Uncle John\'s Tree</h1>' +
    '<p>A single, massive Monterey Cypress stands in front of the ' +
    'McLaren Lodge, where it has stood for over 100 years. It is ' +
    'lovingly called “Uncle John\'s Tree” in honor of the park\'s ' +
    'most influential superintendent, John McLaren.</p>' +
    '<p>McLaren was an enthusiastic tree planter, responsible for ' +
    'the complete transformation of the landscape of Golden ' +
    'Gate Park from desolate dunes to an urban greenscape.</p>' +
    '<p>Attribution: <a href="http://www.atlasobscura.com/' +
    'places/uncle-johns-tree-mclaren-lodge" target="_blank">' +
    'Tre at Atlas Obscura</a> (last visited May 27, 2015)</p>';

  var mclarWindow = new google.maps.InfoWindow({
    content: mclarInfo
  });

  google.maps.event.addListener(mclarMarker, 'click', function() {
    mclarWindow.open(map, mclarMarker);
  });

 
  var pleasMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Mary Ellen Pleasant Memorial Park',
    icon: 'tree.png',
    place: {
      placeId: 'Ei0xNjYxIE9jdGF2aWEgU3QsIFNhbiBGcmFuY2lzY28sIENBIDk0MTA5LCBVU0E',
      location: {
        lat: 37.787746,
        lng: -122.426877
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var pleasInfo = '<h1>Mary Ellen Pleasant Memorial Park</h1>' +
    '<p>Almost 100 years before Rosa Parks, San Francisco resident ' +
    'Mary Ellen Pleasant sued a local transportation company for not ' +
    'letting her and other African Americans ride. She won.</p> ' +
    '<p>Many details of Ms. Pleasant’s life are open to question, but what is ' +
    'certain, and recorded in a plaque at the corner of Octavia and Bush streets, ' +
    'is that she was a tireless worker for civil rights and a great entrepreneur.</p>' +
    '<p>The Mary Ellen Pleasant Memorial Park, the smallest park in San Francisco, ' +
    'consists of six enormous eucalyptus blue gum trees marching down Octavia Street, '+
    'remaining from the twenty she planted. The trees are landmarked '+
    'by the City of San Francisco.</p>'+
    '<p>Attribution: <a href="http://www.sfcityguides.org/public_guidelines.html?article'+
    '=1305&submitted=TRUE&srch_text=&submitted2=&topic=San" target="_blank">' +
    'Marian Halley at SF City Guides</a> (last visited May 28, 2015)</p>';

  var pleasWindow = new google.maps.InfoWindow({
    content: pleasInfo
  });

  google.maps.event.addListener(pleasMarker, 'click', function() {
    pleasWindow.open(map, pleasMarker);
  });


  var transMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Transamerica Redwood Park',
    icon: 'tree.png',
    place: {
      placeId: 'ChIJYXDDl4qAhYAReRkaZFbsSzo',
      location: {
        lat: 37.795180,
        lng: -122.402226
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var transInfo = '<h1>Transamerica Redwood Park</h1>' +
    '<p>Privately owned Redwood Park is a unique feature of Transamerica ' +
    'Pyramid Center: An intimate, half-acre redwood grove nestled ' +
    'between the skyscrapers of San Francisco’s Financial District.</p>' +
    '<p>Transplanted from the Santa Cruz Mountains 60 miles to the ' +
    'south, magnificent redwoods dominate the park designed by Tom Galli. ' +
    'A fountain designed by Anthony Guzzardo — its pond complete ' +
    'with jumping frog sculptures, in a fond remembrance of Mark Twain, ' +
    'who for a time lived and wrote on this site — lends the sound ' +
    'of running water to those who seek peaceful moments here. ' +
    'Ferns, boulders and a winding walkway add to the tranquility.</p>' +
    '<p>Attribution: <a href="http://www.pyramidcenter.com/' +
    'point-of-interest/redwood-park/" target="_blank">' +
    'Transamerica Pyramid Center</a> (last visited May 27, 2015)</p>';

  var transWindow = new google.maps.InfoWindow({
    content: transInfo
  });

  google.maps.event.addListener(transMarker, 'click', function() {
    transWindow.open(map, transMarker);
  });


  var filbertMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Filbert Steps',
    icon: 'stairs.png',
    place: {
      placeId: 'ChIJQ88A9PaAhYAR0f5SuyAsC6U',
      location: {
        lat: 37.802108,
        lng: -122.403437
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var filbertInfo = '<h1>The Filbert Steps</h1>' +
    '<p>Running down the east slope of Telegraph Hill on the old ' +
    'trail of dock workers, the Filbert Steps is the same seemingly ' +
    'endless staircase Humphrey Bogart stumbles up in the noir classic ' +
    'Dark Passage. The stairs rise in three sections from Sansome Street ' +
    'to Coit Tower, past art deco buildings, such as Lauren Bacall’s ' +
    'pad from the same movie at 1360 Montgomery Street. Many of ' +
    'the homes along the route can only be reached from the stairs. ' +
    'Besides city views, the steps have a garden, known as the Grace ' +
    'Marchant Garden, that is home to a flock of emerald parrots.</p>' +
    '<p>Attribution: <a href="http://www.travelandleisure.com/travel-guide' +
    '/north-beachtelegraph-hill/things-to-do/climb-the-filbert-steps/"' +
    'target="_blank">Travel + Leisure</a> (last visited May 27, 2015)</p>';

  var filbertWindow = new google.maps.InfoWindow({
    content: filbertInfo
  });

  google.maps.event.addListener(filbertMarker, 'click', function() {
    filbertWindow.open(map, filbertMarker);
  });


  var lyonMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'The Lyon Street Steps',
    icon: 'stairs.png',
    place: {
      placeId: 'EioyNTUxIEx5b24gU3QsIFNhbiBGcmFuY2lzY28sIENBIDk0MTIzLCBVU0E',
      location: {
        lat: 37.794256,
        lng: -122.446652
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var lyonInfo = '<h1>The Lyon Street Steps</h1>' +
    '<p>Just being at the summit of these steps is a mystical Zen experience ' +
    'truly difficult to describe. The feeling of the sky and air ' +
    'where you are standing is amazing. And, spread out before you are ' +
    'fabulous views of the Palace of Fine Arts Dome, the blue San Francisco ' +
    'Bay, and a fog shrouded sky beyond. To the west is the Presidio forest ' +
    'and to the east are amazing old Pacific Heights mansions with ' +
    'their manicured lawns and many balconies. ' +
    '<p>Attribution: <a href="http://www.hiddensf.com/300d' +
    '-lyon-street-steps-san-francisco-ca.html" target="_blank">' +
    'hiddenSF</a> (last visited May 28, 2015)</p>';

  var lyonWindow = new google.maps.InfoWindow({
    content: lyonInfo
  });

  google.maps.event.addListener(lyonMarker, 'click', function() {
    lyonWindow.open(map, lyonMarker);
  });


  var moragaMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: '16th Avenue Tiled Steps',
    icon: 'stairs.png',
    place: {
      placeId: 'ChIJ1wGSxGGHhYAREY_K3hZq3ps',
      location: {
        lat: 37.756241,
        lng: -122.473635
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var moragaInfo = '<h1>The 16th Avenue Tiled Steps</h1>' +
    '<p>If you\'ve ever wanted to find a hidden art gem in San Francisco, head to ' +
    '16th and Moraga to discover The 16th Avenue Tiled Steps. Not only will ' +
    'you be able to see some amazing views of the city, you\'ll get to ' +
    'appreciate a beautiful mosaic running up 163 steps. Inspired by the ' +
    ' world-famous steps in Rio de Janeiro, Irish ceramist Aileen Barr ' +
    'and mosaic artist Colette Crutcher joined forces, working with over ' +
    '300 community volunteers for over a two and a half year ' +
    'period until they unveiled the project in August 2005.</p>' +
    '<p>The names of over 220 sponsors were actually woven into the ' +
    'sweeping sea-to-sky design and, amazingly, over 2,000 handmade ' +
    'tiles and 75,000 fragments of tile, mirror and stained glass ' +
    'went into the finished piece. There were a total of 163 ' +
    'separate mosaic panels created, one for each step riser.</p>' +
    '<p>Attribution: <a href="http://www.mymodernmet.com/profiles/blogs/' +
    '16th-avenue-tiled-steps-san-francisco" target="_blank">Alice Yoo, ' +
    'My Modern Met</a> (last visited May 27, 2015)</p>';

  var moragaWindow = new google.maps.InfoWindow({
    content: moragaInfo
  });

  google.maps.event.addListener(moragaMarker, 'click', function() {
    moragaWindow.open(map, moragaMarker);
  });


  var galvMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Galvanize',
    icon: 'iconSF.png',
    place: {
      placeId: 'ChIJg4tKuXyAhYARgEUpagGR_Dw',
      location: {
        lat: 37.788099,
        lng: -122.396578
      }
    },
    attribution: {
      source: 'Trees and Stairs in SF',
      //webUrl: need url here
    }
  });

  var galvInfo = '<h1>Galvanize</h1>' +
    '<p>Located in SoMa, Galvanize San Francisco takes ' +
    'collaboration to a whole new level, with five floors ' +
    'of creators, innovators, and passionate learners. ' +
    'And don’t forget the rooftop, with gorgeous views ' +
    'of downtown and the San Francisco Bay.</p>' +
    '<p>44 Tehama St San Francisco CA 94105 • (415) 805-1888</p>' +
    '<p>Attribution: <a href="http://www.galvanize.com/campuses/san-francisco-soma/"' +
    'target="_blank">Galvanize</a> (last visited ' +
    'May 27, 2015)</p>';

  var galvWindow = new google.maps.InfoWindow({
    content: galvInfo
  });

  google.maps.event.addListener(galvMarker, 'click', function() {
    galvWindow.open(map, galvMarker);
  });


  /* An InfoWindow displays content (usually text or images) in a popup window above the map,
   at a given location. The info window has a content area and a tapered stem.
   The tip of the stem is attached to a specified location on the map.

   The InfoWindow constructor takes an InfoWindowOptions object literal,
   which specifies the initial parameters for displaying the info window.

   The content of the InfoWindow may contain a string of text, a snippet of HTML,
   or a DOM element. To set the content, either specify it within the InfoWindowOptions
   or call setContent() on the InfoWindow explicitly.

   If you wish to explicitly size the content, you can put it in a <div> element
   and style the <div> with CSS. You can use CSS to enable scrolling too.
   Note that if you do not enable scrolling and the content exceeds the space available
   in the info window, the content may spill out of the info window.

   Best practices: For the best user experience, only one info window should be open
   on the map at any one time. Multiple info windows make the map appear cluttered.
   You can create one InfoWindow object and open it at different locations
   or markers upon map events, such as user clicks.  */

  var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Tree</h1>' +
    '<div id="bodyContent">' +
    '<p><b>Tree</b>, some content for a <b>Tree</b>, some more ' +
    'content for a tree. I could put lots of information ' +
    'in here. I don\'t have a lot to say right now, since this ' +
    'is only some placeholder text for when I actually have ' +
    'something of interest to write about. </p>' +
    '<p>Attribution: Tree, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';



  var treeWindow = new google.maps.InfoWindow({
    content: contentString
  });


  /* When you create an info window, it is not displayed automatically on the map.
  To make the info window visible, you need to call the open() method on the InfoWindow,
  passing it the Map on which to open, and optionally, the Marker with which to anchor it.
  If no marker is provided, the info window will open at its position property. */
  google.maps.event.addListener(treeMarker, 'click', function() {
    treeWindow.open(map, treeMarker);
  });


  // closing tag of the initialize function
}


function getElevation(event) {
  var locations = [];

  // Retrieve the clicked location and push it on the array
  var clickedLocation = event.latLng;
  locations.push(clickedLocation);

  /* Create a LocationElevationRequest object literal using the array's one value.
    A LocationElevationRequest object literal contains the following field:
    {
        locations[]: LatLng
    }
   locations (required) defines the location(s) on the earth from which
   to return elevation data. This parameter takes an array of LatLngs.
   You may pass any number of multiple coordinates within an array, as long as you don't
   exceed the service quotas. Note that when passing multiple coordinates, the accuracy of any returned
   data may be of lower resolution than when requesting data for a single coordinate.*/
  var positionalRequest = {
    'locations': locations
  }

  /* Initiate the location request to the ElevationService using the
    getElevationForLocations() method, which is passed a list of one
    or more locations using a LocationElevationRequest object. */
  elevationSvc.getElevationForLocations(positionalRequest, function(results, status) {
    /* For each valid request, the Elevation service will return to the defined
      callback a set of ElevationResult objects along with an ElevationStatus object. */
    if (status == google.maps.ElevationStatus.OK) {

      /* Upon success, the results argument of your callback function
        will contain a set of ElevationResult objects.Retrieve the first result: */
      if (results[0]) {

        // Open an info window indicating the elevation (in meters) at the clicked position
        elevWindow.setContent('The elevation at this point <br>is ' + results[0].elevation + ' meters.');
        elevWindow.setPosition(clickedLocation);
        elevWindow.open(map);
      } else {
        alert('No results found');
      }
    } else {
      alert('Elevation service failed due to: ' + status);
    }
  });
}


/*To ensure that the map is placed on the page after the page has fully loaded,
only execute the function which constructs the Map object once the
<body> element of the HTML page receives an onload event.
The Maps API provides the addDomListener() static method to listen to and bind to DOM events.*/
google.maps.event.addDomListener(window, 'load', initialize);


/* Detect iPhone and Android devices by inspecting the navigator.userAgent
property within the DOM, to alter layout for particular devices. */
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}