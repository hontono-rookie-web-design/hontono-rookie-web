# フロントエンドのデプロイ・動作確認について

## 概要

フロントエンドは、GitHub Actionsを使用してCloudflare Workersへデプロイします。

デプロイ先は、用途に応じて以下の2種類に分かれています。

| Environment | 用途 | デプロイタイミング |
| --- | --- | --- |
| `<開催期>-preview` | Pull Requestの変更内容を確認するための環境 | Pull Requestの作成・更新時 |
| `<開催期>-production` | 本番環境 | `main`ブランチへのマージ時 |

例えば、開催期が`2026autumn`の場合は、以下のEnvironmentを使用します。

```text
2026autumn-preview
2026autumn-production
```

GitHub上では、Repositoryの **Deployments** から各環境のデプロイ状況と、デプロイされたWebサイトを確認できます。


## 開催期

以降の説明に登場する`<開催期>`は、対象となる開催期を表します。

例えば、以下のような値です。

```text
2026autumn
2027spring
2027autumn
```

Environment名は、以下の命名規則とします。

```text
<開催期>-production
<開催期>-preview
```

例えば、`2026autumn`の場合は以下のようになります。

```text
2026autumn-production
2026autumn-preview
```


## Worker名

デプロイ先となるCloudflare Workerの名前は、`wrangler.jsonc`の`name`で設定します。

```jsonc
{
  "name": "<Worker名>"
}
```

Worker名は開催期などによって変更される可能性があります。

以降の説明に登場する`<Worker名>`は、この`name`に設定されている値を表します。


## Preview環境

### 用途

Preview環境は、Pull Requestの変更内容を`main`へマージする前に、実際にデプロイされたWebサイトで確認するために使用します。

GitHub上では、以下のEnvironmentにPreview Deploymentが登録されます。

```text
<開催期>-preview
```

例えば、`2026autumn`の場合は以下です。

```text
2026autumn-preview
```

Pull Requestごとに異なるPreview URLが発行されます。


### URL

Preview URLは、以下の形式です。

```text
https://pr-{Pull Request番号}-<Worker名>.<workers.devサブドメイン>.workers.dev/
```

例えば、Pull Request #123の場合は以下のようなURLになります。

```text
https://pr-123-<Worker名>.<workers.devサブドメイン>.workers.dev/
```

`pr-{Pull Request番号}`をPreview Aliasとして使用しているため、同じPull Requestにコミットを追加して再デプロイした場合もURLは変わりません。


### Previewがデプロイされるタイミング

デプロイ対象となるフロントエンドに変更があり、以下の操作が行われた場合にPreview用のGitHub Actionsが実行されます。

- Pull Requestを新規作成したとき
- Pull Requestを更新したとき（コミットを追加したとき）
- Pull RequestをReopenしたとき

処理の流れは以下の通りです。

```text
Pull Requestを作成・更新
        ↓
GitHub Actionsを実行
        ↓
GitHub Preview Deploymentを作成
        ↓
Cloudflare WorkersへPreviewをアップロード
        ↓
PR番号を使用したPreview URLを作成・更新
        ↓
GitHubのPreview DeploymentにURLを登録
```

Workflowでは変更対象となるディレクトリを指定しているため、対象のフロントエンドに変更がないPull RequestではPreviewデプロイは実行されません。


### 同じPull Requestを更新した場合

同じPull Requestにコミットを追加すると、Previewが再デプロイされます。

このとき、Preview URLは変わりません。

例えば、Pull Request #123の場合は、何度更新しても以下のURLを使用します。

```text
https://pr-123-<Worker名>.<workers.devサブドメイン>.workers.dev/
```

新しいPreviewのデプロイが成功すると、同じPull Requestに対する以前のGitHub Deploymentは`inactive`になります。

```text
PR #123

1回目のDeployment
└─ inactive

2回目のDeployment
└─ inactive

3回目のDeployment
└─ active（最新）
```

これにより、同じPull Requestに複数のDeployment履歴が存在していても、現在有効なPreviewを判別しやすくしています。


