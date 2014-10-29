module.exports = function resolve(deferred, resFn) {
  return function (err, rows) {
    console.log(err, rows);
    if (err) {
      return deferred.reject(err);
    }

    if (resFn) {
      deferred.resolve(resFn.bind(this)(err, rows));
    } else {
      deferred.resolve(rows);  
    }
  };
};