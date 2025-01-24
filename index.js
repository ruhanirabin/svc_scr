const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  const width = parseInt(req.query.width) || 1280;
  const height = parseInt(req.query.height) || 720;
  const filename = `${Date.now()}.png`;
  const filePath = path.join(__dirname, 'public', filename);

  if (!url) {
    return res.status(400).send('URL query parameter is required');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: filePath, fullPage: true });
    await browser.close();

    res.send(filename);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error taking screenshot');
  }
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
