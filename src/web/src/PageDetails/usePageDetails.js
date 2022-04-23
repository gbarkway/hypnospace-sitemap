import { useEffect, useState } from "react";

const defaultPage = {
  tags: [],
  path: "",
  zone: "",
  date: "",
  name: "Welcome!",
  description: "",
  citizen: "",
  linkedByAd: false,
  linkedByMail: false,
};

function usePageDetails(date, path) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    if (!process.env.REACT_APP_PAGE_SERV_URL && process.env.NODE_ENV === "development") {
      console.error("Env variable REACT_APP_PAGE_SERV_URL is unset");
    }
    fetch(
      `${process.env.REACT_APP_PAGE_SERV_URL}/captures/${date}/pages/${encodeURIComponent(path)}`
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          return { ...defaultPage, ...{ date, path, name: "Page not Found" } };
        } else {
          throw new Error(
            `Error fetching page details. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
          );
        }
      })
      .then(setPage)
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setError("Error getting page details");
        setPage(null);
      })
      .finally(() => setLoading(false));
  }, [date, path]);

  return { page, loading, error };
}

export default usePageDetails;
