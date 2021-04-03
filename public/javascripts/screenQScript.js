var pgm=new Vue({
    el:"#app",
    data:{
        q:[],
    },
    methods:{
        updateQ:async function(){
            try {
                var ret = await axios.get("/api/q");
                ret.data.q.reverse()
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
pageScroll(1);
function pageScroll(a) {
    var before=window.scrollY;
    window.scrollBy(0,a);
    var after=window.scrollY;

    if(before==after) {
        setTimeout(() => {
            window.scrollTo(0,0);
            setTimeout(()=>pageScroll(a),4*1000);
        }, 4*1000);
    }
    else
    setTimeout(()=>pageScroll(a),20);
}

