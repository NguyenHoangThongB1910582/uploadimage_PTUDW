const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const router = express.Router();

 

// get 
router.get('/', async (req, res) => {
  const posts = await loadPostCollection();
  res.send(await posts.find({}).toArray());
});

//add
router.post('/', async (req, res) => {
    const posts = await loadPostCollection();
    await posts.insertOne({
    text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
    
});
// xóa
router.delete('/:id', async (req,res) =>{
    const posts = await loadPostCollection();
    await posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadPostCollection(){
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://thongowen:t123456@cluster0.4cushaz.mongodb.net/test',{
            useNewUrlParser: true
        }
    );
    return client.db('vuejs').collection('posts');
}
module.exports = router;