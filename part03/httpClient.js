const http = require("http"); // http 모듈 로드

var options = {
  // 호출 페이지 정보 설정
  host: "127.0.0.1",
  port: 8000,
  path: "/",
};

var req = http.request(options, (res) => {
  // 페이지 호출
  var data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    // 수신 완료시 화면에 출력
    console.log(data);
  });
});

req.end(); // 명시적으로 종료
