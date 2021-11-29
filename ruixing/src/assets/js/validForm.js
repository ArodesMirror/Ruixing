import { Toast } from "vant";
import Vue from "vue";

Vue.use(Toast);
class ValidForm {
    constructor() {}
    valid(o) {
        // console.log("表单的验证", o);
        // let 变量名 in 对象名
        for (let key in o) {
            // 正则表达式.test(value) 匹配返回true否则返回false
            if (!o[key].reg.test(o[key].value)) {
                // 验证失败
                Toast(o[key].errorMsg);
                return false;
            }
        }
        // 验证通过
        Toast.success('注册成功！');
        return true;
    }
}
export default new ValidForm();