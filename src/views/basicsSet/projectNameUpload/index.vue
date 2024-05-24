<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" />
			<el-form ref="formRef" :model="state.tableData">
				<Table
					ref="tableRef"
					v-bind="state.tableData"
					class="table"
					@sortHeader="onSortHeader"
					@onTableInfiniteScroll="tableInfiniteScroll"
					@openAdd="openDialog"
					@delRow="onTableDelRow"
					@pageChange="onTablePageChange"
					@exportTable="onExportTable"
				>
				</Table>
			</el-form>
			<!-- 编辑弹窗 -->
			<Dialog
				:isFootBtn="isFootBtn"
				ref="projectDialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="40%"
				@downloadTemp="downloadTemp"
				@importTableData="submitUpload"
			>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="projectNameUpload">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
import {
	getProjectInfoByPageApi,
	postProjectInfoAddApi,
	postProjectInfoDeleteApi,
	postProjectInfoExportApi,
	postProjectInfoImportExcelApi,
	postProjectInfoUpdaApi,
} from '/@/api/growthSet/projectNameUpload';
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const matNoRef = ref();
const sampleDeliveryListDialogRef = ref(false);
const formRef = ref();
const projectDialogRef = ref();
const loadingBtn = ref(false);
const isFootBtn = ref(true);
// 弹窗标题
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		tempTableData: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'projectId', colWidth: '', title: '專案編碼', type: 'text', isCheck: true, isTableIcon: true, isRequired: true },
			{ key: 'projectName', colWidth: '', title: '轉案名稱', type: 'text', isCheck: true },
			{ key: 'buCode', colWidth: '', title: 'BU代碼', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: true, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: true, //是否有表格右上角工具
			isPage: false, //是否有分页
			operateWidth: 200, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			exportIcon: true,
			height: 680,
			// tableAlign: 'left',
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '專案編碼', prop: 'projectId', required: false, type: 'input', placeholder: '' },
			{ label: '轉案名稱', prop: 'projectName', required: false, type: 'input', placeholder: '' },
			{
				label: 'BU',
				prop: 'Bucode',
				required: false,
				type: 'select',
				placeholder: '',
				options: [
					{ value: 'CMA', label: 'CMA', text: 'CMA' },
					{ value: 'DP', label: 'DP', text: 'DP' },
					{ value: 'CMB', label: 'CMB', text: 'CMB' },
					{ value: 'CMC', label: 'CMC', text: 'CMC' },
				],
			},
		],
		searchConfig: {
			isSearchBtn: true,
		},
		topBtnConfig: [{ type: 'add', name: '新增', defaultColor: 'primary', isSure: true, disabled: true }],
		btnConfig: [
			{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' },
			{ type: 'del', name: 'message.allButton.deleteBtn', isSure: false, defaultColor: 'danger', icon: 'ele-Delete' },
		],
		// 弹窗表单
		dialogConfig: [
			{ label: '專案代號', prop: 'projectId', placeholder: '', required: true, type: 'input', sm: 24, md: 24, lg: 24, xl: 24, isCheck: true },
			{ label: '專案名稱', prop: 'projectName', placeholder: '', required: true, type: 'input', sm: 24, md: 24, lg: 24, xl: 24, isCheck: true },
			{
				label: 'BU代碼',
				prop: 'buCode',
				placeholder: '',
				required: true,
				type: 'select',
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
				options: [
					{ value: 'CMA', label: 'CMA', text: 'CMA' },
					{ value: 'DP', label: 'DP', text: 'DP' },
					{ value: 'CMB', label: 'CMB', text: 'CMB' },
					{ value: 'CMC', label: 'CMC', text: 'CMC' },
				],
			},
			// { label: '年月', prop: 'yandm', placeholder: '', required: true, type: 'input', sm: 24, md: 24, lg: 24, xl: 24, isCheck: true },
		],
		// 给后端的数据
		form: {},
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10000,
		},
		// 打印标题
		printName: '表格打印演示',
	},
});
// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const form = state.tableData.form;
	let data: EmptyObjectType = {};
	data = {
		...form,
		...state.tableData.page,
	};
	const res = await getProjectInfoByPageApi(data);
	state.tableData.tempTableData = res.data.data;
	state.tableData.data = res.data.data.slice(0, 15);

	state.tableData.config.total = res.data.data.length;
	if (res.status) {
		state.tableData.config.loading = false;
	}
	tableRef.value?.infiniteScrollReset();
};
// 觸底
const tableInfiniteScroll = (page: number, data: EmptyObjectType) => {
	// let data = state.tableData.tempTableData.slice(page * 15, page * 15 + 15);
	state.tableData.data = state.tableData.data.concat(data);
};
// 下載模板
const downloadTemp = () => {
	window.open(`${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : window.webConfig.webApiBaseUrl}/doc/Project.xlsx`, '_blank');
};
// 上传文件
const submitUpload = async (formEl: EmptyObjectType | undefined) => {
	const res = await postProjectInfoImportExcelApi(formEl!.raw);
	if (res.status) {
		ElMessage.success('上傳成功');
		projectDialogRef.value.closeDialog();
		getTableData();
	}
};
// 下載
const onExportTable = async () => {
	const form = state.tableData.form;
	let data: EmptyObjectType = {
		...form,
	};

	// if (Object.keys(data).length <= 0) return ElMessage.warning(t('沒有可以導出的專案'));
	const res = await postProjectInfoExportApi(data);
	const result: any = res.data;
	let blob = new Blob([result], {
		// 这里一定要和后端对应，不然可能出现乱码或者打不开文件
		type: 'application/vnd.ms-excel',
	});
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1].replace(new RegExp('"', 'g'), '');
	link.download = decodeURIComponent(temp);
	// link.download = `${t('文件')} ${new Date().toLocaleString()}.xlsx`; // 在前端也可以设置文件名字
	link.click();
	//释放内存
	window.URL.revokeObjectURL(link.href);
};
// 打开新增編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	isFootBtn.value = type === 'imp' ? false : true;
	state.tableData.dialogConfig?.forEach((item) => {
		if (item.prop != 'projectName') {
			item.type = type === 'add' ? (item.prop == 'projectId' ? 'input' : 'select') : 'text';

			item.required = type === 'add' ? true : false;
		}
	});
	projectDialogRef.value.openDialog(type, row, '信息');
};
//新增修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	const res = type === 'add' ? await postProjectInfoAddApi(ruleForm) : await postProjectInfoUpdaApi(ruleForm);
	if (res.status) {
		type === 'add' ? ElMessage.success(t(`message.hint.addSuccess`)) : ElMessage.success(t(`message.hint.modifiedSuccess`));
		projectDialogRef.value.closeDialog();
		getTableData();
	}
	loadingBtn.value = false;
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	const res = await postProjectInfoDeleteApi(row);
	if (res.status) {
		ElMessage.success(`${t('message.allButton.deleteBtn')} ${t('message.hint.success')}`);
		getTableData();
	}
};
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
	state.tableData.form = Object.assign({}, state.tableData.form, { ...data });
	tableRef.value?.pageReset();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
	state.tableData.header = data;
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.page.pageNum = page.pageNum;
	state.tableData.page.pageSize = page.pageSize;
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.table-container {
	.table-padding {
		padding: 15px;
		.table {
			flex: 1;
			overflow: hidden;
		}
	}
}
:deep(.download-form) {
	margin-bottom: 50px !important;
}
</style>
