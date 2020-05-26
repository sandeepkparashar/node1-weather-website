const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const port = process.env.PORT || 3000;

app.set("views", viewPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Sandeep Parashar" });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us Page",
    name: "Sndeep Kumar",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    name: "Sandeep Parashar",
    helpText: "Please post your queries here.",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Please supply address" });
  }
  const address = req.query.address;
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        location,
        forecastData,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found.",
    title: "Help 404 page",
    name: "Sandeep",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "Page not found.",
    title: "404 Page",
    name: "Sandeep",
  });
});

app.listen(port, () => {
  console.log("server is up on port " + port);
});
