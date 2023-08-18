"use strict"; // strict 모드 사용

const net = require("net");

class tcpClient {
  // 클래스 선언
  constructor(host, port, onCreate, onRead, onEnd, onError) {
    // 생성자
    this.options = {
      host: host,
      port: port,
    };
    this.onCreate = onCreate;
    this.onRead = onRead;
    this.onEnd = onEnd;
    this.onError = onError;
  }
  connect() {
    //  접속 처리함수
    this.client = net.connect(this.options, () => {
      if (this.onCreate) {
        this.onCreate(this.options); // 접속 완료 이벤트 콜백
      }
    });
    this.client.on("data", (data) => {
      var sz = this.merge ? this.merge + data.toString() : data.toString();
      var arr = sz.split("⑀");
      for (var n in arr) {
        if (sz.charAt(sz.length - 1) != "⑀" && n == arr.length - 1) {
          this.merge = arr[n];
          break;
        } else if (arr[n] == "") {
          break;
        } else {
          this.onRead(this.options, JSON.parse(arr[n]));
        }
      }
    });
    this.client.on("close", () => {
      if (this.onEnd) {
        this.onEnd(this.options);
      }
    });
    this.client.on("error", (err) => {
      if (this.onError) {
        this.onError(this.options, err);
      }
    });
  }
  write(packet) {
    this.client.write(JSON.stringify(packet) + "⑀");
  }
}

module.exports = tcpClient;
