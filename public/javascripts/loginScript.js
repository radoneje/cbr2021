var login=new Vue({
    el:"#app",
    data:{
        user:{},
        err:{},
        showDeptDialog:false,
        dept:dept,
        activeDept:{id:null, title:"Подразделение"}
    },
    watch:{
        activeDept:function(){
            console.log("activeDept")
            var _this=this;
            setTimeout(()=>{ this.showDeptDialog=false;},0)

        }

    },
    methods:{

    },
    mounted:function () {
      console.log("vue login")
    }

})