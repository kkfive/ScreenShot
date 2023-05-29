const axios = require('axios');
const fs = require('fs');
const path = require('path')
const { LSKY_7BU, KEY, SECRET } = process.env
/**
 * 获取站点列表
 * @returns {Promise<{link:string,name:string,id:string}[]>}
 */
async function getSiteList () {
  const result = await axios.get('https://api.antmoe.com/api/open/website/list?day=7')
  return result.data.data
}


async function getShot (url, name) {
  return new Promise(async (resolve) => {
    const response = await axios.get(`https://image.thum.io/get/width/1024/crop/768/${url}`, {
      responseType: 'arraybuffer'
    })

    if (response.status === 200) {
      fs.writeFile(path.resolve(__dirname, '..', 'dist', name + '.png'), response.data, function (err) {
        resolve()
        if (err) return console.log(`${name}保存失败：${err.message}`);
        console.log(`${name}保存成功：${url}`);
      });
    }
  })

}

async function uoload7Bu () {
 const result = await axios.post('https://7bu.top/api/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: LSKY_7BU,
    },
  })
  return result.data;
}


async function main () {
  const siteList = await getSiteList()
  await Promise.all(siteList.map(item => getShot(item.link, item.name)))
}

main()