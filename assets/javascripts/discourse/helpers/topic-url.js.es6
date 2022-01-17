import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("topic-url", function(topic) {
    return topic.linked_post_number
      ? topic.urlForPostNumber(topic.linked_post_number)
      : topic.get("lastUnreadUrl");
});
