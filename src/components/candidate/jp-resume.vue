<template>
<div class="jp-resume">
  <mt-header fixed title="即派简历">
    <!-- <router-link to="/myInterview" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link> -->
    <a :href="info.html" slot="left">查看 html</a>
    <a slot="right" v-if="info" :href="info.pdf">查看 PDF</a>
  </mt-header>
  <!-- <iframe v-if="info" id="include-resume" :src="info.pdf" /> -->
</div>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
// import { Badge, Indicator, MessageBox, Toast, Actionsheet } from 'mint-ui';
// Vue.component(Badge.name, Badge);
// Vue.component(Actionsheet.name, Actionsheet);

export default {
  data() {
    return {
      info: {
        pdf: 'http://www.geetemp.com/geetemp/jd/report/即派推荐1009074-人事专员-朱先生.pdf',
        html: 'http://www.geetemp.com/geetemp/jd/report/即派推荐1009074-人事专员-朱先生.html'
      }
      // title: '',
      // url_params: this.$route.params,
      // pageData: {
      //   detail: {},
      // },
      // basicData: {},
      // interviewerFeedbacks: {},
      // sheetVisible: false,
      // actions: [],
      // statusData: [],
    }
  },
  mounted() {
    console.log('this.$route.query', this.$route.query)
    const {jpid, jid} = this.$route.query
    const api = `/api/v1.0/client/resumePreview/${jpid}/${jid}`
      this.$http
        .get(api)
        .then(({body: res}) => {
          if (res.code === 200) {

            this.info = res.result

            this.src = this.info.html

            this.$nextTick(function() {
              const ifa = $('#include-resume')

              ifa.height($(window).height() - 127)

              // function resize() {
              //   ifa.height($(window).height() - 127)
              // }

              // $(window).on('resize', () => {
              //   if(this.timer) {
              //     clearTimeout(this.timer)
              //   }
              //   this.timer = setTimeout(resize, 333)
              // })
              // resize()
            })


          }
        })
        .catch(err => {
          console.log(err.status, err.statusText, err.url)
        });
  },
  created: function () {
    // this.fetchResume();
    // this.fetchProfile();
    // // 获取面试状态
    // this.$http.get('/api/v1.0/common/config/901002').then((response) => {
    //   if (response.body.code === 200) {
    //     this.statusData = response.body.result;
    //     response.body.result.forEach(item => {
    //       this.actions.push({
    //         name: item.name,
    //         method: () => this.handleChangeStatus(item.id),
    //       })
    //     });
    //   }
    // });
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.jp-resume {
  min-width: 1180px;
  .mint-button {
    margin-top: 0
  }
  height: 100%;
  // background: #fef;
  padding-top: 40px;
}
</style>
