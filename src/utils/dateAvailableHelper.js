export const isDateWithin20Days = (date) => {
  const today = new Date();
  const bookingDate = new Date(date);

  // time remove (sirf date compare)
  //yaha kya ho rha hai == hum time ko 0 kr rhe hain taki sirf date ka hi comparison ho
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);

  // yaha kya ho rha hai == hum difference nikal rhe hain dono dates ka aur phir us difference ko days me convert kr rhe hain
  const diffTime = bookingDate - today; // in milliseconds
  const diffDays = diffTime / (1000 * 60 * 60 * 24); // convert to days

  // check if within 0 to 20 days
  return diffDays >= 0 && diffDays <= 20;
};
