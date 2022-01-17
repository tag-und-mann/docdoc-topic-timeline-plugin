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
    # self.rebake!(invalidate_broken_images: true, priority: :normal)
    new_cooked = Nokogiri::HTML.fragment(cooked)
    new_cooked.css('.poll').remove
    mentions = new_cooked.css('.mention').map { |m| [m.inner_html, m.to_s] }
    text = Post.excerpt(new_cooked.to_html, SiteSetting.post_excerpt_maxlength, strip_images: true, post: self)
    text.gsub!('[image]', '')
    mentions.each { |m| text.gsub!(m[0], m[1]) }
    text
  end

  add_to_serializer(:listable_topic, :include_excerpt?) { true }

  add_to_serializer(:listable_topic, :video_url, false) {
    raw = object.posts.first.raw
    raw.match(/(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com|player\.vimeo\.com\/video)\/([\w\/]+)([\?].*)*/).to_a.first
  }

  # Load last 3 posts of a topic.
  add_to_serializer(:topic_list_item, :posts) do
    @posts ||= begin
      posts = object.posts_count < 4 ? object.posts.last(object.posts_count - 1) : object.posts.last(3) || []
      posts.map do |post|
        serializer = PostSerializer.new(post, scope: scope, root: false)
        serializer.as_json
      end
    end
  end

  # Load last 3 posts of a suggested topic.
  add_to_serializer(:suggested_topic, :posts) do
    @posts ||= begin
      posts = object.posts_count < 4 ? object.posts.last(object.posts_count - 1) : object.posts.last(3) || []
      posts.map do |post|
        serializer = PostSerializer.new(post, scope: scope, root: false)
        serializer.as_json
      end
    end
  end

  add_to_class :topic_query, :create_list do |filter, options = {}, topics = nil|
    topics ||= default_results(options)
    topics = yield(topics) if block_given?

    options = options.merge(@options)
    if ["activity", "default", "created"].include?(options[:order] || "activity") &&
      !options[:unordered] &&
      filter != :private_messages
      topics = prioritize_pinned_topics(topics, options)
    end

    topics = topics.to_a

    if options[:preload_posters]
      user_ids = []
      topics.each do |ft|
        user_ids << ft.user_id << ft.last_post_user_id << ft.featured_user_ids << ft.allowed_user_ids
      end

      avatar_lookup = AvatarLookup.new(user_ids)
      primary_group_lookup = PrimaryGroupLookup.new(user_ids)

      # memoize for loop so we don't keep looking these up
      translations = TopicPostersSummary.translations

      topics.each do |t|
        t.posters = t.posters_summary(
          avatar_lookup: avatar_lookup,
          primary_group_lookup: primary_group_lookup,
          translations: translations
        )
      end
    end

    topics.each do |t|
      t.allowed_user_ids = filter == :private_messages ? t.allowed_users.map { |u| u.id } : []
    end

    list = TopicList.new(filter, @user, topics, options.merge(@options))
    list.per_page = options[:per_page] || per_page_setting
    list
  end

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
