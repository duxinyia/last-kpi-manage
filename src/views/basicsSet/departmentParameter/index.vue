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
			>
			</Table>
			<!-- 编辑弹窗 -->
			<Dialog
				ref="dialogRef"
				:dialogConfig="state.tableData.dialogConfig"
				@addData="addData"
				:loadingBtn="loadingBtn"
				dialogWidth="50%"
				@selectChange="onSelectChange"
				@removeTag="onRemoveTag"
			>
			</Dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="departmentParameter">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
// import { getQueryApplyCheckInventoryApi, getCheckDetailsOfMatApi } from '/@/api/reports/acceptanceList';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDeptInfoGetDeptInfoApi, getDeptInfoGetOrganizeFrameApi, postDeptInfoUpdateApi } from '/@/api/basicsSet/departmentParameter';
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
			{ key: 'deptName', colWidth: '250', title: '部門', type: 'tooltipText', isCheck: true, isTableIcon: true },
			{ key: 'deptCode', colWidth: '', title: '單位代碼', type: 'text', isCheck: true },
			{ key: 'isKPI', colWidth: '', title: '是否參與', type: 'text', isCheck: true },
			{ key: 'deptCoeff', colWidth: '', title: '部門係數', type: 'text', isCheck: true },
			{
				key: 'factorStr',
				colWidth: '',
				title: '關聯因子數',
				type: 'text',
				isCheck: true,
				transfer: {
					1: '單一因子',
					2: '復合因子',
				},
			},
			{ key: 'correlateBu', colWidth: '', title: '關聯BU', type: 'text', isCheck: true },
			{
				key: 'correlatefactorCh',
				colWidth: '',
				title: '關聯因素/關聯權重',
				type: 'text',
				isCheck: true,
				childrenHeader: [
					{ key: 'assweightText-1', colWidth: '', title: '產出量', type: 'text', isCheck: true },
					{ key: 'assweightText-2', colWidth: '', title: '試產量', type: 'text', isCheck: true },
					{ key: 'assweightText-3', colWidth: '', title: '樓板數', type: 'text', isCheck: true },
					{ key: 'assweightText-4', colWidth: '', title: 'SMT', type: 'text', isCheck: true },
				],
			},
			// { key: 'assweightText', colWidth: '', title: '關聯機種', type: 'text', isCheck: true },
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
			// height: 500,
			// expand: true,
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '部門', prop: 'DeptId', required: false, type: 'treeSelect', optionsData: [], placeholder: '' },
			{
				label: '是否參與',
				prop: 'IsKPI',
				required: false,
				type: 'select',
				placeholder: '',
				options: [
					{ value: 'Y', label: 'Y', text: 'Y' },
					{ value: 'N', label: 'N', text: 'N' },
				],
			},
		],
		searchConfig: {
			isSearchBtn: true,
		},
		btnConfig: [{ type: 'edit', name: 'message.allButton.edit', isSure: false, color: '#438df5', icon: 'ele-Edit' }],
		// 弹窗表单
		dialogConfig: [
			{ label: '部門', prop: 'deptName', placeholder: '', required: false, type: 'text', isCheck: true },
			{ label: '單位代碼', prop: 'deptCode', placeholder: '', required: false, type: 'text', isCheck: true },
			{ label: '是否參與', prop: 'isKPI', placeholder: '', required: false, type: 'switch', isCheck: true },
			{
				label: '部門係數',
				prop: 'deptCoeff',
				placeholder: '',
				required: false,
				type: 'number',
				isCheck: true,
				precision: 2,
			},
			{
				label: '關聯因子數',
				prop: 'factorStr',
				placeholder: '',
				required: false,
				type: 'select',
				isCheck: true,
				options: [
					{ value: '1', label: '單一因子', text: '單一因子' },
					{ value: '2', label: '復合因子', text: '復合因子' },
				],
			},
			{
				label: '關聯BU',
				prop: 'correlateBu',
				placeholder: '',
				required: false,
				type: 'select',
				isCheck: true,
				options: [
					{ value: 'CMA', label: 'CMA', text: 'CMA' },
					{ value: 'DP', label: 'DP', text: 'DP' },
				],
			},
			{
				label: '關聯因素',
				prop: 'correlatefactorArr',
				placeholder: '',
				required: false,
				type: 'select',
				isCheck: true,
				options: [
					{ value: '1', label: '產出量', text: '產出量' },
					{ value: '2', label: '試產量', text: '試產量' },
					{ value: '3', label: '樓板數', text: '樓板數' },
					{ value: '4', label: 'SMT產出量', text: 'SMT產出量' },
				],
				multiple: true,
			},
			{
				label: '關聯權重',
				prop: 'assweight',
				placeholder: '',
				required: false,
				type: 'text',
				isCheck: false,
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

// 處理表格數據
const tData = (datas: EmptyArrayType) => {
	let len = 0;
	datas.forEach((item) => {
		if (item.faWeight) {
			item.faWeight.forEach((f) => {
				item[`assweight-${f.id}`] = f.value;
				item[`assweightText-${f.id}`] = f.value + '%';
			});
		}
		// correlatefactorCh = [];
		// assweight-${val[val.length - 1]}
		// state.tableData.dialogConfig?.forEach((opt) => {
		// 	if (opt.prop === 'correlatefactorArr' && item.correlatefactorArr && item.correlatefactorArr.length > 0) {
		// 		opt.options?.forEach((m) => {
		// 			item.correlatefactorArr.forEach((a) => {
		// 				if (a === m.value) {
		// 					if (item.correlatefactorCh) {
		// 						item.correlatefactorCh.push(m.text);
		// 					}
		// 				}
		// 			});
		// 		});
		// 	}
		// });
		// item.assweightText = item.assweight ? item.assweight + '%' : '';
		// item.item.correlatefactorCh = item.correlatefactorCh.join(',');
		if (item.factorStr === '1') {
			item[`assweight`] = '100%';
			item[`assweightText-${item.correlatefactorArr[0]}`] = '100%';
		}
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
	const res = await getDeptInfoGetDeptInfoApi(data);
	let datas = tData(res.data);
	// console.log(datas);
	state.tableData.data = datas;
	if (res.status) {
		state.tableData.config.loading = false;
	}
};
// 判斷來個數組是否全等
const arraysEqual = (a1, a2) => {
	return JSON.stringify(a1) === JSON.stringify(a2);
};
// 得到來個數組不同的數據
const filterArr2 = (arr1, arr2) => {
	return arr1.concat(arr2).filter((t, i, arr) => {
		return arr.indexOf(t) === arr.lastIndexOf(t);
	});
};

// 清除多選
const onRemoveTag = (val: string, prop: string, formData: EmptyObjectType) => {};
// 用於判斷與關聯因子是否相等的數組
let a = [];

// 關聯因子改變
const onSelectChange = (val: string, prop: string, formData: EmptyObjectType) => {
	if (prop === 'factorStr') {
		formData.correlatefactorArr = val == '1' ? '' : [];
		a = [];
		state.tableData.dialogConfig = state.tableData.dialogConfig.slice(0, 8);
		state.tableData.dialogConfig!.forEach((item) => {
			if (item.prop === 'correlatefactorArr') {
				item.multiple = val == '1' ? false : true;
			} else if (item.prop === 'assweight') {
				item.isCheck = val == '1' ? true : false;
				formData.assweight = 100 + '%';
			}
		});
	} else if (prop === 'correlatefactorArr' && val instanceof Array) {
		let selectAllLabel = [];
		// 拿到關聯因素的下拉框label值
		state.tableData.dialogConfig!.forEach((item) => {
			if (item.prop === 'correlatefactorArr') {
				item.options?.forEach((o) => {
					selectAllLabel.push(o.label);
				});
			}
		});

		if (val[val.length - 1]) {
			a.push(val[val.length - 1]);
		}
		a = Array.from(new Set(a));
		// 對比
		if (arraysEqual(a, val) && val.length > 0) {
			// 每選一個新值增加對應的數據輸入框
			state.tableData.dialogConfig.push({
				label: `${selectAllLabel[val[val.length - 1] - 1]}關聯權重`,
				prop: `assweight-${val[val.length - 1]}`,
				placeholder: '',
				required: false,
				type: 'number',
				isCheck: true,
				precision: 2,
				step: 0.1,
				unit: '%',
				width: '90%',
			});
		} else {
			let diff = filterArr2(a, val);
			state.tableData.dialogConfig?.forEach((item, index) => {
				if (diff.includes(item.prop.split('-')[1]) && item.prop.split('-')[0] == 'assweight') {
					a = val;
					state.tableData.dialogConfig.splice(index, 1);
					formData[item.prop] = null;
				}
				if (val.length <= 0) {
					// 清除之前的操作
					a = val;
					if (item.prop.includes('-')) {
						formData[item.prop] = null;
					}
					state.tableData.dialogConfig = state.tableData.dialogConfig.slice(0, 8);
				}
			});
		}
	}
};

// 打开編輯弹窗
const openDialog = async (type: string, row: EmptyObjectType) => {
	let selectAllLabel = [];
	// 如果是單一因子將關聯因素數值變成字符串，否則是數組
	row.correlatefactorArr =
		row.factorStr == '1' && row.correlatefactorArr instanceof Array ? row.correlatefactorArr.join() || '' : row.correlatefactorArr || [];
	state.tableData.dialogConfig = state.tableData.dialogConfig.slice(0, 8);
	// 拿到關聯因素的下拉框label值
	state.tableData.dialogConfig!.forEach((item) => {
		if (item.prop === 'correlatefactorArr') {
			item.options?.forEach((o) => {
				selectAllLabel.push(o.label);
			});
		}
	});

	state.tableData.dialogConfig?.forEach((item) => {
		if (item.prop === 'assweight') {
			item.isCheck = row.factorStr === '1' ? true : false;
		}
	});

	if (row.faWeight && row.faWeight.length > 0) {
		row.faWeight.forEach((item) => {
			state.tableData.dialogConfig.push({
				label: `${selectAllLabel[item.id * 1 - 1]}關聯權重`,
				prop: `assweight-${item.id * 1}`,
				placeholder: '',
				required: false,
				type: 'number',
				isCheck: true,
				precision: 2,
				step: 0.1,
				unit: '%',
				width: '90%',
			});
		});
	}

	dialogRef.value.openDialog(type, row);
	state.tableData.dialogConfig!.forEach((item) => {
		if (item.prop === 'correlatefactorArr') {
			// 如果是單一因子關聯因素是單選框，否則多選框
			item.multiple = row.factorStr == '1' ? false : true;
		}
	});
};
//修改數據
const addData = async (ruleForm: EmptyObjectType, type: string) => {
	// console.log(ruleForm);
	let { deptCode, deptName, isKPI, deptCoeff, factorStr, correlateBu, correlatefactorArr, assweight } = ruleForm;
	let editData = { deptCode, deptName, isKPI: isKPI || 'N', deptCoeff, factorStr, correlateBu, correlatefactorArr };
	let sum = 0;
	if (factorStr === '1') {
		editData.correlatefactorArr = correlatefactorArr.split(',');
	} else {
		editData.faWeight = [];
		for (let key in ruleForm) {
			if (key.includes('-') && key.split('-')[0] === 'assweight' && ruleForm[key] !== null) {
				editData.faWeight.push({ id: key.split('-')[1], value: ruleForm[key] });
				sum = parseFloat((sum + ruleForm[key]).toFixed(2));
			}
		}
		// 判斷所有的因素是否合計為100
		if (sum != 100) {
			return ElMessage.warning(t(`權重合計應為100%，請更改`));
		}
	}

	try {
		loadingBtn.value = true;
		// console.log(editData);
		const res = await postDeptInfoUpdateApi(editData);
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
// :deep(.el-table__cell .cell) {
// 	align-items: center;
// 	display: flex;
// }
</style>
