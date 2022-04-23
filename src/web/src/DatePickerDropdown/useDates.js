import { useEffect, useState } from "react";

function useDates() {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (!process.env.REACT_APP_CAPTURE_SERV_URL && process.env.NODE_ENV === "development") {
      console.error("Env variable REACT_APP_CAPTURE_SERV_URL is unset");
    }

    fetch(`${process.env.REACT_APP_CAPTURE_SERV_URL}/captures`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(
            `Error fetching dates. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
          );
        }
      })
      .then(setDates)
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
      });
  }, []);

  return dates;
}

export default useDates;
