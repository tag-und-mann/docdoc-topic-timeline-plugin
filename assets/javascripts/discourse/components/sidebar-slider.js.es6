import discourseComputed from "discourse-common/utils/decorators";
import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
    classNames: ["sidebar-slider"],

    @discourseComputed()
    sliders() {
        return [];
    }
});
