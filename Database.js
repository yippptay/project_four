var USE_DB = true;
var mongojs = USE_DB ? require("mongojs").connect("mongodb://heroku_1j9wmpk7:u61qs10ulsq7ef8skrp3ulia22@ds041357.mlab.com:41357/heroku_1j9wmpk7") : null;
var db = USE_DB
  ? mongojs("mongodb://heroku_1j9wmpk7:u61qs10ulsq7ef8skrp3ulia22@ds041357.mlab.com:41357/heroku_1j9wmpk7", ["account", "progress"])
  : null;

Database = {};
Database.isValidPassword = function (data, cb) {
  if (!USE_DB) return cb(true);
  db.account.findOne(
    { username: data.username, password: data.password },
    function (err, res) {
      if (res) cb(true);
      else cb(false);
    }
  );
};
Database.isUsernameTaken = function (data, cb) {
  if (!USE_DB) return cb(false);
  db.account.findOne({ username: data.username }, function (err, res) {
    if (res) cb(true);
    else cb(false);
  });
};
Database.addUser = function (data, cb) {
  if (!USE_DB) return cb();
  db.account.insert(
    { username: data.username, password: data.password },
    function (err) {
      Database.savePlayerProgress(
        { username: data.username, items: [] },
        function () {
          cb();
        }
      );
    }
  );
};
Database.getPlayerProgress = function (username, cb) {
  if (!USE_DB) return cb({ items: [] });
  db.progress.findOne({ username: username }, function (err, res) {
    cb({ items: res.items });
  });
};
Database.savePlayerProgress = function (data, cb) {
  cb = cb || function () {};
  if (!USE_DB) return cb();
  db.progress.update({ username: data.username }, data, { upsert: true }, cb);
};
