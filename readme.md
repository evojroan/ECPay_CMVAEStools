# 綠界檢查碼與加密產生器
## 這是什麼？
本程式有兩個功能： 
1. 算出綠界科技的全方位金流 / 物流 / 電子發票系統中的檢查碼 (CheckMacValue)。 
2. 將綠界科技金流 / 電子發票的參數進行 AES 加密。 
3. 將綠界科技金流 / 電子發票加密過的參數進行 AES 解密。 

[綠界科技技術文件：檢查碼機制](https://developers.ecpay.com.tw/?p=2902) 
[綠界科技技術文件：參數加密方式](https://developers.ecpay.com.tw/?p=7958)

 ## 什麼是檢查碼？為什麼需要檢查碼？ 
將發送給綠界科技金流系統的所需參數，經過本機制的計算後，最後得到的雜湊值(Hash)。目的是為了確認參數發送者是本人，而非假冒。 

進一步了解雜湊演算法與其應用，請參閱： [用 Node.js 輕鬆實現雜湊演算法 — — Hash 與 Hmac](http://tinyurl.com/3dyh5nzz) 

## 如何使用本程式？
 1. 到「本區請自行修改」先選擇要算出檢查碼、將資料進行 AES 加密或解密。
 2. 輸入 HashKey/ HashIV。
 3. 至檢查碼或 AES 加密區域修改參數即可。檢查碼的參數可以選擇 JSON 格式或字串格式，選擇其一後另一個格式請註解掉；AES 加密前的資料應為 JSON 格式。
 4. 執行本程式碼後，會以瀏覽器自動展示計算結果。 

## 本程式作者其他與綠界相關的程式 
1. 綠界科技全方位金流串接範例 
- [GitHub](https://github.com/evojroan/ECPay_AioCheckout) 
- [Medium](https://medium.com/@roan6903/ecpay-aioexampple-37073ceeb853) 

2. 電子發票前置作業與資料驗證 
- [GitHub](https://github.com/evojroan/ECPAy_EInvoice_Data_Verification) 
- [Medium](https://medium.com/@roan6903/ecpay-einvoice-data-verification-cbd212cb6d63) 

## 本程式作者
Roan，專長是碎碎念。 
- [Roan 的網誌](https://medium.com/@roan6903) 
- [Roan 的 GitHub](https://github.com/evojroan) 