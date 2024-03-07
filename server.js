const http = require('http');
const errorHeadle = require('./errorHeadle');
const { v4: uuidv4 } = require('uuid');
//uuidv4(); 
//require('http');
//writeHead

const todos = [];

const requestListenner = (req, res) =>{
  const headers = { 
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };
  let body = "";
  req.on('data', chunk =>{
    body+=chunk;
  });

  if(req.url == "/todos" && req.method == "GET"){
      res.writeHead(200, headers);
      res.write(JSON.stringify({
          "statius": "succes",
          "data": todos,
      }));
      res.end();
    
  }else if(req.url == "/todos" && req.method == "POST"){ //刪除
    req.on('end', ()=>{
      try //亂寫
      {
        const title = JSON.parse(body).title;
        if(title != null){
          let todo ={
            "title": title,
            "id": uuidv4(),
          }
          todos.push(todo);
    
          res.writeHead(200, headers);
          res.write(JSON.stringify({
              "statius": "succes",
              "data": todos,
          }));
          res.end();
        }else{
          errorHeadle(res, 400, "輸入格式錯誤");
        }
      }
      catch(error){
        errorHeadle(res, 400, "輸入格式錯誤");
      }
    });
  }else if(req.url.startsWith("/todos/") && req.method == "POST"){ //修改
    req.on('end', ()=>{
      try //亂寫
      {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(item => item.id == id);

        const title = JSON.parse(body).title;
        if(title != null && index != -1){
   
          todos[index].title = title;
    
          res.writeHead(200, headers);
          res.write(JSON.stringify({
              "statius": "succes",
              "data": todos,
          }));
          res.end();
        }else{
          errorHeadle(res, 400, "輸入格式錯誤");
        }
      }
      catch(error){
        errorHeadle(res, 400, "輸入格式錯誤");
      }
    });

  }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){ //單筆代辦
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id == id);
    if(index != -1){
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
          "statius": "succes",
          "data": todos,
      }));
      res.end();
    }else{
      errorHeadle(res, 400, "輸入格式錯誤");
    }

  }else if(req.url == "/todos" && req.method == "DELETE"){ //刪除
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "statius": "succes",
      "data": todos,
    }));
    res.end();

  }else  if(req.method == "OPTIONS"){ 
    //這個沒有問題，正常會有其他驗證
    res.writeHead(200, headers);
    res.end();
  }else{
    errorHeadle(res, 404, "not found");
  }
}

const server = http.createServer(requestListenner);
server.listen( process.env.PORT || 3005);