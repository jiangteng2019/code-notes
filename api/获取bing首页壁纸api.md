## 获取bing首页壁纸api

官方的api

https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN

参数 | 值
---| ---
format（非必需）| 返回数据格式，不存在返回xml格式 js (返回json格式)xml（返回xml格式）
idx  (非必需) | 请求图片截止天数 0:今天,-1:截止中明天 （预准备的）,1: 截止至昨天，类推（目前最多获取到7天前的图片）
n （必需）| 1-8 返回请求数量，目前最多一次获取8张
mkt（非必需）	| 地区zh-CN

返回参数:
```json
{
    "images": [
        {
            "startdate": "20231130",
            "fullstartdate": "202311301600",
            "enddate": "20231201",
            "url": "/th?id=OHR.IcebergAntarctica_ZH-CN2053356825_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
            "urlbase": "/th?id=OHR.IcebergAntarctica_ZH-CN2053356825",
            "copyright": "罗斯海的冰山，南极洲 (© Michel Roggo/Minden Pictures)",
            "copyrightlink": "https://www.bing.com/search?q=%E7%BD%97%E6%96%AF%E6%B5%B7&form=hpcapt&mkt=zh-cn",
            "title": "为最酷的地方欢呼！",
            "quiz": "/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20231130_IcebergAntarctica%22&FORM=HPQUIZ",
            "wp": true,
            "hsh": "39efaae73f87a07a2b2f11e2bd0815ca",
            "drk": 1,
            "top": 1,
            "bot": 1,
            "hs": []
        }
    ],
    "tooltips": {
        "loading": "正在加载...",
        "previous": "上一个图像",
        "next": "下一个图像",
        "walle": "此图片不能下载用作壁纸。",
        "walls": "下载今日美图。仅限用作桌面壁纸。"
    }
}
```