import { withPluginApi } from 'discourse/lib/plugin-api';
import Composer from "discourse/models/composer";
import { on, observes } from "discourse-common/utils/decorators";
import { ajax } from "discourse/lib/ajax";
import Site from "discourse/models/site";
import Post from "discourse/models/post";
import ActionSummary from "discourse/models/action-summary";

var latestCreatedDate = '';

function timelineDate(date) {
  const fmt = date.getFullYear() === new Date().getFullYear()
      ? "long_no_year_no_time"
      : "timeline_date";
  return moment(date).format(I18n.t(`dates.${fmt}`));
}

function addCreatedDate() {
  var createdAt = $(this).find('[data-created]').attr('data-created'),
      createdAtDate = new Date(createdAt),
      createdDateFormatted = timelineDate(createdAtDate),
      hasDateBlock = $(this).prev('.topic-created-at').hasClass('topic-created-at');

  if (!hasDateBlock && latestCreatedDate !== createdDateFormatted) {
    latestCreatedDate = createdDateFormatted;
    return $("<div class='topic-created-at'></div>").text(createdDateFormatted);
  }
}

function onScrollMethod() {
  const sidebarWrapper = $('.desktop-view .topic-sidebar');
  const sidebar = $('.desktop-view .topic-sidebar-scrollable');
  const elemCoords = sidebarWrapper.offset();
  const pageScrollPosition = $(window).scrollTop();
  const diffCONST = 84;

  if (!sidebar.length || !sidebarWrapper.length) return;

}

function fetchActionUsers(post) {
  return ajax(`/post_action_users?id=${post.id}&post_action_type_id=2`, { type: "GET" });
}

