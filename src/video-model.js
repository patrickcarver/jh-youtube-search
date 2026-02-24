function toVideoModel(searchItem, statsItem) {
  return {
    videoId: searchItem.id.videoId,
    title: searchItem.snippet.title,
    description: searchItem.snippet.description,
    thumbnail: searchItem.snippet.thumbnails.medium.url,
    commentCount: statsItem?.statistics?.commentCount ?? null,
  };
}

export { toVideoModel };
