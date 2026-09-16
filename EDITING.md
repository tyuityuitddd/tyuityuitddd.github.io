# 如何編輯你的作品集

網站：https://tyuityuitddd.github.io/
編輯後台：https://app.pagescms.org/

## 第一次連接後台

1. 打開後台，選擇 GitHub 登入，使用 tyuityuitddd 帳號。
2. 如果要求安裝 Pages CMS GitHub App，選擇 Only select repositories，只勾選 tyuityuitddd.github.io。
3. 回到後台，選擇 tyuityuitddd.github.io，分支選 main。
4. 此專案已有 .pages.yml 設定，不必重新建立。應可看到「作品管理」與「個人資訊與首頁」。

後台尚未完成你的登入連接與實際儲存驗證。如果畫面不同，告訴我目前顯示的文字，我會接著帶你操作。

## 作品管理

- 換圖：進入作品的「圖片」欄位，選取或上傳新圖片；第一張為封面。
- 新增：新增一筆作品，填獨立英文網址代號（例如 commission-030）、分類、管理用中文名稱及圖片。圖片簡短說明可寫「委託角色插畫」，不要填客戶資料或原檔名。
- 只放圖：「顯示名稱與介紹」保持關閉。中文名稱仍用來管理，可填「委託插畫 30」；介紹可留白，英文與日文名稱也可留白。
- 顯示介紹：開啟「顯示名稱與介紹」，填想公開的名稱與介紹。遊戲與設計作品通常可開啟。
- 排序：數字越小越前面。
- 下架展示：關閉「顯示在網站」。這不會刪除公開儲存庫中的檔案與歷史。
- 影片：貼入 YouTube 或 Vimeo 網址。
- 儲存：確認儲存到 main，GitHub 會自動建置與發佈。等儲存庫 Actions 的最新執行完成後，再重新整理網站。

JPG、PNG 會在發佈時自動產生 WebP 展示版本，無需自己轉檔。單純上傳到媒體庫不會自動變成作品，仍要在作品資料中選取圖片。

## 個人資訊與首頁

可以修改聯絡信箱、個人圖片、三語簡介，以及首頁四張選圖（填入作品的網址代號）。首頁大標、選單文案與版面動畫目前由程式管理，需要修改時可以直接告訴我。

## 不使用後台也能編輯

打開 https://github.com/tyuityuitddd/tyuityuitddd.github.io/tree/main/content/works ，選取作品 JSON，再點鉛筆修改。個人簡介在 content/settings.json。修改後選 Commit changes 存到 main，就會自動發佈。

建議平時使用後台，避免手動修改 JSON 的逗號或引號。

官方後台入門：https://pagescms.org/docs/quick-start/
