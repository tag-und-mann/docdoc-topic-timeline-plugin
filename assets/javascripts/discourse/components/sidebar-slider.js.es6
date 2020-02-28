import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
    classNames: ["sidebar-slider"],

    init() {
        this._super(...arguments);

        const rssUrl = this.siteSettings.timeline_sidebar_rss_url;
        const isSliderEnabled = this.siteSettings.timeline_sidebar_enamble_slider;
        const endpoint = `${window.location.origin}/rss_feed?uri=${rssUrl}`;

        if (!isSliderEnabled) return;

        Ember.run.scheduleOnce('afterRender', this, () => {
            const sliderCont = $('.j-slider-cont:visible');

            if (!sliderCont.length) return;

            ajax(endpoint, {
                type: "GET"
            }).then((data) => {
                return this.genData(data);
            }).then((data) => {
                sliderCont.html(data);
                setTimeout(() => {
                  sliderCont.slick({
                    dots: true
                  });
                }, 0);
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
