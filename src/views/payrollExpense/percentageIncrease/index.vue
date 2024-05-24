<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" />
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table"
				@sortHeader="onSortHeader"
				@onTableInfiniteScroll="tableInfiniteScroll"
				@openAdd="openDialog"
				@pageChange="onTablePageChange"
				@exportTable="onExportTable"
			>
			</Table>
			<!-- 编辑弹窗 -->
			<Dialog
				ref="dialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="50%"
				:isFootBtn="isFootBtn"
				@downloadTemp="downloadTemp"
				@importTableData="submitUpload"
			>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="percentageIncrease">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDeptInfoGetOrganizeFrameApi } from '/@/api/basicsSet/departmentParameter';
import {
	getRiseSalaryApi,
	postRiseSalaryUpdateApi,
	postRiseSalaryExportApi,
	postRiseSalaryImportExcelApi,
} from '/@/api/payrollExpense/percentageIncrease';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
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
			{ key: 'deptName', colWidth: '', title: '部門', type: 'tooltipText', isCheck: true, isTableIcon: true },
			{ key: 'deptCode', colWidth: '', title: '單位代碼', type: 'text', isCheck: true },
			{ key: 'adJustPropPer', colWidth: '', title: '調薪比例', type: 'text', isCheck: true },
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
			tableAlign: 'left',
			exportIcon: true,
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '部門', prop: 'DeptId', required: false, type: 'treeSelect', optionsData: [], placeholder: '' },
			{ label: '年度', prop: 'YearStr', required: false, type: 'date', placeholder: '', dateType: 'year', valueFormat: 'YYYY' },
		],
		searchConfig: {
			isSearchBtn: true,
		},
		btnConfig: [{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' }],
		// 弹窗表单
		dialogConfig: [
			{ label: '部門', prop: 'deptName', placeholder: '', required: false, type: 'text', isCheck: true, sm: 24, md: 24, lg: 24, xl: 24 },
			{ label: '單位代碼', prop: 'deptName', placeholder: '', required: false, type: 'text', isCheck: true, sm: 24, md: 24, lg: 24, xl: 24 },
			{
				label: '漲薪比例',
				prop: 'adJustProp',
				placeholder: '',
				required: false,
				type: 'number',
				isCheck: true,
				precision: 1,
				step: 1,
				unit: '%',
				width: '90%',
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
			},
		],
		// 给后端的数据
		form: {},
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: '表格打印演示',
	},
});
// 下載模板
const downloadTemp = () => {
	window.open(
		`${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : window.webConfig.webApiBaseUrl}/doc/RiseSalary.xlsx`,
		'_blank'
	);
};
// 上传文件
const submitUpload = async (formEl: EmptyObjectType | undefined) => {
	const res = await postRiseSalaryImportExcelApi(formEl!.raw);
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
	// if (Object.keys(data).length <= 0) return ElMessage.warning(t('沒有可以導出的專案'));
	const res = await postRiseSalaryExportApi(data);
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
// 處理表格數據
const tData = (datas: EmptyArrayType) => {
	let len = 0;
	datas.forEach((item) => {
		item.children = item.details;
		item.adJustPropPer = item.adJustProp && item.adJustProp + '%';
		if (item.children.length > 0) {
			item.tableIcon = 'ele-FolderOpened';
			tData(item.children);
		} else {
			item.tableIcon = 'ele-Document';
		}
	});
	return datas;
};
// let tempTableData = [];
// 初始化列表数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const form = state.tableData.form;
	let data: EmptyObjectType = {};
	data = {
		...form,
	};
	const res = await getRiseSalaryApi(data);
	let datas = tData(res.data);
	state.tableData.data = datas;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};

// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	isFootBtn.value = type === 'imp' ? false : true;
	dialogRef.value.openDialog(type, row);
};
//修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	try {
		const res = await postRiseSalaryUpdateApi(ruleForm);
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
const tableInfiniteScroll = (page, data) => {
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
// 處理樹結構數據
const treeData = (datas: EmptyArrayType) => {
	datas.forEach((item) => {
		item.label = item.deptName;
		item.value = item.deptCode;
		if (item.children) {
			treeData(item.children);
		}
	});
	return datas;
};
// 得到部門下拉樹表格
const getBuTreeSelectData = async () => {
	const res = await getDeptInfoGetOrganizeFrameApi();
	const data = treeData(res.data);
	state.tableData.search[0].optionsData = data;
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
	getBuTreeSelectData();
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
