<template>
	<div class="table-container layout-padding">
		<div class="table-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" @search="onSearch" :searchConfig="state.tableData.searchConfig" :form="state.tableData.form">
				<template #otherBtn>
					<el-button @click="onView" size="default" type="warning"
						><el-icon class="mr5"> <ele-View /> </el-icon>{{ $t('預覽') }}
					</el-button>
				</template>
			</TableSearch>
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table"
				@sortHeader="onSortHeader"
				@onTableInfiniteScroll="tableInfiniteScroll"
				@openAdd="openDialog"
				@pageChange="onTablePageChange"
				@onOpentopBtnOther="onOpentopBtnOther"
			>
			</Table>
			<!-- 编辑弹窗 -->
			<Dialog ref="dialogRef" :dialogConfig="state.tableData.dialogConfig" @addData="addData" :loadingBtn="loadingBtn" dialogWidth="50%"> </Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="annualEstimates">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDeptInfoGetKPIOrganizeApi } from '/@/api/global';
import { getExamsetestApi, getExamsetstageApi, getPreviewExamsetstageApi, postReportinfoSaveApi } from '/@/api/departmenAssessment/annualEstimates';
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
			{ key: 'deptName', colWidth: '220', title: '部門', type: 'tooltipText', isCheck: true, isTableIcon: true },
			{ key: 'deptCode', colWidth: '', title: '單位代碼', type: 'text', isCheck: true },
			{ key: 'lastyearsalary', colWidth: '', title: '上年度實際薪資', type: 'text', isCheck: true },
			{ key: 'growthratePer', colWidth: '', title: '本年度標準成長率', type: 'text', isCheck: true },
			{ key: 'standardsalary', colWidth: '', title: '本年度標準漲薪', type: 'text', isCheck: true },
			{ key: 'salaryestimate', colWidth: '', title: '本年度薪資暫估', type: 'text', isCheck: true },
			{ key: 'expectpropPer', colWidth: '', title: '預計節省比例', type: 'text', isCheck: true },
			{ key: 'expectsalary', colWidth: '', title: '預計節省金額', type: 'text', isCheck: true },
			{ key: 'expectreward', colWidth: '', title: '預計獎勵額度', type: 'text', isCheck: true },
			{ key: 'kpiscore', colWidth: '', title: '人力KPI得分預估', type: 'text', isCheck: true },
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
			operateWidth: 120, //操作栏宽度，如果操作栏有几个按钮就自己定宽度
			tableAlign: 'left',
			height: 700,
			// expand: true,
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '部門', prop: 'DeptId', required: false, type: 'treeSelect', optionsData: [], placeholder: '', noclearable: true },
			{
				label: '年月',
				prop: 'YearStr',
				required: false,
				type: 'date',
				placeholder: '',
				dateType: 'month',
				valueFormat: 'YYYYMM',
				noclearable: true,
				editable: false,
			},
		],
		searchConfig: {
			isSearchBtn: true,
		},
		btnConfig: [{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' }],
		topBtnConfig: [
			{ type: 'com', name: '計算', defaultColor: 'primary', isSure: true, disabled: true },
			{ type: 'save', name: '保存', defaultColor: 'success', isSure: true, disabled: true },
		],
		// 弹窗表单
		dialogConfig: [
			{ label: '部門', prop: 'deptName', placeholder: '', required: false, type: 'text', isCheck: true },
			{ label: '單位代碼', prop: 'deptCode', placeholder: '', required: false, type: 'text', isCheck: true },
		],
		// 给后端的数据
		form: { DeptId: 'A00001', YearStr: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}` },
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		page: {
			pageNum: 1,
			pageSize: 10,
		},
		// 打印标题
		printName: '表格打印演示',
	},
});

// 處理表格數據
const tData = (datas: EmptyArrayType) => {
	let len = 0;
	datas.forEach((item) => {
		item.growthratePer = item.growthrate != null ? item.growthrate + '%' : '';
		item.expectpropPer = item.expectprop != null ? item.expectprop + '%' : '';

		item.children = item.details;
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
	const res = await getExamsetestApi(data);
	let datas = tData(res.data);
	state.tableData.data = datas;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};

// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	dialogRef.value.openDialog(type, row);
	row.correlatefactorArr = row.factorStr == '1' ? row.correlatefactorArr.join() || '' : row.correlatefactorArr || [];
	state.tableData.dialogConfig!.forEach((item) => {
		if (item.prop === 'correlatefactorArr') {
			item.multiple = row.factorStr == '1' ? false : true;
		}
	});
};
//修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	// loadingBtn.value = true;
	// let { deptCode, deptName, isKPI, deptCoeff, factorStr, correlateBu, correlatefactorArr, assweight } = ruleForm;
	// if (factorStr === '1') {
	// 	correlatefactorArr = correlatefactorArr.split(',');
	// }
	// try {
	// 	const res = await postDeptInfoUpdateApi({ deptCode, deptName, isKPI, deptCoeff, factorStr, correlateBu, correlatefactorArr, assweight });
	// 	if (res.status) {
	// 		ElMessage.success(t(`message.hint.modifiedSuccess`));
	// 		dialogRef.value.closeDialog();
	// 		getTableData();
	// 	}
	// 	loadingBtn.value = false;
	// } catch {
	// 	loadingBtn.value = false;
	// }
};
// 計算保存按鈕
const onOpentopBtnOther = async (_: any, type: string) => {
	if (type === 'com') {
		state.tableData.config.loading = true;
		const res = await getExamsetstageApi({ YearStr: state.tableData.form.YearStr });
		let datas = tData(res.data);
		state.tableData.data = datas;
		if (res.status) {
			state.tableData.config.loading = false;
		}
	} else {
		// 保存
		ElMessageBox.confirm(`確定保存嗎？`, t('message.hint.tips'), {
			confirmButtonText: t('message.allButton.ok'),
			cancelButtonText: t('message.allButton.cancel'),
			type: 'warning',
			draggable: true,
			// dangerouslyUseHTMLString: true, // 注意此属性如果想寫标签
			closeOnClickModal: false,
		})
			.then(async () => {
				const fromData = state.tableData.form;
				const res = await postReportinfoSaveApi({ runId: '', yandm: fromData.YearStr, rtype: 'Est', rvalue: JSON.stringify(state.tableData.data) });
				// getTableData();
				ElMessage.success(t(`保存成功！`));
			})
			.catch(() => {});
	}
};
// 觸底
const tableInfiniteScroll = (page: any, data: EmptyObjectType) => {
	state.tableData.data = state.tableData.data.concat(data);
};
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
	state.tableData.form = Object.assign({}, state.tableData.form, { ...data });
	tableRef.value?.pageReset();
};
// 預覽
const onView = async () => {
	state.tableData.config.loading = true;
	const res = await getPreviewExamsetstageApi(state.tableData.form);
	let datas = tData(res.data);
	state.tableData.data = datas;
	if (res.status) {
		state.tableData.config.loading = false;
	}
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
		item.children = item.details;
		if (item.children) {
			treeData(item.children);
		}
	});
	return datas;
};
// 得到部門下拉樹表格
const getBuTreeSelectData = async () => {
	const res = await getDeptInfoGetKPIOrganizeApi();
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
