const http = require("http");
const url = require("url"); // url 모듈 로드
const querystring = require("querystring"); // queryString 모둘 로드

const members = require("./monolithic_members.js"); // 모듈을 로드
const members = require("./monolithic_goods.js");

var server = http
  .createServer((req, res) => {
    var method = req.method; // 메서드를 얻어 옴
    var uri = url.parse(req.url, true);
    var pathname = uri.pathname; // uri를 얻어옴

    if (method === "POST" || method === "PUT") {
      var body = "";

      req.on("data", function (data) {
        body += data;
      });
      req.on("end", function () {
        var params;
        if (req.headers["content-type"] == "application/json") {
          params = JSON.parse(body);
        } else {
          params = querystring.parse(body);
        }
        onRequest(res, method, pathname, params);
      });
    } else {
      // GET 과 DELETE 이면 query 정보를 읽음
      onRequest(res, method, pathname, uri.query);
    }
  })
  .listen(8000);

function onRequest(res, method, pathname, params) {
  switch (pathname) {
    case "/members":
      members.onRequest(res, method, pathname, params, response);
      break;
    case "/goods":
      members.onRequest(res, method, pathname, params, response);
      break;
    case "/purchases":
      members.onRequest(res, method, pathname, params, response);
      break;
    default:
      res.writeHead(404);
      return res.end(); // 정의되지 않은 요청에 404 에러 리턴
  }
}

function response(res, packet) {
  // JSON 형식의 응답
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(packet));
}
