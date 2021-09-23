---
id: raspi-cluster
title: ラズパイをクラスター化させてマインクラフトサーバーを建てたい!!
---

どうもどうも、たまごです。  
最近マインクラフトサーバーをなんとか、コンピューター?(処理装置の構造)から自作したいと思いました。  
逸般の誤家庭のサーバーになるように頑張りたいと思います!

## 概要
[ラズベリーパイ](https://raspberrypi.org)を**クラスター化**([スパコン](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF)みたいにPC重ねまくって)させて、低スぺパソコンを合体させまくって高スぺクラスターをつくりたい! ってことー    
まず、クラスター化させるために、[Kubernetes](https://kubernetes.io/ja/)クラスターというのを使用します。  
本当の話、[Turing Pi](https://turingpi.com/)という、基盤を(7個)どんどん元になる基盤にぶっさすことで作れる夢のようなﾔﾂがあるんですが、もし100個(100個?!?!)ぐらい作るときは、Turing Piでは**カバーできない**ので、ラズパイ単品でベイクしていきます。

## 引用させていただく記事
 - *1 [@reireiasという方の記事 (裸のラズパイにKubernetesの環境を構築する方法)](https://qiita.com/reireias/items/0d87de18f43f27a8ed9b)
 - *2 [Jeef Geerling という方の記事 (サーバーの導入方法)](https://www.jeffgeerling.com/blog/2020/raspberry-pi-cluster-episode-4-minecraft-pi-hole-grafana-and-more)
 - *3 [とある方の記事](https://gist.github.com/gabrielsson/2d110bb3f43b46597831f4a0e4065265)

## 最初の工程
### 購入
[ラズパイ](https://raspberrypi.org)を購入する。  
*1 ですが、Kubernetes環境を構築するためには、最低で3つのラズパイを使用する必要があります。  
なので、**3つ以上**のラズパイを購入します。  
ちなみに、現在の一番高スぺであるラズパイは以下のようになっています。

| 性能 | 値 |
| ---- | ---- |
| CPU | Broadcom BCM2711, Quad core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz |
| CPUコア数 | 4コア |
| メモリ | 8GB LPDDR4-3200 SDRAM |
| インターネット | Gigabit Ethernet |
| その他 | [こちらから](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/specifications/) |

一つ10,230円くらいです。  
なんと、適当に見てみたところOkdoというオンラインショップでは現在在庫切れのようです...

### OSベーキング
#### 概要
せっかく買ったラズパイ、でも電源入れてみても立ち上がらない。  
当たり前です。  
[OS](https://e-words.jp/w/OS.html)という、基盤の次に大切なﾔﾂがないのです!  
ところで、ラズパイの標準ディスクは、MicroSD Cardとなっています。  
ですが、実際僕が使用した時にもよく起きましたが、`Kernel panic`というSDカードの耐久性の弱さのためのエラーが吐き出されてしまうことがしばしばあり、最悪の場合起動すら許可してくれません。  
なので、後に少々面倒なことをしなくてはいけません。

### MicroSDにインストール
#### フォーマット
まずはMicroSDカードを用意します。  
理由は後にお伝えします。  
ラズパイは**fat32**というフォーマットをする必要があります。  
~~そこでWindowsでは、**32GB**までちゃんとフォーマットできますが、**64GB**以降は専用のフォーマットソフトをインストールして使用する必要があります。  
まぁ、32GBのMicroSDカードで大丈夫でしょう。~~

今回は*1との手順とは違い、最初は[RaspberryPi Imager](https://www.raspberrypi.org/software/)という公式のソフトウェアを使用させていただきます。  
早速[RaspberryPi Imager](https://www.raspberrypi.org/software/)をインストールします。  
`Install (OS)`となっているボタンを押すとダウンロードが開始するので、ダウンロードされた`imager_(version).(拡張子)`をクリックしてください。  
インストールが完了したら、まずPCに**MicroSD Card**をぶっさしてやってください。  

そし鱈、ついさっきインストールしたソフトを起動させます。  
そして、`CHOOSE OS`のボタンを押し、`Erase`を選択します。  
次に、`CHOOSE SD CARD`のボタンを押します。  
そうすると、つい先ほどぶっ刺したMicroSD Cardがリストに出てくると思います。ので、それを押してやってください。  
そしたら、`WRITE`しちゃってください!!!  
あっという間にフォーマット完了!

#### Flash!
まだまだ[RaspberryPi Imager](https://www.raspberrypi.org/software/)の活躍は続きます!