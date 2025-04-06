import axios from "axios";

var options = {
  method: "POST",
  url: "https://oauth2.googleapis.com/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  data: new URLSearchParams({
    grant_type: "authorization_code",
    client_id:
      "1051887930726-9q0mc7719efceosn00on9ej21tel61dk.apps.googleusercontent.com",
    client_secret: "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",
    code: "4/0Ab_5qlmyh22m-X9OJLd1_3ymCQ8-8X2bpzgP_2uTIgY5liPPN218_wSJ_jikFtTCkLUgDg",
    redirect_uri: "https://nsd5xj-5173.csb.app/auth/callback",
  }),
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
