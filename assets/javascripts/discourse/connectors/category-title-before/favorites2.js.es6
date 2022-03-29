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
    if (window.location.href.indexOf("dev.doc-doc.ch/c/berufsalltag") > -1) {
        console.log('works');
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
        console.log("Berufsalltag");
    }
    else{
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
    }
});
$(document).ready(function () {
    if (window.location.href.indexOf("dev.doc-doc.ch/c/vsao") > -1) {
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
        console.log("VSAO");
    }
    else{
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
    }
});
$(document).ready(function () {
    if (window.location.href.indexOf("dev.doc-doc.ch/c/weiterbildung") > -1) {
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
        $('#Weiterbildung').addClass("activebtn");
        console.log("Weiterbildung");
    }
    else{
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
    }
});
$(document).ready(function () {
    if (window.location.href.indexOf("dev.doc-doc.ch/c/studium") > -1) {
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
        $('#Stadium').addClass("activebtn");
    }
    else{
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
    }
});
$(document).ready(function () {
    if (window.location.href.indexOf("dev.doc-doc.ch/c/pausenraum") > -1) {
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
        $('#Pausenraum').addClass("activebtn");
    }
    else{
        $('#Berufsalltag, #VSAO, #Weiterbildung, #Stadium, #Pausenraum').removeClass('activebtn');
    }
});

$(document).ready(function () {
    $(".admin-main-nav .nav-pills li a").click(function () {
        $('.banner-block').css('display', 'none');
        $('.categories-wrapper').css('display', 'none');
    });
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
    if (window.location.href.indexOf("doc-doc.ch/g") > -1) {
    }
    else{
        $('.sidebar-content').css('display', 'none');
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

/*
 Version for Live
 */
/*
$(document).ready(function () {
    if ($(window).width() < 960) {
    }
    else{
        $("<div class='arrow'></div>").insertBefore(".link-bottom-line");
    }
});

$(document).ready(function () {
    $(".title a").click(function(){
        $('.banner-block').css('display','block');
        $('.categories-wrapper').css('display','block');
        if ($(window).width() < 960) {
            $('.banner-block').css('display','none');
            $('.categories-wrapper').css('display','none');
        }
    });
});

$(document).ready(function () {
    if ($(window).width() < 960) {
        $('.banner-block').css('display','none');
        $('.categories-wrapper').css('display','none');
    }
});


$(document).ready(function () {
    if (window.location.href.indexOf("doc-doc.ch/g") > -1) {
        $('.banner-block').css('display','none');
        $('.categories-wrapper').css('display','none');
    }

    else{
        if (window.location.href.indexOf("doc-doc.ch/t/") > -1) {
            $('.banner-block').css('display','none');
            $('.categories-wrapper').css('display','none');
        }
        else{
            if (window.location.href.indexOf("doc-doc.ch/contact-us") > -1) {
                $('.banner-block').css('display','none');
                $('.categories-wrapper').css('display','none');
            }
            else{
                if (window.location.href.indexOf("dev.doc-doc.ch/u/account-created") > -1) {
                    $('.banner-block').css('display','none');
                    $('.categories-wrapper').css('display','none');
                }
                else{
                    $('.banner-block').css('display', 'block');
                    $('.categories-wrapper').css('display', 'block');
                }
            }
        }
    }
});
*/