var express = require('express');
var router = express.Router();
var mongoclient=require('mongodb').MongoClient
var objectId = require("mongodb").ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
let user = req.session.user

 mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',async(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      if(user){
        
        let uid =user._id
        let result= await client.db('todo').collection('list').find({id:uid}).toArray()
        console.log(result);
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        res.render('index',{result,user}) 
      }else{
      let result= await client.db('todo').collection('list').find().toArray()
      console.log(result);
      res.render('index',{result})
      }

      
    }
  })

  
});
router.post('/add',(req,res)=>{
  mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      client.db('todo').collection('list').insertOne(req.body).then((result)=>{
        console.log(req.body);
        res.redirect('/')
      })
    }
  })
}),

router.get('/del/:id',(req,res)=>{
  let todoid = req.params.id;
mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      client.db('todo').collection('list').deleteOne({_id: objectId(todoid)}).then((result)=>{
        console.log(result);
        res.redirect('/')
      })
    }
  })
}),
router.post('/edt/:id',(req,res)=>{
  let todoid = req.params.id;
  let todo =req.body.content
  mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      client.db('todo').collection('list').updateOne({_id: objectId(todoid)},{
            $set: {
              content:todo
            }
          }).then((result)=>{
        console.log(result);
        res.redirect('/')
      })
    }
  })
}),

router.get('/log',(req,res)=>{

  res.render('login')
}),
router.post('/log',(req,res)=>{
  console.log(req.body);
  let email=req.body.email
  let psword=req.body.psword
 
  mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',async(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(email);
      let data=await client.db('todo').collection('user').findOne({email:email})
      console.log(data);
      let emailid= data.email
      if(data){
        ps=data.psword
        if(psword===ps){
          req.session.user = data
          req.session.userloggedIn = true;
          res.redirect('/')
        }else{
          res.send('wrpng password')
        }
      }else{
        res.send('wrong email')
      }
    }
  })
  

}),
router.post('/sig',(req,res)=>{
  console.log(req.body);
  mongoclient.connect('mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin',(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      client.db('todo').collection('user').insertOne(req.body).then((result)=>{
        console.log(result);
        
      })
    }
  })
  res.redirect('/')
}),
router.get("/logout", (req, res) => {
    req.session.user = null
    req.session.userloggedIn = false
    res.redirect("/");
});

module.exports = router;
