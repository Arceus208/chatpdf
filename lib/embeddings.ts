import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function getEmbeddings(
  text: string
) {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const res = await embeddings.embedQuery(text);
    return res;
  } catch (error) {
    console.log(
      "error calling openai embeddings api",
      error
    );
    throw error;
  }
}
