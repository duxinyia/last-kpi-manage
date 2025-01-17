import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';
import ElementPlus from 'element-plus';
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import 'virtual:svg-icons-register'
import ElTableInfiniteScroll from "el-table-infinite-scroll"
// import datav from "@iamzzg/data-view/dist/vue3/datav.map.vue.esm";
const app:any = createApp(App);
directive(app);
other.elSvg(app);

app.use(pinia).use(ElementPlus).use(router).use(i18n).use(VueGridLayout).use(ElTableInfiniteScroll).mount('#app');
