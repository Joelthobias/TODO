var express = require('express');
var router = express.Router();
var mongoclient=require('mongodb').MongoClient
var objectId = require("mongodb").ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
 mongoclient.connect('mongodb://localhost:27017',async(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      let result= await client.db('todo').collection('list').find().toArray()
      res.render('index',{result})
      console.log(result);
    }
  })

  
});
router.post('/add',(req,res)=>{
  mongoclient.connect('mongodb://localhost:27017',(err,client)=>{
    if(err){
      console.log(err);
    }
    else{
      client.db('todo').collection('list').insertOne(req.body).then((result)=>{
        console.log(result);
        res.redirect('/')
      })
    }
  })
}),

router.get('/del/:id',(req,res)=>{
  let todoid = req.params.id;
mongoclient.connect('mongodb://localhost:27017',(err,client)=>{
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
  mongoclient.connect('mongodb://localhost:27017',(err,client)=>{
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
})

module.exports = router;