### Previewデプロイの同時実行について

同じPull Requestに対して短時間に複数回コミットが追加された場合、古いPreviewデプロイと新しいPreviewデプロイが同時に実行される可能性があります。

これを防ぐため、Preview用Workflowでは同じPull Requestに対するデプロイの同時実行を制御しています。

```text
PR #123の古いデプロイを実行中
        ↓
PR #123に新しいコミットをPush
        ↓
古いWorkflowをキャンセル
        ↓
最新のWorkflowを実行
```

これにより、古いコミットのデプロイが後から完了してPreview Aliasを上書きすることを防ぎます。


### Previewページを確認する

Previewのデプロイが完了すると、GitHubの **Deployments** からデプロイされたWebサイトを確認できます。

```text
Repository
↓
Deployments
↓
<開催期>-preview
↓
対象のDeployment
↓
Preview URL
```

例えば、`2026autumn`の場合は以下です。

```text
Repository
↓
Deployments
↓
2026autumn-preview
↓
対象のDeployment
↓
Preview URL
```

確認したいPull Requestに対応するDeploymentを選択し、表示されているURLからPreviewページを開きます。

Pull Request #123の場合は、以下の形式のURLになります。

```text
https://pr-123-<Worker名>.<workers.devサブドメイン>.workers.dev/
```

Pull Requestの変更内容については、基本的にこのPreviewページで動作確認を行ってから`main`へマージしてください。


## Preview URLの仕様

Cloudflare Workersでは、デプロイごとにVersionが作成されます。

本プロジェクトでは、Pull Requestを更新するたびに確認用URLが変わってしまわないよう、以下のPreview Aliasを使用します。

```text
pr-{Pull Request番号}
```

そのため、同じPull Requestを何度更新しても、

```text
https://pr-{Pull Request番号}-<Worker名>.<workers.devサブドメイン>.workers.dev/
```

という同じURLから最新のPreviewを確認できます。

一方、Cloudflare内部ではデプロイのたびに新しいVersionが作成されます。

```text
PR #123
│
├─ 1回目のデプロイ
│      └─ Version A
│
├─ 2回目のデプロイ
│      └─ Version B
│
└─ 3回目のデプロイ
       └─ Version C

Preview Alias
└─ pr-123 → 最新Version
```

GitHub上でもDeploymentの履歴は残りますが、同じPull Requestに対する以前のDeploymentは`inactive`となり、最新のDeploymentが有効な状態になります。


## Pull RequestをMerge / Closeした場合

Pull RequestがMergeまたはCloseされると、そのPull Requestに対応するGitHub上のPreview Deploymentを`inactive`にします。

```text
PR #123
↓
Preview Deployment
↓
active
```

という状態からPull RequestをMergeまたはCloseすると、

```text
PR #123
↓
Merge / Close
↓
Cleanup Workflow
↓
Preview Deployment
↓
inactive
```

となります。

これにより、現在OpenになっているPull RequestのPreviewと、すでに終了したPull RequestのPreviewを区別できるようにしています。

なお、`inactive`にするのはGitHub上のDeploymentです。

Cloudflare Workers上に作成されたVersionそのものを削除する処理ではありません。


## Production環境

### 用途

Production環境は、本番公開するWebサイトのデプロイ先です。

GitHub上では、以下のEnvironmentにProduction Deploymentが登録されます。

```text
<開催期>-production
```

例えば、`2026autumn`の場合は以下です。

```text
2026autumn-production
```

`main`ブランチへ変更がマージされると、GitHub ActionsによってProductionへのデプロイが実行されます。


### URL

Production URLは以下の形式です。

```text
https://<Worker名>.<workers.devサブドメイン>.workers.dev/
```

Previewとは異なり、Production URLはPull Requestやデプロイごとに変化しません。

```text
Preview
https://pr-{Pull Request番号}-<Worker名>.<workers.devサブドメイン>.workers.dev/
        ↑
   PRごとに異なる

Production
https://<Worker名>.<workers.devサブドメイン>.workers.dev/
        ↑
   常に同じURL
```


