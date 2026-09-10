import { Client, Connection } from "@temporalio/client";

let client: Client | null = null;

export async function getTemporalClient() {
  if (!client) {
    const connection = await Connection.connect({
      address: "localhost:7233",
    });

    client = new Client({
      connection,
    });
  }

  return client;
}
