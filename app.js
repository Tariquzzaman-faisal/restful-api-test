//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true,  useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////TARGETTING ALL ARTICLES/////////////////////////////////////////////////////
app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    const title = req.body.title;
    const content = req.body.content;
    const newArticle = new Article({
        title: title,
        content: content
    });
    newArticle.save(function(err){
        if(!err){
            console.log("Saved successfuly!");
        } else {
            console.log(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Deleted all articles successfully!");
        } else {
            res.send(err);
        }
    });
});

//////////////////////////////////////////////////////TARGETTING A SPECIFIC ARTICLE///////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles were found!");
        }
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Article updated successfully!");
            } else {
                res.send(err);
            }
        }
    );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Patched Successfully!");
            } else {
                res.send(err);
            }
        }
    );
})



.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Article deleted successfully");
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
