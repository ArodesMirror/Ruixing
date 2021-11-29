<template>
    <div class="home">
        <!-- 导航栏 -->
        <van-nav-bar left-text="返回" right-text="按钮" left-arrow fixed>
            <template #left>
                <div class="user-box">
                    <div class="time">晚上好,</div>
                    <div class="user-name">Arodes</div>
                </div>
            </template>
            <template #right>
                <van-search placeholder="请输入搜索关键词"/>
            </template>
        </van-nav-bar>
        <!-- 商品大盒子 -->
        <div class="product-box">
            <!-- 轮播图 -->
            <div class="banner">
                <van-swipe class="my-swipe" indicator-color="white">
                <van-swipe-item v-for="(item,index) in bannerData" :key="index"
                @click="goDetail(item.pid)">
                    <img 
                    :src="item.bannerImg" 
                    alt="" 
                    class="auto-img"
                    />
                    <div class="img-name">{{item.name}}</div>
                </van-swipe-item>
                <template #indicator>
                    <span></span>
                </template>
                </van-swipe>
            </div>
            <!-- 热门推荐 -->
            <div class="product-content">
                <div class="clearflx">
                    <div class="product-title fl">热门推荐</div>
                </div>
                <div class="product-item-box">
                    <div 
                    class="pro-item"
                    v-for="(item,index) in productsData" 
                    :key="index"
                    @click="goDetail(item.pid)"
                    >
                        <div class="pro-img">
                            <img 
                            class="auto-img" 
                            :src="item.largeImg" 
                            alt=""
                            />
                        </div>
                        <div class="pro-name text-eli">{{item.name}}</div>
                        <div class="pro-enname text-eli">{{item.enname}}</div>
                        <div class="pro-price">￥{{item.price}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import "../assets/less/home.less"
export default {
    data(){
        return{
            bannerData:[],
            // 热门推荐的数据
            productsData:[]
        }
    },
    created(){
        // 请求轮播图的数据
        this.getBannerData();
        // 请求热门推荐的数据
        this.getProductsData();
    },
    methods:{
        // 请求轮播图的数据
        getBannerData(){
            this.axios({
                method:"GET",
                url:"/banner",
                params:{
                    appkey:this.appkey
                }
            }).then(res => {
                if(res.data.code === 300){
                    this.bannerData = res.data.result;
                }
                // console.log("轮播图Banner成功，res ==》",res);
            }).catch(err => {
                // console.log('轮播图Banner失败，err ==>',err);
            })
        },
        // 请求热门推荐的数据
        getProductsData(){
            this.axios({
                method:"GET",
                url:"/typeProducts",
                params:{
                    appkey:this.appkey,
                    key:"isHot",
                    value:1
                }
            }).then(res => {
                if(res.data.code === 500){
                    this.productsData = res.data.result;
                }
                // console.log("热门推荐接口，res ==》",res);
            }).catch(err => {
                // console.log('热门推荐接口，err ==>',err);
            })
        },
        // 跳转详情页
        goDetail(pid){
            this.$router.push({name:"Detail",params:{pid}})
        }
    }
}
</script>