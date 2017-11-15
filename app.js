var express = require('express');
var app = express();
require('dotenv').config();
var mongo = require('mongodb').MongoClient;
var appURL = process.env.APP_URL;
var subscriptionKey = process.env.API_KEY;
var multer  = require('multer');
var upload = multer();

app.set('view engine', 'pug');
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname +'/views');

app.get("/", function(req, res) {
  res.render('index', {
    title: 'File Metadata',
    abstract: '基本API使用：File Metadata微服务',
    stories: {
      0: '可以通过提交一个 FormData 对象来上传文件。',
      1: '上传一个文件后，会收到一个 JSON 格式的响应，显示文件的大小。'
    },
    usage: {
      0: '访问页面 ' + appURL + '/upload 来上传文件'
    },
    result: {
      0: '[\n\
  {\n\
    \"url\": \"http://epilepsyu.com/wp-content/uploads/2013/03/dog-open-mouth.jpg\",\n\
    \"snippet\": \"Do you have a dog with epilepsy? - EpilepsyU\",\n\
    \"thumbnail\": \"https://tse4.mm.bing.net/th?id=OIP.TkkEm-k2O0C2QS8udUlLhQEcEs&pid=Api\",\n\
    \"context\": \"http://epilepsyu.com/blog/do-you-have-a-dog-with-epilepsy/\"\n\
  },\n\
  {\n\
    \"url\": \"http://thehappypuppysite.com/wp-content/uploads/2016/02/steal3.jpg\",\n\
    \"snippet\": \"How To Stop Your Dog Stealing - The Happy Puppy Site\",\n\
    \"thumbnail\": \"https://tse2.mm.bing.net/th?id=OIP.vjRYcVfxIpGOq0kFkPlohwEsC4&pid=Api\",\n\
    \"context\": \"http://thehappypuppysite.com/how-to-stop-your-dog-stealing/\"\n\
  }\n\
]'
    }
  });
});

app.get("/upload", function(req, res) {
  res.render('upload');
});

mongo.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/FileMetadataResults", function(err, db) {
  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB');
  }
    
  app.post('/file', upload.single('userFile'), function(req, res) {
    var fileStatus = {
      name : req.file.originalname,
      size : req.file.size,
      encoding : req.file.encoding,
      mimetype : req.file.mimetype
    };
    res.send(JSON.stringify(fileStatus));
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});