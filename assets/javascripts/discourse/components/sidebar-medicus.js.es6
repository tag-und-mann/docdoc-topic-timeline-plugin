import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
  classNames: ["sidebar-medicus"],
  btnText: 'Medicus',

  @discourseComputed()
  medicusTitle() {
    return this.siteSettings.timeline_sidebar_medicus_title;
  },
});
