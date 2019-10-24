<template>
  <swiper :options="swiperOption" ref="mySwiper" class="banner">
    <swiper-slide v-for="item in data" :key="item.img">
      <img :src="item.picture" @click="showCount(item)" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
import Vue from "vue";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showId:'',
      link: "",
      swiperOption: {
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  methods: {
    showCount(item) {
      this.link = item.link;
      this.showId=item.showId
      Vue.http.interceptors.push(function(request, next) {
        request.headers.set("showId", this.showId);
      });
      this.$http.get("/api/v1.0/client/showCount").then(res => {
        if (!this.link) {
          this.$message({
            type: "error",
            message: "此广告暂时还未设置链接！"
          });
        } else {
          window.location.href = this.link;
        }
      });
    }
  },
  components: {
    swiper,
    swiperSlide
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
.banner .swiper-slide {
  width: 100vw;
  padding: 10px;
  box-sizing: border-box;
}
.banner img {
  width: 100%;
  height: 100px;
  border-radius: 8px;
}

.banner .swiper-pagination {
  /* bottom: 20px; */
  margin-bottom: 10px;
  line-height: 10px;
}

.banner .swiper-pagination .swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background: black;
  opacity: 0.2;
  border-radius: 5px;
  margin: 0 5px;
}
.banner
  .swiper-pagination
  .swiper-pagination-bullet.swiper-pagination-bullet-active {
  opacity: 0.5;
}
</style>
