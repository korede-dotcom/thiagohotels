

async function getUsers(page, pageSize) {
  // Calculate the offset based on the page number and page size
  const offset = (page - 1) * pageSize;

  // Execute the query with the limit and offset options
  const users = await User.findAll({
    limit: pageSize,
    offset
  });

  // Retrieve the total number of rows
  const count = await User.count();

  // Calculate the total number of pages
  const pages = Math.ceil(count / pageSize);

  // Return the results and metadata
  return {
    users,
    count,
    pages
  };
}