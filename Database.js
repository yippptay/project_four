var USE_DB = true;
var mongoose = USE_DB ? require("mongoose") : null;
var db = USE_DB ? mongoose.connection : null;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/myGame";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

db.on("open", () => {});

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
