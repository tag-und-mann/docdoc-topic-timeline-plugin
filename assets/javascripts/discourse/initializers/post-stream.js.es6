import { withPluginApi } from 'discourse/lib/plugin-api';
import { on } from "discourse-common/utils/decorators";

export default {
  name: 'post-stream',
  initialize(container) {
    withPluginApi('0.8.12', (api) => {
      api.modifyClass('component:scrolling-post-stream', {
        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, () => {
            this.hideReplyButtonOfPosts();
          });
        },

        hideReplyButtonOfPosts() {
          if ($('nav.post-controls .widget-button.reply').length < 2) {
            $('nav.post-controls .widget-button.reply').show();
          }
        },
      });

      // Turnoff collapsing of post buttons.
      api.reopenWidget('post-menu', {
        settings: {
          collapseButtons: false,
          buttonType: "flat-button",
          showReplyTitleOnMobile: false,
        },
      });
    });
  }
}

