const axios=require("axios");
module.exports = (function () {
        function getLink(file, no_webp) {
                var dir, base;
                if (!no_webp) {
                        if (file['hasavif']) {
                                return ufu(file, 'avif', 'a');
                        }
                        if (file['haswebp']) {
                                return ufu(file, 'webp', 'a');
                        }
                }
                var ext = dir || file.name.split('.').pop();
                dir = dir || 'images';
                if (file.hash.length >= 3) {
                        file.hash = file.hash.replace(/^.*(..)(.)$/, '$2/$1/' + file.hash);
                }
                var url = 'https://a.hitomi.la/' + dir + '/' + file.hash + '.' + ext;
                var retval = 'b';
                if (base) {
                        retval = base;
                }
                var b = 16;

                var r = /\/[0-9a-f]\/([0-9a-f]{2})\//;
                var m = r.exec(url);
                if (!m) {
                        return url.replace(/\/\/..?\.hitomi\.la\//, '//a.hitomi.la/');
                }

                var g = parseInt(m[1], b);
                if (!isNaN(g)) {
                        var o = 0;
                        if (g < 0x80) {
                                o = 1;
                        }
                        if (g < 0x40) {
                                o = 2;
                        }
                        retval = String.fromCharCode(97 + o) + retval;
                }
                return url.replace(/\/\/..?\.hitomi\.la\//, '//' + retval + '.hitomi.la/');
        }
        async function getList(number) {
                let data = await axios.get(`https://ltn.hitomi.la/galleries/${number}.js`, {
                        Headers: {
                                Host: "ltn.hitomi.la",
                                Referer: `https://hitomi.la/reader/${number}.html`,
                                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
                        }
                })
                return JSON.parse(data.data.replace(/var galleryinfo ?= ?/, ""));
        }
        return async function (number, no_webp) {
                var list = await getList(number);
                var { files } = list;
                var result = [];
                for (let i = 0; i < files.length; i++) {
                        result.push(getLink(files[i], no_webp));
                }
                return result;
        }
})();