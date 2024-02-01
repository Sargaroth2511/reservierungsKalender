
const CalendarHeader = ({value, setValue}) => {
    const currYear = () => value.format("YYYY")
    const currMonthName = () => {
        const germanMonthNames = {
            "January":
                "Januar",
            "February":
                "Februar",
            "March":
                " März",
            "April":
                "April",
            "May":
                "Mai",
            "June":
                "Juni",
            "July":
                "Juli",
            "August":
                "August",
            "September":
                "September",
            "October":
                "Oktober",
            "November":
                "November",
            "December":
                "Dezember"
        }
        let germanMonth = value.locale('de')
        return germanMonth.format("MMMM")
    }

    const prevMonth = () => value.clone().subtract(1, "month")
    const nextMonth = () => value.clone().add(1, "month")
    return (
        <div className="header">
            <div className="previous" onClick={() => setValue(prevMonth())}>{String.fromCharCode(171)}</div>
            <div className="current">{currMonthName()} {currYear()}</div>
            <div className="next" onClick={() => setValue(nextMonth())}>{String.fromCharCode(187)}</div>
        </div>
    );
}

export default CalendarHeader;