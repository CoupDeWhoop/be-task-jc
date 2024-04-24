const ukDateToSql = (ukDateString) => {
  const [day, month, year] = ukDateString.split("/");
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
};

module.exports = { ukDateToSql };
