function convertDateTime(str) {
    var date = new Date(Date.parse(str)),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('-');
}
export default convertDateTime;