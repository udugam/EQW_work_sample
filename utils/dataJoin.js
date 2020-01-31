function dataJoin(data) {
  // Join Data into one object
  const joinedData = [];
  data[0].rows.forEach((row, index) => {
  //  Copy all properties from all three endpoint responses into one object
    const joinedRowData = { ...row };
    joinedRowData.events = data[1].rows[index].events;
    joinedRowData.poi = data[2].rows[index % 4];

    //  Add id identifier for each row of data (will be used for fuzzy search row heighlighting)
    //  Then push joined object to joinedData Array
    joinedRowData.id = index;
    joinedData.push(joinedRowData);
  });
  return joinedData;
}

module.exports = dataJoin;
