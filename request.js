async function gogo() {
  let password = "123456";
  const request = require('request');
  const shopify_user = {
    "customer": {
      "email": "222222@qq.com",
      "password": password,
      "password_confirmation": password,
      "send_email_welcome": false
    }
  };

  const headers = {
    'X-Shopify-Access-Token': "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",
  };

  const shopifyUrl = `zyfirst.myshopify.com`;
  const shopifyCustomersUrl = `https://${shopifyUrl}/admin/api/2022-04/customers`;
  let method = 'POST';
  let url = shopifyCustomersUrl + '.json';

  function asyncRequest(url, headers) {
    return new Promise(function (resolve, reject) {
      request({ url, headers }, function (error, res, body) {
        if (!error && res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(error);
        }
      });
    });
  }

  let existingCustomer = null;

  // 发送异步请求，检查客户是否已经存在
  let searchUrl = shopifyCustomersUrl + `/search.json?query=email:222222@qq.com`;
  let searchResult = await asyncRequest(searchUrl, headers);
  console.log("searchResult",  searchResult);

  if (searchResult.customers && searchResult.customers.length) {
    existingCustomer = searchResult.customers.find(c => c.email === "222222@qq.com");
  }

  // 如果客户存在，则把Api改为更新客户的方法，PUT就是客户的方法
  if (existingCustomer) {
    method = 'PUT';
    url = shopifyCustomersUrl + '/' + existingCustomer.id + '.json';
  }

  // 调用Shopify adminAPI 创建客户
  request({
    headers,
    method,
    url,
    json: shopify_user
  }, function (error, response, body) {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    if (error) {
      callback(error);
    } else {
      if (body.customer) {
        console.log('customer:', body.customer);
      }
    }
  });
}

gogo();
