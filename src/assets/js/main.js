const test = 'Babel is doing the job.';

$(window).on('load', function() {
    console.log(test);

    setTimeout(function () {
        $('.last').addClass('last-loaded');
    }, 2000);
    AOS.init();
});