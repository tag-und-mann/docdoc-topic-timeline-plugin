import { withPluginApi } from 'discourse/lib/plugin-api';
import { on, observes } from 'ember-addons/ember-computed-decorators';

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

  if (pageScrollPosition + diffCONST > elemCoords.top) {
    sidebar.css({position: 'fixed', top: diffCONST});
  } else {
    sidebar.css({position: 'absolute', top: 0});
  }
}

export default {
  name: 'topics',
  initialize(container){

    withPluginApi('0.8.12', (api) => {

      api.modifyClass('component:topic-list',  {
        // Lifecyle logic

        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, () => {

            if (!this.site.mobileView && $('.navigation-topics').length) {
              const path = window.location.pathname;
              if (this.order !== 'created' && (path === '/' || path === '/latest')) {
                this.changeSort('created');
              }
              if (this.order === 'created' && path !== '/latest') {
                this.changeSort('default');
              }
            }
            // this.$('.mansory .right-column:nth-child(4)').addClass("top-margin");

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

        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, this.applyOrdering);
        },

        @on('didInsertElement')
        setupListStyle() {
          Ember.run.scheduleOnce('afterRender', this, this.applyOrdering);
        },

        @on('init')
        _setupProperties() {
          if( $("#suggested-topics").length == 0 && $(".user-messages-page").length == 0 ) {
            this.set('tagName', 'div');
          } else {
            this.set('tagName', 'tr');
          }
        },

        applyOrdering() {
          var dateAdditional = $('.list-container').length ? addCreatedDate : '';
          this.$().before(dateAdditional).addClass("right-column");
        }

      });


    });
  }
};
