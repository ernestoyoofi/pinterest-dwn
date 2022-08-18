const app = require("express")()
const express = require("express")
const Pinterest = require("./fetch")
const port = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.sendFile(`${require("path").resolve()}/index.html`)
})
app.use("/assets/", express.static(`${require("path").resolve()}/assets/`))
app.get("/api/", (req, res) => {
  const url = req.query.url
  try {
    if(!url) {
      FormaterJSON(res, 400, {
        message: "Please Put Your URL",
        example: {
          ex_1: `${Hostname(req)}/api?url=${encodeURIComponent("https://pin.it/twwDvEW")}`,
          ex_2: `${Hostname(req)}/api?url=${encodeURIComponent("https://id.pinterest.com/pin/603834262554698583/")}`
        }
      })
    } else {
      const startFetch = new Date().getTime()
      Pinterest(url).then(part => {
        FormaterJSON(res, 200,{
          status: 200,
          fetch_time: Math.floor((new Date() - startFetch) / 1000) + " Detik",
          results: part
        })
      })
    }
  } catch(err) {
    res.status(500).send(err.stack)
  }
})

app.get("/api/media", (req, res) => {
  const url = req.query.url
  try {
    if(!url) {
      FormaterJSON(res, 400, {
        message: "Please Put Your URL",
        example: {
          ex_1: `${Hostname(req)}/api/media?url=${encodeURIComponent("https://pin.it/twwDvEW")}`,
          ex_2: `${Hostname(req)}/api/media?url=${encodeURIComponent("https://id.pinterest.com/pin/603834262554698583/")}`
        }
      })
    } else {
      Pinterest(url).then(part => {
        res.redirect(part.preview.url)
      })
    }
  } catch(err) {
    res.status(500).send(err.stack)
  }
})

function FormaterJSON(res, status, json) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Vercel')
  res.setHeader('Create-By', '@ernestoyoofi')
  res.status(status).send(JSON.stringify(json, null, 2))
}
function FormaterFiles(res, path) {
  res.setHeader('X-Powered-By', 'Vercel')
  res.setHeader('Create-By', '@ernestoyoofi')
  res.sendFile(path)
}
function Hostname(req) {
  const protocol = req.headers['x-forwarded-proto']? "https://" : "http://"
  return `${protocol}${req.headers.host || "localhost"+PORT}`
}
app.listen(port, () => console.log(`Server Running In Port ${port}`))
