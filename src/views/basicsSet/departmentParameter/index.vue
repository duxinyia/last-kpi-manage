<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" />
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table"
				@sortHeader="onSortHeader"
				@cellclick="reqNoClick"
				@onTableInfiniteScroll="tableInfiniteScroll"
			>
			</Table>
			<!-- <el-dialog v-model="sampleDeliveryListDialogRef" title="詳情" width="50%" draggable :close-on-click-modal="false">
				<Table v-bind="dialogState.tableData" class="table" />
			</el-dialog> -->
		</div>
	</div>
</template>

<script setup lang="ts" name="departmentParameter">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
// import { getQueryApplyCheckInventoryApi, getCheckDetailsOfMatApi } from '/@/api/reports/acceptanceList';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/search/search.vue'));
// 定义变量内容
const { t } = useI18n();
const tableRef = ref<RefType>();
const matNoRef = ref();
const sampleDeliveryListDialogRef = ref(false);

// 弹窗标题
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [
			{
				id: 1,
				name: 'wangxiaohu',
				address: 'No. 189, Grove St, Los Angeles',
				tableIcon: 'ele-FolderOpened',
			},
			{
				id: 2,
				name: 'wangxiaohu',
				address: 'No. 189, Grove St, Los Angeles',
				tableIcon: 'ele-FolderOpened',
			},
			{
				id: 3,
				name: 'wangxiaohu',
				address: 'No. 189, Grove St, Los Angeles',
				tableIcon: 'ele-FolderOpened',
				children: [
					{
						id: 31,
						name: 'wangxiaohu',
						address: 'No. 189, Grove St, Los Angeles',
						tableIcon: 'ele-Document',
						children: [
							{
								id: 331,
								name: 'wangxiaohu',
								address: 'No. 189, Grove St, Los Angeles',
							},
							{
								id: 332,
								name: 'wangxiaohu',
								address: 'No. 189, Grove St, Los Angeles',
							},
						],
					},
					{
						id: 32,
						name: 'wangxiaohu',
						address: 'No. 189, Grove St, Los Angeles',
						tableIcon: 'ele-Document',
					},
				],
			},
			{
				id: 4,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},

			{
				id: 5,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 6,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 7,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 8,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 9,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 10,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 11,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 12,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 13,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 14,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 15,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 16,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 17,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 18,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 19,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
			{
				id: 20,
				name: 'wangxiaohu',
				tableIcon: 'ele-FolderOpened',
				address: 'No. 189, Grove St, Los Angeles',
			},
		],
		tempTableData: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'name', colWidth: '', title: '部門', type: 'text', isCheck: true, isTableIcon: true },
			{ key: 'address', colWidth: '', title: '單位代碼', type: 'text', isCheck: true },
			{ key: 'is', colWidth: '', title: '是否參與', type: 'text', isCheck: true },
			{ key: 'id', colWidth: '', title: 'id', type: 'text', isCheck: true },
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
			operateWidth: 100, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			tableAlign: 'left',
			// height: 500,
			// expand: true,
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '部門', prop: 'matNo', required: false, type: 'select', options: [], placeholder: '' },
			{ label: '部門係數', prop: 'dep', required: false, type: 'input', placeholder: '' },
			{ label: '關聯因子數', prop: 'matNo', required: false, type: 'select', options: [], placeholder: '' },
			{ label: '關聯BU', prop: 'matNo', required: false, type: 'select', options: [], placeholder: '' },
			{ label: '關聯因素', prop: 'matNo', required: false, type: 'select', options: [], placeholder: '' },
			{ label: '關聯權重', prop: 'matNo', required: false, type: 'input', placeholder: '' },
		],
		searchConfig: {
			isSearchBtn: true,
		},
		btnConfig: [{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' }],
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
const dialogState = reactive({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'reqNo', colWidth: '', title: '申請單號', type: 'text', isCheck: true },
			{ key: 'passQty', colWidth: '', title: '合格數量', type: 'text', isCheck: true },
			{ key: 'failQty', colWidth: '', title: '不合格數量', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: true, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: false, // 是否显示表格操作栏
			isButton: false, //是否显示表格上面的新增删除按钮
			isInlineEditing: false, //是否是行内编辑
			isTopTool: false, //是否有表格右上角工具
			isPage: false, //是否有分页
			isDialogTab: true, //是否是弹窗里面的表格
			height: 500,
		},
	},
});
const onSign = async (matNo: string) => {
	// const res = await getCheckDetailsOfMatApi(matNo);
	// if (res.data) {
	// 	if (!res.data.length) {
	// 		ElMessage.warning('暫無詳情信息');
	// 	} else {
	// 		sampleDeliveryListDialogRef.value = true;
	// 		dialogState.tableData.data = res.data;
	// 		dialogState.tableData.config.loading = false;
	// 	}
	// }
};
// let tempTableData = [];
// 初始化列表数据
const getTableData = async () => {
	// state.tableData.config.loading = true;
	// const form = state.tableData.form;
	// let data: EmptyObjectType = {};
	// data = {
	// 	...form,
	// 	page: state.tableData.page,
	// };
	// const res = await getQueryApplyCheckInventoryApi(data);
	state.tableData.tempTableData = state.tableData.data;
	state.tableData.data = state.tableData.data.slice(0, 15);

	state.tableData.config.total = state.tableData.data.length;
	// if (res.status) {
	state.tableData.config.loading = false;
	// }
};
// 点击料号
const reqNoClick = async (row: EmptyObjectType, column: EmptyObjectType) => {
	// if (column.property === 'matNo') {
	// 	matNoRef.value = row.matNo;
	// 	setTimeout(() => {
	// 		maintenanceListDialogRef.value = true;
	// 	}, 100);
	// }
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
:deep(.el-table__cell .cell) {
	align-items: center;
	display: flex;
}
</style>
