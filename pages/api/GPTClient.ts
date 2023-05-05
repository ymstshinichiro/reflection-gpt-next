import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

export class GPTClient {
  private static instance: GPTClient;

  private api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  private llm = new OpenAI({ openAIApiKey: this.api_key, temperature: 0, modelName: "gpt-4" });
  private chain = new ConversationChain({ llm: this.llm });

  private constructor() {}

  public static getInstance(): GPTClient {
    if (!GPTClient.instance) {
      GPTClient.instance = new GPTClient();
    }
    return GPTClient.instance;
  }

  public async callAPI(question: string): Promise<string> {
    const res = await this.chain.call({ input: question });

    console.log("Human:", question);

    // これ消すとプロンプトに何も出なくなっちゃうので注意ね
    console.log("AI:", res["response"]);
    return res["response"];
  }
}
