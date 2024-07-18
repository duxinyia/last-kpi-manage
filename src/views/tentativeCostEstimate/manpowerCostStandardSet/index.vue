<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<!-- <TableSearch :labelWidth="' '" :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" /> -->
			<el-form ref="formRef" :model="state.tableData">
				<Table
					ref="tableRef"
					v-bind="state.tableData"
					class="table"
					@sortHeader="onSortHeader"
					@onTableInfiniteScroll="tableInfiniteScroll"
					@openAdd="openDialog"
					@pageChange="onTablePageChange"
					@delRow="onTableDelRow"
				>
				</Table>
			</el-form>
			<!-- 编辑弹窗 -->
			<Dialog ref="corsDialogRef" :dialogConfig="state.tableData.dialogConfig" @addData="addData" :loadingBtn="loadingBtn" dialogWidth="50%">
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="departmentParameter">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import {
	getIdentitytypeApi,
	getLaborcoststandardsApi,
	postLaborcostAddApi,
	postLaborcostDeleteApi,
	postLaborcostUpdateApi,
} from '/@/api/tentativeCostEstimate/manpowerCostStandardSet';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
const Dialog = defineAsyncComponent(() => import('/@/components/dialog/dialog.vue'));
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const matNoRef = ref();
const sampleDeliveryListDialogRef = ref(false);
const formRef = ref();
const corsDialogRef = ref();
const loadingBtn = ref(false);
// 弹窗标题
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		tempTableData: [],
		// 表头内容（必传，注意格式）
		header: [
			{
				key: 'identitytype',
				colWidth: '',
				title: '人員類別',
				type: 'text',
				isCheck: true,
				isTableIcon: true,
				isRequired: true,
				transfer: {
					1: '陸幹師級',
					2: '陸幹員級',
					3: '臺外幹',
				},
			},
			{ key: 'monsalary', colWidth: '', title: '月薪資(KNTD)', type: 'text', isCheck: true },
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
			// tableAlign: 'left',
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '人員類別', prop: 'Identitytype', required: false, type: 'input', placeholder: '' },
			{ label: '月薪資(KNTD)', prop: 'Monsalary', required: false, type: 'input', placeholder: '' },
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
			{
				label: '人員類別',
				prop: 'identitytype',
				placeholder: '',
				required: true,
				type: 'select',
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
				options: [],
			},
			{
				label: '月薪資(KNTD)',
				prop: 'monsalary',
				placeholder: '',
				required: true,
				type: 'number',
				xs: 24,
				sm: 24,
				md: 24,
				lg: 24,
				xl: 24,
				isCheck: true,
			},
		],
		// 给后端的数据
		form: {
			// matNo: '',
			// sampleNo: '',
		},
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
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
		// page: state.tableData.page,
	};
	const res = await getLaborcoststandardsApi(data);
	state.tableData.tempTableData = res.data;
	state.tableData.data = res.data.slice(0, 15);
	state.tableData.config.total = res.data.length;
	if (res.status) {
		state.tableData.config.loading = false;
	}
	tableRef.value?.infiniteScrollReset();
};
// 觸底
const tableInfiniteScroll = (page: number, data: EmptyObjectType) => {
	state.tableData.data = state.tableData.data.concat(data);
};
// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	corsDialogRef.value.openDialog(type, row, '');
};
//修改和新增數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	loadingBtn.value = true;
	const res = type === 'add' ? await postLaborcostAddApi(ruleForm) : await postLaborcostUpdateApi(ruleForm);
	if (res.status) {
		type === 'add' ? ElMessage.success(t(`message.hint.addSuccess`)) : ElMessage.success(t(`message.hint.modifiedSuccess`));
		corsDialogRef.value.closeDialog();
		getTableData();
	}
	loadingBtn.value = false;
};
// 表格删除当前项回调
const onTableDelRow = async (row: EmptyObjectType, type: string) => {
	const res = await postLaborcostDeleteApi(row);
	if (res.status) {
		ElMessage.success(`${t('message.allButton.deleteBtn')} ${t('message.hint.success')}`);
		getTableData();
	}
};
// 行內編輯保存按鈕(存著有用)
// const onHandleSave = (scope) => {
// 	let validateFieldList: EmptyArrayType = [];
// 	validateFieldList.push(`data.${scope.$index}.types`);
// 	if (!formRef.value) return ElMessage.warning(t('表格項必填未填'));
// 	formRef.value.validateField(validateFieldList, async (errorMessage: any) => {
// 		if (errorMessage) {
// 			scope.row.edit = false;
// 		} else {
// 			// 验证成功
// 			ElMessage.warning('表格項必填未填');
// 		}
// 	});
// };
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.page.pageNum = page.pageNum;
	state.tableData.page.pageSize = page.pageSize;
	getTableData();
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
// 下拉框数据
const getSelect = async () => {
	const res = await getIdentitytypeApi();
	const option = res.data.map((item: any) => {
		return { label: item.description, text: item.description, value: item.value };
	});
	if (state.tableData.dialogConfig) {
		state.tableData.dialogConfig[0].options = option;
	}
};
// 页面加载时
onMounted(() => {
	getTableData();
	getSelect();
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
:deep(.table-top .allBtn) {
	margin-top: 0 !important;
}
</style>
