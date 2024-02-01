
import "./calendarStyles.scss"

import { useEffect, useState } from "react";
import buildCalendar  from "./build";
import dayStyles, { isBefore } from "./styles";
import CalendarHeader from "./header";
import IsBeforeWarning from "./isBeforeWarning";
import CalendarTextInput from "./textInput";

const Calendar = ({value, onChange}) => {
    const [calendar, setCalendar] = useState([])
    const [showPopup, setShowPopup] = useState(false)


    useEffect(() => {
        setCalendar(buildCalendar(value))
    }, [value])







    return (
        <div className="calendar">
            <CalendarHeader value={value} setValue={onChange} />
            <div className="body standard-box">
                <div className="day-names">
                    {
                        ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
                        .map(d => <div className="week" key={d}>{d}</div> 

                        )
                    }
                </div>
                {calendar.map((week) => (
                    <div key={week}>
                        {week.map((day) => (
                            <div className="day"
                                key={day}
                                onClick={(e) => {
                                    onChange(day)
                                    isBefore(day) ? setShowPopup(true) : setShowPopup(false)
                                }
                                }>
                                <div
                                    className={dayStyles(day, value)}
                                >{day.format("D")}
                                </div>

                            </div>
                        ))}
                    </div>
                ))
                }
            </div>
            {/* {showPopup ? <IsBeforeWarning setShowPopup={setShowPopup} /> : null}
            <CalendarTextInput value={value} setValue={onChange} />     */}
        </div>
    );
}

export default Calendar;