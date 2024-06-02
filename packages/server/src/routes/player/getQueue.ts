import { useError } from "utils/useError";
import { MpcService } from "../../services/mpc.service";
import { API } from "routes/api-contract";

export const handleGetQueue: API["player"]["getQueue"]["GET"] = async (
  req,
  res,
) => {
  try {
    const queueResult = await MpcService.getQueue();
    return res.status(200).send(queueResult);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).send(useError(err, "Error getting queue"));
  }
};
