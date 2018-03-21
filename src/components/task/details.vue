<template>
  <div id="task_details_wrapper">
    <div class="detail_header">
      <div class="detail_title">
        <i class="icon_bg_taskImg bg-ico_file"></i>
        <span class="detail_titleText">项目：安保工作</span>
      </div>
      <div class="detail_name">
        <span class="detail_nameLeft">日常任务</span>
        <span class="detail_nameRight">朝外大街巡逻</span>
      </div>
      <div class="detail_complete">
        <mt-button type="primary" size="large">点击完成任务</mt-button>
      </div>
      <div class="detail_content">
        <div class="detail_contentTitle">
          <mt-cell title="李晓岚">
            <mt-button type="primary" size="small" @click="assignOpen">指派他人</mt-button>
            <img slot="icon" src="../../assets/tx.png" width="40" height="40">
          </mt-cell>
        </div>
        <div class="detail_contentList">
          <div @click="locationOpen">
            <mt-cell>
              <div>
                <span slot="title"> <i class="icon_bg_taskImg bg-ico_location"></i> 添加任务地点</span>
              </div>
            </mt-cell>
          </div>
          <div>
            <mt-cell>
              <div>
                <span slot="title"> <i slot="icon" class="icon_bg_taskImg bg-ico_date"></i> 设置到期时间</span>
              </div>
            </mt-cell>
          </div>
          <div>
            <mt-cell>
              <mt-field style="width:100%" placeholder="编辑任务名称" :disableClear="true" type="text"></mt-field>
              <i slot="icon" class="icon_bg_taskImg bg-ico_pencil1"></i>
            </mt-cell>
          </div>
        </div>
      </div>
    </div>
    <div class="detail_comment">
      <div class="detail_commentList" v-for=" n in 6">
        <p>2018-3-15 08:30:00</p>
        <mt-cell>
            <span class="detail_commentListText">
              <b class="detail_commentNameColor">张明 </b>
              <span>给</span>
              <b class="detail_commentNameColor">刘佳</b>
              <span>只指派了任务</span>
            </span>
          <img slot="icon" src="../../assets/tx.png" width="25" height="25">
        </mt-cell>
      </div>
    </div>
    <div class="feedback_wrapper">
      <mt-popup
        v-model="feedbackState"
        popup-transition="popup-fade">
        <div class="feedback_box">
          <h3 class="feedback_title">反馈内容</h3>
          <mt-field placeholder="请填写反馈内容(不超过256个字)" type="textarea" :attr="{ maxlength: 256 }" v-model="feedbackContent"
                    rows="5"></mt-field>
          <mt-button type="primary" size="large" @click="submitFeedback">提交任务反馈</mt-button>
        </div>
      </mt-popup>
    </div>
    <div class="assign_wrapper">
      <mt-popup
        v-model="assignState"
        position="right">
        <div class="assign_box">
          <mt-header title="选择负责人">
            <div slot="left">
              <mt-button icon="back" @click="assignClose">返回</mt-button>
            </div>
          </mt-header>
          <mt-search v-model="searchValue">
            <div v-for="n in 20">
              <mt-cell title="标题文字">
                <i slot="icon" class="icon_bg_taskImg bg-ico_head"></i>
              </mt-cell>
            </div>
          </mt-search>
        </div>
      </mt-popup>
    </div>
    <div class="location_wrapper">
      <mt-popup
        v-model="locationState"
        position="right">
        <div class="assign_box">
          <mt-header title="选择任务地点">
            <div slot="left">
              <mt-button icon="back" @click="locationClose">返回</mt-button>
            </div>
          </mt-header>
          <mt-search v-model="searchValue">
            <mt-cell title="标题文字" v-for="n in 20" :key="n">
              <i slot="icon" class="icon_bg_taskImg bg-ico_head"></i>
            </mt-cell>
          </mt-search>
        </div>
      </mt-popup>
    </div>
    <div class="detail_addCommentBtn">
      <mt-button size="large" @click="addComment">填写任务反馈</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        feedbackState: false,//判断反馈弹框是否打开
        assignState: false,//判断指派弹框是否打开
        locationState: false,//判断指派弹框是否打开
        searchValue: '',//搜索框输入的内容
        feedbackContent: ''//反馈内容
      };
    },
    watch: {
      searchValue: 'searchChange'
    },
    methods: {
      // 添加反馈弹框打开
      addComment(){
        this.feedbackState = true;
      },
      //添加反馈弹框关闭，提交反馈
      submitFeedback(){
        this.feedbackState = false;
      },
      //指派他人弹框打开
      assignOpen(){
        this.assignState = true;
      },
      //指派他人弹框关闭
      assignClose(){
        this.assignState = false;
      },
      //添加位置弹框打开
      locationOpen(){
        this.locationState = true;
      },
      //添加位置弹框关闭
      locationClose(){
        this.locationState = false;
      },
      searchChange(data){
        let BMap = null;
        let map = null;
        let self = this;
        let curl;
        //判断是不是安卓苹果
        let u = navigator.userAgent;
        let isAndroid = '0';
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isAndroid) {
          curl = {
            location: location.href //安卓的参数
          };
        }
        if (!isAndroid) {
          curl = {
            location: location.href.toString().split('#')[0] //苹果的参数
          };
        }

          this.$http.post('/api/v1.0/wechat/sign', curl).then(response => { //获取签名接口开始
            if (response.body.code === 200) {
              this.t1 = response.body.result.appid.toString();
              this.t2 = response.body.result.timestamp.toString();
              this.t3 = response.body.result.nonceStr.toString();
              this.t4 = response.body.result.signature.toString();
              this.yyy = true;
//              let cvt = new BMap.Convertor();
              wx.config({
                debug: false,
                appId: this.t1,
                timestamp: this.t2,
                nonceStr: this.t3,
                signature: this.t4,
                jsApiList: [
                  'openLocation'
                ]
              });
              wx.error(function (res) {
                console.log('error',res)
//                // 微信获取经纬度失败
//                self.failModelErr = true;
//                self.failModel = true;
//                self.qulocation = true;
//                self.showBtnContent = false;
              });
              wx.ready(function () {
                wx.openLocation({
//                  type: 'wgs84',
                    name: data,
                  success: function (res) {
                    console.log('res',res)
//                    self.getLocations = false;
//                    self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
//                    self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;  //这个是原有
//                    let speed = res.speed; // 速度，以米/每秒计
//                    let accuracy = res.accuracy; // 位置精度
////                    console.log('tencent', res.longitude, res.latitude)
//                    cvt.translate([new BMap.Point(res.longitude, res.latitude)]/* 微信坐标 wx */, 1, 5, (data) => {   //原有
//                      if (data.status === 0) {
//                        let myPosition = data.points[0]; // 转换后的微信坐标
////                        console.log('转换后', myPosition);
//                        self.MyPosition = myPosition;
//                        //经纬度传值start
//                        let scopes = [];
//                        self.searchLocationArray = (rt => {
//                          if (!rt) return false;
//                          let out = [];
//                          rt.forEach(item => {
//                            out.push(new BMap.Point(item.LONGITUDE, item.LATITUDE));
//                            scopes.push(item.SCOPE);
//                          });
//                          return out;
//                        })(self.punchCardInfo.locations);
//
//                        let arrayLonglat = self.searchLocationArray;
//                        cvt.translate(arrayLonglat/* 可打卡坐标 */, 3, 5, (data) => {
//                          //status === 0 百度地图服务状态码，0是正常
//                          if (data.status === 0) {
//                            // 转换后的可打卡坐标
//                            let distance;
//                            self.twRange = '';
//                            self.outsideObtainValue = true;// 初始值为true
//                            for (let i = 0; i < data.points.length; i++) {
//                              distance = map.getDistance(data.points[i], myPosition);
//                              if (distance < scopes[i]) {
//                                self.outsideObtainValue = false;
//                                break;
//                              }
//                            }
//                            new BMap.Geocoder().getLocation(myPosition, function (res) { //进行给传值参数位置
//                              self.twRange = res.addressComponents.district + res.addressComponents.street;
//                              if (!self.twRange) {
//                                self.twRange = '未获取到位置信息';
//                              }
//                              self.punchInfo(self.twRange);
//                            });
//                          } else {
//                            this.showBtnContent = false;
//                            MessageBox('提示', '获取地理位置失败');
//                          }
//                        });
//                      } else {
//                        this.showBtnContent = false;
//                        MessageBox('提示', '获取地理位置失败');
//                      }
//                    });
                  },
                  cancel: function (res) {
                    console.log('cancel',res)
                    //判断是不是安卓苹果
//                    let u = navigator.userAgent;
//                    let isAndroid = '0';
//                    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//                    self.showBtnContent = false;
//                    if (isAndroid) {
//                      MessageBox('提示', '您拒绝了获取定位请求，只有允许才能进行打卡');
//                    }
//                    if (!isAndroid) {
//                      MessageBox('提示', '请开启微信定位服务');
//                    }
                    //判断结束
                  },
                  fail: function (res) {
                    console.log('fail',res)
                    // 微信定位未开启
//                    self.failModelErr = false;
//                    self.failModel = true;
//                    self.qulocation = true;
//                    self.showBtnContent = false;
                  }
                });
              });
            } else {
//              this.showBtnContent = false;
//              MessageBox('提示', response.body.message);
            }
          }, response => {
//            console.log('error callback');
          });

        console.log('data', data);
      }
    }
  }
