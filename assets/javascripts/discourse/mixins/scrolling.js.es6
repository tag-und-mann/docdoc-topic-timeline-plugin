import { scheduleOnce } from "@ember/runloop";
import discourseDebounce from "discourse/lib/debounce";
import Mixin from "@ember/object/mixin";

/**
  This object provides the DOM methods we need for our Mixin to bind to scrolling
  methods in the browser. By removing them from the Mixin we can test them
  easier.
**/
const ScrollingDOMMethods = {
  bindOnScroll(onScrollMethod, name) {
    name = name || "default";
    $(document).bind(`touchmove.discourse-${name}`, onScrollMethod);
    $(window).bind(`scroll.discourse-${name}`, onScrollMethod);
    $('.j-load-more-btn').bind(`click.discourse-${name}`, onScrollMethod);
  },

  unbindOnScroll(name) {
    name = name || "default";
    $(window).unbind(`scroll.discourse-${name}`);
    $(document).unbind(`touchmove.discourse-${name}`);
    $('.j-load-more-btn').unbind(`click.discourse-${name}`);
  },

  screenNotFull() {
    return $(window).height() > $("#main").height();
  }
};

const Scrolling = Mixin.create({
  // Begin watching for scroll events. By default they will be called at max every 100ms.
  // call with {debounce: N} for a diff time
  bindScrolling(opts) {
    opts = opts || { debounce: 100 };

    // So we can not call the scrolled event while transitioning
    const router = Discourse.__container__.lookup("router:main")
      ._routerMicrolib;

    let onScrollMethod = (event) => {
      if (router.activeTransition) {
        return;
      }
      this.loadMoreEvent = event;
      if ($('.j-load-more-btn').length && this.loadMoreEvent.type === 'click') {
        $(document).scrollTop($('.j-load-more-btn').offset().top - 940);
        setTimeout(() => {
          $(document).scrollTop($('.j-load-more-btn').offset().top - 940);
        }, 0);
      }
      return scheduleOnce("afterRender", this, "scrolled");
    };

    if (opts.debounce) {
      onScrollMethod = discourseDebounce(onScrollMethod, opts.debounce);
    }

    ScrollingDOMMethods.bindOnScroll(onScrollMethod, opts.name);
  },

  screenNotFull: () => ScrollingDOMMethods.screenNotFull(),

  unbindScrolling(name) {
    ScrollingDOMMethods.unbindOnScroll(name);
  }
});

export { ScrollingDOMMethods };
export default Scrolling;
