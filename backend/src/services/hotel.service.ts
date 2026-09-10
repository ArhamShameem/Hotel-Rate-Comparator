import { getTemporalClient } from "../temporal/client";
import type { Hotel, HotelSearchInput } from "../types/hotel";

export class HotelService {
  async searchHotels(
    input: HotelSearchInput,
    onAbort?: (cancel: () => Promise<void>) => void
  ): Promise<Hotel> {
    const client = await getTemporalClient();
    const workflowId = `hotel-search-${Date.now()}`;

    const handle = await client.workflow.start("hotelSearchWorkflow", {
      taskQueue: "hotel-search",
      workflowId,
      args: [input],
    });

    if (onAbort) {
      onAbort(async () => {
        try {
          await handle.cancel();
        } catch {
          // Ignore if workflow has already finished or terminated
        }
      });
    }

    return await handle.result();
  }
}

export const hotelService = new HotelService();
