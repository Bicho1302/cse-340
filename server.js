/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const path = require("path")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")

const app = express()
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities") // ✅ add once, use everywhere


/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(flash())

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice")
  next()
})

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/inv", inventoryRoute)

// (Optional) Home route if your staticRoutes doesn't handle it
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * 404 Handler (must be after routes)
 *************************/
app.use(async (req, res) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: 404,
    nav,
    message: "Sorry, the page you requested was not found.",
  })
})

/* ***********************
 * Error Handler (must be after 404, and has 4 params)
 *************************/
app.use(async (err, req, res, next) => {
  console.error(err.stack)

  const nav = await utilities.getNav()
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 500,
    nav,
    message: err.message,
  })
})

/* ***********************
 * Local Server Information (listen LAST)
 *************************/
const port = process.env.PORT || 8080
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