export default {
  name: 'topics',
  initialize(container) {

    withPluginApi('0.8.12', (api) => {
      api.modifyClass('component:topic-list',  {
        // Lifecyle logic

        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, () => {
            // clear for filtration and new pages
            latestCreatedDate = '';

            let _wrapper = this.$(".mansory"),
                _cards = this.$(".topic-list-item"),
                _cols = parseInt(_wrapper.css("column-count")) || 2,
                _out = [],
                _col = 0;

            while(_col < _cols) {
              for (let i = 0; i < _cards.length; i += _cols) {
                let _val = _cards[i + _col];
                if (_val !== undefined)
                  _out.push(_val);
              }
              _col++;
            }
            if (_cards.length & 1) {
              _out.push(_cards[_cards.length - 1]);
            }

            _wrapper.html(_out);
          });

          $(window).bind('scroll', onScrollMethod);
        },

        @on('didInsertElement')
        setupListStyle() {
          if( $("#suggested-topics").length == 0 && $(".user-messages-page").length == 0 ) {
            this.$(".topic-list-item").wrapAll("<div class='mansory'></div>");
            this.$(".topic-list-item").append(this.$("<div class='arrow'></div>"));
          }
        },

        @observes('topics.[]')
        masonryObserver() {
          if (this.observeTaskCreated) return;
          this.observeTaskCreated = true;
          Ember.run.scheduleOnce('afterRender', this, () => {
            let _wrapper = this.$(".mansory"),
                _cards = this.$(".topic-list-item"),
                _cols = parseInt(_wrapper.css("column-count")) || 2,
                _out = [],
                _col = 0;

            while(_col < _cols) {
              for (let i = 0; i < _cards.length; i += _cols) {
                let _val = _cards[i + _col];
                if (_val !== undefined)
                  _out.push(_val);
              }
              _col++;
            }
            if (_cards.length & 1) {
              _out.push(_cards[_cards.length - 1]);
            }
            _wrapper.html(_out);
            _out = null;
            // let them render

            this.$(".topic-list-item").removeClass("right-column left-column");
            var halfScreenWidth = _wrapper[0].offsetWidth / 2;
            var leftCollection = [], rightCollection = [];
            this.$(".topic-list-item").each(function( index ) {
              if (this.offsetLeft > halfScreenWidth) {
                  rightCollection.push(this);
              } else {
                  leftCollection.push(this);
              }
            });
            $(leftCollection).before(addCreatedDate).addClass("right-column");
            $(rightCollection).before(addCreatedDate).addClass("right-column");
            leftCollection = rightCollection = null; // free vars
            this.$(".topic-list-item > :not(.arrow)").append($("<div class='arrow'></div>"));
            this.observeTaskCreated = false;
          });
        },

      });

      api.modifyClass('component:topic-list-item', {
        // Lifecyle logic

        showLast3Posts() {
          return this.topic.posts && this.topic.posts.length > 0;
        },

        bindLoadPostsEvent() {
          this.$().find('.load-last-posts-action').on('click', () => {
            this.$().find('.hidden-timeline-post').toggleClass('hide');
          });
        },

        addPostDate() {
          this.$().find('[data-post-created]').each(function(_index, date) {
            const self = $(date);
            const saneDate = moment(self.attr('data-post-created')).format('D MMMM YYYY');
            self.html(saneDate);
          })
        },

        addTopicDate() {
          const date = this.$().find('[data-created]').attr('data-created');
          const saneDate = moment(date).format('D MMMM YYYY');
          this.$('.link-top-line')
            .append(`<span class="timeline-item-created-at">${saneDate}</span>`);
        },

        @on('didReceiveAttrs')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, () => {
            this.addTopicDate();
            this.addPostDate();
            this.applyOrdering();
            this.bindLoadPostsEvent();

            this.$('#reply-now-button').on("click", () => {
              this.replyNow();
            });


            this.$('.topic-custom-like').on('click', (event) => {
              this.like(event);
            });
          });
        },

        @on('didInsertElement')
        setupListStyle() {
          Ember.run.scheduleOnce('afterRender', this, this.applyOrdering);
        },

        @on('init')
        _setupProperties() {
          this.set('tagName', 'div');
          const post = this.topic.main_post;

          if (!post) {
            return;
          }

          this.set("postRecrod", this.store.createRecord("post", post));

          // Get who liked the users and update likeAction accordingly so user can do unlike.
          fetchActionUsers(post).then(result => {
            if (result.post_action_users.find(user => user.id === this.currentUser.id)) {
              this.postRecrod.likeAction.acted = true
              this.postRecrod.likeAction.can_undo = true
              this.$('.topic-custom-like').addClass('liked');
            }
          })
        },

        applyOrdering() {
          var dateAdditional = $('.list-container').length ? addCreatedDate : '';
          this.$().before(dateAdditional).addClass("right-column");
        },

        click() {
          if (this.topic.hasExcerpt) {
            let topicReadMore = $(`#custom-topic-a-${this.topic.id}`);
            let topicDiv = $(`#custom-topic-div-${this.topic.id}`);
            let topicTagP = $(`#custom-topic-p-${this.topic.id}`);

            if (topicReadMore[0]?.checked && topicTagP[0]?.innerText.length) {
              topicTagP.remove();
              topicDiv.append(this.postRecrod.cooked);
            }
          }
        },

        // Like a topic right from the timeline...
        like(event) {
          this.postRecrod.updateLikeCount(this.topic.like_count + 1);
          if (this.postRecrod.likeAction && this.postRecrod.likeAction.get("canToggle")) {
            this.postRecrod.likeAction.togglePromise(this.postRecrod).then((result) => {
              if (result.acted) {
                this.$('.topic-custom-like').addClass('liked');
                this.$('.likes-count').html(this.topic.like_count + 1);
                this.topic.set("like_count", this.topic.like_count + 1);
              } else {
                this.$('.topic-custom-like.liked').removeClass('liked');
                this.$('.likes-count').html(this.topic.like_count - 1);
                this.topic.set("like_count", this.topic.like_count - 1);
              }
            });
          }
        },

        // This adds ability to reply right from the timeline. 
        replyNow() {
          const route = container.lookup("route:application");

          route.controllerFor("composer").open({
            action: Composer.REPLY,
            topic: this.topic,
            draftKey: `topic_${this.topic.id}`,
            draftSequence: this.topic.draft_sequence || 0,
          });
        }
      });
    });
  }
};
