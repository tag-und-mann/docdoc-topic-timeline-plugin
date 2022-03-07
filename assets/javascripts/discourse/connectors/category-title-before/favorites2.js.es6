import { ajax } from 'discourse/lib/ajax';
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

$(document).ready(function () {
    if ($(window).width() < 960) {
    }
    else{
        $("<div class='arrow'></div>").insertBefore(".link-bottom-line");
    }

    if (window.location.href.indexOf("https://dev.doc-doc.ch/t/") > -1) {
        $('.banner-block').css('display','none');
        $('.categories-wrapper').css('display','none');
    }
    else{
        $('.banner-block').css('display','block');
        $('.categories-wrapper').css('display','block');
    }

    $(".title a").click(function(){
        $('.banner-block').css('display','block');
        $('.categories-wrapper').css('display','block');
        if ($(window).width() < 960) {
            $('.banner-block').css('display','none');
            $('.categories-wrapper').css('display','none');
        }
    });
    if ($(window).width() < 960) {
        $('.banner-block').css('display','none');
        $('.categories-wrapper').css('display','none');
    }
});