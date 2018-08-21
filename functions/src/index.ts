import * as functions from 'firebase-functions'
import * as puppeteer from 'puppeteer'
import * as cors from 'cors'
const corsHandler = cors({origin: true})

async function getBrowserPage() {
  const browser = await puppeteer.launch({args: ['--no-sandbox']})
  return browser.newPage()
}

const addHttp = (url) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    return "https://" + url
  }
  return url
}

export const screenshot = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const url = req.query.url
    const page = await getBrowserPage()

    if (!url) {
      res.send('No URL was provided as a query: ?url=google.com')
    }

    await page.goto(addHttp(url))
    const image = await page.screenshot({
      encoding: 'base64'
    })

    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.json({ screenshot: image })
  })
})



