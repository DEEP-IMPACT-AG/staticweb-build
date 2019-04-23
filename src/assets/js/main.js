const header = $('#header');
const loading = $('.loading');

$(window).on('load', function () {
	WebFont.load({
		google: {
			families: ["Lato:300,400,700"]
		}
	});
	loading.addClass('loaded');
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