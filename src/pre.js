const axios = require('axios');
const fs = require('fs');
const path = require('path')
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
    const response = await axios.get(`https://s0.wp.com/mshots/v1/${url}`, {
      responseType: 'arraybuffer'
    })
    const buffer = response.data
    if (buffer) {
      fs.writeFile(path.resolve(__dirname, '..', 'dist', name + '.png'), buffer, function (err) {
        resolve()
        if (err) return console.log(`${name}保存失败：${err.message}`);
        console.log(`${name}保存成功：${url}`);
      });
    }
  })

}


async function main () {
  const siteList = await getSiteList()
  await Promise.all(siteList.map(item => getShot(item.link, item.name)))
}

main()