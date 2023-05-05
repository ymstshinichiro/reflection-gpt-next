import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
// import  styles from '@/styles/Home.module.css'
import  '/styles/Home.module.css'
import { useState, Fragment } from "react";
import { GPTClient } from "./api/GPTClient";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [reason, setReason] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([]);

  // LangChainのConversationChainを使うので、GPTClientはシングルトンで実装する
  const gptClient = GPTClient.getInstance();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const firstQuery = `
      あなたは私のメンターという設定です。そして、今から私は振り返りたい事柄についてテーマ設定し、それについて話します。あなたからは質問をしてもらいたいです。
      理解できましたか？理解できたらOKと答えてください。
    `;
    await gptClient.callAPI(firstQuery); // ここは戻り値無視

    const input = `振り返りたいテーマ: ${theme}\n理由: ${reason}`;
    const apiResponse = await gptClient.callAPI(input);

    setConversation((prevConversation) => [
      ...prevConversation,
      { role: "user", content: input },
      { role: "gpt", content: apiResponse },
    ]);
  };

  const handleAnswerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const apiResponse = await gptClient.callAPI(userAnswer);

    setConversation((prevConversation) => [
      ...prevConversation,
      { role: "user", content: userAnswer },
      { role: "gpt", content: apiResponse },
    ]);

    setUserAnswer("");
  };

  const placeholder = `例: 大きなプロジェクトで課題にいくつか課題に直面したが乗り越えられたので,
その要因がなんだったのかを振り返りを通じて明らかにしたい`

  return (
    <div className="App">
      <h1>Reflection with GPT4</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="theme">あなたが振り返りたいテーマ:</label>
          <br />
          <textarea
            id="theme"
            placeholder='例: 最近の仕事を通じて成長を感じていること'
            value={theme}
            rows={3}
            cols={100}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="reason">テーマに設定した理由:</label>
          <br />
          <textarea
            id="reason"
            placeholder={placeholder}
            value={reason}
            rows={5}
            cols={100}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button type="submit">会話を開始する</button>
      </form>
      <hr />
      {/* <div>
        {conversation.map((entry, index) => (
          <div key={index} className={entry.role === "user" ? "user" : "gpt"}>
            <strong>{entry.role === "user" ? "あなた:" : "GPT-4:"}</strong> {entry.content}
          </div>
        ))}
      </div> */}
      <div>
      {conversation.map((entry, index) => (
        <Fragment key={index}>
          {index !== 0 && conversation[index - 1].role !== entry.role && <br />}
          <div key={index} className={entry.role === "user" ? "user" : "gpt"}>
            <strong>{entry.role === "user" ? "あなた:" : "GPT-4:"}</strong>{" "}
            {entry.content.split('\n').map((line, i) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
      <hr />
      <form onSubmit={handleAnswerSubmit}>
        <div>
          <label htmlFor="userAnswer">回答を入力してください:</label>
          <br />
          <textarea
            id="userAnswer"
            value={userAnswer}
            rows={5}
            cols={100}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>
        <button type="submit">回答する</button>
      </form>
    </div>
  );
}