### Productionがデプロイされるタイミング

`main`ブランチにデプロイ対象となるフロントエンドの変更がpushされた場合に、Productionデプロイが実行されます。

通常の開発では、Pull Requestを`main`へMergeすることで実行されます。

```text
Pull Request
    ↓
Previewで動作確認
    ↓
mainへMerge
    ↓
Production Deployment
    ↓
本番環境へ反映
```

Workflowでは変更対象となるディレクトリを指定しているため、他の開催期のフロントエンドのみが変更された場合には、この開催期のProductionデプロイは実行されません。


### Productionページを確認する

Productionへのデプロイが完了すると、GitHubの **Deployments** からデプロイされたWebサイトを確認できます。

```text
Repository
↓
Deployments
↓
<開催期>-production
↓
最新のDeployment
↓
Production URL
```

例えば、`2026autumn`の場合は以下です。

```text
Repository
↓
Deployments
↓
2026autumn-production
↓
最新のDeployment
↓
Production URL
```

最新のProduction Deploymentに表示されているURLから、本番ページを開くことができます。

Production URLはデプロイごとには変化せず、常に以下の形式です。

```text
https://<Worker名>.<workers.devサブドメイン>.workers.dev/
```

過去のProduction Deploymentは履歴として残りますが、以前のDeploymentは`inactive`となり、最新のProduction Deploymentが現在の本番環境として扱われます。


### Productionデプロイの同時実行について

Production用Workflowでは、同じ開催期のProductionデプロイが同時に複数実行されないよう制御しています。

先に開始されたProductionデプロイが実行中の場合は、その処理が完了してから次のデプロイが実行されます。

これにより、複数のProductionデプロイが同時にCloudflareへ反映されることを防ぎます。


### Productionを手動でデプロイする

Production用Workflowでは`workflow_dispatch`を設定しているため、GitHub Actionsから手動でProductionデプロイを実行できます。

GitHubで以下を開きます。

```text
Repository
↓
Actions
↓
対象開催期のProduction用Workflow
↓
Run workflow
```

例えば、`2026autumn`の場合は以下のWorkflowです。

```text
2026autumn Deploy - Production
```

通常は`main`へのMergeによる自動デプロイを使用し、必要な場合のみ手動デプロイを使用してください。


## GitHub Environmentについて

Cloudflare Workers + GitHub Actionsでデプロイする開催期では、開催期ごとに以下の2つのGitHub Environmentを使用します。

```text
<開催期>-production
<開催期>-preview
```

例えば、`2026autumn`の場合は以下です。

```text
2026autumn-production
2026autumn-preview
```

将来、新しい開催期を追加する場合も同じ命名規則を使用します。

```text
2026autumn-production
2026autumn-preview

2027spring-production
2027spring-preview

2027autumn-production
2027autumn-preview
```

開催期ごとにEnvironmentを分けることで、GitHubのDeployments上で各開催期のProduction / Previewを区別して管理できます。


### `<開催期>-production`

対象開催期の本番環境へのDeploymentを管理します。

最新のProduction Deploymentが現在の本番環境となり、過去のProduction Deploymentは`inactive`として履歴に残ります。


### `<開催期>-preview`

対象開催期のPull Requestの動作確認用Deploymentを管理します。

複数のPull Requestが同時にOpenになっている場合、それぞれのPreview Deploymentが存在します。

```text
<開催期>-preview
│
├─ PR #123 → active
├─ PR #124 → active
└─ PR #125 → active
```

同じPull Requestを更新した場合は、最新のDeploymentが`active`となり、以前のDeploymentは`inactive`になります。

Pull RequestがMergeまたはCloseされると、対応するPreview Deploymentは`inactive`になります。


## 複数の開催期について

本Repositoryでは、複数の開催期のフロントエンドが存在する場合があります。

例えば、以下のような構成です。

```text
2026spring/
2026autumn/
2027spring/
```

Cloudflare Workers + GitHub Actionsでデプロイする開催期については、開催期ごとにEnvironmentとWorkerを分けて管理します。

例えば、

