# 本当のルーキー祭り2026春

## フロントエンドのセットアップ方法

1. (Windowsのみ)WSLのインストール
   https://qiita.com/SAITO_Keita/items/148f794a5b358e5cb87b
2. Node.js v24のインストール（anyenvをインストールすると楽）<br>
   anyenv: https://github.com/anyenv/anyenv <br>
   Node.js: https://nodejs.org/ja
3. `.env.local`を共有ドライブからダウンロードして`2026spring/frontend`下に配置
4. 以下を実行

```bash
cd 2026spring/frontend
source .env.local
npm install
npm run dev
```

## バックエンドのセットアップ方法

1. Python 3.12のインストール
2. 以下を実行

```bash
python -m venv .venv

# Windowsの場合
.venv/Scripts/activate.ps1
# macOS, linuxの場合
. .venv/bin/activate

cs 2026spring/backend
pip install -r requirements.txt
python -m scripts.<module_name>
# 例: python -m scripts.setup_forms
```
