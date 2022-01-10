import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
  classNames: ["sidebar-doppel"],
  btnText: 'DoppelDoc',

  @discourseComputed()
  doppelTitle() {
    return this.siteSettings.timeline_sidebar_doppel_title;
  },
});
