const header = $('#header');

$(window).on('load', function () {
	setTimeout(function () {
		$(window).scroll(function () {
			let scrolled = $(window).scrollTop();
			if (scrolled > 350) {
				header.addClass('scrolled');
			} else {
				header.removeClass('scrolled');
			}
		});
	}, 2000);
	AOS.init();
});