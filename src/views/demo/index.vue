<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'sys_dept_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'sys_dept_del'" @click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'iddm_demo_export'"
						@exportExcel="exportExcel"
						class="ml10 mr20"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
				@sort-change="sortChangeHandle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" label="#" width="40" />
				<el-table-column prop="username" label="用户名" show-overflow-tooltip />
				<el-table-column prop="nicename" label="昵称" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'sys_dept_add'" @click="formDialogRef.openDialog(scope.row.id)"></el-button>
						<el-button icon="delete" text type="primary" v-auth="'sys_dept_add'" @click="handleDelete([scope.row.id])"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- ç¼–è¾‘ã€æ–°å¢ž  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemDemo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/demo/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

// å¼•å…¥ç»„ä»¶
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// å®šä¹‰æŸ¥è¯¢å­—å…¸

// å®šä¹‰å˜é‡å†…å®¹
const formDialogRef = ref();
// æœç´¢å˜é‡
const queryRef = ref();
const showSearch = ref(true);
// å¤šé€‰å˜é‡
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// æ¸…ç©ºæœç´¢æ¡ä»¶
const resetQuery = () => {
	// æ¸…ç©ºæœç´¢æ¡ä»¶
	queryRef.value?.resetFields();
	// æ¸…ç©ºå¤šé€‰
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/iddm/demo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'demo.xlsx');
};

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('是否确定删除');
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
