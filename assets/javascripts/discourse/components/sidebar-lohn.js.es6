import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
    classNames: ["sidebar-lohn"],
    descriptionText: 'Finde raus, was du verdienen solltest.',
    btnText: 'Jetzt Lohn berechnen',


    @discourseComputed()
    lohnTitle() {
        return '<b>Lohnrechner</b> </br> VSAO ZÜRICH';
    },

    @discourseComputed()
    lohnLink() {
        return this.siteSettings.timeline_sidebar_lohn_url || 'https://vsao-zh.ch/lohnrechner/?return';
    }

});
