/**
 * Created by Josh
 */
import Vue from "vue";
import Store from "./storage";
import AV from 'leancloud-storage';
import Remote from "./remote"

export default function bar() {
  var APP_ID = 'F3UkuDlal71UvF2zwUY3GoVP-gzGzoHsz';
  var APP_KEY = 'v3vSOioD6OEfHgo9VuG3QMpQ';
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  });

  var filters = {
    all: function (items) {
      return items;
    },
    active: function (items) {
      return items.filter(function (item) {
        return !item.isFinished;
      });
    },
    completed: function (items) {
      return items.filter(function (item) {
        return item.isFinished;
      });
    }
  };

  var todoList = new Vue({
    el:"#todos",
    data:{
      item:{
        name:"",
        createTime:"",
        isFinished:""
      },
      formData:{
        username:"",
        password:""
      },
      list: [],
      inputItem: Store.fetch("input") || "",
      signType:"signIn",
      visibility:"all",
      currentUser:null
    },
    watch:{
      list:{
        handler:function (items) {
          Remote.remoteSave(items);
        },
        deep:true
      },
      inputItem:{
        handler:function (items) {
          Store.save("input",items);
        },
        deep:true
      }
    },
    created:function(){
      this.currentUser = this.getCurrentUser();
        Remote.remoteFetch(this.list);
    },
    methods:{
      addItem:function(){
        var that = this;
        if(!this.inputItem) return;
        var date = new Date();
        var time = date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate() + "日" + date.getHours() + "时";
        var obj = {
          name:this.inputItem,
          isFinished:false,
          createTime:time
        };
        this.list.push(obj);
        obj = {};
        this.inputItem = "";
      },
      removeItem:function(item){
        var index = this.list.indexOf(item);
        this.list.splice(index,1);
      },
      removeList:function(){
        this.list = [];
      },
      finished:function(item){
        item.isFinished = !item.isFinished;
      },
      changeSignType:function () {
        this.signType == "signUp" ? this.signType="signIn" : this.signType="signUp";
      },
      selectAll:function () {
        this.visibility = 'all';
      },
      selectDone:function () {
        this.visibility = 'completed';
      },
      selectTodo:function () {
        this.visibility = 'active';
      },
      signUp:function () {
        let user = new AV.User();
        user.setUsername(this.formData.username);
        user.setPassword(this.formData.password);
        //有了箭头函数，再也不用写var _this = this;了
        user.signUp().then((loginedUser) => {
          this.currentUser = this.getCurrentUser();
          alert("注册成功");
        }, function (error) {
        });
      },
      signIn:function () {
        AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
          this.currentUser = this.getCurrentUser();
          window.location.reload();
        }, function (error) {
          alert("请输入正确的用户名/密码")
        });
      },
      signOut:function () {
        AV.User.logOut();
        this.currentUser = null;
        window.location.reload();
      },
      getCurrentUser:function () {
        //解构赋值，意为获取目标相同key的值
        var current = AV.User.current();
        if(current){
          let {id, createdAt, attributes: {username}} = current;
          return {id, username, createdAt};
        }else{
          return null;
        }
      }
    },
    computed:{
      filteredTodos:function () {
        return filters[this.visibility](this.list);
      }
    }
  });
};