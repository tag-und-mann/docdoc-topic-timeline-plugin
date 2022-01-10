import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("topic-title", function(topic) {
    return topic.get("fancyTitle") || '';
});
