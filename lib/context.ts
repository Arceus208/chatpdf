import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMathchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIROMENT!,
  });

  const index = pinecone.Index(
    process.env.PINECONE_INDEX!
  );

  /* const namespace = index.namespace(
    convertToAscii(fileKey)
  ); */

  try {
    const queryResult = await index.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log(
      "error querrying embeddings",
      error
    );
    throw error;
  }
}

export async function getContext(
  query: string,
  fileKey: string
) {
  const queryEmbeddings = await getEmbeddings(
    query
  );

  const matches = await getMathchesFromEmbeddings(
    queryEmbeddings,
    fileKey
  );

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map(
    (match) => (match.metadata as Metadata).text
  );

  return docs.join("\n").substring(0, 3000);
}
