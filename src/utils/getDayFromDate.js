export const getDayFromDate = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const givenDate = new Date(date);
  const dayIndex = givenDate.getDay(); // 0–6

  return days[dayIndex];
};
