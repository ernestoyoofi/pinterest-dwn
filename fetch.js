const axios = require("axios")
const cheerio = require("cheerio")

/**
 * @name variables-configuration
 * @description Configuration For Scraping Downloader
 */
const config = {
  PINTEREST_BASE: "https://www.expertsphp.com/facebook-video-downloader.php", // POST { pinterest-downloader }
}

/**
 * @name pinterest-downloader
 * @description Put Your URL Pintrest Shortlink Or Original Links
 */
function Pinterest(url) {
  return new Promise((resolve, reject) => {
    let params = new URLSearchParams()
    params.append("url", url)
    axios.post(config.PINTEREST_BASE, params).then(res => {
      let other = []
      const html = cheerio.load(res.data)
      html("#main table.table tbody tr").each((i, el) => {
        other.push({
          nimetype: html("td:nth-of-type(3) strong", el).text()?.split(" ")[0]?.toLowerCase(),
          size: html("td:nth-of-type(2) strong", el).text(),
          url: html("td:nth-of-type(1) a", el).attr("href")
        })
      })
      const perp = html("#main #showdata .col-sm-12 video").attr("src")
      if(!perp) {
        other.splice(0, 1)
      }
      const type = other[0].nimetype.split("/")[0]
      const returnresult = {
        url: encodeURI(url),
        preview: {
          url: perp || other[0].url,
          type
        },
        other
      }
      resolve(returnresult)
    }).catch(err => {
      reject(err.stack)
    })
  })
}

module.exports = Pinterest