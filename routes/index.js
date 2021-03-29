var express = require('express');
var router = express.Router();
var content=require('./../content')


router.get('/admin', async (req, res, next) =>{
  if(req.session.admin)
    res.render('admin', { title: 'admin' });
  else
    res.render('adminLogin', { title: 'admin' });
});

router.post('/admin', async (req, res, next) =>{
  if(req.body.l!="editor" || req.body.p!="dfczgegrby" )
    res.render('adminlogin', { title: 'admin' });
  else
  {
    req.session.admin=true;
    res.render('admin', { title: 'admin' });
  }
});

router.get('/', async (req, res, next) =>{
  //res.render('work', { title: 'under constaction' });
  res.redirect("/index/ru")

});
router.get('/index/:lang?', async (req, res, next) =>{
  if(!req.params.lang)
    req.params.lang="ru"
  req.params.lang=req.params.lang.toLowerCase();
  if(!(req.params.lang=="ru" || req.params.lang=="en"))
    res.redirect("/index/ru")
  //res.render('work', { title: 'under constaction' });
  var content=await req.knex.select("*").from("t_cbrf_settings").orderBy("id", 'desc')
  var speakers=await req.knex.select("*").from("t_cbrf_spk").orderBy("sortOrder")
  //res.redirect("/login/ru")
  res.render('index', {  lang:req.params.lang, speakers:speakers, site:content[0].site, content:content[0].content });

});

module.exports = router;
