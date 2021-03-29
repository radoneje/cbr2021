var express = require('express');
var moment= require('moment');
var fs= require('fs');
var path= require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(true);
});
function adminLogin(req, res, next) {
  console.log("al", req.session)
  if(req.session.admin)
    return next();
  res.sendStatus(401);
}
router.post('/adminContent' ,adminLogin ,async(req, res, next)=> {
  var row=await req.knex.select("*").from("t_cbrf_settings").orderBy("id", 'desc');
  var id=row[0].id;
  row=await req.knex("t_cbrf_settings").insert({site:JSON.stringify(row[0].site), content:JSON.stringify(row[0].content), speakers:JSON.stringify(row[0].speakers)},"*").where({id:id});
  var ret=await req.knex("t_cbrf_settings").update({content:req.body.data},"*").where({id:row[0].id})
  res.json(ret[0]);

});


router.post('/adminSpeakers' ,adminLogin ,async(req, res, next)=> {
  var row=await req.knex.select("*").from("t_cbrf_settings").orderBy("id", 'desc');
  var id=row[0].id;
  row=await req.knex("t_cbrf_settings").insert({site:JSON.stringify(row[0].site), content:JSON.stringify(row[0].content), speakers:JSON.stringify(row[0].speakers)},"*").where({id:id});
  var ret=await req.knex("t_cbrf_settings").update({speakers:req.body.data},"*").where({id:row[0].id})
  res.json(ret[0]);

});
router.post('/adminSite' ,adminLogin ,async(req, res, next)=> {

  var row=await req.knex.select("*").from("t_cbrf_settings").orderBy("id", 'desc');
  var id=row[0].id;
  row=await req.knex("t_cbrf_settings").insert({site:JSON.stringify(row[0].site), content:JSON.stringify(row[0].content), speakers:JSON.stringify(row[0].speakers)},"*").where({id:id});
  var ret=await req.knex("t_cbrf_settings").update({site:req.body.data},"*").where({id:row[0].id});
  res.json(ret[0]);

});

router.get('/content' , adminLogin,async(req, res, next)=> {

  var ret=await req.knex.select("*").from("t_cbrf_settings").orderBy("id", 'desc')
  if(ret.length==0)
    ret=await req.knex("t_cbrf_settings").insert({},"*")
  res.json(ret[0]);
});

router.get('/regUser', adminLogin ,async(req, res, next)=> {
  var ret=await req.knex.select("*").from("t_cbrf_users").orderBy("id", 'desc')
  ret.forEach(u=>{
    u.online=(req.counter.filter(user=>{return user.id==u.id}).length>0);
  })
  res.json(ret);
});

router.post("/chat",async(req, res, next)=> {
  if(!req.body.text)
    return res.sendStatus(404)
  if(!req.body.text.length>1200)
    return res.sendStatus(404)
  if(!req.body.userid)
    return res.sendStatus(404)

  var ret=await req.knex("t_cbrf_chat").insert({text:req.body.text, userid:req.body.userid, date:new Date()}, "*")
  ret=await req.knex.select("*").from("v_cbrf_chat").where({id:ret[0].id})

  res.json(ret[0]);
});
router.post("/q",async(req, res, next)=> {
  if(!req.body.text)
    return res.sendStatus(404)
  if(!req.body.text.length>1200)
    return res.sendStatus(404)
  if(!req.body.userid)
    return res.sendStatus(404)

  var ret=await req.knex("t_cbrf_q").insert({text:req.body.text, userid:req.body.userid, date:new Date()}, "*")
  ret=await req.knex.select("*").from("v_cbrf_q").where({id:ret[0].id})

  res.json(ret[0]);
});
router.get("/chat",async(req, res, next)=> {
  var ret={};
  ret.q=await req.knex.select("*").from("v_cbrf_q").orderBy("id");;
  ret.chat=await req.knex.select("*").from("v_cbrf_chat").orderBy("id");
  return res.json(ret);
});
router.delete("/chat/:id",async(req, res, next)=> {
  var ret =await req.knex("t_cbrf_chat").update({isDeleted:true}, "*").where({id:req.params.id})
  return res.json({id:req.params.id});
});
router.delete("/q/:id",async(req, res, next)=> {
  var ret =await req.knex("t_cbrf_q").update({isDeleted:true}, "*").where({id:req.params.id})
  return res.json({id:req.params.id});
});

router.post("/chatToQ",async(req, res, next)=> {

  console.log("chatToQ", req.body)
  var ret =await req.knex("t_cbrf_q").insert({text:req.body.text, userid:req.body.userid, date:req.body.date, isDeleted:false}, "*");

  return res.json(ret[0]);
});



