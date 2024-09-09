import { MpcService } from "../../services/mpc.service";
import { useError } from "utils/useError";
import { API } from "src/types/api-contract";

export const handleGetAlbums: API["library"]["albums"]["GET"] = async (
  req,
  res,
) => {
  try {
    const albums = await MpcService.getAlbums();
    return res.json(albums);
  } catch (err) {
    console.error(err);
    const useErr = useError(err, "Error fetching albums");
    return res.status(500).send(useErr);
  }
};
