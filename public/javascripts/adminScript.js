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
        codes:[],
        newSpk:{photo:null,f:"",i:"",o:"",position:"", id:0},
        redirect:[],
        newRedirect:{},
    },
    methods:{
        addCode:async function(txt){
            var ret=[];
            var err=false;
            let arrayOfLines = txt.match(/[^\r\n]+/g);
            txt.match(/[^\r\n]+/g).forEach(line=>{
                var item=line.split(";");
                if(item.length>=2){
                    item[0]=item[0].trim();
                    if(isNormalInteger(item[0])) {
                        item[1] = item[1].trim();
                        item[1] = item[1].substr(0, 1).toUpperCase() + item[1].substring(1);
                        var elem={
                            code:item[0],
                            f:item[1],
                            io:item[2],
                            sourceDept:item[3]
                        }
                        ret.push(elem)
                    }
                    else
                        err=true

                }
                else
                    err=true;
            })
            if(err)
                alert("ошибка формата");
            else{
                if(ret.length>0) {
                    console.log("addcode", ret)
                    var str = await axios.post('/api/codes',{users:ret});
                    str.data.forEach(s=>{
                        this.codes.push(s);
                    })
                    alert("коды добавлены!")

                }
            }

        },
        editRedirect:async function(item){
            console.log("edit redirect", item)
            var ret= await axios.post("/api/redirect", item);
            item=ret.data;
        },
        addRedirect:async function(item){
            var ret= await axios.post("/api/redirectAdd", item);
            this.redirect.push(ret.data);
            this.newRedirect={};
        },
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
            if(this.sect==6){
                var ret=await axios.get("/api/redirect");
                this.redirect=ret.data;
                setTimeout(()=>{ this.showLoader=false;},200)
            }
            if(this.sect==7){
                var ret=await axios.get("/api/codes");
                this.codes=ret.data;
                setTimeout(()=>{ this.showLoader=false;},200)
            }
        }
    },
    mounted:function () {
        this.updateChat();
        setTimeout(()=>{ this.loaded=true; this.sect=0},0)
    }
})
function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}