<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="昵称" prop="nicename">
        <el-input v-model="form.nicename" placeholder="昵称"/>
      </el-form-item>
      </el-col>

			</el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="DemoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/demo/table'
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// å®šä¹‰å˜é‡å†…å®¹
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// å®šä¹‰å­—å…¸

// æäº¤è¡¨å•æ•°æ®
const form = reactive({
		id:'',
	  username: '',
	  nicename: '',
});

// å®šä¹‰æ ¡éªŒè§„åˆ™
const dataRules = ref({
        username: [{required: true, message: '用户名', trigger: 'blur'}],
        nicename: [{required: true, message: '昵称', trigger: 'blur'}],
})

// æ‰“å¼€å¼¹çª—
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // é‡ç½®è¡¨å•æ•°æ®
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // èŽ·å–demoä¿¡æ¯
  if (id) {
    form.id = id
    getdemoData(id)
  }
};

// æäº¤
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
    loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '修改失败');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
    loading.value = false;
  }
};


// åˆå§‹åŒ–è¡¨å•æ•°æ®
const getdemoData = (id: string) => {
  // èŽ·å–æ•°æ®
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// æš´éœ²å˜é‡
defineExpose({
  openDialog
});
</script>