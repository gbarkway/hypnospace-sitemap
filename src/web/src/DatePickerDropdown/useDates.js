import { useEffect, useState } from "react";

function useDates() {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (!import.meta.env.VITE_CAPTURE_SERV_URL && import.meta.env.MODE === "development") {
      console.error("Env variable VITE_CAPTURE_SERV_URL is unset");
    }

    fetch(`${import.meta.env.VITE_CAPTURE_SERV_URL}/captures`)
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
