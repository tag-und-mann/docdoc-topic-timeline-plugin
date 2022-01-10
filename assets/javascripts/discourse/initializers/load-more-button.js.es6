import { withPluginApi } from 'discourse/lib/plugin-api';
import mixinSettings from "../mixins/mixin-settings";

export default {
    name: 'load-more',
    initialize(container){

        withPluginApi('0.8.12', (api) => {

            api.modifyClass('component:discovery-topics-list', mixinSettings);

        });
    }
};
