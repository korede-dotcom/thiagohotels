
const User = require("../models/User")

const paginationConfig = async (page,limit,modelname,Query) =>{
try {
  const options = {
      page: page,
      limit: limit,
      collation: {
        locale: 'en',
      },
    };
    
    await modelname.paginate(Query, options, async function (err, result) {
      if(err) return err
      return result
      // result.docs
      // result.totalDocs = 100
      // result.limit = 10
      // result.page = 1
      // result.totalPages = 10
      // result.hasNextPage = true
      // result.nextPage = 2
      // result.hasPrevPage = false
      // result.prevPage = null
      // result.pagingCounter = 1
    });
  
} catch (error) {
  return {
    error
  }
}
}

module.exports = paginationConfig