import * as functions from "firebase-functions";
import * as path from "path";
import axios, {AxiosResponse} from "axios";
import * as express from "express";
import * as cors from "cors";
const app = express();

app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/:username/:domain", async (req: any, res: any) => {
  const domain = req.params.domain;
  const username = req.params.username;
  const baseUrl = `https://${domain}/api/v1`;
  const accountUrl = `${baseUrl}/accounts/lookup?acct=${username}`;

  axios.get(accountUrl).then((user: AxiosResponse<any>) => {
    axios.get(`${baseUrl}/accounts/${user.data.id}/statuses`)
        .then((statuses: AxiosResponse<any>) => {
          res.render('timeline', {
            username: user.data.username,
            statuses: statuses.data,
          });
        });
  });
});

app.get("/", (req: any, res: any) => {
  res.send("hooray, it works in index");
});

exports.app = functions.https.onRequest(app);
