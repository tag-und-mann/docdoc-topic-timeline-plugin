import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("topic-video", function(topic) {
    const frameUrlYouTube = 'https://www.youtube.com/embed/';
    const frameUrlVimeo = 'https://player.vimeo.com/video/';
    let url = '';

    if (topic.video_url.indexOf(frameUrlVimeo) !== -1 || topic.video_url.indexOf(frameUrlYouTube) !== -1) {
        return `${topic.video_url}?title=0&byline=0&portrait=0`;
    }

    if (topic.video_url.indexOf('vimeo') !== -1) {
        url = frameUrlVimeo;
    } else if (topic.video_url.indexOf('youtu') !== -1) {
        url = frameUrlYouTube;
    }

    return `${url}${getVideoId(topic.video_url)}?title=0&byline=0&portrait=0`;
});

function getVideoId(videoUrl) {
    let [url, params] = videoUrl.split('?');
    const queryArr = params ? params.split('&') : [];
    const paramsArr = url.split('/');
    const vimeoVideo = paramsArr.find(param => param === 'vimeo.com');
    const videoIdParam = queryArr.find(param => param.split('=')[0] === 'v');
    const vimeoVideoIndex = vimeoVideo ? paramsArr.indexOf(vimeoVideo) : '';
    const videoIdParamIndex = videoIdParam ? queryArr.indexOf(videoIdParam) : '';

    if (videoIdParamIndex) {
        return queryArr[videoIdParamIndex].split('=')[1];
    } else {
        return vimeoVideoIndex ? paramsArr[vimeoVideoIndex + 1] : paramsArr[paramsArr.length - 1];
    }
}
