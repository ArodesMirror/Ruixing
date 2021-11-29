<template>
    <div class="detail">
        <van-nav-bar 
        title="商品详情" 
        left-text="返回" 
        left-arrow
        @click-left="$router.back()"
        fixed
        />
        <!-- 背景图片 -->
        <div class="img-box">
            <img alt="" class="auto-img" :src="DetailData.large_img"/>
            <div class="img-name">{{DetailData.name}}</div>
        </div>
        <!-- 商品规格 -->
        <div class="products-rule-box">
            <!-- 规格 -->
            <div class="rule-box">
                <div class="rule-item" v-for="(item,index) in DetailData.rules" :key="index">
                    <div class="rule-name">{{item.title}}</div>
                    <div class="rule-selects">
                        <div class="select" :class="{active:item.currentIndex === i}" v-for="(n,i) in item.rule" :key="i" @click="toggleSelect(item,i)">{{n}}</div>
                    </div>
                </div>
            </div>
            <!-- 商品描述 -->
            <div class="pro-des">
                <div class="des-title">商品描述</div>
                <div class="des-content">
                    <div v-for="(item,index) in DetailData.desc" :key="index">
                        {{`${index + 1}、${item}`}}
                    </div>
                </div>
            </div>
            <!-- 商品价格 -->
            <div class="price-box clearflx">
                <div class="price fl">￥{{DetailData.price}}</div>
                <div class="fr">
                    <van-stepper v-model="proCount" theme="round" button-size="22" disable-input />
                </div>
            </div>
        </div>
        <!-- 商品导航 -->
        <van-goods-action>
            <van-goods-action-icon 
            icon="bag" 
            :color="shopcartCount > 0 ? '#0b34ba' : '#989898'" 
            :badge="shopcartCount > 0 ? shopcartCount : ''" 
            text="购物袋" 
            @click="$router.push({name:'Shopbag'})"/>

            <van-goods-action-icon 
            icon="like" 
            :color="islike ? '#0b34ba' : '#989898'" 
            :text="islike ? '已收藏' : '未收藏'" 
            @click="getlike" />

            <van-goods-action-button 
            color="#5CB4D8" 
            type="warning" 
            text="加入购物袋"
            @click="addShopcart" />
            <van-goods-action-button color="#0b34ba" type="danger" text="立即购买" />
        </van-goods-action>
    </div>
</template>
<script>
import '../assets/less/detail.less'
export default {
    data(){
        return{
            pid:0,
            DetailData:{},
            // 当前商品数量
            proCount:0,
            // 购物袋数量
            shopcartCount:0,
            // 是否收藏
            islike:false,
        }
    },
    created(){
        this.pid = this.$route.params.pid;
        // 获取详情页的数据
        this.getDetailData();
        // 查询是否收藏
        this.findlike();
        // 查询购物袋的数量
        this.findshopcartRows();
    },
    methods:{
        getDetailData(){
            this.axios({
                method:"GET",
                url:"/productDetail",
                params:{
                    appkey:this.appkey,
                    pid:this.pid
                }
            }).then(res => {
                // console.log("详情页接口，res ==》",res);
                if(res.data.code === 600){
                    let data = res.data.result[0];
                    // 字符串的API String.split(以切割字符) 转化为数组
                    data.desc = data.desc.split(/\n/);
                    // 商品规格
                    let rules = [];
                    let rulesData = ['cream','milk','sugar','tem'];
                    rulesData.map((v)=>{
                        let r = {};
                        r.title = data[v + '_desc'];    //{title:'奶油}
                        let rule = [];
                        // 当前选中的规格
                        r.currentIndex = 0;
                        // 默认奶油/无奶油
                        let ruleString = data[v].split('/');
                        ruleString.map((o)=>{
                            if(o != ''){
                                rule.push(o);
                            }
                        });
                        r.rule = rule;
                        if(r.rule.length > 0){
                            rules.push(r);
                        }
                    })
                    data.rules = rules;
                    this.DetailData = data;
                    // this.DetailData = res.data.result[0];
                }
            }).catch(err => {
                // console.log('详情页接口，err ==>',err);
            })
        },
        // 切换规格
        toggleSelect(item,i){
            item.currentIndex = i;
        },
        // 收藏
        getlike(){
            // 获取token
            var tokenString = localStorage.getItem('__tk');
            // 用户未登录(返回登录页面)
            if(!tokenString){
                this.$toast('请先登录！');
                return this.$router.push({name:'Login'});
            }
            let url = this.islike ? '/notlike' : '/like';
            this.axios({
                method:"POST",
                url,
                data:{
                    appkey:this.appkey,
                    pid:this.pid,
                    tokenString
                }
            }).then(res => {
                this.$toast(res.data.msg);
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'})
                }else if(res.data.code === 800){
                    this.islike = true;
                }else if(res.data.code === 900){
                    this.islike = false;
                }
                // console.log("收藏接口，res ==》",res);
            }).catch(err => {
                // console.log('收藏接口，err ==>',err);
            })
        },
        // 查询收藏
        findlike(){
            var tokenString = localStorage.getItem('__tk');
            // 用户未登录(返回登录页面)
            if(!tokenString){
                return;
            }
            this.axios({
                method:"GET",
                url:"/findlike",
                params:{
                    appkey:this.appkey,
                    pid:this.pid,
                    tokenString
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'})
                }else if(res.data.code === 1000 && res.data.result.length > 0){
                    this.islike = true;
                }
                // console.log("查询收藏接口，res ==》",res);
            }).catch((err) => {
                // console.log('查询收藏接口，err ==>',err);
            })
        },
        // 添加购物车
        addShopcart(){
            // 获取token
            var tokenString = localStorage.getItem('__tk');
            // 用户未登录(返回登录页面)
            if(!tokenString){
                this.$toast('请先登录！');
                return this.$router.push({name:'Login'});
            }
            let rule = [];
            this.DetailData.rules.map(v=>{
                rule.push(v.rule[v.currentIndex])
            });
            rule = rule.join('/');
            this.axios({
                method:"POST",
                url:'/addShopcart',
                data:{
                    appkey:this.appkey,
                    pid:this.pid,
                    count:this.proCount,
                    rule,
                    tokenString,
                }
            }).then(res => {
                this.$toast(res.data.msg);
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'})
                }else if(res.data.code === 3000){
                    if(res.data.status === 1){
                        this.shopcartCount++;
                    }else{
                        this.$toast('该商品已在购物袋中，数量已修改！');
                    }
                }
                // console.log("收藏接口，res ==》",res);
            }).catch(err => {
                // console.log('收藏接口，err ==>',err);
            })
        },
        // 查询购物袋商品数量
        findshopcartRows(){
            var tokenString = localStorage.getItem('__tk');
            // 用户未登录(返回登录页面)
            if(!tokenString){
                return;
            }
            this.axios({
                method:"GET",
                url:"/shopcartRows",
                params:{
                    appkey:this.appkey,
                    tokenString
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'});
                }else if(res.data.code === 8000){
                    this.shopcartCount = res.data.result;
                }
                // console.log("查询收藏接口，res ==》",res);
            }).catch((err) => {
                // console.log('查询收藏接口，err ==>',err);
            })
        }
    }
}
</script>