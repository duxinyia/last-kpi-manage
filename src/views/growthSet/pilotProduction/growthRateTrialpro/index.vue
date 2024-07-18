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
					@delRow="onTableDelRow"
					@pageChange="onTablePageChange"
					@exportTable="onExportTable"
					:row-style="tableRowClassName"
				>
				</Table>
			</el-form>
			<!-- 编辑弹窗 -->
			<!-- <Dialog
				:isFootBtn="isFootBtn"
				ref="projectDialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="40%"
			>
			</Dialog> -->
		</div>
	</div>
</template>

<script setup lang="ts" name="growthRateTrialpro">
import { defineAsyncComponent, reactive, ref, onMounted, h, VNode } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
import { getTrialpropApi, postTrialpropUpdateApi, postTrialpropExportApi } from '/@/api/growthSet/growthRateTrialpro';
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
			{ key: 'projectName', colWidth: '150', title: '專案名稱', type: 'text', isCheck: true, isTableIcon: true, isRequired: true },
			{ key: 'janNum', colWidth: '', title: '1月', type: 'text', isCheck: true },
			{ key: 'febNum', colWidth: '', title: '2月', type: 'text', isCheck: true },
			{ key: 'marNum', colWidth: '', title: '3月', type: 'text', isCheck: true },
			{ key: 'aprNum', colWidth: '', title: '4月', type: 'text', isCheck: true },
			{ key: 'mayNum', colWidth: '', title: '5月', type: 'text', isCheck: true },
			{ key: 'junNum', colWidth: '', title: '6月', type: 'text', isCheck: true },
			{ key: 'julNum', colWidth: '', title: '7月', type: 'text', isCheck: true },
			{ key: 'augNum', colWidth: '', title: '8月', type: 'text', isCheck: true },
			{ key: 'septNum', colWidth: '', title: '9月', type: 'text', isCheck: true },
			{ key: 'octNum', colWidth: '', title: '10月', type: 'text', isCheck: true },
			{ key: 'novNum', colWidth: '', title: '11月', type: 'text', isCheck: true },
			{ key: 'decNum', colWidth: '', title: '12月', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: false, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: false, // 是否显示表格操作栏
			isButton: true, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: true, //是否有表格右上角工具
			isPage: false, //是否有分页
			operateWidth: 200, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			height: 710,
			exportIcon: true,
			isHidenExportIcon: true,
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
		btnConfig: [],
		// 弹窗表单
		dialogConfig: [],
		// 给后端的数据
		form: { buCode: 'CMA', yyyy: new Date().getFullYear().toString() },
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
	const res = await getTrialpropApi(data);
	// let myData = [{}];
	// res.data.forEach((item: any) => {
	// 	item.planDetail.forEach((i: any) => {
	// 		item['mm-' + i.mm] = i.numerical;
	// 	});
	// });
	// state.tableData.tempTableData = res.data;
	// state.tableData.data = res.data.slice(0, 15);
	state.tableData.data = res.data;

	// state.tableData.config.total = res.data.length;
	if (res.status) {
		state.tableData.config.loading = false;
	}
	// tableRef.value?.infiniteScrollReset();
};
// 觸底
const tableInfiniteScroll = (page, data) => {
	state.tableData.data = state.tableData.data.concat(data);
};

// 下載
const onExportTable = async () => {
	const form = state.tableData.form;
	let data: EmptyObjectType = {
		...form,
	};
	const res = await postTrialpropExportApi(data);
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
const tableRowClassName = ({ row, rowIndex }: any) => {
	// if (rowIndex === state.tableData.data.length - 2) {
	// 	return { position: 'sticky', bottom: '48px', 'background-color': '#f5f7fa', 'z-index': 100 };
	// }
	// 固定第一行
	if (rowIndex == 0) {
		return { position: 'sticky', top: 0, 'background-color': '#edf192', 'z-index': 100 };
	}
	if (rowIndex === state.tableData.data.length - 1) {
		// 固定最後一行
		return { position: 'sticky', bottom: 0, 'background-color': '#f5f7fa', 'z-index': 100 };
	}
};

// 打开新增編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	// projectDialogRef.value.openDialog(type, row, '信息');
};
//新增修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	// const res = type === 'add' ? await postProjectInfoAddApi(ruleForm) : await postProjectInfoUpdaApi(ruleForm);
	// if (res.status) {
	// 	type === 'add' ? ElMessage.success(t(`message.hint.addSuccess`)) : ElMessage.success(t(`message.hint.modifiedSuccess`));
	// 	projectDialogRef.value.closeDialog();
	// 	getTableData();
	// }
	loadingBtn.value = false;
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	// const res = await postProjectInfoDeleteApi(row);
	// if (res.status) {
	// 	ElMessage.success(`${t('message.allButton.deleteBtn')} ${t('message.hint.success')}`);
	// 	getTableData();
	// }
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
