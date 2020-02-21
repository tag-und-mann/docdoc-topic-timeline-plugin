import Eyeline from "discourse/lib/eyeline";
import { schedule } from "@ember/runloop";
import Scrolling from "./scrolling";
import { on } from "discourse-common/utils/decorators";
import Mixin from "@ember/object/mixin";

// Provides the ability to load more items for a view which is scrolled to the bottom.
export default Mixin.create(Scrolling, {
  scrolled() {
    const eyeline = this.eyeline;
    return eyeline && eyeline.update();
  },

  loadMoreUnlessFull() {
    if (this.screenNotFull()) {
      this.send("loadMore");
    }
  },

  @on("didInsertElement")
  _bindEyeline() {
    const eyeline = new Eyeline(this.eyelineSelector + ":last");
    this.set("eyeline", eyeline);
    eyeline.on("sawBottom", () => this.send("loadMore"));
    eyeline.update(); // update once to consider current position
    this.bindScrolling();
  },

  @on("willDestroyElement")
  _removeEyeline() {
    this.unbindScrolling();
  },

  actions: {
    loadMore() {
      if (!this.site.mobileView || this.loadMoreEvent.type === 'click') {
        Discourse.updateContextCount(0);
        this.model.loadMore().then(hasMoreResults => {
          schedule("afterRender", () => this.saveScrollPosition());
          if (!hasMoreResults) {
            this.eyeline.flushRest();
          } else if ($(window).height() >= $(document).height()) {
            this.send("loadMore");
          }
        });
      }
    }
  }
});
