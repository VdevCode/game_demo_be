function createPagination(data, total, defaultLimit, params) {
  const result = {
    data,
    pagination: {
      page: params.page ? parseInt(params.page) : 1,
      total,
      limit: params.limit ? params.limit : defaultLimit,
    },
  };
  return result;
}

module.exports = { createPagination };