router.get('/stat', adminLogin ,async(req, res, next)=> {

  var ret={};
  ret.now=req.counter.length;
  ret.loginsCount=(await req.knex.select("*").from("t_cbrf_logins")).length;
  ret.counts= await req.knex.select("*").from("t_cbrf_count").where('date','>=', moment().add(-4, 'hours').toISOString())
  res.json(ret);
});
router.get('/spk', adminLogin ,async(req, res, next)=> {
  var ret= await req.knex.select("*").from("t_cbrf_spk").where({isDeleted:false}).orderBy("sortOrder")
  res.json(ret);
});
router.delete('/spk/:id', adminLogin ,async(req, res, next)=> {
  await req.knex("t_cbrf_spk").where({id:req.params.id}).delete();
  res.json(req.params.id);
});
router.post('/spk/', adminLogin ,async(req, res, next)=> {

  var id=req.body.id;
  delete req.body.id;
  var ret=await req.knex("t_cbrf_spk").update(req.body, "*").where({id:id})
  res.json(ret[0]);
});
router.get('/redirect', adminLogin ,async(req, res, next)=> {
  var ret=await req.knex.select("*").from("t_cbrf_redirect").orderBy("id")
  res.json(ret);
});

router.post('/redirect', adminLogin ,async(req, res, next)=> {
 var id=req.body.id;
 console.log("dd", req.body)
 delete req.body.id;
  var ret=await req.knex("t_cbrf_redirect").update({value:req.body.value}, "*").where({id:id});
  res.json(ret[0]);
});
router.post('/redirectAdd', adminLogin ,async(req, res, next)=> {
  var ret=await req.knex("t_cbrf_redirect").insert({value:req.body.value}, "*");
  res.json(ret[0]);
});

router.post('/repositionSpk/', adminLogin ,async(req, res, next)=> {

  var id=req.body.id;
  delete req.body.id;
  await req.knex("t_cbrf_spk").update({sortOrder:req.body.sortOrder}, "*").where({id:id});
  var ret=await req.knex.select("*").from("t_cbrf_spk").orderBy("sortOrder");
  var i=0;
  for(var item  of ret){
    i=i+10;
    await req.knex("t_cbrf_spk").update({sortOrder:i}).where({id:item.id});
  }

  res.json(ret);
});



router.post('/spkImage', adminLogin ,async(req, res, next)=> {
  if(!req.files["image"])
    return res.sendStatus(404)
  //var ret= await req.knex.select("*").from("t_cbrf_spk").where({isDeleted:false}).orderBy("sortOrder")

  var filename=path.basename(req.files.image.path)
  var pathname=path.join(__dirname, '../public/images/spk/'+filename)
  fs.renameSync( req.files.image.path, pathname )
  res.json("/images/spk/"+filename);
});
router.post('/addSpk', adminLogin ,async(req, res, next)=> {

  delete req.body.id;
  req.body.sortOrder=(await req.knex("t_cbrf_spk").max("sortOrder"));
  req.body.sortOrder=req.body.sortOrder?req.body.sortOrder[0].max:0;
  req.body.sortOrder=req.body.sortOrder+10;

  var ret=await req.knex("t_cbrf_spk").insert(req.body, "*");
  res.json(ret[0]);

})




router.post('/regUser', async(req, res, next)=> {

  var usr = await req.knex("t_cbrf_users").insert({
    f: req.body.user.f,
    i: req.body.user.i,
    o: req.body.user.o,
    email: req.body.user.email.toLowerCase(),
    date: new Date(),
  }, "*")
  res.json(usr[0]);
});
router.post('/loginUser', async(req, res, next)=> {
  console.log("loginUser");
  var usrs = await req.knex.select("*").from("t_cbrf_users").where({email:req.body.user.email.toLowerCase()});
  if(usrs.length==0)
    return res.json(false);
  return res.json(usrs[0]);
})
router.post('/aliveUser', async(req, res, next)=> {
  console.log("aliveUser", req.body)
  if(req.counter.filter(c=>{return c.id==req.body.id}).length==0)
  {
    req.counter.push({id:req.body.id, date:moment().unix()});
    await req.knex("t_cbrf_count").insert({count:req.counter.length, date:new Date()})
    await req.knex("t_cbrf_logins").insert({
      userid:req.body.id,
      date: new Date(),
    })

  }
  else{
    req.counter.forEach(c=>{
      if(c.id==req.body.id)
        c.date=moment().unix()
    })
  }
  res.json({
    userid:req.body.id,
    date: new Date(),
  })
})
router.get('/count', function(req, res, next) {
  res.json(req.counter.length);
});


module.exports = router;
