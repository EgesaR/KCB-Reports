import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";

export function useSafeFormattedDate(
  dateString?: string,
  dateFormat = "MMMM d, yyyy"
) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString);
      if (isValid(date)) {
        setFormattedDate(format(date, dateFormat));
      } else {
        setFormattedDate("Invalid Date");
      }
    } else {
      setFormattedDate("");
    }
  }, [dateString, dateFormat]);

  return formattedDate;
}
