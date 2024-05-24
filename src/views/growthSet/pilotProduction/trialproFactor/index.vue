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
					@onOpenOtherDialog="setCurrent"
					@delRow="onTableDelRow"
					@pageChange="onTablePageChange"
					@exportTable="onExportTable"
					:row-style="tableRowClassName"
					@openAdd="openDialog"
					@getSummaries="comSum"
				>
				</Table>
			</el-form>
			<!-- 编辑弹窗 -->
			<Dialog
				:isFootBtn="isFootBtn"
				ref="dialogRef"
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

<script setup lang="ts" name="trialproFactor">
import { defineAsyncComponent, reactive, ref, onMounted, h, VNode } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));

import {
	getTrialcoeffApi,
	postTrialcoeffUpdateApi,
	postTrialcoeffExportApi,
	postTrialcoeffImportExcelApi,
	postTrialcoeffDeleteApi,
	postTrialcoeffSetBaseProjectApi,
} from '/@/api/growthSet/trialproFactor';
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const matNoRef = ref();
const sampleDeliveryListDialogRef = ref(false);
const formRef = ref();
const dialogRef = ref();
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
			{ key: 'projectName', colWidth: '', title: '專案名稱', type: 'text', isCheck: true, isTableIcon: true, isRequired: true },
			{ key: 'prostationsa', colWidth: '', title: '製程主站位數_a', type: 'text', isCheck: true },
			{ key: 'diffcultcoeffb', colWidth: '', title: '難度係數_b', type: 'text', isCheck: true },
			{ key: 'convernumc', colWidth: '', title: '折算數量_c(a/基準*b)', type: 'text', isCheck: true },
		],
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
			operateWidth: 230, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			height: 740,
			isShowSummary: true,
			exportIcon: true,
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
			{ type: 'other', name: '選定為基準機種', isSure: false, color: '#67c23a', icon: '' },
			{ type: 'edit', name: '修改', isSure: false, color: '#438df5', icon: '' },
			// { type: 'del', name: 'message.allButton.deleteBtn', defaultColor: 'danger', icon: 'ele-Delete' },
		],
		// 弹窗表单
		dialogConfig: [
			{ label: '專案名稱', prop: 'projectName', placeholder: '', required: false, type: 'text', sm: 24, md: 24, lg: 24, xl: 24, isCheck: true },
			{
				label: '製程主站位數_a',
				prop: 'prostationsa',
				placeholder: '',
				required: true,
				type: 'number',
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
				precision: 0,
			},
			{
				label: '難度係數_b',
				prop: 'diffcultcoeffb',
				placeholder: '',
				required: true,
				type: 'number',
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
				precision: 2,
			},
		],
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
		// ...state.tableData.page,
	};
	const res = await getTrialcoeffApi(data);
	// state.tableData.tempTableData = res.data;
	// state.tableData.data = res.data.slice(0, 15);
	state.tableData.data = res.data;
	// state.tableData.config.total = res.data.length;
	if (res.status) {
		state.tableData.config.loading = false;
	}
	tableRef.value?.infiniteScrollReset();
};
// 觸底
const tableInfiniteScroll = (page: number, data: EmptyObjectType) => {
	state.tableData.data = state.tableData.data.concat(data);
};
// 下載模板
const downloadTemp = () => {
	window.open(
		`${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : window.webConfig.webApiBaseUrl}/doc/Trialcoeff.xlsx`,
		'_blank'
	);
};
// 上传文件
const submitUpload = async (formEl: EmptyObjectType | undefined) => {
	const res = await postTrialcoeffImportExcelApi(formEl!.raw);
	if (res.status) {
		ElMessage.success('上傳成功');
		dialogRef.value.closeDialog();
		getTableData();
	}
};
// 下載
const onExportTable = async () => {
	const form = state.tableData.form;
	let data: EmptyObjectType = {
		...form,
	};
	const res = await postTrialcoeffExportApi(data);
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
	if (row.baseflag == 'Y') {
		return { 'background-color': '#ffc000', 'font-weight': 700 };
	}
	// if (rowIndex === state.tableData.data.length - 1) {
	// 	// 固定最後一行
	// 	return { position: 'sticky', bottom: 0, 'background-color': '#f5f7fa', 'z-index': 100 };
	// }
};
// 選中行
const setCurrent = (scope: EmptyObjectType) => {
	ElMessageBox.confirm(`是否選擇 <span style="color:red">${scope.row.projectName}</span> 此專案為基準機種？`, t('message.hint.tips'), {
		confirmButtonText: t('message.allButton.ok'),
		cancelButtonText: t('message.allButton.cancel'),
		type: 'warning',
		draggable: true,
		dangerouslyUseHTMLString: true, // 注意此属性
		closeOnClickModal: false,
	})
		.then(async () => {
			const res = await postTrialcoeffSetBaseProjectApi({ ...scope.row, baseflag: 'Y' });
			// state.tableData.data.forEach((item) => {
			// 	item.flag = false;
			// });
			// scope.row.flag = true;
			getTableData();
		})
		.catch(() => {});
};

// 合計
const comSum = (param: EmptyObjectType, sums: any) => {
	const { columns, data } = param;
	columns.forEach((column: EmptyObjectType, index: number) => {
		// if (index === 0) {
		// 	sums[index] = h('div', { style: { 'backgound-color': '#000' } }, [h('div', '月小計'), h('div', '同比累計')]);
		// 	return;
		// }
		// if (index === 1) {
		// 	sums[index] = h('div', [h('div', 1), h('div', 2)]);
		// 	return;
		// }
		if (index === 0) {
			sums[index] = h('div', ['轉案數量合計']);
			return;
		}
		if (column.property === 'convernumc') {
			const values = data.map((item: any) => Number(item[column.property]));
			if (!values.every((value: any) => Number.isNaN(value))) {
				sums[index] = `${values.reduce((prev: any, curr: any) => {
					const value = Number(curr);
					if (!Number.isNaN(value)) {
						return parseFloat((prev + curr).toFixed(2));
					} else {
						return prev;
					}
				}, 0)}`;
			}
		} else {
			sums[index] = ' ';
		}
	});
};
// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	isFootBtn.value = type === 'imp' ? false : true;
	dialogRef.value.openDialog(type, row, '');
};
//新增修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	const res = await postTrialcoeffUpdateApi(ruleForm);
	if (res.status) {
		ElMessage.success(t(`message.hint.modifiedSuccess`));
		dialogRef.value.closeDialog();
		getTableData();
	}
	loadingBtn.value = false;
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	const res = await postTrialcoeffDeleteApi(row);
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
