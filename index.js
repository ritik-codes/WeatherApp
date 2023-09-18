import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
const port = 3000;

// Configure dotenv package

dotenv.config();

const API_URL = "https://api.openweathermap.org";
const API_key = `${process.env.API_Key}`;

app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
  res.render("index.ejs",{city:"", temp:"", status:"", main:"", pressure:"", humidity:"", wind:"", visibility:""});
});

app.post("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/data/2.5/weather", {
      params: {
        q: req.body.city ,
        units: "metric",
        appid: API_key,
      },
    });
    res.render("index.ejs", {
      temp: Math.floor(result.data.main.temp),
      status: result.data.weather[0].description,
      city: req.body.city.toUpperCase(),
      main: result.data.weather[0].main,
      pressure: result.data.main.pressure,
      humidity: result.data.main.humidity,
      wind: result.data.wind.speed,
      visibility: result.data.visibility
     });

  } catch (error) {
    res.render("index.ejs", {
      error: "No such Location found"
    })
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
