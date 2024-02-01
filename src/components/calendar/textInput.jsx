import { useState } from "react";

const CalendarTextInput = ({ value, setValue }) => {
    const [day, setDay] = useState(value.get('date'));
    const [month, setMonth] = useState(value.get('month')+1);
    const [year, setYear] = useState(value.get('year'));

    const handleDateChange = (e) => {
        const re = /^[0-9\b]+$/;
        let input = e.target.value;
    
        if (re.test(input) || input === "") {
          switch (e.target.name) {
            case "day":
              if ((input > 0 && input <= 31) || input === "") setDay(input);
              break;
            case "month":
              if ((input > 0 && input <= 12) || input === "") setMonth(input);
              break;
            case "year":
              if ((input > 0 && input <= 2500) || input === "") setYear(input);
              break;
    
            default:
              return input;
          }
        }
      };
    
      const handleDateSubmit = (e) => {
        e.preventDefault();
        let newDate = value.clone();
        newDate.set({ date: day, month: month - 1, year: year });
        setValue(newDate);
      };

    return (
        <>
            <div className="submission-form">
                <form onSubmit={handleDateSubmit}>
                    <input
                        type="text"
                        value={day}
                        name="day"
                        required={true}
                        onChange={(e) => handleDateChange(e)}
                        onFocus={(e) => {e.target.value = '';}}
                    ></input>
                    <input
                        type="text"
                        value={month}
                        name="month"
                        required={true}
                        onChange={(e) => handleDateChange(e)}
                        onFocus={(e) => {e.target.value = '';}}
                    ></input>
                    <input
                        type="text"
                        value={year}
                        name="year"
                        required={true}
                        onChange={(e) => handleDateChange(e)}
                        onFocus={(e) => {e.target.value = '';}}
                    ></input>
                    <input type="submit" value="Senden" />
                </form>
            </div>
            
        </>
    );
}

export default CalendarTextInput;