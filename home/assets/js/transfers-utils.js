(function (global) {
  function normalizeMediaUrl(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    return trimmed.replace(/([^:]\/)\/+/g, "$1");
  }

  function getOutputUrl(transfer) {
    if (!transfer) return null;
    if (transfer.output_url) return normalizeMediaUrl(transfer.output_url);
    if (transfer.output) {
      if (typeof transfer.output === "string") return normalizeMediaUrl(transfer.output);
      if (transfer.output.url) return normalizeMediaUrl(transfer.output.url);
    }
    return null;
  }

  /**
   * Build same-origin proxy URL for model-viewer (avoids cross-origin GLB fetch).
   * @param {string} outputUrl - absolute URL on free-base-laravel.test/storage/...
   * @param {string} [proxyBase] - e.g. "../api/proxy-glb.php"
   */
  function getProxiedModelUrl(outputUrl, proxyBase) {
    const normalized = normalizeMediaUrl(outputUrl);
    if (!normalized) return null;

    const base =
      proxyBase ||
      (function () {
        const path = global.location.pathname || "";
        if (path.includes("/my-transfers/")) return "../api/proxy-glb.php";
        if (path.includes("/home/")) return "api/proxy-glb.php";
        return "/home/api/proxy-glb.php";
      })();

    return base + "?url=" + encodeURIComponent(normalized);
  }

  global.TransfersUtils = {
    normalizeMediaUrl,
    getOutputUrl,
    getProxiedModelUrl,
  };
})(window);
