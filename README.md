# KoreanNote｜我的韓文學習筆記

KoreanNote 是一個以繁體中文整理韓文學習內容的靜態網站，包含單字收藏、文法筆記與互動小測驗。採用原生 HTML、CSS、JavaScript，無需安裝套件即可部署到 GitHub Pages。

## 功能
- 單字庫：搜尋韓文、中文意思、羅馬拼音與例句。
- 分類篩選：依學習、生活、動詞、形容詞、副詞等分類瀏覽。
- 文法筆記：整理常用文法的意思、接續方式、例句與補充說明。
- 小測驗：五道選擇題，即時顯示正誤與解釋，完成後可重新挑戰。
- 響應式版面：支援桌機與手機。

## 專案結構
```text
KoreanNote/
├── index.html
├── style.css
├── app.js
├── AGENTS.md
├── README.md
└── data/
    ├── vocabulary.json
    ├── grammar.json
    └── quiz.json
```

## 本機預覽
由於網站使用 `fetch()` 讀取 JSON，請透過本機伺服器開啟，不要直接雙擊 `index.html`。

```bash
python -m http.server 8000
```

接著在瀏覽器開啟 `http://localhost:8000`。

## 部署到 GitHub Pages
1. 在 GitHub 建立新的 Public repository，例如 `KoreanNote`。
2. 將本專案所有檔案上傳到 repository 根目錄。
3. 進入 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**。
5. Branch 選 `main`，資料夾選 `/ (root)`，按 Save。
6. 等待 GitHub Pages 完成部署，網址通常為 `https://你的帳號.github.io/KoreanNote/`。

## 如何讓 AI 繼續擴充
請先閱讀 `AGENTS.md`。新增單字、文法或測驗題時，依照其中定義的 JSON 欄位格式更新 `data/`，再確認 `app.js` 的渲染邏輯可正確呈現。若要新增一個頁面或功能，需同步更新導覽、README，並測試手機版與桌機版。這能讓 AI 延續既有資料結構與設計，不會每次新增內容都採用不同格式。

## 注意
目前內附的單字、文法與題目為學習示範內容。正式使用前，建議依課堂教材或可靠韓語辭典再次確認細節。
