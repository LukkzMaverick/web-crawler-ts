import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

const axiosInstance = axios.create({
  withCredentials: true,
});

let cookies: string[] = [];

@Injectable()
export class CronService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    this.monitorProduct();
  }

  async monitorProduct() {
    try {
      const response = await this.requestWithCookies(
        'https://telfar.net/collections/telfar-track/products/cropped-track-jacket-oxblood',
        'get',
      );
      const content = response.data;
      console.log(content);
      if (this.isProductAvailable(content)) {
        const checkoutLink = await this.addProductToCart();
        console.log('Checkout Link:', checkoutLink);
      } else {
        console.log('Product not available');
      }
    } catch (error) {
      console.log(error.response.data);
      console.error('Error monitoring product:', error);
    }
  }

  isProductAvailable(content: string): boolean {
    const $ = cheerio.load(content);
    const isAvailable = $('#AddToCartText').length > 0;
    return isAvailable;
  }

  async addProductToCart() {
    const form = new FormData();
    form.append('form_type', 'product');
    form.append('utf8', '✓');
    form.append('id', '40346032078947');
    form.append('quantity', '1');
    form.append('product-id', '6912937623651');
    await this.requestWithCookies(
      'https://telfar.net/cart/add.js',
      'post',
      form,
    );
    return 'https://telfar.net/checkout';
  }

  async requestWithCookies(
    url: string,
    method: 'get' | 'post' = 'get',
    data?: any,
  ) {
    const response = await axiosInstance({
      url,
      method,
      headers: {
        Cookie: cookies.join('; '),
      },
      data,
    });

    const newCookies = response.headers['set-cookie'];
    if (newCookies) cookies = newCookies;

    return response;
  }
}
