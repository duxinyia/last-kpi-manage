<template>
	<div class="table-container">
		<el-auto-resizer>
			<template #default="{ height, width }">
				<el-table-v2 id="elTable" :columns="Columns" :data="data" :width="width" :height="height" fixed />
			</template>
		</el-auto-resizer>
	</div>
</template>
<script lang="tsx" setup>
import { ref, onMounted } from 'vue';

import dayjs from 'dayjs';
import { ElButton, ElIcon, ElTag, ElTooltip, TableV2FixedDir } from 'element-plus';
import { Timer } from '@element-plus/icons-vue';
import type { CheckboxValueType } from 'element-plus';
import { ElCheckbox } from 'element-plus';

import type { FunctionalComponent } from 'vue';

let id = 0;
const dataGenerator = () => ({
	columnn: 1,
	id: `random-id-${++id}`,
	name: 'Tom',
	date: '2020-10-1',
	column: 1,
});
const header = [
	{ key: 'date', colWidth: '', title: 'Date', type: 'text', isCheck: true },
	{ key: 'name', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'bu', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'id', colWidth: '', title: 'id', type: 'text', isCheck: true },
	{ key: 'a', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'a', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'a', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'a', colWidth: '', title: '名字', type: 'text', isCheck: true },
	{ key: 'a', colWidth: '', title: '名字', type: 'text', isCheck: true },
];
const columns = (item: any) => ({
	key: item.key,
	title: item.title,
	// dataKey: item.key,
	width: item.colWidth || 180,
	align: 'center',
	fixed: '',
	cellRenderer: ({ rowData }: any) => (
		<div>
			{item.type === 'date' && (
				<ElTooltip content={dayjs(rowData[item.key]).format('YYYY/MM/DD')}>
					{
						<span class="flex items-center">
							{/* <ElIcon class="mr3"> */}
							<Timer />
							{/* </ElIcon> */}
							{dayjs(rowData[item.key]).format('YYYY/MM/DD')}
						</span>
					}
				</ElTooltip>
			)}
			{item.type === 'tag' && <ElTag>5</ElTag>}
			{item.type === 'text' && rowData[item.key]}
		</div>
	),
});
const onDelRow = (rowData: any) => {
	return () => {
		console.log(rowData);
	};
};
const data = ref(Array.from({ length: 200 }).map(dataGenerator));
// 操作栏
const Columns = header.map((item) => columns(item));
Columns.push({
	key: 'operations',
	title: '操作',
	// dataKey: 'operations',
	fixed: '',
	cellRenderer: ({ rowData }) => (
		<>
			<ElButton size="small" type="primary">
				编辑
			</ElButton>
			<ElButton size="small" type="danger" onClick={onDelRow(rowData)}>
				删除
			</ElButton>
		</>
	),
	width: 150,
	align: 'center',
});
// 选择
type SelectionCellProps = {
	value: boolean;
	intermediate?: boolean;
	onChange: (value: CheckboxValueType) => void;
};
const SelectionCell: FunctionalComponent<SelectionCellProps> = ({ value, intermediate = false, onChange }) => {
	return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />;
};
// 选择框和序号栏
Columns.unshift(
	{
		key: 'selection',
		width: 50,
		// dataKey: 'selection',
		title: '',
		align: 'center',
		fixed: '',
		cellRenderer: ({ rowData }) => {
			const onChange = (value: CheckboxValueType) => (rowData.checked = value);
			return <SelectionCell value={rowData.checked} onChange={onChange} />;
		},
	},
	{
		key: 'column-n-1',
		width: 50,
		// dataKey: 'column-n-1',
		title: '序号',
		cellRenderer: ({ rowIndex }) => <div>{rowIndex + 1}</div>,
		align: 'center',
		fixed: '',
	}
);
Columns[Columns.length - 1].fixed = TableV2FixedDir.RIGHT;

// const handleResize = () => {
// const clientWidth = document.body.clientWidth;
// if (clientWidth < 1000) {
// 	tableWidth.value = document.body.clientWidth - 30; // 设置表格宽度为窗口宽度减去一些边距
// } else {
// 	tableWidth.value = document.body.clientWidth - 250; // 设置表格宽度为窗口宽度减去一些边距
// }
// };
onMounted(() => {
	// handleResize();
	// 监听窗口大小变化
	// window.addEventListener('resize', handleResize);
});
// 页面卸载时
// onUnmounted(() => {
// window.removeEventListener('resize', handleResize);
// });
</script>

<style scoped lang="scss">
.table-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	.el-table {
		flex: 1;
	}
	.table-top {
		display: flex;
		.table-top-tool {
			flex: 1;
			display: flex;
			align-items: end;
			justify-content: flex-end;
			i {
				margin-right: 10px;
				cursor: pointer;
				color: var(--el-text-color-regular);
				&:last-of-type {
					margin-right: 0;
				}
			}
		}
	}
	.button {
		// width: 80px;
		height: 32px;
	}

	.footer {
		display: flex;
	}
	.pages {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	:deep(.el-table th.el-table__cell) {
		background-color: var(--el-color-primary-light-9);
		color: var(--el-text-color-primary);
	}
}
:deep(.disabled-row) {
	color: #ccc !important;
	pointer-events: none !important;
	cursor: not-allowed !important;
}
:deep(.el-form-item__content) {
	display: flex;
	justify-content: center;
}
</style>
