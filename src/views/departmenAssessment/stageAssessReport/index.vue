<template>
	<div class="table-container layout-padding">階段考核報表</div>
</template>

<script setup lang="ts" name="lines">
import { defineAsyncComponent, reactive, ref, onMounted, computed, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';

// 引入组件

// 定义变量内容
const { t } = useI18n();

// 页面加载时
onMounted(() => {});
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
