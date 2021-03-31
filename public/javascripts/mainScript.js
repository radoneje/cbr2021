var pgm=new Vue({
    el:"#app",
    data:{
        content:content,
        pgmItem:content.pgm[0],
        speakers:speakers,
    },
    methods:{

        getSpkInit:function(spk){
            var ret=spk.f;
            if(!spk.i || spk.i.length==0)
                return ret;
            ret+=" "+ spk.i.substr(0,1).toUpperCase()+"."
            if(!spk.o || spk.o.length==0)
                return ret;
            ret+=" "+ spk.o.substr(0,1).toUpperCase()+"."
            return ret;
        },
        getSpeakes:function (users) {
            var ret=[];
            this.speakers.forEach(s=>{
                if(users)
                    users.forEach(ss=>{
                    if(s.id==ss.id) {
                        s.theme=ss.theme
                        ret.push(s)
                    }
                })
            })
            console.log("speakers", ret)
            return ret;
        },
        getModerators:function (event) {
            var ret=[];
            this.speakers.forEach(s=>{
                if(event.moderators)
                    event.moderators.forEach(ss=>{
                        if(s.id==ss)
                            ret.push(s)
                    })
            })
            console.log("speakers", ret)
            return ret;
        }
        ,
        getUsers:function (event) {
            var ret=[];
            this.speakers.forEach(s=>{
                if(event.users)
                    event.users.forEach(ss=>{
                        if(s.id==ss)
                            ret.push(s)
                    })
            })
            console.log("speakers", ret)
            return ret;
        }
    },
    mounted:function () {
      console.log("vue pgm")
    }

})