<template>
  <swiper :options="swiperOption" ref="mySwiper" class="banner">
    <swiper-slide v-for="item in data" :key="item.img">
      <!-- <a :href="item.link" > -->
      <img :src="item.picture" @click="showCount(item)" />
      <!-- </a> -->
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
      swiperOption: {
        autoplay: {
          delay: 1300
        },
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  methods: {
    showCount(item) {
        // console.log(item.showId)
      let id = item;
      Vue.http.interceptors.push(function(request, next) {
        request.headers.set("showId", item.showId);
      });
      this.$http.get("/api/v1.0/client/showCount").then(res => {
        console.log('广告');
      });
      window.location.href =item.link
    }
  },
  components: {
    swiper,
    swiperSlide
  }
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
  height: 60px;
  border-radius: 8px;
}

.banner .swiper-pagination {
  bottom: 20px;
  margin-bottom: 6px;
}

.banner .swiper-pagination .swiper-pagination-bullet {
  width: 20px;
  height: 5px;
  background: #fff;
  opacity: 0.5;
  border-radius: 5px;
  margin: 0 5px;
}
.banner
  .swiper-pagination
  .swiper-pagination-bullet.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>
