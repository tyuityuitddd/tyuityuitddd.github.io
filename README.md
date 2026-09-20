# 泰迪迪迪 TDDD｜作品集網站

目前已完成可在本機瀏覽的第一版：首頁滾動分離動畫、36 個作品專案、三語切換、分類、作品詳情、大圖檢視、聯絡信箱。

網站包含 68 張作品圖及 1 張個人圖片。原始素材仍保留在專案上一層的「素材」，此網站只包含網頁展示版本。

## 本機預覽

需要 Node.js 22.13 以上版本。在此資料夾開啟終端機：

```sh
npm ci
npm run dev
```

開啟終端機顯示的網址。已安裝套件時，只需執行 `npm run dev`。

## 發佈到 GitHub Pages

此版本以個人主站網址 `https://tyuityuitddd.github.io/` 為目標。

1. 在 GitHub 建立公開儲存庫，名稱必須是 `tyuityuitddd.github.io`。如已經有同名網站，請先保留原站並確認遷移方式，不要直接覆蓋。
2. 將本資料夾的內容放到儲存庫根目錄，使用 `main` 分支。需要包含 `.github/workflows/deploy.yml`、`.pages.yml` 等隱藏檔。
3. 不要上傳 `node_modules`、`dist`、`.vinext` 或上一層的原始「素材」資料夾。
4. 在 GitHub 的 Settings → Pages 將 Source 選為 GitHub Actions。
5. 在 Actions 執行「Publish portfolio to GitHub Pages」。後續每次更新 `main` 都會自動重建並發佈。

網站已發佈：https://tyuityuitddd.github.io/ 。

## 使用管理後台

本專案已附上 Pages CMS 設定檔 `.pages.yml`。儲存庫建立後：

1. 開啟 https://app.pagescms.org/，使用 GitHub 登入。
2. 安裝 Pages CMS GitHub App，授予這個網站儲存庫的存取權。
3. 選取網站儲存庫及 `main` 分支。
4. 在「作品管理」新增作品：填寫唯一英文代號、分類、三語名稱及介紹，並上傳圖片。
5. 第一張圖片就是封面；同一專案可增加多張圖片並調整順序。
6. 打開「顯示在網站」並儲存，等待 GitHub Actions 完成更新。

英日文欄位尚未填寫時，訪客會看到中文原文。翻譯不會自動在發佈時產生。

影片欄位可貼 YouTube 或 Vimeo 連結；訪客點擊後才載入播放器。其他 HTTPS 影片連結會顯示外部連結。本版尚未收到實際影片連結，因此目前不顯示影片區塊。

後台的登入、授權及實際儲存流程需要等連接你的 GitHub 帳號後驗證。目前已完成的是後台欄位配置與網站內容讀取。

## 更新素材

- 建議新增圖片使用 JPG、PNG 或 WebP，長邊約 1600–2200 px，單張盡量控制在 2 MB 以內。
- 每次預覽、檢查與發佈都會自動產生 400／800／1400px WebP 版本。瀏覽器依實際顯示大小與螢幕解析度選圖；放大查看才載入高解析度版本。新增的靜態 JPG、PNG 也會自動轉成 WebP，保留透明背景及原始上傳檔；動態 GIF／WebP 保持動畫原檔。
- 原圖不必刪除，可保留在本機「素材」資料夾。
- `published: false` 只代表網站不展示；公開儲存庫裡的檔案與歷史紀錄仍然公開。
- 首頁雙幅主視覺可在「個人資訊與首頁」調整作品代號，依順序顯示前兩個已公開作品；其餘作品仍保留在作品集中。
- 插畫預設只展示圖片，已移除原檔名式名稱；「顯示名稱與介紹」關閉時不顯示標題與介紹。名稱可用「委託插畫 01」等管理代號；遊戲與設計可開啟此選項顯示專案文字。

## 專案結構

- `content/works/`：每個作品一份 JSON。
- `content/settings.json`：聯絡信箱、簡介、個人圖片、首頁作品。
- `public/media/`：展示圖片與縮圖。
- `app/`、`components/`：網站頁面與互動。
- `.pages.yml`：管理後台設定。
- `.github/workflows/deploy.yml`：GitHub Pages 發佈流程。

## 驗證及輸出

```sh
npm run check
npm run build
```

`check` 檢查型別、素材、作品代號、首頁參照、影片網址及新圖片自動轉換。`build` 產生靜態網頁並驗證作品頁、圖片及連結；輸出位於 `dist/client/`。

網站使用 Sites 產生的 React / vinext 專案，採用純靜態 GitHub Pages 輸出。此版沒有需要在網頁伺服器執行的登入或資料庫；編輯由外部 Pages CMS 處理。

已檢查：38 個靜態頁面、927 個本機連結與素材路徑（含響應式圖片）。尚未執行瀏覽器點擊／手機視覺驗收，GitHub Pages 已發佈；Pages CMS 的登入授權與完整編輯流程仍待驗證。


## 圖片最佳化（2026-09-09）

69 張 400px WebP 版本合計 872,794 bytes；原先縮圖合計 2,236,178 bytes，減少約 61%。首頁四張主視覺的小尺寸版本共 59,892 bytes。這是圖片檔案大小比較，不是載入時間實測；實際下載版本取決於螢幕寬度與像素密度。

最佳化輸出在 `public/optimized/`，對照資料在 `generated/images.json`；它們由建置自動產生，不需手動上傳或修改。原始上傳圖片仍放在 `public/media/`。
