(function($) {
  "use strict";

  /* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
  $(window).on('scroll load', function() {
		if ($(".navbar").offset().top > 20) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
    });
    
})(jQuery);