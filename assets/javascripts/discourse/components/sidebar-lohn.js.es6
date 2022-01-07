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

document.addEventListener('DOMContentLoaded', function(){
    if(window.location.href=="https://dev.doc-doc.ch/")
        var element = document.getElementsByClassName("list-controls")[0];
        element.classList.remove("btn-support-filter");
    }
    else{
        var element = document.getElementsByClassName("list-controls")[0];
        element.classList.add("btn-support-filter");
    }
});