<template>
  <div>

    <div style="background: pink;line-height: 2rem;width: 10rem">
     所所所所所所
    </div>
    <!--<baidu-map class="bm-view" :center="circlePath.center" :zoom="15" @ready="handler">-->
      <!--&lt;!&ndash;<bm-circle&ndash;&gt;-->
        <!--&lt;!&ndash;:center="circlePath.center"&ndash;&gt;-->
        <!--&lt;!&ndash;:radius="circlePath.radius"&ndash;&gt;-->
        <!--&lt;!&ndash;stroke-color="blue"&ndash;&gt;-->
        <!--&lt;!&ndash;:stroke-opacity="0.5"&ndash;&gt;-->
        <!--&lt;!&ndash;:stroke-weight="2"&ndash;&gt;-->
        <!--&lt;!&ndash;@lineupdate="updateCirclePath"&ndash;&gt;-->
        <!--&lt;!&ndash;:editing="true">&ndash;&gt;-->

    <!--</baidu-map>-->
    <baidu-map :center="center" @ready="handler"></baidu-map>
  </div>
</template>
<script>


  export default {
    data(){
      return {
          center: {
            lng: 121.738688,
            lat: 31.571045
          },
        latitude:'',
        longitude:'',
          radius: '',
        imgSrc: {
          shenFenIcon: require('../../assets/shenfenzheng.png'),
        },


      }
    },
    created: function () {



      this.$http.get('/api/v1.0/wechat/sign').then(response => { //获取签名接口开始
        console.log(response.body.result);
        this.t1=response.body.result.appid;
        console.log(this.t1);
        this.t2=response.body.result.timestamp;
        this.t3=response.body.result.nonceStr;
        this.t4=response.body.result.signature;

        wx.config({
          debug: false,
          appId: this.t1,
          timestamp: this.t2,
          nonceStr: this.t3,
          signature: this.t4,
          jsApiList: [
            'getLocation'
          ]
        });

      }, response => {
        console.log( 'error callback');
      });


      wx.ready(function () {
        wx.error(function(res){
          alert('wx.error错误信息'+res)
          console.log(res)
          console.log(res)

        });
        wx.checkJsApi({
          jsApiList: [
            'getLocation'
          ],
          success: function (res) {
            wx.getLocation({
              success: function (res) {
               this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
               this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                alert('纬度'+this.latitude+'经度'+this.longitude);
                console.log('纬度'+this.latitude+'经度'+this.longitude);
                console.log('纬度'+this.latitude+'经度'+this.longitude);

              },
              cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
              }
            });
//          alert('微信版本！');
            // alert(JSON.stringify(res));
            // alert(JSON.stringify(res.checkResult.getLocation));
            if (res.checkResult.getLocation == false) {
              alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
              return;
            }
          }
        });


      });

        //以上是获取经纬度
      this.$http.post('/api/v1.0/client/findPunchCardLog').then(response => { //查询是否有打卡
        console.log(response.body.result.locations)
        for(let i=0;i<response.body.result.locations.length;i++){
          this.circlePath={
            center: {
              lng: response.body.result.locations[i].LONGITUDE,
              lat: response.body.result.locations[i].LATITUDE,
            },
            radius: response.body.result.locations[i].SCOPE
          }
        }
      }, response => {
        console.log('findPunchCardLog error callback');
      });


    },


      methods: {
        handler ({BMap, map}) {
        console.log(BMap, map);
        console.log(this.latitude);
          console.log(this.latitude);
          console.log(this.latitude);

          let distance=map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(this.longitude, this.latitude));
          if(distance<1000){
            alert('区域内'+map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(this.longitude, this.latitude)));
          }else{
              alert('区域外'+map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(this.longitude, this.latitude)));
          }

     }


    },

    components: {
    },
  }

</script>

<style scoped>
  .bm-view {
    width: 100%;
    height: 300px;
  }
  .dataTitle span{
    font-size: 1.4rem;
  }
  .changeSelect{
    width: 14rem;
    display: block;
    height: 2.5rem;
    border: none;
    font-size: 1.22rem;
  }
  .cardClass{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    padding-bottom: 1rem;
    position: absolute;
    left: -15rem;
    top: -3rem;
  }
  .cardClass div{
    width: 9rem;
    height: 1.2rem;
    position: absolute;
    top:2.8rem;
    font-size: 1.1rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 80%;
    padding-left: 0rem;

  }
  .myApply{
    width: 23.2rem;
    height: 14.5rem;
    margin-top: 1rem;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .myApplyTitleLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: left;
    font-weight: 600;
    font-size:1.3rem ;
  }
  .myApplyContentLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    text-align: left;
    font-weight: 600;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyContentNr{
    width: 22rem;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyBottomNrLeft{
    width: 6.5rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyBottomNrRight{
    width: 15rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyTitleRight{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: right;
    font-weight: 600;
    font-size:1.3rem ;
  }
</style>
