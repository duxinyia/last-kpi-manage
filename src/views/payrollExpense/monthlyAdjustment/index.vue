<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" :form="state.tableData.form" />
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table"
				@sortHeader="onSortHeader"
				@onTableInfiniteScroll="tableInfiniteScroll"
				@openAdd="openDialog"
				@pageChange="onTablePageChange"
			>
			</Table>
			<!-- 编辑弹窗 -->
			<Dialog ref="dialogRef" :dialogConfig="state.tableData.dialogConfig" @addData="addData" :loadingBtn="loadingBtn" dialogWidth="50%"> </Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="monthlyAdjustment">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDeptInfoGetOrganizeFrameApi } from '/@/api/basicsSet/departmentParameter';
import { getGetMonCoeffApi, postMonCoeffUpdateApi } from '/@/api/payrollExpense/monthlyAdjustment';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const dialogRef = ref();
const loadingBtn = ref(false);
// 弹窗标题
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		tempTableData: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'month', colWidth: '', title: '月份', type: 'text', isCheck: true },
			{ key: 'mm-1', colWidth: '', title: '1月', type: 'text', isCheck: true },
			{ key: 'mm-2', colWidth: '', title: '2月', type: 'text', isCheck: true },
			{ key: 'mm-3', colWidth: '', title: '3月', type: 'text', isCheck: true },
			{ key: 'mm-4', colWidth: '', title: '4月', type: 'text', isCheck: true },
			{ key: 'mm-5', colWidth: '', title: '5月', type: 'text', isCheck: true },
			{ key: 'mm-6', colWidth: '', title: '6月', type: 'text', isCheck: true },
			{ key: 'mm-7', colWidth: '', title: '7月', type: 'text', isCheck: true },
			{ key: 'mm-8', colWidth: '', title: '8月', type: 'text', isCheck: true },
			{ key: 'mm-9', colWidth: '', title: '9月', type: 'text', isCheck: true },
			{ key: 'mm-10', colWidth: '', title: '10月', type: 'text', isCheck: true },
			{ key: 'mm-11', colWidth: '', title: '11月', type: 'text', isCheck: true },
			{ key: 'mm-12', colWidth: '', title: '12月', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: false, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isButton: false, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: true, //是否有表格右上角工具
			isPage: false, //是否有分页
			operateWidth: 120, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '年度', prop: 'YearStr', required: false, type: 'date', placeholder: '', dateType: 'year', valueFormat: 'YYYY', noclearable: true },
		],
		searchConfig: {
			isSearchBtn: true,
		},
		btnConfig: [{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' }],
		// 弹窗表单
		dialogConfig: [
			{ label: '1月', prop: 'mm-1', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '2月', prop: 'mm-2', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '3月', prop: 'mm-3', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '4月', prop: 'mm-4', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '5月', prop: 'mm-5', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '6月', prop: 'mm-6', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '7月', prop: 'mm-7', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '8月', prop: 'mm-8', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '9月', prop: 'mm-9', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '10月', prop: 'mm-10', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '11月', prop: 'mm-11', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
			{ label: '12月', prop: 'mm-12', placeholder: '', required: false, type: 'number', isCheck: true, precision: 2 },
		],
		// 给后端的数据
		form: { YearStr: new Date().getFullYear().toString() },
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: '表格打印演示',
	},
});

// let tempTableData = [];
// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const form = state.tableData.form;
	let data: EmptyObjectType = {};
	data = {
		...form,
	};
	const res = await getGetMonCoeffApi(data);
	let myData = [{}];
	res.data.forEach((item: any) => {
		myData.forEach((i: any) => {
			i.month = '係數';
			i['mm-' + item.monthStr] = item.adjustCoeff;
			i.year = item.yearStr;
		});
	});
	state.tableData.data = myData;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};

// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	dialogRef.value.openDialog(type, row);
};
//修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	let form = { ...ruleForm };
	delete ruleForm.month;
	delete ruleForm.year;
	let getData = [];
	for (let key in ruleForm) {
		getData.push({ yearStr: form.year, monthStr: key.split('-')[1], adjustCoeff: ruleForm[key] });
	}
	loadingBtn.value = true;
	try {
		const res = await postMonCoeffUpdateApi(getData);
		if (res.status) {
			ElMessage.success(t(`message.hint.modifiedSuccess`));
			dialogRef.value.closeDialog();
			getTableData();
		}
		loadingBtn.value = false;
	} catch {
		loadingBtn.value = false;
	}
};

// 觸底
const tableInfiniteScroll = (page: number, data: EmptyObjectType) => {
	state.tableData.data = state.tableData.data.concat(data);
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
</style>