</script>
<style lang="scss">
  #task_details_wrapper {
    text-align: left;
    .detail_header {
      position: fixed;
      z-index: 10;
      width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      .detail_title {
        padding: 15px 15px;
        .detail_titleText {
          padding-left: 5px;
          font-size: 15px;
          color: #333333;
          vertical-align: middle;
        }
      }
      .detail_name {
        padding: 0 15px;
        .detail_nameLeft {
          display: inline-block;
          padding: 3px;
          margin-right: 5px;
          border-radius: 3px;
          font-size: 13px;
          color: #ffffff;
          background-color: #ff9f4a;
        }
        .detail_nameRight {
          font-size: 15px;
          color: #333333;
        }
      }
      .detail_complete {
        padding: 30px 15px;
      }
      .detail_content {
        box-sizing: border-box;
        border-top: 10px solid #eff3f7;
        padding: 10px 15px;
        background-color: #ffffff;
        .detail_contentTitle {
          background-color: #ffffff;
          padding-bottom: 10px;
          border-bottom: 1px solid rgb(204, 204, 204);
          .mint-cell-wrapper {
            padding: 0;
            font-size: 15px;
            color: #333333;
            font-weight: 600;
          }
        }
        .detail_contentList {
          background-color: #ffffff;
          .mint-cell-wrapper {
            padding: 0;
            font-size: 14px;
            color: #333333;
          }
          .mint-cell:last-child {
            .mint-cell-title {
              flex: 0;
            }
            .mint-cell-value {
              margin-left: 3px;
              width: 100%;
              input {
                padding: 3px;
                background-color: #f2f2f2;
                border-radius: 3px;
              }
            }
          }
        }
      }
    }
    .detail_comment {
      padding: 420px 15px 60px;
      overflow: auto;
      background-color: #eff3f7;
      .detail_commentList {
        margin: 10px 0 15px;
        p {
          font-size: 12px;
          color: #666666;
          text-align: center;
        }
        .mint-cell {
          min-height: 0;
          background-color: transparent;
          .mint-cell-left, .mint-cell-right {
            height: auto;
          }
          .mint-cell-wrapper {
            height: auto;
            font-size: 14px;
            padding: 0;
            align-items: inherit;
            .mint-cell-title {
              flex: 0;
            }
            .mint-cell-value {
              margin-top: 5px;
              .detail_commentListText {
                padding-left: 5px;
                line-height: 20px;
                color: #666666;
                .detail_commentNameColor {
                  color: #333333;
                }
              }
            }
          }
        }
      }
    }
    .feedback_wrapper {
      .mint-popup {
        width: 80vw;
        .feedback_box {
          padding: 15px;
          .feedback_title {
            margin-bottom: 20px;
            font-size: 15px;
            text-align: center;
          }
          .mint-field {
            margin-bottom: 20px;
            .mint-cell-wrapper {
              padding: 0;
              border: 1px solid #d9d9d9;
              border-radius: 4px;
            }
            .mint-field-core {
              font-size: 14px;
            }
            textarea {
              resize: none;
            }
          }
          .mint-button {
            font-size: 14px;
          }
        }
      }
    }
    .assign_wrapper, .location_wrapper {
      .mint-popup {
        width: 100vw;
        height: 100vh;
        .assign_box {
          .mint-header {
            position: fixed;
            top: 0;
            width: 100%;
            background-color: #ffffff;
            color: #2c3e50;
            border-bottom: 1px solid #E5E5E5;

          }
          .mint-search {
            position: absolute;
            top: 40px;
            padding-bottom: 40px;
            width: 100%;
            .mint-searchbar {
              padding: 10px 15px;
              background-color: #f5f5f5;
              .mint-searchbar-cancel {
                display: none;
              }
            }
            .mint-search-list {
              padding-top: 60px;
              padding-bottom: 80px;
            }
          }
        }
      }
    }
    .detail_addCommentBtn {
      position: fixed;
      bottom: 0;
      padding: 10px 20px;
      width: 100%;
      box-sizing: border-box;
      background-color: #f9f9f9;
    }
  }
</style>
