function createSort(sort) {
  let result = { ["createdAt"]: -1 };
  if (sort) {
    let sortQuery = sort.split(",");
    if (sortQuery.length === 2)
      result = {
        [sortQuery[0]]: parseInt(sortQuery[1]),
      };
    else
      result = {
        [sortQuery[0]]: 1,
      };
  }
  return result;
}

module.exports = { createSort };
