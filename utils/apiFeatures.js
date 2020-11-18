class APIFeatures {
  constructor(query, queryString, defaultLimit, defaultPage) {
    this.query = query;
    this.queryString = queryString;
    this.limit = defaultLimit;
    this.page = defaultPage;
  }

  filter() {
    // delete special keywords in the query
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => delete queryObj[element]);

    // add $ to comparision keywords
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = JSON.parse(queryStr);

    const keys = Object.keys(query);

    keys.forEach(key => { 
      if (key === 'account') {
        if (query[key] > 0) {
          this.query.find({ [key]: query[key] });
        } else {
          this.query.find({ [key]: null });
        }
      } else { 
        this.query.find({ 
          [key]: { 
            $regex: query[key], 
            $options: 'i'
          } 
        });
      }
    })
    
    return this;
  }

  sort() {
    // sort the query result
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // pagination
    const page = this.queryString.page * 1 || this.page;
    const limit = this.queryString.limit * 1 || this.limit;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    this.limit = limit;
    this.page = page;
    
    return this;
  }
}

module.exports = APIFeatures;