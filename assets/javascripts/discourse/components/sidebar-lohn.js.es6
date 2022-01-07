import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
    classNames: ["sidebar-lohn"],
    descriptionText: 'Finde raus, was du verdienen solltest.',
    btnText: 'Jetzt Lohn berechnen',


    @discourseComputed()
    lohnTitle() {
        const title = this.siteSettings.timeline_sidebar_lohn_title;
        return '<b>' + title + '</b> </br> VSAO ZÜRICH';
    },

    @discourseComputed()
    lohnLink() {
        return this.siteSettings.timeline_sidebar_lohn_url || 'https://vsao-zh.ch/lohnrechner/?return';
    }

});

$(document).ready(function() {
    if(innerHTML="https://dev.docdoc.ch"){
        var element = document.getElementsByClassName("list-controls")[0];
        element.classList.remove("mystyle");
    }
    else{
        var element = document.getElementsByClassName("list-controls")[0];
        element.classList.add("btn-support-");
    }
});