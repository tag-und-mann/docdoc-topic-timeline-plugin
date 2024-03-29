import {ajax} from 'discourse/lib/ajax';
import title from 'discourse/plugins/discourse-favorites/discourse/connectors/category-title-before/favorites';
import favorites from 'discourse/plugins/discourse-favorites/lib/favorites';

export default {

    setupComponent(args, component) {
        component.set('category', args.category);
        favorites.isFavorite(args.category.id, isFavorite => {
            component.set('isFavorite', isFavorite);
        });
    },

    actions: {
        toggleFavorite: function () {
            const category_id = this.get('category').id;
            const status = !this.get('isFavorite');
            this.set('isFavorite', status);

            if (status) {
                favorites.add(category_id);
            } else {
                favorites.remove(category_id);
            }
        }
    }

};

/* Version for dev */

$(document).ready(function () {
    $('.title a').click(function (event) {
        //event.preventDefault();
        $(".btn").removeClass("activebtn");
    });
});

$(document).ready(function () {
    $('.badge-wrapper').click(function (e) {
        $("a.activebtn").removeClass("activebtn");
    });
});
$(document).ready(function () {
    $('#categories-under-banner .btn').click(function (event) {
        //event.preventDefault();
        $(".btn").removeClass("activebtn");
        $(this).addClass('activebtn');
    });

    $('.category-link .bullet').click(function (event) {
        if (window.location.href.indexOf("/berufsalltag") > -1) {
            $('.btn').removeClass('activebtn');
            $('#Berufsalltag').addClass("activebtn");
        } else {
            $('.btn').removeClass('activebtn');
            if (window.location.href.indexOf("/vsao") > -1) {
                $('.btn').removeClass('activebtn');
                $('#VSAO').addClass("activebtn");
            } else {
                if (window.location.href.indexOf("/weiterbildung") > -1) {
                    $('.btn').removeClass('activebtn');
                    $('#Weiterbildung').addClass("activebtn");
                } else {
                    if (window.location.href.indexOf("/studium") > -1) {
                        $('.btn').removeClass('activebtn');
                        $('#Stadium').addClass("activebtn");
                    } else {
                        if (window.location.href.indexOf("/pausenraum") > -1) {
                            $('.btn').removeClass('activebtn');
                            $('#Pausenraum').addClass("activebtn");
                        } else {
                            $('.btn').removeClass('activebtn');
                        }
                    }
                }
            }
        }
    });
});

$(document).ready(function () {
    $('.nav-pills li a').click(function (event) {
        $(".banner-block").addClass("displaynone");
        $("#categories-under-banner").addClass("displaynone");
    });
});

$(document).ready(function () {
    $('.btn').removeClass('activebtn');
    if (window.location.href.indexOf("/berufsalltag") > -1) {
        $('.btn').removeClass('activebtn');
        $('#Berufsalltag').addClass("active");
    } else {
        $('.btn').removeClass('activebtn');
        if (window.location.href.indexOf("/vsao") > -1) {
            $('.btn').removeClass('activebtn');
            $('#VSAO').addClass("activebtn");
        } else {
            if (window.location.href.indexOf("/weiterbildung") > -1) {
                $('.btn').removeClass('activebtn');
                $('#Weiterbildung').addClass("activebtn");
            } else {
                if (window.location.href.indexOf("/studium") > -1) {
                    $('.btn').removeClass('activebtn');
                    $('#Stadium').addClass("activebtn");
                } else {
                    if (window.location.href.indexOf("/pausenraum") > -1) {
                        $('.btn').removeClass('activebtn');
                        $('#Pausenraum').addClass("activebtn");
                    } else {
                        $('.btn').removeClass('activebtn');
                    }
                }
            }
        }
    }
});

$(document).ready(function () {
    if ($(window).width() < 960) {
    } else {
        $("<div class='arrow'></div>").insertBefore(".link-bottom-line");
    }
});

$(document).ready(function () {
    $(".title a").click(function () {
        $('.banner-block').css('display', 'block');
        $('.categories-wrapper').css('display', 'block');
        if ($(window).width() < 960) {
            $('.banner-block').css('display', 'none');
            $('.categories-wrapper').css('display', 'none');
        }
    });
});
$(document).ready(function () {
    $(".category-name").click(function () {
        $('.banner-block').css('display', 'block');
        $('.categories-wrapper').css('display', 'block');
        if ($(window).width() < 960) {
            $('.banner-block').css('display', 'none');
            $('.categories-wrapper').css('display', 'none');
        }
    });
    $(".category-links .category-link").click(function () {
        $('.banner-block').css('display', 'block');
        $('.categories-wrapper').css('display', 'block');
        if ($(window).width() < 960) {
            $('.banner-block').css('display', 'none');
            $('.categories-wrapper').css('display', 'none');
        }
    });
});

$(document).ready(function () {
    if ($(window).width() < 960) {
        $('.banner-block').css('display', 'none');
        $('.categories-wrapper').css('display', 'none');
    }
});

$(document).ready(function () {
    if (window.location.href.indexOf("doc-doc.ch") > -1) {
        $('.sidebar-content').css('display', 'block');
    } else {
        if ($(window).width() < 960) {
            $('.sidebar-content').css('display', 'none');
        }
    }
});
$(document).ready(function () {
    if (window.location.href.indexOf("doc-doc.ch/g") > -1) {
        $('.banner-block').css('display', 'none');
        $('.categories-wrapper').css('display', 'none');
    } else {
        if (window.location.href.indexOf("doc-doc.ch/t/") > -1) {
            $('.banner-block').css('display', 'none');
            $('.categories-wrapper').css('display', 'none');
        } else {
            if (window.location.href.indexOf("doc-doc.ch/contact-us") > -1) {
                $('.banner-block').css('display', 'none');
                $('.categories-wrapper').css('display', 'none');
            } else {
                if (window.location.href.indexOf("doc-doc.ch/u/account-created") > -1) {
                    $('.banner-block').css('display', 'none');
                    $('.categories-wrapper').css('display', 'none');
                } else {
                    $('.banner-block').css('display', 'block');
                    $('.categories-wrapper').css('display', 'block');
                }
            }
        }
    }
});

$(document).ready(function () {
    $('.d-header').on('click', 'ul.category-links li.category-link a', function() {
        var category = $('.category-name', $(this)).text();

        $('#categories-under-banner a.btn.activebtn').removeClass('activebtn');
        $('#categories-under-banner a.btn .d-button-label:contains("'+category+'")').parent().addClass('activebtn');
    });
});
