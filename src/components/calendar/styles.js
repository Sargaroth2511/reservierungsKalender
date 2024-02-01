const isSelected = (day, value) => value.isSame(day, "day")
export const isBefore = day => day.isBefore(new Date(), "day")
const isToday = day => day.isSame(new Date(), "day")
const dayStyles = (day, value) => {
    if (isBefore(day) && isSelected(day, value)) return "before-selected"
    if (isBefore(day)) return "before"
    if (isSelected(day, value)) return "selected"
    if (isToday(day)) return "today"
    return "";
}

export default dayStyles;