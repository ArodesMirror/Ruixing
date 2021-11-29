<template>
    <div class="shopBag">
        <van-nav-bar 
        title="购物袋" 
        left-text="返回" 
        left-arrow
        :right-text="isEmpty ? '' : isEdit ? '完成' : '编辑'"
        @click-left="$router.back()"
        @click-right="isEdit =! isEdit"
        fixed
        />
        <!-- 空状态 -->
        <van-empty description="购物袋空空如也，去逛一逛！" v-if="isEmpty">
            <van-button round type="danger" class="bottom-button" color="#0b34ba">去逛一逛</van-button>
        </van-empty>
        <!-- 背景图 -->
        <div class="bg-box">
            <img class="auto-img" src="../assets/images/shopbag_bg.png" alt="">
        </div>
        <!-- 商品内容 -->
        <div class="pro-box">
            <div class="pro-item" v-for="(item,index) in ShopcarData" :key="index">
                <van-swipe-cell :disabled="!isEdit">
                    <div class="pro">
                        <div class="pro-item-fl">
                            <van-checkbox v-model="item.isActive" @click="selectOne" checked-color="#0b34ba"/>
                        </div>
                        <div class="pro-item-fr">
                            <div class="info-img">
                                <img class="auto-img" :src="item.large_img" alt="">
                            </div>
                            <div class="item-info">
                                <div class="info-name">
                                    <div class="name">{{item.name}}</div>
                                    <div class="rule">{{item.rule}}</div>
                                </div>
                                <div class="item-enname">{{item.enname}}</div>     
                                <div class="info-price clearfix">
                                    <div class="fl">￥{{item.price}}</div>
                                    <div class="fr">
                                        <van-stepper 
                                        v-model="item.count"
                                        @change="modifyShopcartCount(item.count,item.sid)" 
                                        theme="round" 
                                        button-size="22" 
                                        disable-input />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button square 
                        type="danger" 
                        text="删除" 
                        @click="deleteOne(item.sid,index)"/> 
                    </template>
                </van-swipe-cell>
            </div>
        </div>
        <!-- 提交订单栏 -->
        <van-submit-bar :price="total" button-text="提交订单" v-if="!isEdit" @submit="deleteSelect">
            <van-checkbox checked-color="#0b34ba" v-model="Allchecked" @click="allselect">全选</van-checkbox>
        </van-submit-bar>
        <van-submit-bar button-text="删除选择" v-if="isEdit" @submit="deleteSelect">
            <van-checkbox checked-color="#0b34ba" v-model="Allchecked"  @click="allselect">全选</van-checkbox>
        </van-submit-bar>
    </div>
</template>
<script>
import '../assets/less/shopbag.less';
export default {
    data(){
        return{
            ShopcarData:[],// 购物袋所有的商品数据
            isEmpty:false,// 是否为空状态
            checked:true,// 按钮状态
            Allchecked:false,// 全选
            isEdit:false,// 处于编辑状态
            total:0,    //总价
        };
    },
    created(){
        this.findAllShopcart();
    },
    methods:{
        // 查询购物袋商品数量
        findAllShopcart(){
            var tokenString = localStorage.getItem('__tk');
            // 用户未登录(返回登录页面)
            if(!tokenString){
                return;
            }
            this.axios({
                method:"GET",
                url:"/findAllShopcart",
                params:{
                    appkey:this.appkey,
                    tokenString
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'});
                }else if(res.data.code === 5000){
                    res.data.result.map(v=>{
                        v.isActive = false;
                    })
                    this.ShopcarData = res.data.result;
                }
                // console.log("查询购物车接口，res ==》",res);
            }).catch((err) => {
                // console.log('查询购物车接口，err ==>',err);
            })
        },
        // 全选
        allselect(){
            this.ShopcarData.map(v=>{
                v.isActive = this.Allchecked;
            })
            this.sum();
        },
        // 选择单个
        selectOne(){
            this.sum();
            for(let i = 0; i < this.ShopcarData.length; i++){
                if(!this.ShopcarData[i].isActive){
                    return this.Allchecked = false;
                }
            }
            this.Allchecked = true;
        },
        // 计算总价
        sum(){
            this.total = 0;
            this.ShopcarData.map(v=>{
                // 计算被选中的商品
                console.log(v)
                if(v.isActive){
                    this.total += v.price * v.count * 100;
                }
            })
        },
        // 修改购物商品数据的接口
        modifyShopcartCount(count,sid){
            var tokenString = localStorage.getItem('__tk');
            if(!tokenString){
                return;
            }
            this.axios({
                method:"POST",
                url:"/modifyShopcartCount",
                data:{
                    appkey:this.appkey,
                    tokenString,
                    count,
                    sid
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'});
                }else if(res.data.code === 6000){
                    this.sum();
                }
                // console.log("购物车商品数量修改接口，res ==》",res);
            }).catch((err) => {
                // console.log('购物车商品数量修改接口，err ==>',err);
            })
        },
        // 删除单个
        deleteOne(sid,index){
            var tokenString = localStorage.getItem('__tk');
            if(!tokenString){
                return;
            }
            this.axios({
                method:"POST",
                url:"/deleteShopcart",
                data:{
                    appkey:this.appkey,
                    tokenString,
                    sids:JSON.stringify([sid])
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'});
                }else if(res.data.code === 7000){
                    this.ShopcarData.splice(index,1);
                }
                // console.log("购物车商品删除接口，res ==》",res);
            }).catch((err) => {
                // console.log('购物车商品删除接口，err ==>',err);
            });
        },
        // 删除选中的商品
        deleteSelect(){
            var tokenString = localStorage.getItem('__tk');
            if(!tokenString){
                return;
            }
            let isHas = false;
            // 找到所有被选中的商品，存放进数组
            let sid = [];
            this.ShopcarData.map(v=>{
                if(v.isActive){
                    isHas = true;
                    sid.push(v.sid);
                }
            })
            if(!isHas){
                return this.$toast('请选择删除的商品');
            }
            this.axios({
                method:"POST",
                url:"/deleteShopcart",
                data:{
                    appkey:this.appkey,
                    tokenString,
                    sids:JSON.stringify([sid])
                }
            }).then((res) => {
                if(res.data.code === 700){
                    // 登录失败跳转到登录页面
                    this.$router.push({name:'Login'});
                }else if(res.data.code === 7000){
                    for(let i = 0;i < this.ShopcarData.length; i++){
                        if(this.ShopcarData[i].isActive){
                            this.ShopcarData.splice(i,1);
                            i--;
                        }
                    }
                }
                // console.log("购物车商品删除接口，res ==》",res);
            }).catch((err) => {
                // console.log('购物车商品删除接口，err ==>',err);
            });
        }
    }
}
</script>