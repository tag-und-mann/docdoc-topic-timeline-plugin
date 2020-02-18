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
        Ember.run.scheduleOnce('afterRender', this, () => {
            $('.slider-cont').slick({
                dots: true
            });
        });
    }
});
