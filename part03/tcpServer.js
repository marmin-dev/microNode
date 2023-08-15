var net = require("net"); // net 모듈 로드

var server = net.createServer((socket) => {
  // TCP 서버 생성
  console.log("hello node");
});

server.on("error", (err) => {
  //네트워크 에러 처리
  console.log(err);
});

server.listen(9000, () => {
  // 9000 번 포트로 리슨
  console.log("listen", server.address()); // 리슨이 가능해지면 화면에 출력
});
