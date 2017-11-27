<template>
  <div id="commentBox">
    <textarea class="commentText" maxlength="200" placeholder="#请输入评论（不超过200字）"
              v-model.trim="commentContent"></textarea>
    <mt-button type="primary" class="commentBtn" @click="comment">
      <span>提交评论</span>
    </mt-button>
    <mt-button class="commentBtn" @click="cancel">
      <span>取消</span>
    </mt-button>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Toast, MessageBox} from 'mint-ui';
  export default {
    data(){
      return {
        commentContent: '',
        userName: '',
        noticeUid: '',
      }
    },
    created(){
    },
    methods: {
      comment(){
        this.noticeUid = this.getCookie('noticeUid');
        this.userName = this.getCookie('infoObjPassName');
        if (this.commentContent) {
          this.$http.post('/api/v1.0/client/noticeComment/Save', {
            noticeuid: this.noticeUid,
            content: this.commentContent,
            name: this.userName
          }).then(res => {
            if (res.body.code === 200) {
              Toast({
                message: res.body.message,
                iconClass: 'ico_workbench_2'
              });
              this.$router.push({path: '/notice_details'});
            }
          })
        } else {
          MessageBox('提示', '评论不能为空！');
        }
      },
      cancel(){
        this.$router.push({path: '/notice_details'});
      }
    }
  }
</script>
<style lang="scss">
  #commentBox {
    box-sizing: border-box;
    padding: 0 15px;
    min-height: 100%;
    width: 100%;
    background-color: #ffffff;
    textarea {
      margin-top: 15px;
      width: 100%;
      min-height: 100px;
      resize: none;
      border-radius: 4px;
    }
    .commentBtn {
      margin-top: 30px;
      width: 100%;
    }
  }
</style>

