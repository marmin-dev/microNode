const mysql = require("mysql");
const conn = {
  host: "localhost",
  user: "micro",
  password: "service",
  database: "monolithic",
};
exports.onRequest = function (res, method, pathname, params, cb) {
  switch (method) {
    case "POST":
      return register(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    case "GET":
      return inquiry(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    case "DELETE":
      return unregister(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    default:
      return process.nextTick(cb, res, null); // 정의되지 않은 메서드면 null리턴
  }
};

// 상품 등록 기능
function register(method, pathname, params, cb) {
  var response = {
    errorcode: 0,
    errormessage: "success",
  };
  if (
    params.name == null ||
    params.category == null ||
    params.price == null ||
    params.description == null
  ) {
    //유효성 검사
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      "insert into goods(name, category, price, description) values(?,?,?,?)",
      [params.name, params.category, params.price, params.description],
      (error, result, fields) => {
        if (error) {
          // mysql 에러처리
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    connection.end();
  }
}

// 상품 조회 기능
function inquiry(method, pathname, params, cb) {
  var response = {
    errorcode: 0,
    errormessage: "success",
  };

  var connection = mysql.createConnection(conn);

  connection.connect();

  connection.query("select * from goods", (error, results, fields) => {
    if (error || results.length == 0) {
      response.errorcode = 1;
      // 등록된 상품이 없을 때 처리
      response.errormessage = error ? error : "no data";
    } else {
      response.results = results;
    }
    cb(response);
  });
  connection.end();
}

// 상품 삭제 기능
function unregister(method, pathname, params, cb) {
  var response = {
    errorcode: 0,
    errormessage: "success",
  };
  if (params.id == null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      "delete from goods where id = ?",
      [params.id],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    connection.end();
  }
}
