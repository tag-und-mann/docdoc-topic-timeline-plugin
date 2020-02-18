# name: berta-topic-timeline-plugin
# about: Changes for standard topic view
# version: 0.0.2
# authors: Vadim Bondar

enabled_site_setting :timeline_sidebar_enabled

register_asset 'slick/css/slick.scss'
register_asset 'stylesheets/timeline_sidebar_common.scss'
register_asset 'stylesheets/timeline_topics_common.scss'
register_asset 'stylesheets/timeline_sidebar_mobile.scss'
register_asset 'stylesheets/timeline_topics_mobile.scss'

register_asset 'slick/slick.min.js'

after_initialize do
  add_to_class :post, :excerpt_for_topic do
    Post.excerpt(cooked, 200, strip_links: true)
  end
  add_to_serializer(:listable_topic, :include_excerpt?) { true }
end
