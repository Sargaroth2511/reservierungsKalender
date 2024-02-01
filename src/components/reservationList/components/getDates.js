import moment from "moment";

const getDates = formInput => {
    const dates = [];
    let start, end;
    formInput.startDate.seconds ? start = formInput.startDate.toDate() : start = formInput.startDate;
    formInput.endDate.seconds ? end = formInput.endDate.toDate() : end = formInput.endDate;

    let dif = moment(end).diff(moment(start), 'd')

    for (let i=0; i<=dif ;i++){
        dates.push(moment(start).add(i, 'd').toDate())
    }
    return dates;
}
 
export default getDates;