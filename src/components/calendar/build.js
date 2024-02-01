export const buildCalendarWeekView = value => {
    const startDay = value.clone().startOf('week')
    const endDay = value.clone().endOf('week')
    const day = startDay.clone().subtract(1, 'day');
    const calendar = [];
    // console.log(startDay, endDay)

    while (day.isBefore(endDay, 'day')) {
        calendar.push(day.add(1, 'day').clone())
    }

    // console.log(calendar)

}

export default function buildCalendar(value) {
  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");
  const day = startDay.clone().subtract(1, "day");
  const calendar = [];

  while (day.isBefore(endDay, "day")) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => day.add(1, "day").clone())
    );
  }
  // console.log(calendar)

  buildCalendarWeekView(value)
  return calendar;
}


