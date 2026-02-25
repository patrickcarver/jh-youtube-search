function toVideoModel(searchItem, statsItem) {
  // Defense-in-depth: Even though Lit escapes interpolated values by default and
  // YouTube sanitizes its own API output, we truncate fields here as an additional
  // safeguard against unexpectedly large or malformed API responses before data
  // reaches the UI or is persisted to IndexedDB.
  return {
    // YouTube video IDs are 11 characters as of when this was created,
    // but this is not formally documented.
    // We use 20 to allow headroom for future format changes.
    videoId: searchItem.id.videoId.slice(0, 20),
    title: searchItem.snippet.title.slice(0, 200),
    description: searchItem.snippet.description.slice(0, 500),
    thumbnail: searchItem.snippet.thumbnails.medium.url.slice(0, 500),
    commentCount: statsItem?.statistics?.commentCount ?? null,
  };
}

export { toVideoModel };
