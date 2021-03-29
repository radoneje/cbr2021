var app=new Vue({
    el:"#app",
    data:{
        loaded:false,
        sect:-1,
        stage:1,
        showLoader:true,
        users:[],
        chat:[],
        q:[],
        descr:{content:"",speakers:"",site:""},
        stat:{},
        spk:[],
        newSpk:{photo:null,f:"",i:"",o:"",position:"", id:0},
    },
    methods:{
        repositionSpk:async function(item, count){
            item.sortOrder+=count;
            var ret= await axios.post("/api/repositionSpk", item);
            this.spk=ret.data;

        },
        deleteSpk:async function(item){
            if(confirm("вы уверены?")) {
                var ret = await axios.delete("/api/spk/" + item.id);
                item.isDeleted = true;
            }
        },
        editSpk:async function(item){
            var ret= await axios.post("/api/spk", item);
            item=ret.data;
        },
        addSpk:async function(item){
            var ret= await axios.post("/api/addSpk", item);
            this.spk.push(ret.data)
            this.newSpk={};
        },
        editSpkPhoto:async function(item){
            var elem=document.createElement("input")
            elem.type="file"
            elem.display="none"
            elem.onchange=async (e)=>{
                var formData= new FormData()
                formData.append("image", elem.files[0]);
                var res=await axios.post('/api/spkImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                item.photo=res.data;
                elem.parentNode.removeChild(elem);

            };
            document.body.appendChild(elem);
            elem.click()
        },
        saveContent:async function(){
            if(!confirm("Вы уверены?"))
                return ;
            try {
                console.log(this.descr.content)
                var  json= JSON.parse(this.descr.content)
                await axios.post("/api/adminContent",{data:this.descr.content});
            }
            catch (e) {
                return alert("Ошибка формата JSON")
            }


        },
        saveSpeakers:async function(){
            if(!confirm("Вы уверены?"))
                return ;
            try {
                var  json= JSON.parse(this.descr.speakers)
                await axios.post("/api/adminSpeakers",{data:this.descr.speakers});
            }
            catch (e) {
                return alert("Ошибка формата JSON")
            }


        },
        saveSite:async function(){
            if(!confirm("Вы уверены?"))
                return ;
            try {
                var  json= JSON.parse(this.descr.site)
                await axios.post("/api/adminSite",{data:this.descr.site});
            }
            catch (e) {
                return alert("Ошибка формата JSON")
            }


        },
        updateChat:async function(){
            try {
                var ret = await axios.get("/api/chat");
                this.chat = ret.data.chat;
                this.q = ret.data.q;
                var objDiv = document.getElementById("qBox");
                if(objDiv!=null)
                    objDiv.scrollTop = objDiv.scrollHeight;

                objDiv = document.getElementById("chatBox");
                if(objDiv!=null)
                    objDiv.scrollTop = objDiv.scrollHeight;
            }
            catch (e) {
                console.warn(e)
            }
            setTimeout(()=>{this.updateChat()},5*1000)


        },
        deleteChat:async function(item){
            if(!confirm("Вы действительно хотите удалить сообщение?"))
                return false
            var res=await axios.delete("/api/chat/"+item.id);
            this.chat=this.chat.filter(c=>c.id!=item.id);
        },
        deleteQ:async function(item){
            if(!confirm("Вы действительно хотите удалить сообщение?"))
                return false
            var res=await axios.delete("/api/q/"+item.id);
            this.chat=this.chat.filter(c=>c.id!=item.id);
        },
        chatToQ:async function(item){
            if(!confirm("Вы действительно хотите коприровать сообщение?"))
                return false
            var res=await axios.post("/api/chatToQ/", item);
            this.q.push(res.data);
            alert("Сообщение скопировано")
        }
    },
    watch:{

        sect:async function () {
            this.showLoader=true;
            if(this.sect==0){
                var ret=await axios.get("/api/regUser");
                this.users=ret.data;
                setTimeout(()=>{ this.showLoader=false;},1000)
            }
            if(this.sect==1){
               // var ret=await axios.get("/api/chat");
               // this.chat=ret.data;
                setTimeout(()=>{ this.showLoader=false;},1000)
            }
            if(this.sect==2){
              //  var ret=await axios.get("/api/q");
               // this.q=ret.data;
                setTimeout(()=>{ this.showLoader=false;},1000)
            }
            if(this.sect==3){
                var ret=await axios.get("/api/content");
                for(var key in ret.data)
               {
                   if(key!="id")
                       this.descr[key] = JSON.stringify(ret.data[key])
               }

               // {"id":1,"site":null,"content":{},"speakers":null}
                setTimeout(()=>{ this.showLoader=false;},1000)
            }
            if(this.sect==4){
                var ret=await axios.get("/api/stat");
                this.stat=ret.data;
                console.log(ret.data);
                var chartData=[];
                ret.data.counts.forEach(c=>{
                    chartData.push([c.date,c.count])
                })
                var chart = anychart.area();
                // set the data
                chart.data(chartData/*[
                    ["Chocolate", 5],
                    ["Rhubarb compote", 2],
                    ["Crêpe Suzette", 2],
                    ["American blueberry", 2],
                    ["Buttermilk", 1]
                ]*/);
                // set chart title
                chart.title("Просмотры за 4 часа");
                // set the container element
                chart.container("container");
                // initiate chart display
                var dateScale = anychart.scales.dateTime();
                var dateTicks = dateScale.ticks();
                dateTicks.interval(1);
                var dateMinorTicks = dateScale.minorTicks();
                dateMinorTicks.interval(0, 2);
                chart.xScale(dateScale);

                chart.draw();

                setTimeout(()=>{ this.showLoader=false;},1000)
            }
            if(this.sect==5){
                var ret=await axios.get("/api/spk");
                this.spk=ret.data;
                setTimeout(()=>{ this.showLoader=false;},200)
            }
        }
    },
    mounted:function () {
        this.updateChat();
        setTimeout(()=>{ this.loaded=true; this.sect=0},0)
    }
})