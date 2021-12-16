const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riqnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
       const database = client.db('myways');
       const blogCollection = database.collection('blogs');
      
      //get data
    app.get('/blogs', async(req, res) =>{
        const coursor = blogCollection.find({});
        const blogs = await coursor.toArray();
        res.send(blogs);
    });

    app.post('/blogs', async (req, res) => {
        const blog = req.body;
        const result = await blogCollection.insertOne(blog);
        console.log(result);
        res.json(result);
    });

    app.delete('/blogs/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await blogCollection.deleteOne(query);
        console.log('deleting blog with id', result);

        res.json(result)
    })

    app.get('/blogs/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const blog = await blogCollection.findOne(query);
        console.log('', id);
        res.send(blog);
    })

    //update

    app.put('/blogs/:id', async(req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = {_id:ObjectId(id)};
        const options = {upsert:true};
        const updatedoc = {
            $set: {
                heading:updatedUser.heading,
                documents:updatedUser.documents
            }
        };
        const result = await blogCollection.updateOne(filter, updatedoc, options);
        res.json(result);
             
        
     })

    
    
    
    

    

}
finally {
    // await client.close();
}
}

run().catch(console.dir);

app.get('/', (req, res) => {
res.send('Hello myways portal!')
})

app.listen(port, () => {
console.log(`listening at ${port}`)
})