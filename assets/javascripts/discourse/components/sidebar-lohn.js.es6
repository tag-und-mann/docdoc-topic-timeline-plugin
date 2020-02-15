import discourseComputed from "discourse-common/utils/decorators";
import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
    classNames: ["sidebar-lohn"],
    descriptionText: 'Description text for this block',
    btnText: 'Jet Lohn Dinstructions',


    @discourseComputed()
    lohnTitle() {
        return 'Lohnrechner </br> der name surname';
    },

    @discourseComputed()
    lohnLink() {
        return 'https://vsao-zh.ch/lohnrechner/?return';
    }

});
