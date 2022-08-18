import { NotFoundException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';

export const bluedogBabyParsing = async (url) => {
  let browser = null;
  const bluedogBaby = {
    name: '',
    originPrice: '',
    salePrice: '',
    discount: '',
    colorAndSize: [],
    image: [],
    descriptionImage: 1,
  };
  try {
    if (process.env.NODE_ENV === 'development') {
      browser = await puppeteer.launch({ headless: true });
    } else {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
      });
    }
    const page = await browser.newPage();
    // set the viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 50000 });
    // await clickEventHandler();
    const html = await page.content();
    let $ = await cheerio.load(html);
    // console.log($(".infoArea").html());

    // 상품명
    bluedogBaby.name = $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > div.xans-element-.xans-product.xans-product-detaildesign > table > tbody > tr.showBox.xans-record- > td > p',
    ).text();

    //할인율
    bluedogBaby.discount = $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > div.xans-element-.xans-product.xans-product-detaildesign > table > tbody > tr.showBox.xans-record- > td > div.priceBox > span.salePer',
    ).html();

    //할인가격
    bluedogBaby.salePrice = $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > div.xans-element-.xans-product.xans-product-detaildesign > table > tbody > tr.showBox.xans-record- > td > div.priceBox > span.salePrice',
    ).html();

    //원가격
    bluedogBaby.originPrice = $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > div.xans-element-.xans-product.xans-product-detaildesign > table > tbody > tr.showBox.xans-record- > td > div.priceBox > span.originPrice',
    ).text();

    // 상품 컬러 및 사이즈
    $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > table > tbody:nth-child(2) > tr > td > ul > li',
    ).each((index, node) => {
      bluedogBaby.colorAndSize.push({
        color: $(node).find('a > span').text(),
      });
    });
    if (bluedogBaby.colorAndSize.length >= 1) {
      for (let i = 1; i <= bluedogBaby.colorAndSize.length; i++) {
        const size = [];
        await page.click(
          `#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > table > tbody:nth-child(2) > tr > td > ul > li:nth-child(${i}) > a > span`,
        );
        await page.waitForSelector(
          `#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > table > tbody:nth-child(3) > tr > td > ul > li > a > span`,
        );
        const html = await page.content();
        $ = await cheerio.load(html);
        $(
          '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.infoArea > table > tbody:nth-child(3) > tr > td > ul > li',
        ).each((index, node) => {
          size.push($(node).attr('title'));
        });
        bluedogBaby.colorAndSize[i - 1] = {
          ...bluedogBaby.colorAndSize[i - 1],
          size: size,
        };
      }
    }

    // 상품 이미지
    $(
      '#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.xans-element-.xans-product.xans-product-image.imgArea > div.xans-element-.xans-product.xans-product-addimage.listImg > ul > li',
    ).each((_, node) => {
      bluedogBaby.image.push(
        ('https:' + $(node).find('img').attr('src')).toString(),
      );
    });

    // scroll down then screenshot
    await scrollPageToBottom(page, {
      size: 500,
      delay: 250,
    });
    // 정보 스크린샷
    const info = await page.$('#prdDetail > div');
    await info.screenshot({ path: 'static/1.png' });

    await browser.close();

    return bluedogBaby;
  } catch (e) {
    console.log(e);
    throw new NotFoundException();
  } finally {
    await browser.close();
  }
};
