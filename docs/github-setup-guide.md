# GitHubセットアップガイド

このドキュメントでは、このRepositoryの開発に参加する前に必要となるGit・GitHubの初期設定について説明します。

MacおよびWindowsのWSLなど、bashとOpenSSHを利用できる環境を想定しています。

すでにGitHubへのSSH接続が設定されており、SSH経由でRepositoryをClone・Pushできる場合は、この手順は不要です。


## 1. Gitを利用できることを確認する

以下のコマンドを実行します。

```bash
git --version
```

Gitのバージョンが表示されれば利用できます。

Gitがインストールされていない場合は、使用しているOS・環境に合わせてGitをインストールしてください。


## 2. Gitのユーザー情報を設定する

GitにCommit時のユーザー名とメールアドレスを設定します。

現在の設定は以下で確認できます。

```bash
git config --global user.name
git config --global user.email
```

設定されていない場合は、以下のように設定します。

```bash
git config --global user.name "<GitHubで使用する名前>"
git config --global user.email "<GitHubに登録しているメールアドレス>"
```

GitHubでメールアドレスを非公開にしている場合は、GitHubが提供する `noreply` のメールアドレスを使用しても構いません。

設定後、以下で確認できます。

```bash
git config --global --list
```


## 3. SSH鍵を確認する

GitHubとの認証にはSSHを使用します。

まず、既存のSSH鍵があるか確認します。

```bash
ls -la ~/.ssh
```

例えば、以下のようなファイルが存在する場合は、すでにSSH鍵が作成されている可能性があります。

```text
id_ed25519
id_ed25519.pub
```

`.pub` が付いているファイルが公開鍵、付いていないファイルが秘密鍵です。

既存のSSH鍵をGitHubで利用している場合は、新しい鍵を作成せず、その鍵を利用しても構いません。

> [!WARNING]
> 秘密鍵は他人に共有したり、GitHub RepositoryへCommitしたりしないでください。


## 4. SSH鍵を作成する

GitHubで利用するSSH鍵がない場合は、新しく作成します。

```bash
ssh-keygen -t ed25519 -C "<GitHubに登録しているメールアドレス>"
```

保存先を確認された場合、特に変更する必要がなければEnterを押します。

通常は以下に作成されます。

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

パスフレーズは必要に応じて設定してください。

> [!NOTE]
> すでに同名のSSH鍵が存在する場合は、上書きしないでください。
>
> 既存の鍵を利用するか、別のファイル名で新しい鍵を作成してください。


## 5. SSHのconfigを設定する

GitHubへの接続で使用するSSH鍵を明示するため、`~/.ssh/config` を設定します。

`.ssh` ディレクトリが存在しない場合は作成します。

```bash
mkdir -p ~/.ssh
```

`config` ファイルが存在しない場合は作成します。

```bash
touch ~/.ssh/config
```

`~/.ssh/config` をテキストエディタで開き、以下を記載します。

```text
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

各項目の意味は以下のとおりです。

| 項目 | 内容 |
| --- | --- |
| `Host` | この設定を適用する接続先 |
| `HostName` | 実際に接続するホスト |
| `User` | GitHubへのSSH接続で使用するユーザー |
| `IdentityFile` | GitHubへの接続に使用する秘密鍵 |
| `IdentitiesOnly` | 指定した秘密鍵を使用するようにする |

SSH鍵を別のファイル名で作成した場合は、`IdentityFile` をそのPathに変更してください。

例

```text
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
```

すでに `~/.ssh/config` に設定がある場合は、既存の設定を削除せず、内容を確認したうえでGitHub用の設定を追加してください。

`Host github.com` の設定がすでに存在する場合は、同じHost設定を複数作るのではなく、既存の設定へ必要な項目を追加してください。

必要に応じて、`config` の権限を以下のように設定します。

```bash
chmod 600 ~/.ssh/config
```


## 6. GitHubに公開鍵を登録する

公開鍵の内容を表示します。

```bash
cat ~/.ssh/id_ed25519.pub
```

SSH鍵を別のファイル名で作成した場合は、その公開鍵のPathを指定してください。

表示された内容をすべてコピーします。

GitHubのWebページを開き、ログインします。

画面右上のプロフィールアイコンから以下の順に移動します。

```text
GitHub
↓
Settings
↓
SSH and GPG keys
↓
New SSH key
```

以下を入力します。

| 項目 | 設定内容 |
| --- | --- |
| Title | 使用しているPCが分かる名前 |
| Key type | Authentication Key |
| Key | 公開鍵の内容 |

入力後、**Add SSH key** をクリックして登録します。

> [!WARNING]
> GitHubに登録するのは `.pub` が付いた **公開鍵** です。
>
> `id_ed25519` などの秘密鍵は、GitHubへ登録したり他人へ共有したりしないでください。


## 7. GitHubとのSSH接続を確認する

公開鍵をGitHubへ登録したら、以下を実行します。

```bash
ssh -T git@github.com
```

初回接続時には、GitHubへの接続を続行するか確認される場合があります。

以下のような確認が表示された場合は、接続先がGitHubであることを確認したうえで `yes` を入力します。

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

接続に成功すると、GitHubのユーザー名を含む認証成功メッセージが表示されます。

GitHubへのSSH接続で問題が発生した場合は、以下の記事も参考にしてください。

https://qiita.com/aki4000/items/4c81bc2747bbd5e96d85


## 8. Repositoryへのアクセス権限を確認する

GitHub上で以下のRepositoryを閲覧できることを確認してください。

```text
hontono-rookie-web-design/hontono-rookie-web
```

Repositoryへのアクセス権限がない場合は、管理者からOrganizationまたはRepositoryへの招待を受けてください。


## 9. RepositoryをCloneする

SSHを使用してRepositoryをCloneします。

```bash
git clone git@github.com:hontono-rookie-web-design/hontono-rookie-web.git
```

CloneしたRepositoryへ移動します。

```bash
cd hontono-rookie-web
```

Remote RepositoryがSSH URLになっていることを確認します。

```bash
git remote -v
```

以下のように `git@github.com:` から始まるURLが表示されれば問題ありません。

```text
origin  git@github.com:hontono-rookie-web-design/hontono-rookie-web.git (fetch)
origin  git@github.com:hontono-rookie-web-design/hontono-rookie-web.git (push)
```

これでGitHubの初期設定は完了です。

続いて `setup-guide.md` を参照し、開発環境を構築してください。


## Windows WSLを使用する場合

WindowsでWSLを使用する場合は、Git・SSH・Python・Node.jsなどの開発環境を基本的にWSL側へ構築してください。

SSH鍵やSSH設定もWSL側の以下のディレクトリで管理します。

```text
~/.ssh/
```

例えば以下のような構成になります。

```text
~/.ssh/
├── config
├── id_ed25519
└── id_ed25519.pub
```

Repositoryも可能であればWSL側のファイルシステムにCloneしてください。

例

```text
~/projects/hontono-rookie-web
```

Windows側とWSL側ではGitやSSHの設定が別になる場合があるため、このガイドのコマンドはWSLのTerminal上で実行してください。
