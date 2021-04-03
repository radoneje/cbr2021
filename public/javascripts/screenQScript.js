var pgm=new Vue({
    el:"#app",
    data:{
        q:[],
    },
    methods:{
        updateQ:async function(){
            try {
                var ret = await axios.get("/api/q");
                this.q = ret.data.q;
            }
            catch (e) {
                console.warn(e)
            }
            setTimeout(()=>{this.updateQ()},10*1000)
        },
    },
    watch: {
    },
    mounted:function () {
        this.updateQ();
        setTimeout(()=>{   document.body.style.opacity=1;
        },500)
    }

})

