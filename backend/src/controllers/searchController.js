const searchService = require("../services/searchService");

/**
 * Controller orchestrating spotlight global search requests.
 */
class SearchController {
  /**
   * Spotlight search across multiple categories concurrently.
   */
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const result = await searchService.globalSearch(q);

      res.status(200).json({
        success: true,
        message: "Spotlight search completed successfully.",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SearchController();
