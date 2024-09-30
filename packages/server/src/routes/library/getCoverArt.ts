import { LibraryService } from "../../services/library.service";
const streamMimeType = import("stream-mime-type");
import { API } from "src/types/api-contract";

export const handleGetCoverArt: API["library"]["album"]["albumId"]["cover-art"]["GET"] =
  async (req, res) => {
    const { albumId } = req.params;

    const coverArtStream = await LibraryService.getAlbumCoverArt({ albumId });
    if (!coverArtStream) {
      res.sendStatus(404);
      return;
    }
    const { stream, mime } = await (
      await streamMimeType
    ).getMimeType(coverArtStream);
    res.setHeader("Content-Type", mime);
    stream.pipe(res);
  };
