import discourseComputed from "discourse-common/utils/decorators";
import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
    classNames: ["sidebar-slider"],

    @discourseComputed()
    sliders() {
        return [];
    },

    init() {
        this._super(...arguments);

        const rssUrl = this.siteSettings.timeline_sidebar_rss_url;
        const isSliderEnabled = this.siteSettings.timeline_sidebar_enamble_slider;
        const endpoint = `rss_feed?uri=${rssUrl}`;

        if (!isSliderEnabled) return;

        Ember.run.scheduleOnce('afterRender', this, () => {
            var sliderCont = $('.slider-cont');

            ajax(endpoint, {
                type: "GET"
            }).then((data) => {
                return this.genData(data);
            }).then((data) => {
                sliderCont.html(data);
                $('.j-slider-cont').slick({
                    dots: true
                });
            });
        });
    },

    genData(data) {
        return new Promise((resolve, reject) => {
            let content = '';
            if (data.items && data.items.length) {
                data.items.forEach((item) => {
                    var pubDate = moment(item.pubDate).format('DD MMMM YYYY');
                    content += `<div class="slider-slide">
                                  <p class="news-date">${pubDate}</p>
                                  <p class="news-content">
                                    <a href="${item.link}" class="news-link" target="_blank">${item.title}</a>
                                  </p>
                                </div>`;
                })
            }
            resolve(content);
        });
    }
});
