<template>
<div>
  <el-popover
    popper-class="choose-emp"
    ref="pop"
    v-model="popFlag"
    placement="top-start"
    @hide="hidePop"
    :visible-arrow="false">
    <el-input prefix-icon="el-icon-search" v-model.trim="mso.key" @input="find"></el-input>
    <el-table border highlight-current-row :data="mso.list" height="250" @row-click="choose" v-loading="loading" :element-loading-text="loadingText">
      <el-table-column width="100" property="jobNumber" label="工号"></el-table-column>
      <el-table-column width="150" property="name" label="姓名"></el-table-column>
      <el-table-column width="150" property="deptName" label="部门"></el-table-column>
      <el-table-column v-if="type === 'task' && refBy" width="84">
        <template slot-scope="scope">
          <el-tag type="success" v-if="refBy.indexOf(scope.row.recordUid) > -1">可选</el-tag>
          <el-tag type="danger" v-else>不可选</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix">
      <el-pagination
        v-if="mso.total"
        layout="prev, pager, next"
        :current-page.sync="mso.options.pageNumber"
        :total="mso.total"
        :page-size="mso.options.pageSize"
        @current-change="msPaging">
      </el-pagination>
    </div>
  </el-popover>
  <el-button v-show="!emp.jobNumber && !emp.name" v-popover:pop @click="msFilterQuery">选择{{ empDesc ? empDesc : '汇报上级'}}</el-button>
  <el-tag v-if="emp.jobNumber || emp.name" :closable="!mso.dispatch" @close="closeTag" type="primary" :title="`${emp.jobNumber ? '[' + emp.jobNumber + ']' : ''}${emp.name}-${emp.deptName}`">{{ formatEmp(emp) }}</el-tag>
  <!-- <pre>{{ mso.options }}</pre> -->
</div>
</template>

<script>
import _ from 'lodash'

export default {
  props: [
    'reporterOfStaff',
    'value',
    'empDesc',
    'type',
    'projectUid',
    'refBy',
    'noMembers',
    'projectLeader',
    'intasks'
  ],
  data() {
    return {
      mso: {
        options: {
          staffUid: null,
          recordUid: null,
          pageSize: 10,
          pageNumber: 1,
          key: null,
          mobile: null,
          projectUid: null,
          jobNumber: null
        },
        list: [],
        total: 0,
        key: null,
        dispatch: false,
      },
      loading: false,
      loadingText: '加载中......',
      popFlag: false,
      emp: {},
      first: true,
    }
  },

  methods: {
    queryRpt(options) {
      this.loading = true;
      let api = '';

      switch(this.type) {
        case 'task':
          api = `/api/v1.0/depts/select/task/staff`;
          this.mso.options.projectUid = this.projectUid || null;
          if(this.noMembers) {
            this.mso.options.staffRecordId = [...this.noMembers];
          }
          if(this.projectLeader) {
            this.mso.options.staffRecordId.push(this.projectLeader);
          }

          if(this.intasks) {
            this.mso.options.staffRecordId = [...this.intasks];
          }
        break;
        case 'attend':
          api = `/api/v1.0/attend/reportJobNumber/select`;
        break;
        default:
          api = `/api/v1.0/staff/reportJobNumber/select`;
        break;
      }

      this.$http.post(api, options)
        .then(({body: res}) => {
          this.loading = false;
          if(res.code === 200) {
            // console.log('res.result.list', res.result.list);
            this.mso.list = res.result.list || [];
            this.mso.total = res.result.total;
            if(this.mso.list.length && this.first) {
              if(this.mso.options.jobNumber || this.mso.options.mobile) {
                this.emp.deptName = this.mso.list[0].deptName;
                this.emp.jobNumber = this.mso.list[0].jobNumber || '';
                this.emp.name = this.mso.list[0].name;
                this.emp.recordUid = this.mso.list[0].recordUid;
                this.$emit('input', this.emp.recordUid);
                this.$emit('setIntasks', this.emp.recordUid);
                this.$emit('setNoLeader', this.emp.recordUid);
                this.$emit('validate');
                this.mso.options.jobNumber = null;
                this.mso.options.mobile = null;
              }
              this.first = false;
            }
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(api, err.status, err.statusText)
        });
    },
    msFilterQuery() {
      this.mso.options.pageNumber = 1;
      if(typeof this.mso.key === 'string') {
        this.mso.options.key = this.mso.key.trim() || null;
      }
      this.queryRpt(this.mso.options);
    },
    msPaging(index) {
      this.mso.options.pageNumber = index;
      this.queryRpt(this.mso.options);
    },
    reset() {

      this.emp = {};

      this.mso.options.staffUid = null;
      this.mso.options.recordUid = null;
      this.mso.options.pageSize = 10;
      this.mso.options.pageNumber = 1;
      this.mso.options.key = null;
      this.mso.options.mobile = null;
      this.mso.options.projectUid = null;
      this.mso.options.jobNumber = null;
      this.mso.list = [];
      this.mso.total = 0;
      this.mso.key = null;
      this.mso.dispatch = false;
      this.first = true;
    },
    find: _.debounce(function(a) {
      this.msFilterQuery();
    }, 500),
    hidePop() {
      // this.mso.staffUid = null;
      // this.mso.recordUid = null;
      // this.mso.pageSize = 10;
      // this.mso.pageNumber = 1;
      // this.mso.key = null;
      // this.mso.list = [];
      // this.mso.total = 0;
      // this.mso.key = null;

      // this.first = true;
    },
    choose(row) {
      if(this.type === 'task' && this.refBy) {
        if(this.refBy.indexOf(row.recordUid) > -1) {
          this.popFlag = false;
          this.emp = row;
          this.$emit('input', row.recordUid);
          this.$emit('setIntasks', row.recordUid);
          this.$emit('setNoLeader', row.recordUid);
          this.$emit('validate');
        }
      }else {
        this.popFlag = false;
        this.emp = row;
        this.$emit('input', row.recordUid);
        this.$emit('setNoLeader', row.recordUid);
        this.$emit('setIntasks', row.recordUid);
        this.$emit('validate');
      }

    },
    closeTag() {
      this.emp = {};
      this.$emit('input', '');
      this.$emit('setNoLeader', '');
      this.$emit('setIntasks', '');
      this.$emit('validate');
    },
    init(o = {}) {
      if(o.reporterOfStaff) {
        this.emp = {...o.reporterOfStaff};
      }else {
        // console.log('o', o);
        // this.first = true;
        this.mso.options.staffUid = o.staffUid || null;
        this.mso.options.recordUid = o.recordUid || null;

        if(o.jobNumber) {
          this.mso.options.jobNumber = o.jobNumber;
        }else if(o.mobile) {
          // 来自考勤，轨迹管理
          this.mso.options.mobile = o.mobile;
        }

        if(o.dispatch) {
          this.mso.dispatch = true;
        }else {
          this.mso.dispatch = false;
        }

        if(this.projectUid) {
          this.mso.options.projectUid = this.projectUid;
        }

        this.queryRpt(this.mso.options);
      }

    },
    formatEmp(emp) {
      let jobNumber = '';
      if(emp.jobNumber) {
        jobNumber = `[${emp.jobNumber}]`
      }
      let str = `${jobNumber}${emp.name}-${emp.deptName}`;
      if(str.length > 30) {
        str = str.substring(0, 30) + '...';
      }
      return str;
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    reporterOfStaff: {
      handler: function (n, o) {
        if(n) {
          this.emp = {...n};
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.choose-emp {
  .el-table,
  .close-wrapper {
    margin-top: 16px;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>
