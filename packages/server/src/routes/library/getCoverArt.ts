import { LibraryService } from "../../services/library.service";
const streamMimeType = import("stream-mime-type");
import { API } from "src/types/api-contract";

export const handleGetCoverArt: API["library"]["album"]["albumId"]["cover-art"]["GET"] =
  async (req, res) => {
    const { albumId } = req.params;

    const coverArtStream = await LibraryService.getAlbumCoverArt({ albumId });
    if (!coverArtStream) {
      res.redirect(
        "https://cdn2.bigcommerce.com/server1900/beb6d/products/1329/images/2929/CD1S.FCLR__92507.1629312849.600.600.png?c=2",
      );
      return;
    }
    const { stream, mime } = await (
      await streamMimeType
    ).getMimeType(coverArtStream);
    res.setHeader("Content-Type", mime);
    // Cache for 1 week
    res.setHeader("Cache-Control", "public, max-age=604800");
    stream.pipe(res);
  };
