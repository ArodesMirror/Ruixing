<template>
    <div class="login">
        <!-- 导航栏 -->
        <van-nav-bar left-text="返回" right-text="先逛一逛" left-arrow
        @click-right="$router.push({name:'Home'})">
            <template #left>
                <div class="nav-left">
                    <div class="logo"><img class="auto-img" src="../assets/images/home_active.png" alt="" srcset=""></div>
                    <div class="logo-name">Luckin Coffee</div>
                </div>
            </template>
        </van-nav-bar>
        <!-- 用户 -->
        <div class="welcome-box">
            <h2 class="welcome">欢迎回来!</h2>
            <p class="welcome-en">Please login to your accounts</p>
        </div>
        <!-- 登录账号密码 -->
        <van-form>
            <van-field
                v-model="userLoginInfo.phone"
                name="手机号"
                label="手机号"
                placeholder="手机号"
            />
            <van-field
                v-model="userLoginInfo.password"
                :type="showLoginPsw ? '' : 'password'"
                name="密码"
                label="密码"
                placeholder="密码"
                :right-icon="showLoginPsw ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showLoginPsw =! showLoginPsw"
            />
            <div class="forget">
                <span>忘记密码？</span>
            </div>
            <div class="login-btn van-btn">
                <van-button round block type="info" color="#0b34ba" @click="login">登录</van-button>
            </div>
            <div class="register-btn van-btn" @click="registerShow = true">
                <van-button round block type="default">注册</van-button>
            </div>
        </van-form>
        <!-- 注册弹出层 -->
        <van-popup 
            v-model="registerShow" 
            position="bottom" 
        >
        <div class="register-title">注册</div>
        <!-- 注册表单 -->
        <van-form>
            <van-field
                v-model="userRegisterInfo.phone"
                name="手机号"
                label="手机号"
                placeholder="11位手机号"
            />
            <van-field
                v-model="userRegisterInfo.nickName"
                name="昵称"
                label="昵称"
                placeholder="1-10位昵称"
            />
            <van-field
                v-model="userRegisterInfo.password"
                :type="showRegisterPsw ? '' : 'password'"
                name="密码"
                label="密码"
                placeholder="6-16位密码且以字母开头"
                :right-icon="showRegisterPsw ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showRegisterPsw =! showRegisterPsw"
            />
            <div class="register-btn">
                <van-button round block type="info" color="#0b34ba" 
                @click="register">注册</van-button>
            </div>
        </van-form>
        </van-popup>
    </div>
</template>
<script>
import "../assets/less/login.less"
// 引入validForm 文件
import validForm from '../assets/js/validForm'
export default {
  data() {
    return {
        // 显示隐藏登录密码
      showLoginPsw:false,
      // 显示隐藏登录密码
      showRegisterPsw:false,
        // 显示隐藏注册弹出层
      registerShow:false,
    //   用户登录信息
      userLoginInfo:{
          phone:'',
          password:''
      },
    //   用户注册信息
      userRegisterInfo:{
          phone:'',
          nickName:'',
          password:''
      }
    };
  },
  methods:{
      register(){
        //   构造表单验证信息
          let o = {
            //   验证手机号码
            phone:{
                // 获取手机号码
                value:this.userRegisterInfo.phone,
                errorMsg:"手机格式化不正确",
                // 正则表达式验证手机号码
                reg:/^1[3-9]\d{9}$/
            },
            nickName:{
                value:this.userRegisterInfo.nickName,
                errorMsg:'昵称格式化不正确',
                // \u4e00-\u9fa5 中文匹配
                reg:/^[\w\u4e00-\u9fa5]{1,10}$/
            },
            password:{
                value:this.userRegisterInfo.password,
                errorMsg:'密码格式化不正确',
                // 设配大小写和5到15位数字
                reg:/^[A-Za-z]\w{5,15}$/
            }
          }
        //   表单格式是否验证通过，发起注册请求
        if(validForm.valid(o)){
            // 拷贝一份用户注册的数据
            var userInfo = Object.assign({},this.userRegisterInfo);
            userInfo.appkey = this.appkey;
            //加载中
            this.$toast.loading({
                // 加载显示的文本
                message:"注册中……",
                // 放穿透
                forbidClick:true,
                // 持续时间
                duration:0
            })

            this.axios({
                // 请求类型
                method:"POST",
                // 请求路径
                url:"/register",
                // 请求参数（需要的字符串类型）
                data:userInfo,
            }).then(res => {
                if(res.data.code === 100){
                    // 关闭加载中
                    this.$toast.clear();
                    // 隐藏注册页面
                    this.registerShow = false;
                }else{
                    // 手机号已被注册的提示
                    this.$toast(res.data.msg);
                }
                // console.log('res ==>',res);
            }).catch(err => {
                // console.log('err ==>',err);

            })
        }
      },
      login(){
        //   构造表单验证信息
          let o = {
            //   验证手机号码
            phone:{
                // 获取手机号码
                value:this.userLoginInfo.phone,
                errorMsg:"手机格式化不正确",
                // 正则表达式验证手机号码
                reg:/^1[3-9]\d{9}$/
            },
            password:{
                value:this.userLoginInfo.password,
                errorMsg:'密码格式化不正确',
                // 设配大小写和5到15位数字
                reg:/^[A-Za-z]\w{5,15}$/
            }
          }
        //   表单格式是否验证通过，发起注册请求
        if(validForm.valid(o)){
            // 拷贝一份用户注册的数据
            var userInfo = Object.assign({},this.userLoginInfo);
            userInfo.appkey = this.appkey;
            
            //加载中
            this.$toast.loading({
                // 加载显示的文本
                message:"登录中……",
                // 放穿透
                forbidClick:true,
                // 持续时间
                duration:0
            })

            this.axios({
                // 请求类型
                method:"POST",
                // 请求路径
                url:"/login",
                // 请求参数（需要的字符串类型）
                data:userInfo,
            }).then(res => {
                this.$toast(res.data.msg);
                if(res.data.code === 200){
                    // 使用localStorage 保存token
                    localStorage.setItem('__tk',res.data.token);
                    this.$router.push({name:"Home"});
                }
                // console.log("登录 res ==》",res);
            }).catch(err => {
                this.$toast.clear();
                // console.log('登录err ==>',err);
            })
        }
      }
  }
};
</script>