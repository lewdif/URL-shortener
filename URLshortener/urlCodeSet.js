// 0~9, A~Z, a~z 총 62개의 문자
var codes = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var codeLen = codes.length;

function encode(num)
{
  var result = '';
  var id = num;

  // 입력받은 10진수를 codes를 사용하는 62진수로 변환
  while (id)
  {
    var remain = id % codeLen;
    result = codes[remain].toString() + result;

    id = Math.floor(id / codeLen);
  }

  return result;
}

function decode(str)
{
  var result = 0;
  var shortURL = str;
  var idx = '';
  var pwr = 0;

  // 입력받은 codes를 사용하는 62진수를 10진수로 변환
  while (shortURL)
  {
    idx = codes.indexOf(shortURL[0]);
    pwr = shortURL.length - 1;

    result += idx * (Math.pow(codeLen, pwr));

    shortURL = shortURL.substring(1);
  }

  return result;
}

module.exports.encode = encode;
module.exports.decode = decode;