```text
2026autumn
├─ 2026autumn-production
└─ 2026autumn-preview

2027spring
├─ 2027spring-production
└─ 2027spring-preview
```

のように管理します。

各Workflowではデプロイ対象となるディレクトリを指定するため、ある開催期だけを変更した場合に、別の開催期のCloudflare用Workflowが実行されることはありません。


## 開発時の基本的な流れ

通常の開発では、以下の流れで作業してください。

```text
1. Issueを作成
      ↓
2. 作業用ブランチを作成
      ↓
3. 実装
      ↓
4. Pull Requestを作成
      ↓
5. Previewが自動デプロイされる
      ↓
6. DeploymentsからPreviewページを確認
      ↓
7. Previewページで動作確認
      ↓
8. 問題がなければmainへMerge
      ↓
9. Preview Deploymentがinactiveになる
      ↓
10. Productionへ自動デプロイ
      ↓
11. DeploymentsからProductionページを確認
```

Pull Requestを更新した場合は、同じPull Request番号のPreview URLに最新の内容が再デプロイされます。

また、同じPull Requestに対する以前のGitHub Deploymentは`inactive`になります。


## URLまとめ

| 種類 | GitHub Environment | URL形式 |
| --- | --- | --- |
| Production | `<開催期>-production` | `https://<Worker名>.<workers.devサブドメイン>.workers.dev/` |
| Preview | `<開催期>-preview` | `https://pr-{Pull Request番号}-<Worker名>.<workers.devサブドメイン>.workers.dev/` |

Worker名は`wrangler.jsonc`の`name`を確認してください。

```jsonc
{
  "name": "<Worker名>"
}
```


## Workflowの役割

Cloudflare Workers + GitHub Actionsでデプロイする開催期では、以下の3種類のWorkflowを使用します。

| Workflow | 用途 |
| --- | --- |
| Preview用Workflow | Pull Request作成・更新時にPreviewをデプロイ |
| Preview Cleanup用Workflow | Pull RequestのMerge / Close時にPreview Deploymentを`inactive`化 |
| Production用Workflow | `main`へのMerge時にProductionをデプロイ |

開催期ごとにWorkflowを用意し、対象となるフロントエンドのディレクトリを`paths`で指定します。

例えば、`2026autumn`の場合は以下のように指定します。

```yaml
paths:
  - "2026autumn/frontend/**"
```

これにより、他の開催期のみを変更した場合には`2026autumn`用のWorkflowは実行されません。


## 補足

### GitHub EnvironmentとCloudflareの環境について

GitHub上の`<開催期>-production` / `<開催期>-preview` Environmentと、Cloudflare Workers上のVersion・Deploymentは、それぞれ別の仕組みです。

GitHub Environmentは、GitHub上でデプロイ先やDeploymentの状態・URLを管理するために使用しています。

Cloudflare Workersでは、実際にアプリケーションをビルド・アップロードし、ProductionまたはPreview URLからアクセスできるようにしています。


### Preview Deploymentのinactiveについて

Preview Deploymentが`inactive`になるケースは、主に以下の2つです。

- 同じPull Requestに新しいPreviewがデプロイされ、以前のDeploymentが不要になった場合
- Pull RequestがMergeまたはCloseされた場合

`inactive`化は、GitHub上のDeploymentを整理するための処理です。

Cloudflare Workers上に作成されたVersionそのものを削除する処理ではありません。


### Production Deploymentのinactiveについて

新しいProduction Deploymentが作成されると、それ以前のProduction Deploymentは`inactive`になります。

過去のDeployment自体はGitHub上に履歴として残るため、これまでのデプロイ履歴を確認できます。


### 既存の開催期について

開催期によっては、Cloudflare Workers + GitHub Actions以外の方法でデプロイされている場合があります。

その場合、GitHub Environment名やPreview URL、デプロイのタイミングなどが本資料の説明と異なることがあります。

本資料の`<開催期>-production` / `<開催期>-preview`という命名規則は、Cloudflare Workers + GitHub Actionsで管理する開催期に適用します。
