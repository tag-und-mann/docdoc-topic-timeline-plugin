# name: berta-topic-timeline-plugin
# about: Changes for standard topic view
# version: 0.1.0
# authors: Vladyslav Sydorenko

enabled_site_setting :timeline_sidebar_enabled

register_asset 'slick/css/slick.scss'
register_asset 'stylesheets/timeline_sidebar_common.scss'
register_asset 'stylesheets/timeline_topics_common.scss'
register_asset 'stylesheets/timeline_sidebar_mobile.scss'
register_asset 'stylesheets/timeline_topics_mobile.scss'

register_asset 'slick/slick.min.js'

after_initialize do
  add_to_class :post, :excerpt_for_topic do
    self.rebake!(invalidate_broken_images: true, priority: :normal)
    new_cooked = Nokogiri::HTML.fragment(cooked)
    new_cooked.css(".poll").remove
    text = Post.excerpt(new_cooked.to_html, SiteSetting.post_excerpt_maxlength, strip_links: true, strip_images: true, post: self)
    text.gsub('[image]', '')
  end
  add_to_serializer(:listable_topic, :include_excerpt?) { true }

  add_to_serializer(:listable_topic, :video_url, false) {
    raw = object.posts.first.raw
    raw.match(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/).to_a.first
  }

  require_dependency "application_controller"
  require_dependency "plugin_store"
  require_dependency 'rss'

  module ::TopicTimeline
    PLUGIN_NAME = 'topic_timeline'.freeze

    class Engine < ::Rails::Engine
      engine_name TopicTimeline::PLUGIN_NAME
      isolate_namespace TopicTimeline
    end
  end

  class TopicTimeline::ReceiveFeed
    attr_reader :uri

    def initialize(uri)
      @uri = uri
    end

    def call
      rss = RSS::Parser.parse(uri, false)

      channel = channel_data(rss.channel)
      items = items_data(rss.items)

      { channel_data: channel, items: items }
    rescue => e
      { error: e.to_s }
    end

    private

    def channel_data(channel)
      {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        copyright: channel.copyright,
        language: channel.language,
        image: {
          url: channel.image.url,
          title: channel.image.title,
          link: channel.image.link
        }
      }
    end

    def items_data(items)
      items.map do |item|
        {
          title: item.title,
          link: item.link,
          description: item.description,
          category: item.category,
          pub_date: item.pubDate,
          source: item.source,
          guid: item.guid&.content
        }
      end
    end
  end

  class TopicTimeline::TopicTimelineController < ::ApplicationController
    requires_plugin TopicTimeline::PLUGIN_NAME

    before_action :ensure_logged_in
    skip_before_action :check_xhr

    def feed
      feed_data = TopicTimeline::ReceiveFeed.new(params[:uri]).call
      status = feed_data[:error] ? 422 : 200
      render json: feed_data, status: status
    end
  end


  TopicTimeline::Engine.routes.draw do
    get '/' => 'topic_timeline#feed'
  end

  Discourse::Application.routes.append do
    mount ::TopicTimeline::Engine, at: '/rss_feed'
  end
end
