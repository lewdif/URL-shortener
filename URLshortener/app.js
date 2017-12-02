var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var urlCodeSet = require('./urlCodeSet.js');
var validUrl = require('valid-url');
var reqProm = require('request-promise');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'qkek4619',
  database : 'URL_CONTAINER'
});
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index.jade');
});

// longURL을 받아 DB를 통해 저장된 값인지 확인 한 후
// DB에 저장되어 있다면 저장된 shortURL을 전달합니다.
// 반면에 데이터가 겁색되지 않은경우, url_data 테이블에 새로운 튜플을 추가해 준 후
// 추가된 튜플의 shortURL을 전달합니다.
app.post('/make/shorter', (req, res) => {
  var longURL = req.body.url;   // 입력받은 long URL
  var shortURL = '';            // 전달해줄 short URL
  var numRows = 0;              // DB url_data에 저장돤 튜플의 개수
  var baseNum = 1000;           // id의 기본값 (AUTO_INCREMENT의 초기값)

  var sqlSearch = 'SELECT * FROM url_data WHERE longURL = "' + longURL + '"';
  var sqlInsert = 'INSERT INTO url_data (longURL, shortURL) VALUES(?, ?)';
  var sqlCount = 'SELECT * FROM url_data';

  connection.query(sqlCount, (err, url_data, fields) => {
    if(err) {
      console.log(err);
    }

    numRows = url_data.length;
  });

  reqProm('http://' + longURL)
      .then(function (htmlString) {
        // 정상적인 URL이 입력된 경우
        connection.query(sqlSearch, (err, url_data, fields) => {
          if(err) {
            console.log(err);
          }

          if(url_data[0]) {
            // SELECT문을 통해 데이터를 찾은 경우
            shortURL = 'http://localhost:3000/' + url_data[0].shortURL;
          }
          else {
            // 데이터가 존재하지 않는 경우
            shortURL = urlCodeSet.encode(baseNum + numRows);

            connection.query(sqlInsert, [longURL, shortURL], (err, result, fields) => {
              // 새로 입력된 데이터를 추가
              if(err) {
                console.log(err);
              }
            });

            shortURL = 'http://localhost:3000/' + shortURL;
          }
          res.send({'shortURL': shortURL});
        });
      })
      .catch(function (err) {
        // 입력된 URL이 유효하지 않은 경우
        shortURL = 'URL_FAILURE!'     // 62진수에 사용되는 문자만으로 이루어지지 않도록 조심
        res.send({'shortURL': shortURL});
      });
});

// redirect를 진행합니다.
app.get('/:id', (req, res) => {
  var shortURL = req.params.id; // id값을 담는 변수
  var longURL = '';             // DB를 통해 얻어진 longURL을 담는 변수
  var sqlSearch = 'SELECT * FROM url_data WHERE shortURL = "' + shortURL + '"';

  connection.query(sqlSearch, (err, url_data, fields) => {
    if(err) {
      console.log(err);
    }

    if(url_data[0]) {
      // 데이터가 존재하면 해당하는 longURL로 redirect를 진행합니다.
      longURL = url_data[0].longURL;
      res.redirect('http://' + longURL);
    }
    else {
      // 데이터가 존재하지 않는다면 localhost로 redirect를 진행합니다.
      console.log('data does not exists!');
      res.redirect('http://localhost:3000/');
    }
  });
});

app.listen(3000, () => {
    console.log('listening on 3000 port!');
});
