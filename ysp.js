/*
算法来源于 https://garysclub.sharewithyou.dpdns.org/ysp-live/ysp-live-v9.5.py 侵删
https://t.me/ddgksf2021
*/
const CryptoJS = createCryptoJS();

const CACHE_KEY_DEVICE = 'ysp_tv_device_v1';
const SESSION_TTL_MS = 30 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 30 * 1000;

const AK = '9f5c54c4ed0e50109b800f7e28fec205';
const RSA_PUBLIC_KEY_B64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkKeLy4ywWLSnBkwRyqYgF3HMIj05V5uuh5HjyEsZOWnu1NHu3jPQv3sr32wwQNYv5qapsNXmNgLUDHtgHZxqPQAYXltjSRc0qhcD286t62wOIHId8zXS3s1Jy4rgU4qjQWzI9rp/1sE0pMsmwTaJa4zuJ5iz8VwF8Av5oJ1k+HxY+/HLnjNlW1hmWLpuDYmkZYuAoTHa1VGeHQh9FEKI8ZcL3GTQphShUoC+Kg3P1hGUVTtCYapmzPS5lkAdwebuzwvTCfGiTErYZCnPBUSeV7BVlgjtLYIi29KvF0a8FHsJMfe/UdHcyW/RihsIYOtDQcRRpFGXyPXbVrzFJse24QIDAQAB';

const CLOUD_GET_URL = 'https://ytpcloudws.cctv.cn/cloudps/wssapi/device/v2/get';
const CLOUD_REGISTER_URL = 'https://ytpcloudws.cctv.cn/cloudps/wssapi/device/v2/register';
const APP_START_URL = 'https://ytpaddr.cctv.cn/gsnw/api/app/start/v1/01';
const LIVE_V1_01_URL = 'https://ytpaddr.cctv.cn/gsnw/api/live/v1/01';
const LIVE_V1_02_URL = 'https://ytpaddr.cctv.cn/gsnw/api/live/v1/02';
const VDN_GETSTREAM_URL = 'https://ytpvdn.cctv.cn/cctvmobileinf/rest/cctv/videoliveUrl/getstream';
const HEARTBEAT_URL = 'https://ytpdata.cctv.cn/das/app/data/message/single';

const DEFAULT_LIVE_USER_ID = 'BAEBFF2B-C516-4F34-ABC0-A824A6461CBD';
const DEFAULT_DEVICE_NAME = '央视频电视投屏助手';
const VDN_APP_NAME = '央视频电视投屏助手';
const REPORT_APP_KEY = '1178c84d-4818-44ff-b415-02106e87e144';
const LOGO_BASE = 'https://garysclub.sharewithyou.dpdns.org/logos/ysp-live-logos';

const TRUE_4K_CHANNELS = { cctv4k: 1, cctv8k: 1, cctv164k: 1 };

const LIVE_ID_MAP = {
  cctv1: 'Live1717729995180256',
  cctv2: 'Live1718261577870260',
  cctv3: 'Live1718261955077261',
  cctv4: 'Live1718276148119264',
  cctv5: 'Live1719474204987287',
  cctv5p: 'Live1719473996025286',
  cctv7: 'Live1718276412224269',
  cctv8: 'Live1718276458899270',
  cctv9: 'Live1718276503187272',
  cctv10: 'Live1718276550002273',
  cctv11: 'Live1718276603690275',
  cctv12: 'Live1718276623932276',
  cctv13: 'Live1718276575708274',
  cctv14: 'Live1718276498748271',
  cctv15: 'Live1718276319614267',
  cctv16: 'Live1718276256572265',
  cctv17: 'Live1718276138318263',
  cctv4k: 'Live1767871224782105',
  cctv8k: 'Live1688400593818102',
  cctv164k: 'Live1704966749996185',
  cgtn: 'Live1719392219423280',
  cgtnfr: 'Live1719392670442283',
  cgtnru: 'Live1719392779653284',
  cgtnar: 'Live1719392885692285',
  cgtnes: 'Live1719392560433282',
  cgtndoc: 'Live1719392360336281'
};

const DEFAULT_CHANNELS = [
  ['cctv4k', 'CCTV-4K 超高清', '2029810301', '600002264', 'fhd'],
  ['cctv8k', 'CCTV-8K 超高清', '2026774101', '600156816', 'fhd'],
  ['cctv164k', 'CCTV-16 4K', '2027249301', '600099502', 'fhd'],
  ['cctv1', 'CCTV-1 综合', '2024078201', '600001859', 'fhd'],
  ['cctv2', 'CCTV-2 财经', '2024075401', '600001800', 'fhd'],
  ['cctv3', 'CCTV-3 综艺', '2024068501', '600001801', 'fhd'],
  ['cctv4', 'CCTV-4 中文国际', '2029797101', '600001814', 'fhd'],
  ['cctv5', 'CCTV-5 体育', '2024078401', '600001818', 'fhd'],
  ['cctv5p', 'CCTV-5+ 体育赛事', '2024078001', '600001817', 'fhd'],
  ['cctv6', 'CCTV-6 电影', '2013693901', '600108442', 'fhd'],
  ['cctv7', 'CCTV-7 国防军事', '2024072001', '600004092', 'fhd'],
  ['cctv8', 'CCTV-8 电视剧', '2029793001', '600001803', 'fhd'],
  ['cctv9', 'CCTV-9 纪录', '2024078601', '600004078', 'fhd'],
  ['cctv10', 'CCTV-10 科教', '2024078701', '600001805', 'fhd'],
  ['cctv11', 'CCTV-11 戏曲', '2027248701', '600001806', 'fhd'],
  ['cctv12', 'CCTV-12 社会与法', '2027248801', '600001807', 'fhd'],
  ['cctv13', 'CCTV-13 新闻', '2029797201', '600001811', 'fhd'],
  ['cctv14', 'CCTV-14 少儿', '2027248901', '600001809', 'fhd'],
  ['cctv15', 'CCTV-15 音乐', '2027249001', '600001815', 'fhd'],
  ['cctv16', 'CCTV-16 奥林匹克', '2027249101', '600098637', 'fhd'],
  ['cctv17', 'CCTV-17 农业农村', '2027249401', '600001810', 'fhd'],
  ['cctvfyjc', 'CCTV 风云剧场', '2025637102', '600099658', 'shd'],
  ['cctvdyjc', 'CCTV 第一剧场', '2026874202', '600099655', 'shd'],
  ['cctvhjjc', 'CCTV 怀旧剧场', '2026874302', '600099620', 'shd'],
  ['cgtn', 'CGTN', '2024181701', '600014550', 'fhd'],
  ['cgtnfr', 'CGTN 法语', '2024181801', '600084704', 'fhd'],
  ['cgtnru', 'CGTN 俄语', '2024181901', '600084758', 'fhd'],
  ['cgtnar', 'CGTN 阿拉伯语', '2024182001', '600084782', 'fhd'],
  ['cgtnes', 'CGTN 西班牙语', '2024182101', '600084744', 'fhd'],
  ['cgtndoc', 'CGTN 纪录', '2024182301', '600084781', 'fhd'],
  ['cetv1', 'CETV-1 中国教育1台', '2022823801', '600171827', 'fhd'],
  ['guoxue', '国学频道', '2029360403', '600213139', 'fhd'],
  ['bjws', '北京卫视', '2024052703', '600002309', 'fhd'],
  ['jsws', '江苏卫视', '2024171103', '600002521', 'fhd'],
  ['dfws', '东方卫视', '2024054503', '600002483', 'fhd'],
  ['zjws', '浙江卫视', '2024054703', '600002520', 'fhd'],
  ['hnws', '湖南卫视', '2024054803', '600002475', 'fhd'],
  ['hbws', '湖北卫视', '2024171203', '600002508', 'fhd'],
  ['gdws', '广东卫视', '2024060903', '600002485', 'fhd'],
  ['gxws', '广西卫视', '2024060703', '600002509', 'fhd'],
  ['hljws', '黑龙江卫视', '2029797003', '600002498', 'fhd'],
  ['hainanws', '海南卫视', '2024055603', '600002506', 'fhd'],
  ['cqws', '重庆卫视', '2024061103', '600002531', 'fhd'],
  ['szws', '深圳卫视', '2024061303', '600002481', 'fhd'],
  ['scws', '四川卫视', '2024061403', '600002516', 'fhd'],
  ['henanws', '河南卫视', '2029797303', '600002525', 'fhd'],
  ['dnws', '东南卫视', '2024061503', '600002484', 'fhd'],
  ['gzws', '贵州卫视', '2024061603', '600002490', 'fhd'],
  ['jxws', '江西卫视', '2024061703', '600002503', 'fhd'],
  ['lnws', '辽宁卫视', '2024171303', '600002505', 'fhd'],
  ['ahws', '安徽卫视', '2024171403', '600002532', 'fhd'],
  ['hebws', '河北卫视', '2024171503', '600002493', 'fhd'],
  ['sdws', '山东卫视', '2029787903', '600002513', 'fhd'],
  ['tjws', '天津卫视', '2019927003', '600152137', 'fhd'],
  ['jlws', '吉林卫视', '2025561503', '600190405', 'fhd'],
  ['saxws', '陕西卫视', '2029795103', '600190400', 'fhd'],
  ['nxws', '宁夏卫视', '2025608503', '600190737', 'fhd'],
  ['nmgws', '内蒙古卫视', '2025561203', '600190401', 'fhd'],
  ['ynws', '云南卫视', '2025561303', '600190402', 'fhd'],
  ['shanxiws', '山西卫视', '2025560803', '600190407', 'fhd'],
  ['gsws', '甘肃卫视', '2025561703', '600190408', 'fhd'],
  ['qhws', '青海卫视', '2025559103', '600190406', 'fhd'],
  ['xizangws', '西藏卫视', '2025558003', '600190403', 'fhd'],
  ['xjws', '新疆卫视', '2019927403', '600152138', 'fhd']
];

