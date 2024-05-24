<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" :form="state.tableData.form" />
			<el-form ref="formRef" :model="state.tableData">
				<Table
					ref="tableRef"
					v-bind="state.tableData"
					class="table"
					@sortHeader="onSortHeader"
					@onTableInfiniteScroll="tableInfiniteScroll"
					@openAdd="openDialog"
					@delRow="onTableDelRow"
					@exportTable="onExportTable"
					:row-style="tableRowClassName"
				>
				</Table>
			</el-form>
			<!-- 编辑弹窗 -->
			<Dialog
				ref="projectDialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="40%"
				@downloadTemp="downloadTemp"
				@importTableData="submitUpload"
				:isFootBtn="isFootBtn"
			>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="floorGrowthRatio">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
import {
	getTrialplanByPageApi,
	postTrialplanAddApi,
	postTrialplanUpdateApi,
	postTrialplanDeleteApi,
	postTrialplanExportApi,
	postTrialplanImportExcelApi,
} from '/@/api/growthSet/setTrialProductionPlan';
import { getFloorpropByPageApi, postFloorpropUpdaApi, postFloorpropExportApi, postFloorpropImportExcelApi } from '/@/api/growthSet/floorGrowthRatio';
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
		header: [{ key: 'projectName', colWidth: '', title: '月份', type: 'text', isCheck: true }],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: false, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: true, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: true, //是否有表格右上角工具
			isPage: false, //是否有分页
			operateWidth: 110, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			exportIcon: true,
			// tableAlign: 'left',
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{
				label: 'BU',
				prop: 'buCode',
				required: false,
				type: 'select',
				placeholder: '',
				options: [
					{ value: 'CMA', label: 'CMA', text: 'CMA', selected: true },
					{ value: 'DP', label: 'DP', text: 'DP' },
					{ value: 'CMB', label: 'CMB', text: 'CMB' },
					{ value: 'CMC', label: 'CMC', text: 'CMC' },
				],
				noclearable: true,
			},
			{ label: '年度', prop: 'yyyy', required: false, type: 'date', placeholder: '', dateType: 'year', valueFormat: 'YYYY', noclearable: true },
		],
		searchConfig: {
			isSearchBtn: true,
		},
		topBtnConfig: [],
		btnConfig: [
			{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' },
			// { type: 'del', name: 'message.allButton.deleteBtn', isSure: false, defaultColor: 'danger', icon: 'ele-Delete' },
		],
		// 弹窗表单
		dialogConfig: [],
		// 给后端的数据
		form: { yyyy: '2024', buCode: 'CMA' },
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
	};
	const res = await getFloorpropByPageApi(data);
	// res.data.map((item: any) => {
	// 	item.planDetail.map((detail: any) => {
	// 		item['mm-' + detail.mm] = detail.numerical;
	// 	});
	// });
	res.data[res.data.length - 1].editIsShow = true;
	state.tableData.tempTableData = res.data;
	state.tableData.data = res.data.slice(0, 15);

	state.tableData.config.total = res.data.length;
	if (res.status) {
		state.tableData.config.loading = false;
	}
	tableRef.value?.infiniteScrollReset();
};
const tableRowClassName = ({ row, rowIndex }: any) => {
	if (rowIndex === state.tableData.data.length - 1) {
		// 固定最後一行
		return { position: 'sticky', bottom: 0, 'background-color': '#edf192', 'z-index': 100 };
	}
};
// 觸底
const tableInfiniteScroll = (page: number, data: EmptyObjectType) => {
	state.tableData.data = state.tableData.data.concat(data);
};
let rows: EmptyObjectType = {};
// 打开新增編輯弹窗
const openDialog = (type: string, row: EmptyObjectType) => {
	isFootBtn.value = type === 'imp' ? false : true;
	projectDialogRef.value.openDialog(type, row, '');
};
//修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	// let form = { ...ruleForm };
	// let getData = [];
	// for (let key in ruleForm) {
	// 	if (key.includes('-')) {
	// 		getData.push({ yyyy: form.yyyy, monthStr: key.split('-')[1], adjustCoeff: ruleForm[key], buCode: form.buCode });
	// 	}
	// }
	loadingBtn.value = true;
	const res = await postFloorpropUpdaApi(ruleForm);
	if (res.status) {
		ElMessage.success(t(`message.hint.modifiedSuccess`));
		projectDialogRef.value.closeDialog();
		getTableData();
	}
	loadingBtn.value = false;
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	let { buCode, projectId, projectName } = row;
	const res = await postTrialplanDeleteApi({ buCode, projectId, projectName, ...state.tableData.form });
	if (res.status) {
		ElMessage.success(`${t('message.allButton.deleteBtn')} ${t('message.hint.success')}`);
		getTableData();
	}
};
// 下載模板
const downloadTemp = () => {
	window.open(
		`${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : window.webConfig.webApiBaseUrl}/doc/Floorprop.xlsx`,
		'_blank'
	);
};
// 上传文件
const submitUpload = async (formEl: EmptyObjectType | undefined) => {
	const res = await postFloorpropImportExcelApi(formEl!.raw);
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
	const res = await postFloorpropExportApi(data);
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
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
	state.tableData.form = Object.assign({}, state.tableData.form, { ...data });
	tableRef.value?.pageReset();
	getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
	state.tableData.header = data;
};
const getHearder = () => {
	const montArr = [
		{ title: '1月', key: 'janNum' },
		{ title: '2月', key: 'febNum' },
		{ title: '3月', key: 'marNum' },
		{ title: '4月', key: 'aprNum' },
		{ title: '5月', key: 'mayNum' },
		{ title: '6月', key: 'junNum' },
		{ title: '7月', key: 'julNum' },
		{ title: '8月', key: 'augNum' },
		{ title: '9月', key: 'septNum' },
		{ title: '10月', key: 'octNum' },
		{ title: '11月', key: 'novNum' },
		{ title: '12月', key: 'decNum' },
	];
	let headerList: EmptyArrayType = [];
	let hearObj: EmptyObjectType = {};
	let dialogList: EmptyArrayType = [];
	let dialogObj: EmptyObjectType = {};
	montArr.forEach((item) => {
		hearObj = {
			key: item.key,
			title: item.title,
			type: 'text',
			isCheck: true,
			childrenHeader: [],
		};
		headerList.push(hearObj);
		dialogObj = {
			prop: item.key,
			label: item.title + ':',
			placeholder: '',
			required: false,
			type: 'number',
			isCheck: true,
			precision: 1,
		};
		dialogList.push(dialogObj);
	});

	state.tableData.header = state.tableData.header.concat(headerList);
	state.tableData.dialogConfig = state.tableData.dialogConfig?.concat(dialogList);
};
// 页面加载时
onMounted(() => {
	getHearder();
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
