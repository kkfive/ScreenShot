const axios = require('axios');
const fs = require('fs');
const path = require('path')
const FormData = require('form-data');
const { LSKY_7BU, KEY, SECRET } = process.env
/**
 * 获取站点列表
 * @returns {Promise<{link:string,name:string,id:string}[]>}
 */
async function getSiteList () {
  const result = await axios.get('https://api.antmoe.com/api/open/website/list?day=0')
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

async function uoload7Bu (name) {

  const data = new FormData();
  data.append('file', fs.createReadStream(path.resolve(__dirname, '..', 'dist', name + '.png')));
  data.append('album_id', '398');
  data.append('permission', 1);

  const result = await axios.post('https://7bu.top/api/v1/upload', data, {
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
  for (const site of siteList) {
    const result = await uoload7Bu(site.name)
    const shot = result.data.links.url
    const shotKey = result.data.key
    await axios.post('https://api.antmoe.com/api/open/manager/website/update', {
      id: site.id,
      shot,
      shotKey,
      key: KEY,
      secret: SECRET,
    })
    console.log(`${site.name}更新成功：${shot}`)

  }
}

main()