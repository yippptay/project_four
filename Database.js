var USE_DB = true;
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/myGame";
var mongojs = USE_DB ? require("mongojs") : null;
var db = USE_DB
  ? mongojs(MONGO_URI, ["account", "progress"])
  : null;

//account:  {username:string, password:string}
//progress:  {username:string, items:[{id:string,amount:number}]}

Database = {};

Database.isValidPassword = function (data, cb) {
  if (!USE_DB) {
    return cb(true);
  }
  db.account.findOne(
    { username: data.username, password: data.password },
    function (err, res) {
      if (err) {
        console.log("ERROR: " + err);
      }
      if (res) {
        cb(true);
      } else {
        cb(false);
      }
    }
  );
};
Database.isUsernameTaken = function (data, cb) {
  if (!USE_DB) {
    return cb(false);
  }
  db.account.findOne({ username: data.username }, function (err, res) {
    if (err) {
      console.log("ERROR: " + err);
    }
    if (res) {
      cb(true);
    } else {
      cb(false);
    }
  });
};
Database.addUser = function (data, cb) {
  if (!USE_DB) {
    return cb();
  }
  db.account.insert(
    { username: data.username, password: data.password },
    function (err) {
      if (err) {
        console.log("ERROR: " + err);
      }
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
  if (!USE_DB) {
    return cb({ items: [] });
  }
  db.progress.findOne({ username: username }, function (err, res) {
    if (err) {
      console.log("ERROR: " + err);
    }
    cb({ items: [] });
  });
};
Database.savePlayerProgress = function (data, cb) {
  cb = cb || function () {};
  if (!USE_DB) {
    return cb();
  }
  db.progress.update({ username: data.username }, data, { upsert: true }, cb);
};
