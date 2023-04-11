

//おぺんAIとディスコのライブラリとつなぐ
const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits } = require("discord.js");

//ディスコのbotにログイン
const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
});
client.login("***ディスコのbotのAPIキー***");


//OPENAIのアカウントに接続
const configuration = new Configuration({
    apiKey: "***おぺんAIのAPIキー***",
});
const openai = new OpenAIApi(configuration);


//AIを洗脳して上柚木綾にするための命令文（coreScript）を読み込み
const fs = require('fs')
let coreScript = fs.readFileSync("台本.txt").toString();
console.log(coreScript)


//AIとの会話(SESSION)を記録するための配列を用意。
//MainMessagesにAIを洗脳して上柚木綾にするための命令文（coreScript）が入り、
//messagesにユーザーとの会話が入るイメージ

let MainMessages = [
    { role: "system", content: coreScript },
]
let messages = []
let margeMessages = []



//ディスコで何らかのメッセージの投稿を検知すると以下が発動する
client.on("messageCreate", async msg => {

    try {
        //上柚木宛の発言に限らず一旦あらゆるメッセージに反応してしまうため、メッセージが上柚木宛であるかを判定する

        if (msg.mentions.users.size == 1) {//誰か一人に宛てたメッセージか？

            let targetName = msg.mentions.users.first().username//メンション先を取得
            if (targetName == 'AI上柚木' || targetName == "test kamiyugi" || targetName == "上柚木　綾") {//上柚木に宛てたメッセージか？

                //以降、上柚木宛のメッセージであったと判断する。

                let talkingUserName = msg.author.username//メッセージの送り主の名前
                let talkingText = msg.content//メッセージの内容

                //メッセージの内容にはいろいろ邪魔な文字列が含まれるため整形する。
                talkingText = talkingText.split('>')[talkingText.split('>').length - 1]
                talkingText = talkingText.replace(/\s+/g, "")


                //システム系メッセージ（チェンジとかおみくじとか）の対応。システム系メッセージについてはおぺんAIを介さずその場で返信する。
                //そのため返信後はさっさとreturnしている。
                if (talkingText.indexOf("チェンジ") == 0) {
                    //ユーザーとの会話をリセット
                    messages = []
                    msg.reply("まったく、人をデリヘルみたいに扱いやがって。\nSYSTEM：会話リセット　成功");
                    return
                }
                if (talkingText.indexOf("またこんど") == 0) {
                    //ユーザーとの会話をリセット
                    messages = []
                    msg.reply("おーう、またね。\nSYSTEM：会話リセット　成功");
                    return
                }
                if (talkingText.indexOf("cmd:reset") > -1) {
                    //ユーザーとの会話をリセット
                    messages = []
                    msg.reply("SYSTEM：会話リセット　成功");
                    return
                }
                if (talkingText.indexOf("cmd:強制終了") > -1) {
                    //強制終了
                    await msg.reply("SYSTEM:強制終了");
                    process.exit(0)
                }
                if (talkingText.indexOf("cmd:log") > -1) {
                    //会話ログを出力
                    for (let i = 0; i < messages.length; i++) {
                        msg.reply(messages[i]);
                    }
                    return
                }
                if (talkingText.indexOf("cmd:test") > -1) {
                    //入出力テスト
                    msg.reply("あー、あー、テストテスト。本日は晴天なり、あと昨夜は軌道上で戦闘があったのか流れ星がたくさん降ったよ。");
                    return
                }
                if (talkingText.indexOf("おみくじ") == 0) {
                    //おみくじ。Math.randomで乱数を作って配列から結果を引っ張る単純仕様
                    let resultText = ""
                    let n = Math.round(Math.random() * 10)
                    switch (n) {
                        case 0:
                            resultText = "うわ、大凶だ。すまんが今日は距離を置かせてもらう。"
                            break
                        case 1:
                            resultText = "うーん凶だ。空から衛星の破片か何か降ってくるかもな。"
                            break
                        case 2:
                            resultText = "お、吉だね。一番コメントに困るやつだ。"
                            break
                        case 3:
                            resultText = "お、小吉だ。ささやかな幸運が訪れるかもな。"
                            break
                        case 4:
                            resultText = "お、中吉だ。何事もバランスが一番だよね。幸運も足も。"
                            break
                        case 5:
                            resultText = "お、末吉だ。「吉である」と「凶ではない」の間で揺れる存在だ。"
                            break
                        case 6:
                            resultText = "おお！大吉だ！！　おめでとう、宝くじでも買ったらどうだい？　当たったら電動車椅子買ってくれ。"
                            break
                        case 7:
                            resultText = "お、吉だね。無難な感じが" + talkingUserName + "らしいじゃないか。"
                            break
                        case 8:
                            resultText = "お、小吉だ。" + talkingUserName + "って運がいいのか悪いのかよくわからないな。"
                            break
                        case 9:
                            resultText = "うわぁ、大大凶だ………　私とお揃いにならないといいな、" + talkingUserName + "よ。"
                            break
                        case 10:
                            resultText = "お、中吉だ。ナカヨシが一番ってことだな。"
                            break
                        default:
                            resultText = "なんだこれ、くじに何も書いてないな。バグか？"
                    }
                    msg.reply("おみくじだな？どれどれ私が代わりに引いてやろう………\n\n" + resultText);
                    return
                }
                if (talkingText.indexOf("スロット") == 0) {
                    //スロット。こちらもMath.randomで乱数を作って配列から結果を引っ張る単純仕様
                    //ディスコの仕様上スタンプと会話文を併用するとスタンプが小さくなってしまうため投げやりにスタンプだけ返す
                    //なお、スタンプのコードはディスコ上で確認できる。詳細はググってくだち。
                    let resultText = ""
                    let slot = ["<:13:1042097622904741908>",
                        "<:330ripido:1031929035422449727>",
                        "<:330XP:715243208799551499>",
                        "<:330rain:1042097931806842933>",
                        "<:330big:988293769633873940>",
                        "<:330GX:715243222149890158>",
                        "<:HighRiskBadLucker:1082561672507564132>",
                        "<:PIZANOIZUMI:715244819596967936>",
                        "<:330:715158441324445707>"]
                    for (let i = 0; i < 3; i++) {
                        let n = Math.round(Math.random() * (slot.length - 1))
                        resultText = resultText + slot[n]
                    }
                    msg.reply(resultText);
                    return
                }

                //以下AIを介した返信の生成に入る。


                //会話の内容をmessages配列に格納する。
                //トークン数の制限が厳しいため、10個(上柚木とユーザーの会話５回分)だけ保持する
                messages.push({ role: "user", content: talkingUserName + "「" + talkingText + "」" })
                if (messages.length > 10) {
                    messages.shift()
                    messages.shift()
                }

                //coreScriptの内容とmessagesの内容をmargeMessagesに統合
                margeMessages = []
                for (tmp of MainMessages) {
                    margeMessages.push(tmp)
                }
                for (tmp of messages) {
                    margeMessages.push(tmp)
                }


                //以下、実際におぺんAIの崇高な技術を用いてくだらない雑談を生成していく
                try {
                    let i = 0
                    let completion
                    let message = ""
                    let onemore = false
                    do {
                        i++//修正回数のカウント。
                        console.log(margeMessages)
                        msg.channel.sendTyping()//「上柚木綾が入力中...」のメッセージを表示するやつ。15秒くらい有効

                        //APIを叩いて返答をもらう。
                        completion = await openai.createChatCompletion({
                            model: "gpt-3.5-turbo",
                            messages: margeMessages
                        });
                        //もらった返答を確認
                        message = completion.data.choices[0].message.content

                        //GPTくんは英語でしか思考しないナショナリストなので語尾が上柚木らしくなりにくい。そのためもしもデスマス調や女言葉で返答されたような気がした場合は修正させる
                        onemore = (message.indexOf("です") >= 0 || message.indexOf("ます") >= 0 || message.indexOf("だわ") >= 0 || message.indexOf("のよ") >= 0 || message.indexOf("ました") >= 0 || message.indexOf("ません") >= 0 || message.indexOf("でした") >= 0 || message.indexOf("ください") >= 0)
                        if (onemore) {
                            msg.channel.sendTyping()//「上柚木綾が入力中...」のメッセージを表示するやつ。15秒くらい有効
                            console.log("修正対象:" + message)
                            //MainMessages[0]を用いて、「messageを上柚木の発言らしく修正してくだち！」とお願いする
                            let completion2 = await openai.createChatCompletion({
                                model: "gpt-3.5-turbo",
                                messages: [MainMessages[0], { role: "user", content: "以下の文章について、文章の口調を上柚木綾らしい口調に修正した文章を返答してください。\n" + message }]
                            });
                            message = completion2.data.choices[0].message.content
                            console.log("修正後:" + message)

                        }
                        //修正後のやつをもう一回確認
                        onemore = (message.indexOf("です") >= 0 || message.indexOf("ます") >= 0 || message.indexOf("だわ") >= 0 || message.indexOf("のよ") >= 0 || message.indexOf("ました") >= 0 || message.indexOf("ません") >= 0 || message.indexOf("でした") >= 0 || message.indexOf("ください") >= 0)
                    } while (onemore);

                    //無事上柚木っぽい返答が生成されたらディスコに出力する。
                    msg.reply(message);

                    //上柚木の返答を会話に追加。これによって次の会話でも話題が連続する。
                    messages.push({ role: "assistant", content: message })
                } catch (error) {
                    messages = []
                    console.log(error)
                    msg.reply("すまんエラーだ。多分トークン制限だな。\n" + "SYSTEM:GPT3との通信中にエラー発生。会話内容をリセットします。")
                    return
                }

                console.log(messages)


            }
        }
    } catch (error) {

    }

});