const CHANNEL_INDEX = {};
DEFAULT_CHANNELS.forEach((item) => {
  CHANNEL_INDEX[item[0]] = {
    slug: item[0],
    name: item[1],
    sid: item[2],
    pid: item[3],
    defn: item[4],
    liveId: LIVE_ID_MAP[item[0]] || '',
    logo: LOGO_BASE + '/' + item[0] + '.png'
  };
});

// ==================== 基础字节与哈希工具 ====================

function randomBytes(n) {
  const out = new Uint8Array(n);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(out);
    return out;
  }
  // CryptoJS hosts may supply their own native secure random implementation.
  const words = CryptoJS.lib.WordArray.random(n);
  for (let i = 0; i < n; i++) out[i] = (words.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
  return out;
}

function randomHex(len) {
  return bytesToHex(randomBytes(Math.ceil(len / 2))).slice(0, len);
}

function uuidv4() {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = bytesToHex(bytes);
  return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
}

function bytesToHex(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += ('0' + (bytes[i] & 0xff).toString(16)).slice(-2);
  }
  return out;
}

function hexToBytes(hex) {
  const clean = hex.length % 2 ? '0' + hex : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

function utf8ToBytes(str) {
  const bin = unescape(encodeURIComponent(String(str)));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i) & 0xff;
  }
  return out;
}

function bytesToUtf8(bytes) {
  let esc = '';
  for (let i = 0; i < bytes.length; i++) {
    esc += '%' + ('0' + (bytes[i] & 0xff).toString(16)).slice(-2);
  }
  return decodeURIComponent(esc);
}

function base64ToBytes(b64) {
  if (typeof b64 !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(b64)) {
    throw new Error('Base64 格式不正确');
  }
  const wa = CryptoJS.enc.Base64.parse(b64);
  return hexToBytes(wa.toString(CryptoJS.enc.Hex));
}

function bytesToBase64(bytes) {
  const wa = CryptoJS.enc.Hex.parse(bytesToHex(bytes));
  return CryptoJS.enc.Base64.stringify(wa);
}

