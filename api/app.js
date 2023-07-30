const express= require('express');
const app= express();

const { mongoose }=require('./db/mongoose');

const bodyparser= require('body-parser');

//load mongose modules
const {List,Task} = require('./db/models');

app.use(bodyparser.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/lists', async (req, res) => {
    try {
      const lists = await List.find({}).lean();
      res.send(lists);
    } catch (error) {
      res.status(500).send('Error while fetching lists.');
    }
  });
  

app.post('/lists',(req,res)=>{
    // create list
    let title = req.body.title;
    
    let newList= new List({
        title
    })
    newList.save().then((listDoc)=>{
        res.send(listDoc);
    })

})


app.patch('/lists/:id',(req,res)=>{
    //update a list with new values
    List.findOneAndUpdate({_id: req.params.id},{
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    });

})

app.delete('/lists/:id',(req,res)=>{
    // delete a list
    List.findOneAndRemove({_id: req.params.id}).then((removedListDoc)=>{
        res.send(removedListDoc);
    })

})

// Now here to work on tasks.
app.get('/lists/:listId/tasks',(req,res)=>{
    Task.find({_listId: req.params.listId}).then((tasks)=>{
        res.send(tasks);
    })
})


app.get('/lists/:listId/tasks/:TaskId',(req,res)=>{
    Task.find({_listId: req.params.listId,_id: req.params.TaskId}).then((tasks)=>{
        res.send(tasks);
    })
})

app.post('/lists/:listId/tasks',(req,res)=>{

    let _newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    _newTask.save().then((newTaskDoc)=>{
        res.send(newTaskDoc);   
    })
  
})



app.patch('/lists/:listId/tasks/:taskId',(req,res)=>{

    Task.findOneAndUpdate({_id: req.params.taskId , _listId: req.params.listId},{
        $set: req.body

    }).then(()=>{
        res.sendStatus(200);
    });
})


app.delete('/lists/:listId/tasks/:taskId',(req,res)=>{

    Task.findOneAndRemove({_id: req.params.taskId , _listId: req.params.listId}
        ).then((removedTaskDoc)=>{
        res.send(removedTaskDoc);
    });
})





app.listen(3000,()=>{
    console.log("app is listening ");
})