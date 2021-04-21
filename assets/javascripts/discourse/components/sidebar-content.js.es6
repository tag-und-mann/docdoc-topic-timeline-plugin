import discourseComputed from "discourse-common/utils/decorators";

export default Ember.Component.extend({
  classNames: ["sidebar-content"],

  @discourseComputed()
  isLohnEnabled() {
    return this.site.mobileView ?
      this.siteSettings.timeline_sidebar_mobile_lohn_enable :
      this.siteSettings.timeline_sidebar_desktop_lohn_enable;
  },

  @discourseComputed()
  isSliderEnabled() {
    return this.site.mobileView ?
      this.siteSettings.timeline_sidebar_mobile_slider_enable :
      this.siteSettings.timeline_sidebar_desktop_slider_enable;
  },

  @discourseComputed()
  isMeedicusEnabled() {
    return this.site.mobileView ?
      this.siteSettings.timeline_sidebar_mobile_medicus_enable :
      this.siteSettings.timeline_sidebar_desktop_medicus_enable;
  },

  @discourseComputed()
  isDoppelDocEnabled() {
    return this.site.mobileView ?
      this.siteSettings.timeline_sidebar_mobile_doppel_enable :
      this.siteSettings.timeline_sidebar_desktop_doppel_enable;
  },
});