function concatBytes(arrays) {
  let total = 0;
  for (let i = 0; i < arrays.length; i++) total += arrays[i].length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (let i = 0; i < arrays.length; i++) {
    out.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return out;
}

function md5Hex(str) {
  return CryptoJS.MD5(String(str)).toString(CryptoJS.enc.Hex).toLowerCase();
}

function sha1Upper(str) {
  return CryptoJS.SHA1(String(str)).toString(CryptoJS.enc.Hex).toUpperCase();
}

function sha256Hex(str) {
  return CryptoJS.SHA256(String(str)).toString(CryptoJS.enc.Hex).toLowerCase();
}

function sha256Bytes(bytes) {
  const wa = CryptoJS.enc.Hex.parse(bytesToHex(bytes));
  const hex = CryptoJS.SHA256(wa).toString(CryptoJS.enc.Hex);
  return hexToBytes(hex);
}

function sortedJsonStringify(val, escapeSlashes) {
  const build = (v) => {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(build).join(',') + ']';
    const keys = Object.keys(v).sort();
    const parts = keys.map((k) => JSON.stringify(k) + ':' + build(v[k]));
    return '{' + parts.join(',') + '}';
  };
  let text = build(val);
  if (escapeSlashes) text = text.replace(/\//g, '\\/');
  return text;
}

// ==================== 1080P bkliveinfo (TEA + cKey) 协议 ====================

const CK_PLATFORM = 4330403;
const CK_APPVER = 'V8.22.1035.3031';
const CK_TEA = hexToBytes('59b2f7cf725ef43c34fdd7c123411ed3');
const CK_GTEA = hexToBytes('110DBEC10C23E7D2E56A1CAD6914EF1B');
const CK_XOR = new Uint8Array([132, 46, 237, 8, 240, 102, 230, 234, 72, 180, 202, 169, 145, 237, 111, 243]);
const CK_GXOR = new Uint8Array([179, 201, 83, 160, 105, 19, 173, 77]);
const BK_H264 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('H(30:1080,60:1080|30:1080,60:1080)'));

function readU32BE(buf, off) {
  return (((buf[off] << 24) | (buf[off + 1] << 16) | (buf[off + 2] << 8) | buf[off + 3]) >>> 0);
}

function writeU32BE(buf, off, val) {
  buf[off] = (val >>> 24) & 0xff;
  buf[off + 1] = (val >>> 16) & 0xff;
  buf[off + 2] = (val >>> 8) & 0xff;
  buf[off + 3] = val & 0xff;
}

function u32Bytes(val) {
  const b = new Uint8Array(4);
  writeU32BE(b, 0, val >>> 0);
  return b;
}

function u16Bytes(val) {
  return new Uint8Array([(val >>> 8) & 0xff, val & 0xff]);
}

function ckSum(buf) {
  let v = 0;
  for (let i = 0; i < buf.length; i++) {
    v = ((Math.imul(131, v) + buf[i]) & 0x7fffffff) >>> 0;
  }
  return v;
}

function teaBlk(blk, key) {
  let y = readU32BE(blk, 0);
  let z = readU32BE(blk, 4);
  const k0 = readU32BE(key, 0);
  const k1 = readU32BE(key, 4);
  const k2 = readU32BE(key, 8);
  const k3 = readU32BE(key, 12);
  let s = 0;
  for (let i = 0; i < 16; i++) {
    s = (s + 0x9E3779B9) >>> 0;
    y = (y + (((((z << 4) >>> 0) + k0) >>> 0) ^ ((z + s) >>> 0) ^ (((z >>> 5) + k1) >>> 0))) >>> 0;
    z = (z + (((((y << 4) >>> 0) + k2) >>> 0) ^ ((y + s) >>> 0) ^ (((y >>> 5) + k3) >>> 0))) >>> 0;
  }
  const out = new Uint8Array(8);
  writeU32BE(out, 0, y);
  writeU32BE(out, 4, z);
  return out;
}

function teaPkt(data, key) {
  const pad = (8 - ((data.length + 10) % 8)) % 8;
  const headByte = new Uint8Array([(randomBytes(1)[0] & 248) | pad]);
  const plain = concatBytes([headByte, randomBytes(pad), randomBytes(2), data, new Uint8Array(7)]);
  const out = new Uint8Array(plain.length);
  let pp = new Uint8Array(8);
  let pc = new Uint8Array(8);

  for (let off = 0; off < plain.length; off += 8) {
    const mixed = new Uint8Array(8);
    for (let i = 0; i < 8; i++) mixed[i] = plain[off + i] ^ pc[i];
    const enc = teaBlk(mixed, key);
    const cipher = new Uint8Array(8);
    for (let i = 0; i < 8; i++) cipher[i] = enc[i] ^ pp[i];
    out.set(cipher, off);
    pp = mixed;
    pc = cipher;
  }
  return out;
}

function lpBytes(val) {
  const d = val instanceof Uint8Array ? val : utf8ToBytes(String(val));
  return concatBytes([u16Bytes(d.length), d]);
}

function buildCkGuard(ts, guid) {
  const tail = (v) => {
    const t = String(v);
    return t.length >= 5 ? t.slice(-5) : '';
  };
  const body = concatBytes([
    u32Bytes(ts),
    lpBytes(tail(guid)),
    lpBytes(tail('null')),
    lpBytes(tail('null')),
    lpBytes('-1')
  ]);
  const plain = lpBytes(body);
  const enc = concatBytes([teaPkt(plain, CK_GTEA), u32Bytes(ckSum(plain))]);
  for (let i = 0; i < enc.length; i++) {
    enc[i] ^= CK_GXOR[i & 7];
  }
  return bytesToHex(enc).toUpperCase();
}

function generateCKey(channelId) {
  const ts = Math.floor(Date.now() / 1000);
  const guid = randomHex(32);
  const guard = buildCkGuard(ts, guid);
  const uid = randomHex(8).toUpperCase();

  const body = concatBytes([
    hexToBytes('0000004200000004000004d2'),
    u32Bytes(CK_PLATFORM),
    u32Bytes(0),
    u32Bytes(ts),
    lpBytes('dcgh'),
    lpBytes('_zj1A5Gh6QYcxWjIUGos2w=='),
    lpBytes(CK_APPVER),
    lpBytes(String(channelId)),
    lpBytes(guid),
    u32Bytes(1),
    u32Bytes(1),
    lpBytes(uid),
    lpBytes('nil'),
    lpBytes('57eab0c4-2c58-44c6-8ae9-dd2757525dc5'),
    lpBytes('nil'),
    lpBytes('v0.1.000'),
    lpBytes('com.cctv.yangshipin.app.iphone'),
    lpBytes(String(CK_PLATFORM)),
    lpBytes('ex_json_bus'),
    lpBytes('ex_json_vs'),
    lpBytes(guard)
  ]);

  const pkt = concatBytes([u16Bytes(body.length), body]);
  writeU32BE(pkt, 18, ckSum(pkt));

  const enc = concatBytes([teaPkt(pkt, CK_TEA), u32Bytes(ckSum(pkt))]);
  for (let i = 0; i < enc.length; i++) {
    enc[i] ^= CK_XOR[i & 15];
  }

  const b64 = bytesToBase64(enc).replace(/\+/g, '_').replace(/\//g, '-').replace(/=+$/, '');
  return {
    cKey: '--01' + b64,
    guid: guid,
    ts: ts,
    flowId: randomHex(32).toUpperCase() + '_' + CK_PLATFORM
  };
}

function encodeQuery(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

function relativeMediaUrl(value, base) {
  if (/^https?:\/\//i.test(value)) return value;
  if (typeof Widget !== 'undefined' && typeof Widget.resolveUrl === 'function') return Widget.resolveUrl(value, base);
  const origin = /^(https?:)\/\/([^/?#]+)/i.exec(base);
  if (!origin) throw new Error('清单地址格式不正确');
  if (value.startsWith('//')) return origin[1] + value;
  const root = origin[1] + '//' + origin[2];
  const raw = value.startsWith('/') ? value : base.slice(root.length).split('?')[0].replace(/[^/]*$/, '') + value;
  const pieces = [];
  raw.split('/').forEach(part => { if (part === '..') pieces.pop(); else if (part !== '.') pieces.push(part); });
  return root + pieces.join('/');
}

async function playableBkUrl(playback) {
  let lastStatus = '';
  for (const candidate of playback.urls) {
    try {
      let url = candidate;
      let segment = '';
      for (let depth = 0; depth < 3; depth++) {
        const response = await $fetch.get(url, {headers:playback.headers, timeout:6});
        const status = Number(response.status || response.statusCode || 200);
        if (status < 200 || status >= 300) throw new Error('清单 HTTP ' + status);
        const text = String(response.data || '').trim();
        if (!text.startsWith('#EXTM3U')) throw new Error('不是有效直播清单');
        const lines = text.split(/\r?\n/).map(line=>line.trim()).filter(line=>line&&!line.startsWith('#'));
        if (!lines.length) throw new Error('清单没有视频分片');
        const base = response.url || url;
        if (text.includes('#EXT-X-STREAM-INF')) { url = relativeMediaUrl(lines[0], base); continue; }
        segment = relativeMediaUrl(lines[lines.length-1], base);
        break;
      }
      if (!segment) throw new Error('清单层级过深');
      const response = await $fetch.get(segment, {headers:Object.assign({},playback.headers,{Range:'bytes=0-511'}), timeout:6});
      const status = Number(response.status || response.statusCode || 200);
      if (status < 200 || status >= 300) throw new Error('视频分片 HTTP ' + status);
      return candidate;
    } catch (error) { lastStatus = safeError(error); }
  }
  throw new Error((lastStatus || '没有可用视频分片') + '；上游暂未提供可播放的视频，请稍后重试');
}

async function fetchBkPlayUrls(ch) {
  const t = generateCKey(ch.sid);
  const q = encodeQuery({
    atime: '120',
    livepid: ch.pid,
    cnlid: ch.sid,
    appVer: CK_APPVER,
    app_version: '300090',
    caplv: '1',
    cmd: '2',
    defn: ch.defn || 'fhd',
    device: 'iPhone',
    encryptVer: '4.2',
    getpreviewinfo: '0',
    hevclv: '0',
    lang: 'zh-Hans_CN',
    livequeue: '0',
    logintype: '1',
    nettype: '1',
    newnettype: '1',
    newplatform: String(CK_PLATFORM),
    platform: String(CK_PLATFORM),
    sdtfrom: 'v3021',
    spacode: '23',
    spaudio: '1',
    spdemuxer: '6',
    spdrm: '2',
    spdynamicrange: '1',
    spflv: '1',
    spflvaudio: '1',
    sphdrfps: '60',
    sphttps: '1',
    spvcode: BK_H264,
    spvideo: '4',
    stream: '1',
    system: '1',
    sysver: 'ios18.2.1',
    uhd_flag: '0',
    cKey: t.cKey,
    guid: t.guid,
    fntick: String(t.ts),
    flowid: t.flowId,
    playbacktime: '0'
  });

  const resp = await $fetch.get('https://bkliveinfo.ysp.cctv.cn/?' + q, {
    headers: {
      'User-Agent': 'qqlive',
      'Accept': 'application/json'
    }, timeout:8
  });

  const p = apiJson(resp, 'bklive');
  if (!p || Number(p.iretcode) !== 0) {
    throw new Error('bklive iretcode=' + (p ? p.iretcode : 'null'));
  }

  const rawUrls = [];
  if (p.playurl) rawUrls.push(p.playurl);
  const bu = p.backurl_list || p.backurlList || p.backurl;
  if (Array.isArray(bu)) {
    bu.forEach((it) => {
      rawUrls.push(typeof it === 'string' ? it : (it && (it.url || it.playurl) || ''));
    });
  } else if (typeof bu === 'string') {
    bu.split(/[;,]/).forEach((x) => {
      if (x.trim()) rawUrls.push(x.trim());
    });
  }

  const seen = {};
  const urls = rawUrls.filter((u) => {
    const host = typeof u === 'string' && /^https?:\/\/([^/?#]+)/i.exec(u);
    if (!host || !/\.cctv\.(?:cn|com)(?::\d+)?$/i.test(host[1]) || seen[u]) return false;
    seen[u] = true;
    return true;
  });

  urls.sort((a, b) => (a.indexOf('bklive-') !== -1 ? -1 : 1) - (b.indexOf('bklive-') !== -1 ? -1 : 1));
  if (!urls.length) throw new Error('bklive empty playurl');
  const headers = {'User-Agent':'qqlive'};
  if (p.http_header && typeof p.http_header === 'object' && !Array.isArray(p.http_header)) {
    Object.keys(p.http_header).forEach(key => {
      const value = p.http_header[key];
      if (/^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(key) && typeof value === 'string' && !/[\r\n]/.test(value)) headers[key] = value;
    });
  }
  return {urls:urls,headers:headers};
}

// ==================== 4K/高码率 TV 投屏助手协议 (AES-GCM + RSA-OAEP) ====================

const AES_SBOX = new Uint8Array([
  99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,
  183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,
  9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,
  208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,
  205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,
  224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,
  186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,
  225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22
]);
const AES_RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54];

function xtime(a) {
  return (a & 128) ? (((a << 1) ^ 283) & 255) : ((a << 1) & 255);
}

function aes256KeySchedule(key) {
  const w = new Uint32Array(60);
  for (let i = 0; i < 8; i++) {
    w[i] = readU32BE(key, i * 4);
  }
  for (let i = 8; i < 60; i++) {
    let temp = w[i - 1];
    if (i % 8 === 0) {
      temp = ((AES_SBOX[(temp >>> 16) & 255] << 24) |
              (AES_SBOX[(temp >>> 8) & 255] << 16) |
              (AES_SBOX[temp & 255] << 8) |
              AES_SBOX[(temp >>> 24) & 255]) >>> 0;
      temp = (temp ^ (AES_RCON[(i / 8) - 1] << 24)) >>> 0;
    } else if (i % 8 === 4) {
      temp = ((AES_SBOX[(temp >>> 24) & 255] << 24) |
              (AES_SBOX[(temp >>> 16) & 255] << 16) |
              (AES_SBOX[(temp >>> 8) & 255] << 8) |
              AES_SBOX[temp & 255]) >>> 0;
    }
    w[i] = (w[i - 8] ^ temp) >>> 0;
  }
  const rk = [];
  for (let i = 0; i < 60; i += 4) {
    const block = new Uint8Array(16);
    writeU32BE(block, 0, w[i]);
    writeU32BE(block, 4, w[i + 1]);
    writeU32BE(block, 8, w[i + 2]);
    writeU32BE(block, 12, w[i + 3]);
    rk.push(block);
  }
  return rk;
}

function aes256EncryptBlockRk(rk, block) {
  const s = new Uint8Array(block);
  const addRk = (r) => { for (let i = 0; i < 16; i++) s[i] ^= r[i]; };
  const subBytes = () => { for (let i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]]; };
  const shiftRows = () => {
    let t = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = t;
    t = s[2]; const t2 = s[6]; s[2] = s[10]; s[6] = s[14]; s[10] = t; s[14] = t2;
    t = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = s[3]; s[3] = t;
  };
  const mixColumns = () => {
    for (let c = 0; c < 4; c++) {
      const idx = 4 * c;
      const a0 = s[idx], a1 = s[idx + 1], a2 = s[idx + 2], a3 = s[idx + 3];
      s[idx] = xtime(a0) ^ (xtime(a1) ^ a1) ^ a2 ^ a3;
      s[idx + 1] = a0 ^ xtime(a1) ^ (xtime(a2) ^ a2) ^ a3;
      s[idx + 2] = a0 ^ a1 ^ xtime(a2) ^ (xtime(a3) ^ a3);
      s[idx + 3] = xtime(a0) ^ a0 ^ a1 ^ a2 ^ xtime(a3);
    }
  };

  addRk(rk[0]);
  for (let rnd = 1; rnd < 14; rnd++) {
    subBytes();
    shiftRows();
    mixColumns();
    addRk(rk[rnd]);
  }
  subBytes();
  shiftRows();
  addRk(rk[14]);
  return s;
}

function bytesToBigInt(bytes) {
  const hex = bytesToHex(bytes);
  return hex ? BigInt('0x' + hex) : 0n;
}

function bigIntToBytes(n, len) {
  const hex = n.toString(16).padStart(len * 2, '0');
  return hexToBytes(hex.slice(-len * 2));
}

function gfMult(x, y) {
  const R = 0xe1000000000000000000000000000000n;
  const MSB = 1n << 127n;
  const MASK = (1n << 128n) - 1n;
  let z = 0n;
  let v = y;
  let curX = x;
  for (let i = 0; i < 128; i++) {
    if (curX & MSB) z ^= v;
    if (v & 1n) v = (v >> 1n) ^ R;
    else v >>= 1n;
    curX = (curX << 1n) & MASK;
  }
  return z;
}

function ghash(h, aad, ct) {
  let x = 0n;
  const feed = (data) => {
    for (let i = 0; i < data.length; i += 16) {
      const blk = new Uint8Array(16);
      blk.set(data.subarray(i, Math.min(i + 16, data.length)));
      x = gfMult(x ^ bytesToBigInt(blk), h);
    }
  };
  feed(aad);
  feed(ct);
  const lens = (BigInt(aad.length * 8) << 64n) | BigInt(ct.length * 8);
  return gfMult(x ^ lens, h);
}

function inc32(block) {
  const out = new Uint8Array(block);
  const ctr = (readU32BE(block, 12) + 1) >>> 0;
  writeU32BE(out, 12, ctr);
  return out;
}

function gctrRk(rk, icb, data) {
  const out = new Uint8Array(data.length);
  let cb = new Uint8Array(icb);
  for (let i = 0; i < data.length; i += 16) {
    const ks = aes256EncryptBlockRk(rk, cb);
    const end = Math.min(i + 16, data.length);
    for (let j = i; j < end; j++) {
      out[j] = data[j] ^ ks[j - i];
    }
    cb = inc32(cb);
  }
  return out;
}

function normalizeAesKey(keyStr) {
  const raw = utf8ToBytes(keyStr);
  const out = new Uint8Array(32);
  out.set(raw.subarray(0, 32));
  return out;
}

function aesGcmEncryptB64(plainText, keyStr) {
  const key = normalizeAesKey(keyStr);
  const nonce = randomBytes(12);
  const rk = aes256KeySchedule(key);
  const h = bytesToBigInt(aes256EncryptBlockRk(rk, new Uint8Array(16)));
  const j0 = concatBytes([nonce, new Uint8Array([0, 0, 0, 1])]);
  const pt = utf8ToBytes(plainText);
  const ct = gctrRk(rk, inc32(j0), pt);
  const s = bigIntToBytes(ghash(h, new Uint8Array(0), ct), 16);
  const encJ0 = aes256EncryptBlockRk(rk, j0);
  const tag = new Uint8Array(16);
  for (let i = 0; i < 16; i++) tag[i] = encJ0[i] ^ s[i];
  return bytesToBase64(concatBytes([nonce, ct, tag]));
}

function aesGcmDecryptB64(b64Val, keyStr) {
  const raw = base64ToBytes(b64Val);
  if (raw.length < 28) throw new Error('AES-GCM payload too short');
  const nonce = raw.subarray(0, 12);
  const ct = raw.subarray(12, raw.length - 16);
  const tag = raw.subarray(raw.length - 16);
  const rk = aes256KeySchedule(normalizeAesKey(keyStr));
  const j0 = concatBytes([nonce, new Uint8Array([0, 0, 0, 1])]);
  const h = bytesToBigInt(aes256EncryptBlockRk(rk, new Uint8Array(16)));
  const s = bigIntToBytes(ghash(h, new Uint8Array(0), ct), 16);
  const encJ0 = aes256EncryptBlockRk(rk, j0);
  let difference = 0;
  for (let i = 0; i < 16; i++) difference |= tag[i] ^ encJ0[i] ^ s[i];
  if (difference !== 0) throw new Error('AES-GCM authentication failed');
  const pt = gctrRk(rk, inc32(j0), ct);
  return bytesToUtf8(pt);
}

// RSA-OAEP-SHA256
function derReadLen(der, pos) {
  const first = der[pos++];
  if ((first & 128) === 0) return [first, pos];
  const n = first & 127;
  let len = 0;
  for (let i = 0; i < n; i++) len = (len << 8) | der[pos++];
  return [len, pos];
}

function derReadTlv(der, pos) {
  pos++;
  const [ln, nextPos] = derReadLen(der, pos);
  pos = nextPos;
  const end = pos + ln;
  const items = [];
  while (pos < end) {
    const tag = der[pos++];
    const [ln2, p2] = derReadLen(der, pos);
    pos = p2;
    items.push([tag, der.subarray(pos, pos + ln2)]);
    pos += ln2;
  }
  return items;
}

function parseSpkiRsaPubkey(der) {
  const outer = derReadTlv(der, 0);
  const bitstring = outer[1][1];
  const inner = derReadTlv(bitstring.subarray(1), 0);
  return [bytesToBigInt(inner[0][1]), bytesToBigInt(inner[1][1])];
}

function modPow(base, exp, mod) {
  let res = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) res = (res * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }
  return res;
}

function mgf1Sha256(seed, length) {
  const chunks = [];
  let total = 0;
  let counter = 0;
  while (total < length) {
    const d = sha256Bytes(concatBytes([seed, u32Bytes(counter++)]));
    chunks.push(d);
    total += d.length;
  }
  return concatBytes(chunks).subarray(0, length);
}

function rsaEncryptDeviceId(deviceId) {
  const der = base64ToBytes(RSA_PUBLIC_KEY_B64);
  const [n, e] = parseSpkiRsaPubkey(der);
  const k = 256;
  const hlen = 32;
  const chunkSize = k - 2 * hlen - 2;
  const lhash = sha256Bytes(new Uint8Array(0));
  const data = utf8ToBytes(deviceId);
  const outChunks = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const msg = data.subarray(i, Math.min(i + chunkSize, data.length));
    const seed = randomBytes(hlen);
    const ps = new Uint8Array(k - msg.length - 2 * hlen - 2);
    const db = concatBytes([lhash, ps, new Uint8Array([1]), msg]);
    const dbMask = mgf1Sha256(seed, k - hlen - 1);
    const maskedDb = new Uint8Array(db.length);
    for (let j = 0; j < db.length; j++) maskedDb[j] = db[j] ^ dbMask[j];
    const seedMask = mgf1Sha256(maskedDb, hlen);
    const maskedSeed = new Uint8Array(hlen);
    for (let j = 0; j < hlen; j++) maskedSeed[j] = seed[j] ^ seedMask[j];
    const em = concatBytes([new Uint8Array([0]), maskedSeed, maskedDb]);
    const c = modPow(bytesToBigInt(em), e, n);
    outChunks.push(bigIntToBytes(c, k));
  }
  return bytesToBase64(concatBytes(outChunks));
}

// 设备身份与会话管理
function javaStringHashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function javaUuidFromHashes(msbHash, lsbHash) {
  const msb = BigInt(msbHash) & 0xffffffffffffffffn;
  const lsb = BigInt(lsbHash) & 0xffffffffffffffffn;
  return msb.toString(16).padStart(16, '0') + lsb.toString(16).padStart(16, '0');
}

function computeXUid(profile) {
  const s = '1698' + profile.hardware + profile.board + profile.brand + profile.device +
    profile.manufacturer + profile.model + profile.product + profile.tags +
    profile.build_type + profile.user + profile.resolution + profile.mac;
  const uuidPart = javaUuidFromHashes(javaStringHashCode(s), javaStringHashCode(profile.model));
  return sha1Upper(profile.android_id + '|' + uuidPart);
}

function computeFingerprint(xUid, nowMs) {
  const nowS = Math.floor(nowMs / 1000);
  const day0Ms = 86400000 * Math.floor((nowS + 28800) / 86400) - 28800000;
  const first = sha256Hex(AK + xUid + nowMs + day0Ms);
  return { xfp: sha256Hex(first), ts: nowMs };
}

function createDefaultDevice() {
  const macBytes = randomBytes(6);
  macBytes[0] = (macBytes[0] | 2) & 254;
  const mac = Array.from(macBytes).map((b) => ('0' + b.toString(16)).slice(-2)).join(':');
  const profile = {
    android_id: randomHex(16),
    mac: mac,
    hardware: 'mt5895',
    board: 'mt5895',
    brand: 'Sony',
    device: 'sony_xr_85z9k',
    manufacturer: 'Sony',
    model: 'XR-85Z9K',
    product: 'sony_xr_85z9k',
    tags: 'release-keys',
    build_type: 'user',
    user: 'build',
    resolution: '7680*4320',
    display: 'XR-85Z9K-user 13 SONYTV.2022.XR_85Z9K 2024 release-keys',
    version_id: 'SONYTV.2022.XR_85Z9K',
    host: 'sony-tv-build',
    fingerprint: 'Sony/sony_xr_85z9k/sony_xr_85z9k:13/SONYTV.2022.XR_85Z9K/2024:user/release-keys',
    report_model: 'XR85Z9K',
    screen_param: '7680-4320-280',
    cast_model: 'XR-85Z9K'
  };
  profile.x_uid = computeXUid(profile);
  return profile;
}

let cachedSession = null;
let sessionPending = null;

function tvError(step, reason, recoverable) {
  const error = new Error(step + ': ' + reason);
  error.sessionInvalid = !!recoverable;
  return error;
}

function resultCode(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  for (const key of ['result', 'code', 'errCode', 'errcode', 'ret']) {
    const raw = value[key];
    if ((typeof raw === 'number' && Number.isInteger(raw)) ||
        (typeof raw === 'string' && /^-?\d+$/.test(raw.trim()))) return Number(raw);
  }
  for (const key of ['data', 'error', 'response']) {
    const code = resultCode(value[key]);
    if (code !== null) return code;
  }
  return null;
}

function apiJson(response, step, allowedCodes) {
  const status = Number(response && (response.status || response.statusCode) || 200);
  if (status < 200 || status >= 300) throw tvError(step, 'HTTP ' + status, [400,401,403].includes(status));
  let value;
  try { value = typeof response.data === 'string' ? argsify(response.data) : response.data; }
  catch (e) { throw tvError(step, '响应不是有效 JSON', false); }
  if (!value || typeof value !== 'object') throw tvError(step, '响应格式不正确', false);
  const code = resultCode(value);
  if (code !== null && !(allowedCodes || [0]).includes(code)) {
    throw tvError(step, '业务状态 ' + code, [400,401,403].includes(code));
  }
  return value;
}

async function cloudGuid(profile, xfp) {
  const body = sortedJsonStringify({device_id:rsaEncryptDeviceId(profile.x_uid),device_name:DEFAULT_DEVICE_NAME}, false);
  const post = async (url, step) => apiJson(await $fetch.post(url, body, {
    headers:buildTvHeaders(profile, xfp, null, 'application/json'), timeout:8
  }), step, [0,2,601,694,695]);
  const guidOf = value => value && value.data && typeof value.data.guid === 'string' ? value.data.guid.trim() : '';
  const current = await post(CLOUD_GET_URL, 'cloud/get');
  const code = resultCode(current);
  if (code === 0 && guidOf(current)) return guidOf(current);
  if ([601,2].includes(code)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const registered = await post(CLOUD_REGISTER_URL, 'cloud/register');
      const registeredCode = resultCode(registered);
      if (registeredCode === 0 && guidOf(registered)) return guidOf(registered);
      if ([0,694,2].includes(registeredCode)) {
        const fetched = await post(CLOUD_GET_URL, 'cloud/get-after-register');
        if (resultCode(fetched) === 0 && guidOf(fetched)) return guidOf(fetched);
        break;
      }
      if (registeredCode !== 695) break;
    }
  }
  // Preserve a registered identity during temporary registration problems;
  // the required heartbeat below still has to validate this GUID.
  if (typeof profile.cloud_guid === 'string' && profile.cloud_guid.trim()) return profile.cloud_guid.trim();
  throw tvError('cloud/register', '未取得有效设备 GUID', false);
}

async function heartbeat(sess, force) {
  const age = Date.now() - sess.lastHeartbeat;
  if (!force && age >= 0 && age < HEARTBEAT_INTERVAL_MS) return;
  if (sess.heartbeatPending) return sess.heartbeatPending;
  sess.heartbeatPending = (async () => {
    const value = Object.assign({}, sess.reportValue, {
      data_time:String(Date.now()).slice(0,13),guid:sess.profile.cloud_guid,network_type:'WiFi',other:''
    });
    apiJson(await $fetch.post(HEARTBEAT_URL, sortedJsonStringify({key:'app_heartbeat',value:value}, false), {
      headers:buildTvHeaders(sess.profile,sess.xfp,null,'application/json'), timeout:8
    }), 'heartbeat');
    sess.lastHeartbeat = Date.now();
  })();
  try { await sess.heartbeatPending; } finally { sess.heartbeatPending = null; }
}

function buildTvHeaders(profile, xfp, ts, contentType) {
  const h = {
    'Accept': 'application/json',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Referer': 'api.cctv.cn',
    'User-Agent': 'cctv_app_tv',
    'UID': profile.android_id,
    'appChannel': 'dangbei',
    'X-Uid': profile.x_uid,
    'X-Fingerprint': xfp,
    'X-Version': '1.4.1',
    'X-Timestamp': String(ts || Date.now()),
    'X-Nonce': uuidv4()
  };
  if (contentType) h['Content-Type'] = contentType;
  return h;
}

async function ensureTvSession() {
  const now = Date.now();
  const age = cachedSession ? now - cachedSession.createdAt : -1;
  if (cachedSession && age >= 0 && age < SESSION_TTL_MS) {
    const session = cachedSession;
    await heartbeat(session, false);
    return session;
  }
  if (sessionPending) return sessionPending;
  sessionPending = createTvSession();
  try { return await sessionPending; } finally { sessionPending = null; }
}

async function createTvSession() {
  const now = Date.now();

  let profile = null;
  try {
    const raw = $cache.get(CACHE_KEY_DEVICE);
    if (raw) profile = argsify(raw);
  } catch (e) {}
  const requiredFields = ['android_id','mac','hardware','board','brand','device','manufacturer','model','product','tags','build_type','user','resolution','display','version_id','host','fingerprint','report_model','screen_param','cast_model'];
  if (!profile || !requiredFields.every(key => typeof profile[key] === 'string' && profile[key])) {
    profile = createDefaultDevice();
    try { $cache.set(CACHE_KEY_DEVICE, jsonify(profile)); } catch (e) {}
  }
  profile.x_uid = computeXUid(profile);

  const fpObj = computeFingerprint(profile.x_uid, now);
  const startBody = {
    key: 'app_start_d1',
    value: {
      android_id: profile.android_id,
      app_channel: 'dangbei',
      app_key: REPORT_APP_KEY,
      app_language: 'CHINESE',
      app_version: '1.4.1',
      cctv_id: profile.x_uid,
      data_time: String(now).slice(0, 13),
      device_board: profile.board,
      device_brand: profile.brand,
      device_builder_type: profile.build_type,
      device_display: profile.display,
      device_fingerprint: profile.fingerprint,
      device_hardware: profile.hardware,
      device_host: profile.host,
      device_id: profile.android_id,
      device_manufacturer: profile.manufacturer,
      device_model: profile.report_model,
      device_params: profile.device,
      device_product: profile.product,
      device_resolution: profile.resolution,
      device_tags: profile.tags,
      device_type: 'TV',
      device_user: profile.user,
      device_version_id: profile.version_id,
      idfa: '',
      idfv: '',
      imei: '',
      mac: profile.mac,
      os_version: '13',
      sdk_version: '',
      system_type: 'Android',
      user_id: ''
    }
  };

  const startHeaders = buildTvHeaders(profile, fpObj.xfp, fpObj.ts, 'application/json');
  startHeaders['UID'] = '';
  const startPayload = sortedJsonStringify(startBody, true);
  const startResp = await $fetch.post(APP_START_URL, startPayload, { headers: startHeaders, timeout:8 });
  const startJson = apiJson(startResp, 'app/start');
  const encKey = startJson && startJson.data && (typeof startJson.data === 'string' ? startJson.data : startJson.data.key);
  if (typeof encKey !== 'string' || !encKey) throw tvError('app/start', '缺少 session_key', true);
  const sessionKey = aesGcmDecryptB64(encKey, fpObj.xfp.slice(0, 32));
  if (!sessionKey) throw tvError('app/start', 'session_key 为空', true);

  profile.cloud_guid = await cloudGuid(profile, fpObj.xfp);
  try { $cache.set(CACHE_KEY_DEVICE, jsonify(profile)); } catch (e) {}
  const session = {
    profile: profile,
    xfp: fpObj.xfp,
    sessionKey: sessionKey,
    createdAt: Date.now(),
    reportValue: startBody.value,
    lastHeartbeat: 0,
    heartbeatPending: null
  };
  await heartbeat(session, true);
  cachedSession = session;
  return session;
}

async function resolveTv4kPlayUrl(ch) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try { return await resolveTvOnce(ch); }
    catch (error) {
      if (attempt !== 0 || !(error.sessionInvalid || /^AES-GCM/.test(String(error.message)))) throw error;
      cachedSession = null;
    }
  }
}

async function resolveTvOnce(ch) {
  const sess = await ensureTvSession();
  const profile = sess.profile;

  // Step 1: live/v1/01
  const live01Body = sortedJsonStringify({
    clientSign: 'cctvVideo',
    deviceId: { android_id: '', imei: '', serial: '' },
    id: ch.liveId,
    model: profile.cast_model,
    rate: '',
    screenParam: profile.screen_param,
    systemType: 'ios',
    userId: DEFAULT_LIVE_USER_ID
  }, false);

  const r1 = await $fetch.post(LIVE_V1_01_URL, live01Body, {
    headers: buildTvHeaders(profile, sess.xfp, null, 'application/json'), timeout:8
  });
  const j1 = apiJson(r1, 'live/v1/01');
  const videos = j1 && j1.data && (j1.data.videoList || j1.data.videos);
  if (!Array.isArray(videos) || !videos.length) throw tvError('live/v1/01', '缺少视频线路', false);

  let video = videos.find((v) => v && v.rate === '36p' && v.url) || videos.find((v) => v && v.url);
  if (!video || typeof video.url !== 'string') throw tvError('live/v1/01', '没有可用地址', false);
  const rawUrl = video.url;
  const liveUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : aesGcmDecryptB64(rawUrl, sess.sessionKey);

  // Step 2: live/v1/02
  const live02Body = sortedJsonStringify({
    guid: aesGcmEncryptB64('', sess.sessionKey)
  }, false);
  const r2 = await $fetch.post(LIVE_V1_02_URL, live02Body, {
    headers: buildTvHeaders(profile, sess.xfp, null, 'application/json'), timeout:8
  });
  const j2 = apiJson(r2, 'live/v1/02');
  const encSecret = j2 && j2.data && (typeof j2.data === 'string' ? j2.data : (j2.data.appSecret || j2.data.app_secret));
  if (typeof encSecret !== 'string' || !encSecret) throw tvError('live/v1/02', '缺少 appSecret', true);
  const appSecret = aesGcmDecryptB64(encSecret, sess.sessionKey);

  // Step 3: vdn/getstream
  const randomStr = randomHex(8) + '-0000-' + randomHex(4) + '-0000-00000000' + randomHex(4);
  const appSign = md5Hex(AK + appSecret + randomStr);
  const appCommon = sortedJsonStringify({
    adid: '',
    an: VDN_APP_NAME,
    ap: 'cctv_app_tv',
    av: '1.4.1'
  }, false);

  const vdnHeaders = buildTvHeaders(profile, sess.xfp, null, 'application/x-www-form-urlencoded');
  vdnHeaders['APPID'] = AK;
  vdnHeaders['APPSIGN'] = appSign;
  vdnHeaders['APPRANDOMSTR'] = randomStr;

  const vdnForm = 'appcommon=' + encodeURIComponent(appCommon) + '&url=' + encodeURIComponent(liveUrl);
  const r3 = await $fetch.post(VDN_GETSTREAM_URL, vdnForm, { headers: vdnHeaders, timeout:8 });
  const j3 = apiJson(r3, 'VDN');
  if (!j3 || String(j3.succeed) !== '1' || !j3.url) {
    const rawState = String(j3 && j3.succeed);
    const state = /^-?\d+$/.test(rawState) ? rawState : '未提供';
    const detail = j3 && (j3.message || j3.msg || j3.errorMsg || j3.errMsg);
    throw tvError('VDN', '取流失败，状态 ' + state + (typeof detail === 'string' ? '，' + safeError(new Error(detail)) : ''), true);
  }
  if (typeof j3.url !== 'string' || !/^https?:\/\//i.test(j3.url)) throw tvError('VDN', '视频地址格式不正确', false);

  return {
    urls: [j3.url],
    isLive: true,
    mimeType: 'application/x-mpegURL',
    // Upstream rateName labels even some HD channels as "4K/8K".
    // Preserve that metadata separately without presenting it as measured resolution.
    names: ['电视线路 · ' + (video.rate === '36p' ? '高码率' : video.rate === '10p' ? '标准码率' : '自动档位')],
    rate: String(video.rate || ''),
    rateName: typeof video.rateName === 'string' ? video.rateName : '',
    headers: [
      {
        'UID': profile.android_id,
        'APPID': AK,
        'APPRANDOMSTR': randomStr,
        'APPSIGN': appSign,
        'Referer': 'api.cctv.cn',
        'User-Agent': 'cctv_app_tv'
      }
    ]
  };
}

// JCE 普通主线返回一段有限回看清单；由宿主持续刷新并合并成直播窗口。
class JceWriter {
  constructor(){this.parts=[];}
  raw(b){this.parts.push(new Uint8Array(b));}
  head(t,tag){this.raw(tag<15?[(tag<<4)|t]:[240|t,tag]);}
  number(v,tag){
    if(v===0){this.head(12,tag);return;}
    const n=v>=-128&&v<=127?1:v>=-32768&&v<=32767?2:v>=-2147483648&&v<=2147483647?4:8;
    this.head(n===1?0:n===2?1:n===4?2:3,tag);
    const b=new Uint8Array(n);let value=BigInt(v);for(let i=n-1;i>=0;i--){b[i]=Number(value&255n);value>>=8n;}this.raw(b);
  }
  string(s,tag){const b=utf8ToBytes(s);this.head(b.length>255?7:6,tag);this.raw(b.length>255?u32Bytes(b.length):[b.length]);this.raw(b);}
  bytes(b,tag){this.head(13,tag);this.head(0,0);this.number(b.length,0);this.raw(b);}
  struct(fn,tag){this.head(10,tag);fn(this);this.head(11,0);}
  list(tag){this.head(9,tag);this.number(0,0);}
  out(){return concatBytes(this.parts);}
}
class JceReader {
  constructor(b){this.b=b;this.p=0;this.depth=0;}
  get(n){if(n<0||n>1048576||this.p+n>this.b.length)throw Error('JCE 数据长度无效');const b=this.b.slice(this.p,this.p+n);this.p+=n;return b;}
  head(){const b=this.get(1)[0];return[b&15,(b>>4)===15?this.get(1)[0]:b>>4];}
  field(){return this.value(this.head()[0]);}
  count(){const n=this.field();if(!Number.isInteger(n)||n<0||n>100000)throw Error('JCE 元素数量无效');return n;}
  value(t){
    if(t<=5){const n=[1,2,4,8,4,8][t],b=this.get(n),d=new DataView(b.buffer,b.byteOffset,b.byteLength);if(t===4)return d.getFloat32(0);if(t===5)return d.getFloat64(0);if(n===1)return d.getInt8(0);if(n===2)return d.getInt16(0);if(n===4)return d.getInt32(0);return Number(d.getBigInt64(0));}
    if(t===6||t===7)return bytesToUtf8(this.get(t===6?this.get(1)[0]:readU32BE(this.get(4),0)));
    if(t===12)return 0;
    if(t===13){if(this.head()[0]!==0)throw Error('JCE 字节类型无效');return this.get(this.count());}
    if(t===11)return null;
    if(++this.depth>32)throw Error('JCE 嵌套过深');
    try{
      if(t===10)return this.struct();
      if(t===9){const n=this.count(),a=[];for(let i=0;i<n;i++)a.push(this.field());return a;}
      if(t===8){const n=this.count(),m={};for(let i=0;i<n;i++){const k=this.field();m[k]=this.field();}return m;}
      throw Error('JCE 数据类型无效');
    }finally{this.depth--;}
  }
  struct(){const m={};while(this.p<this.b.length){const [t,tag]=this.head();if(t===11)break;m[tag]=this.value(t);}return m;}
}
let jceGuid='';
function jceQua(w){
  w.string('3.2.7.26212',0);w.string('302070',1);
  [[1080,2],[2400,3],[3,4]].forEach(x=>w.number(x[0],x[1]));
  w.string('12',5);[[1,6],[1,7],[420,8]].forEach(x=>w.number(x[0],x[1]));w.string('10070',9);
  for(let i=10;i<15;i++)w.string('',i);
  w.struct(x=>{x.number(0,0);x.number(0,1);x.string('',2);},15);
  for(let i=16;i<19;i++)w.string('',i);
  w.struct(x=>{x.number(0,0);x.head(4,1);x.raw(new Uint8Array(4));x.head(4,2);x.raw(new Uint8Array(4));x.head(5,3);x.raw(new Uint8Array(8));},19);
  w.string(jceGuid.slice(0,16),20);w.string('Pixel 6',21);w.number(1,22);
  for(let i=23;i<27;i++)w.number(0,i);
  w.string('',27);w.string('',28);w.string(jceGuid,29);
}
function jcePacket(ch,start,end,reqid){
  if(typeof Widget==='undefined'||!Widget.binary)throw Error('请更新 WeBox 以支持普通直播主线');
  if(!jceGuid)jceGuid=randomHex(32);
  const body=new JceWriter();body.string(ch.pid,0);body.string(ch.sid,1);body.number(start,2);body.number(end,3);body.string(ch.defn,4);
  const w=new JceWriter();w.struct(x=>{
    x.number(reqid,0);x.number(25312,1);x.struct(jceQua,2);x.string('1200013',3);x.string(jceGuid,4);x.list(5);x.struct(()=>{},6);x.list(7);x.number(0,8);x.number(0,9);x.number(0,10);
  },0);w.bytes(body.out(),1);
  const cmd=w.out(),inner=concatBytes([new Uint8Array([38]),u32Bytes(cmd.length+17),new Uint8Array([1]),new Uint8Array(10),cmd,new Uint8Array([40])]);
  const compressed=base64ToBytes(Widget.binary.gzip(bytesToBase64(inner)));
  const out=concatBytes([new Uint8Array([19]),u32Bytes(0),u16Bytes(2),u16Bytes(65281),u16Bytes(25312),u16Bytes(0),u32Bytes(0),u32Bytes(reqid),u32Bytes(531),u32Bytes(10012),new Uint8Array(8),utf8ToBytes(jceGuid),new Uint8Array([1]),u32Bytes(302070),new Uint8Array(6),new Uint8Array(5),u32Bytes(inner.length),compressed,new Uint8Array([3])]);
  writeU32BE(out,1,out.length);return out;
}
const JCE_UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const jceInitial={};
async function resolveJceUrl(ch){
  const now=Math.floor(Date.now()/1000),packet=jcePacket(ch,now-300,now,Date.now()&0x7fffffff);
  const response=await $fetch.post('https://jacc.ysp.cctv.cn',bytesToBase64(packet),{dataEncoding:'base64',base64Data:true,headers:{'Content-Type':'application/octet-stream'},timeout:12});
  if(Number(response.status||response.statusCode)!==200)throw Error('普通主线接口暂不可用');
  const raw=base64ToBytes(response.data);if(raw.length<90||raw[0]!==19)throw Error('普通主线响应格式无效');
  let payload=raw.slice(89,-1);
  if(readU32BE(raw,21)&2)payload=base64ToBytes(Widget.binary.gunzip(bytesToBase64(payload)));
  if(payload[0]!==38||payload[payload.length-1]!==40)throw Error('普通主线响应不完整');
  const body=new JceReader(payload.slice(16,-1)).struct()[1];if(!(body instanceof Uint8Array))throw Error('普通主线缺少数据');
  const m=new JceReader(body).struct();if(m[0])throw Error('普通主线接口返回 '+m[0]);
  const url=m[2];if(typeof url!=='string'||!/^https?:\/\//.test(url)||url.includes('liverecord.video.cloud.cctv.com'))throw Error('普通主线未返回可用地址');
  return url;
}
async function getLivePlaylist(ext){
  const {slug}=argsify(ext),ch=CHANNEL_INDEX[slug];if(!ch)throw Error('频道不存在');
  const cached=jceInitial[slug];delete jceInitial[slug];
  const url=cached&&Date.now()-cached.time<3000?cached.url:await resolveJceUrl(ch);
  const response=await $fetch.get(url,{headers:{'User-Agent':JCE_UA},timeout:12});
  if(Number(response.status||response.statusCode)!==200||typeof response.data!=='string'||!response.data.trimStart().startsWith('#EXTM3U'))throw Error('直播清单暂不可用');
  return jsonify({playlist:response.data,baseUrl:url});
}

// ==================== 播放器插件标准导出接口 ====================

const appConfig = {
  ver: 202611015,
  title: '央视频直播',
  mediaType: 'live',
  site: 'https://www.yangshipin.cn',
  tabs: [
    { name: '全部频道', ext: { id: 'all' } },
    { name: '4K/超高清', ext: { id: '4k' } },
    { name: '央视频道', ext: { id: 'cctv' } },
    { name: '卫视频道', ext: { id: 'weishi' } },
    { name: 'CGTN/特色', ext: { id: 'other' } }
  ]
};

function matchTab(slug, tabId) {
  if (tabId === 'all') return true;
  if (tabId === '4k') return !!TRUE_4K_CHANNELS[slug];
  if (tabId === 'cctv') return slug.indexOf('cctv') === 0;
  if (tabId === 'other') return slug.indexOf('cgtn') === 0 || slug === 'cetv1' || slug === 'guoxue';
  if (tabId === 'weishi') return slug.indexOf('cctv') !== 0 && slug.indexOf('cgtn') !== 0 && slug !== 'cetv1' && slug !== 'guoxue';
  return true;
}

function channelToCard(slug) {
  const ch = CHANNEL_INDEX[slug];
  let remark = '普通直播';
  if (TRUE_4K_CHANNELS[slug]) remark = '超高清频道';
  else if (ch.liveId) remark = '电视 / 普通线路';
  return {
    vod_id: ch.slug,
    vod_name: ch.name,
    vod_pic: ch.logo,
    isLive: true,
    vod_remarks: remark,
    ext: { id: ch.slug }
  };
}

async function getLocalInfo(ext) {
  return jsonify({
    ver: 1,
    name: '央视频直播',
    api: 'ysp_live_js',
    type: 3
  });
}

async function getConfig() {
  return jsonify(appConfig);
}

async function getCards(ext) {
  const { id = 'all', page = 1 } = argsify(ext);
  if (Number(page) > 1) {
    return jsonify({ list: [], hasMore: false });
  }
  const cards = [];
  DEFAULT_CHANNELS.forEach((item) => {
    const slug = item[0];
    if (matchTab(slug, id)) {
      cards.push(channelToCard(slug));
    }
  });
  return jsonify({
    list: cards,
    hasMore: false
  });
}

async function getTracks(ext) {
  const { id } = argsify(ext);
  const ch = CHANNEL_INDEX[id];
  if (!ch) return jsonify({ list: [] });

  const groups = [
    {title:'普通直播',tracks:[{name:ch.name,pan:'',ext:{slug:ch.slug,mode:'normal'}}]},
    {
      title: '普通备用线路',
      tracks: [
        {
          name: ch.name + ' · 普通直播',
          pan: '',
          ext: { slug: ch.slug, mode: 'bk' }
        }
      ]
    }
  ];

  if (ch.liveId) {
    const label = ' · 优先高码率';
    groups.unshift({
      title: '电视线路',
      tracks: [
        {
          name: ch.name + label,
          pan: '',
          ext: { slug: ch.slug, mode: 'tv' }
        }
      ]
    });
  }

  return jsonify({ list: groups });
}

async function getPlayinfo(ext) {
  const { slug, mode = 'normal' } = argsify(ext);
  const ch = CHANNEL_INDEX[slug];
  if (!ch) return jsonify({ urls: [], headers: [] });

  // Keep the user's choice: TV failures must not silently turn into a BK line.
  if (mode === 'tv') {
    if (!ch.liveId) throw new Error('这个频道没有电视线路，请选择普通备用线路');
    try {
      const res = await resolveTv4kPlayUrl(ch);
      if (res && res.urls && res.urls.length) {
        return jsonify(res);
      }
      throw new Error('电视接口没有返回视频地址');
    } catch (e) {
      throw new Error('电视线路暂不可用（' + safeError(e) + '），可返回选择普通备用线路');
    }
  }
  if(mode==='normal'){
    try{const url=await resolveJceUrl(ch);jceInitial[slug]={url,time:Date.now()};return jsonify({urls:[url],headers:[{'User-Agent':JCE_UA}],isLive:true,mimeType:'application/x-mpegURL',names:['普通直播'],playlistFunction:'getLivePlaylist',playlistParams:{slug}});}
    catch(e){throw new Error('普通主线暂不可用（'+safeError(e)+'）');}
  }
  if (mode !== 'bk') throw new Error('无法识别播放线路，请重新打开频道');

  try {
    const playback = await fetchBkPlayUrls(ch);
    const urls = [await playableBkUrl(playback)];
    const headers = urls.map(() => Object.assign({}, playback.headers));
    return jsonify({
      urls: urls,
      isLive: true,
      mimeType: 'application/x-mpegURL',
      names: urls.map((_, index) => '普通直播 · 线路 ' + (index + 1)),
      headers: headers
    });
  } catch (e) {
    throw new Error('普通直播线路暂不可用（' + safeError(e) + '），请稍后重试');
  }
}

function safeError(error) {
  const message = String(error && error.message || error || '请求失败');
  // Transport errors may contain a complete signed request URL.
  return message.replace(/https?:\/\/[^\s"'<>]+/gi, '[请求地址]').slice(0, 180);
}

async function search(ext) {
  const { text, wd } = argsify(ext);
  const kw = String(text || wd || '').trim().toLowerCase();
  if (!kw) return jsonify({ list: [] });

  const cards = [];
  DEFAULT_CHANNELS.forEach((item) => {
    const slug = item[0];
    const name = item[1].toLowerCase();
    if (slug.indexOf(kw) !== -1 || name.indexOf(kw) !== -1) {
      cards.push(channelToCard(slug));
    }
  });
  return jsonify({ list: cards });
}
