const axios = require('axios');
const fs = require('fs');
const path = require('path')
/**
 * 获取站点列表
 * @returns Promise<any[]>
 */
function getSiteList () {
  return new Promise(resolve => {
    resolve([
      {
        site: 'https://www.imlete.cn',
        name: 'lete'
      }
    ])
  })
}


async function getShot (url, name) {

  const response = await axios.get(`https://image.thum.io/get/width/1024/crop/768/${url}`, {
    responseType: 'arraybuffer'
  })

  if (response.status === 200) {
    fs.writeFile(path.resolve(__dirname,'..','dist',name+'.png'), response.data, function (err) {
      if (err) return console.log(`${name}保存失败：${err}`);
      console.log(`${name}保存成功：${url}`);
    });
  }

}

async function main () {
   const siteList = await getSiteList()
   siteList.forEach(item => {
     getShot(item.site, item.name)
   })
}

main()