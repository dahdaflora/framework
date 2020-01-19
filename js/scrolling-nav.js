(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

})(jQuery); // End of use strict
// Position par défaut (Châtelet à Paris)
var centerpos = new google.maps.LatLng(49.0942574,6.2282795);

// Options relatives à la carte
var optionsGmaps = {
    center:centerpos,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 15
};
// ROADMAP peut être remplacé par SATELLITE, HYBRID ou TERRAIN
// Zoom : 0 = terre entière, 19 = au niveau de la rue
 
// Initialisation de la carte pour l'élément portant l'id "map"
var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
  
// .. et la variable qui va stocker les coordonnées
var latlng;
