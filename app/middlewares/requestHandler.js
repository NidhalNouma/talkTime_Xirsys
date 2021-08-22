let https = require("https");
let request = function (options) {
  console.log(options);
  return new Promise((resolve, reject) => {
    //make call to Xirsys API, with modified request. Expect and return response to client.
    let h = https.request(options, function (httpres) {
      let str = "";
      httpres.on("data", function (data) {
        str += data;
      });
      //error - returns 500 status and formatted response
      httpres.on("error", function (e) {
        reject({ s: "error", v: "Proxy Request Error" }); //todo - better error
      });
      httpres.on("end", function () {
        console.log("Requested: ", options.path, "\n : ", str);

        let result;
        try {
          result = JSON.parse(str);
        } catch (e) {
          return reject(e);
        }
        if (result.s !== "ok") {
          return reject(result);
        }

        if (options.path.search("_host") >= 0) {
          console.log("options path ==> ", options.path);
          const urlParams = new URLSearchParams(options.path);
          const userId = urlParams.get("k");
          const allUsers = getAllUsers();
          const randomUser = getRandomUser(userId);
          if (userId) {
            if (!randomUser) addUsers(userId);
            if (randomUser) removeUsers(randomUser);
            result.users = allUsers;
            result.randomUser = randomUser;
          }
        }

        resolve(result);
      });
    });
    if (options.method === "PUT" || options.method === "POST") {
      let js = JSON.stringify(options.body);
      options.headers["Content-Length"] = js.length;
      options.headers["Content-Type"] = "application/json";
      h.write(js);
    }
    h.on("timeout", (e) => {
      console.log(e);
      return reject({ s: "error", v: "Proxy Timeout Error" }); //todo - better error
    });
    h.on("error", (e) => {
      console.log(e.message);
      return reject({ s: "error", v: "Proxy Request Error" }); //todo - better error
    });
    h.end();
  });
};

module.exports = function (xirsys) {
  let options = {};
  console.log("RH1");
  return [
    (req, res, next) => {
      if (req.error) {
        next();
      } else {
        //construct options
        options = {
          host: req.PREFERRED_XIRSYS_GATEWAY,
          method: req.method,
          path: req.url,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                xirsys.info.ident + ":" + xirsys.info.secret
              ).toString("base64"),
          },
          timeout: xirsys.gatewayTimeout,
          body: req.body,
        };
        request(options)
          .then((result) => {
            req.success = result;
            next();
          })
          .catch((err) => {
            req.error = err;
            next();
          });
      }
    },
  ];
};

let users = [];

function addUsers(user) {
  users.push(user);
}

function getAllUsers() {
  return users;
}

function removeUsers(userd) {
  const u = users.filter((user) => user !== userd);
  users = u;
}

function getRandomUser(userd) {
  const u = users.filter((user) => user !== userd);
  const randomUser = u[Math.floor(Math.random() * u.length)];
  return randomUser;
}
