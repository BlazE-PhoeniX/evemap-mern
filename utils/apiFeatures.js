class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let filterObj = { ...this.queryObj };
    ["limit", "page", "sort", "fields"].forEach(el => delete filterObj[el]);

    let queryStr = JSON.stringify(filterObj);
    queryStr = queryStr.replaceAll(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`
    );
    filterObj = JSON.parse(queryStr);

    this.query = this.query.find(filterObj);

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.replaceAll(",", " ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("date");
    }

    return this;
  }

  limit() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.replaceAll(",", " ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    if (this.queryObj.page || this.queryObj.limit) {
      const page = this.queryObj.page * 1 || 1;
      const limit = this.queryObj.limit * 1 || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = APIFeatures;
