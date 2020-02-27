import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("topic-video", function(topic) {
    let url = '';
    if (topic.video_url.indexOf('vimeo') !== -1) {
        url = 'https://player.vimeo.com/video/';
    } else if (topic.video_url.indexOf('youtu') !== -1) {
        url = 'https://www.youtube.com/embed/';
    }

    return `${url}${getVideoId(topic.video_url)}?title=0&byline=0&portrait=0`;
});

function getVideoId(videoUrl) {
    let [url, params] = videoUrl.split('?');
    const queryArr = params ? params.split('&') : [];
    const paramsArr = url.split('/');
    const vimeoVideoIndex = paramsArr.findIndex(param => param === 'vimeo.com');
    const videoIdParamIndex = queryArr.findIndex(param => param.split('=')[0] === 'v');

    if (videoIdParamIndex !== -1) {
        return queryArr[videoIdParamIndex].split('=')[1];
    } else {
        return vimeoVideoIndex !== -1 ? paramsArr[vimeoVideoIndex + 1] : paramsArr[paramsArr.length - 1];
    }
}
