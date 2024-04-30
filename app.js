import { createHash } from "crypto";
import crypto from "crypto";
import fs from "fs";
///////////////////本區請自行修改///////////////////
//一、選擇要計算 CheckMacValue 還是 AES 加密。0：計算 CheckMacValue；1：AES 加密；2：AES 解密
const option = 0;

//二、修改 HashKey 與 HashIV
const HashKey = "pwFHCqoQZGmho4w6"; //3002607
const HashIV = "EkRm7iFT261dpevs"; //3002607

//三、修改參數
//3.1 CheckMacValue 資料：請自行選擇並修改變數 CMVparameters
const CMValgorithm = "sha256"; //CheckMacValue使用的演算法，請自行修改為 'sha256' 或 'md5'
const CMVparameters = {
  "MerchantID": "3002607",
  "MerchantTradeNo": "20240430000010",
  "MerchantTradeDate": "2024/04/30 10:48:36",
  "PaymentType": "aio",
  "TotalAmount": 100,
  "TradeDesc": "測試描述",
  "ItemName": "測試品名",
  "ReturnURL": "https://www.ecpay.copm.tw",
  "ChoosePayment": "Credit",
  "EncryptType": 1,

};

//const CMVparameters=''

//3.2 AES 加密前的 Data(應為 JSON 格式)
const AESalgorithm = "aes-128-cbc";
const DataArray = {};


//3.3 AES 解密前的 Data
const EncodedData ="";

///////////////////以下不須修改///////////////////
//四、CheckMacValue 或 AES 計算過程
//4.1 CheckMacValue 計算函式

let method;
if (CMValgorithm === "sha256") {
  method = "SHA256";
} else if (CMValgorithm === "md5") {
  method = "MD5";
}

function CheckMacValueGen(CMVparameters, algorithm, digest) {
  let CMVStep0;
  if (typeof CMVparameters === "string") {
    CMVStep0 = CMVparameters;
  } else if (typeof CMVparameters === "object") {
    CMVStep0 = Object.entries(CMVparameters)
      .map(([Key, value]) => `${Key}=${value}`)
      .join("&");
  }

  function DotNETURLEncode(string) {
    const list = {
      "%2D": "-",
      "%5F": "_",
      "%2E": ".",
      "%21": "!",
      "%2A": "*",
      "%28": "(",
      "%29": ")",
      "%20": "+",
    };

    Object.entries(list).forEach(([encoded, decoded]) => {
      const regex = new RegExp(encoded, "g");
      string = string.replace(regex, decoded);
    });

    return string;
  }

  const CMVStep1 = CMVStep0.split("&")
    .sort((a, b) => {
      const KeyA = a.split("=")[0];
      const KeyB = b.split("=")[0];
      return KeyA.localeCompare(KeyB);
    })
    .join("&");
  const CMVStep2 = `HashKey=${HashKey}&${CMVStep1}&HashIV=${HashIV}`;
  const CMVStep3 = DotNETURLEncode(encodeURIComponent(CMVStep2));
  const CMVStep4 = CMVStep3.toLowerCase();
  const CMVStep5 = createHash(algorithm).update(CMVStep4).digest(digest);
  const CMVStep6 = CMVStep5.toUpperCase();

  return `
  檢核碼計算順序<br/>
<p>(1) 將傳遞參數依照第一個英文字母，由A到Z的順序來排序(遇到第一個英名字母相同時，以第二個英名字母來比較，以此類推)，並且以&方式將所有參數串連。<br/>
${CMVStep1}</p>

<p>(2) 參數最前面加上HashKey、最後面加上HashIV<br/>
${CMVStep2}</p>

<p>(3) 將整串字串進行URL encode<br/>
${CMVStep3}</p>

<p>(4) 轉為小寫<br/>
${CMVStep4}</p>

<p>(5) 以 ${method} 方式產生雜凑值<br/>
${CMVStep5}</p>

<p>(6) 再轉大寫產生 CheckMacValue<br/>
${CMVStep6}</p>
  `;
}

// 4.2 AES 加密函式
function AESEncoder(DataArray) {
  let URLEncoded = encodeURIComponent(JSON.stringify(DataArray));

  const cipher = crypto.createCipheriv(AESalgorithm, HashKey, HashIV);
  let EncryptedData = cipher.update(URLEncoded, "utf8", "base64");
  EncryptedData += cipher.final("base64");

  return `
  <p>(1)加密前 Data 資料：<br/>
  ${JSON.stringify(DataArray)}</p>

  <p>(2)URLEncode 編碼後結果：<br/>
  ${URLEncoded}</p>

  <p>(3)AES 加密後結果：<br/>
  ${EncryptedData}</p>
  `;
}

//4.3 AES 解密函式
function AESDecoder(EncodedData) {
  const decipher = crypto.createDecipheriv(AESalgorithm, HashKey, HashIV);
  let DecryptedData = decipher.update(EncodedData, "base64", "utf8");
  DecryptedData += decipher.final("utf8");

  return `
      <p>(1)AES 解密前 Data 資料：<br/>
      ${EncodedData}</p>

      <p>(2)AES 解密後 Data 資料：<br/>
      ${decodeURIComponent(DecryptedData)}</p>
      `;
}

//五、產生 html 畫面
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>顯示文本</title>
</head>
<body>
${
  option == 0
    ? CheckMacValueGen(CMVparameters, CMValgorithm, "hex")
    : option == 1
    ? AESEncoder(DataArray)
    : option == 2
    ? AESDecoder(EncodedData)
    : ""
}
</body>
</html>
`;

//六、製作出 index.html
fs.writeFile("index.html", htmlContent, (err) => {
  if (err) {
    console.error("寫入檔案時發生錯誤:", err);
  } else {
    console.log("已建立 index.html");
    import("open")
      .then((open) => {
        open.default("index.html");
      })
      .catch((error) => {
        console.error("錯誤！", error);
      });
  }
});
