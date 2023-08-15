function func(callback) {
  // nextTick 을 사용하여 인자값으로 전달된 callback 함수 호출
  process.nextTick(callback, "callback!");
}

try {
  func((param) => {
    a.a = 0; // 의도적으로 예외 발생
  });
} catch (e) {
  console.log("exception"); // 같은 스레드일 경우 호출
}
