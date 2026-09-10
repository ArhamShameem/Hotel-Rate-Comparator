import { Worker, NativeConnection } from "@temporalio/worker";
import * as activities from "./activities/hotel.activities";

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows/hotel.workflow"),
    activities,
    taskQueue: "hotel-search",
  });

  console.log("Temporal worker started...");

  await worker.run();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
