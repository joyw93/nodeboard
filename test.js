const condition = true;
const promise = new Promise((resolve, reject) => {
    if (condition) {
        resolve('성공');
    } else {
        reject('실패');
    }
});

promise
  .then(console.log)
  .catch(console.log)
  .finally(() => {
      console.log('무조건');
  });

console.log('딴짓')