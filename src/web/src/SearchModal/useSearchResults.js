import { useEffect, useState } from "react";

const buildUrl = (date, { pageNameQuery, citizenNameQuery, tagsQuery }) => {
  const url = new URL(
    `${import.meta.env.VITE_PAGE_SERV_URL}/captures/${date}/pages`,
    window.location.origin
  );
  if (pageNameQuery && pageNameQuery.length) {
    url.searchParams.append("nameOrDescription", pageNameQuery);
  }
  if (citizenNameQuery === null) {
    url.searchParams.append("citizenName", "");
  } else if (citizenNameQuery && citizenNameQuery.length) {
    url.searchParams.append("citizenName", citizenNameQuery);
  }
  if (tagsQuery && tagsQuery.length) {
    url.searchParams.append("tags", tagsQuery);
  }
  return url.href;
};

function useSearchResults(searchRequest, date) {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchRequest) return;
    setError("");
    setLoading(true);
    fetch(buildUrl(date, searchRequest))
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(
            `Error fetching search results. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
          );
        }
      })
      .then(setSearchResults)
      .catch((err) => {
        if (import.meta.env.MODE === "development") {
          console.error(err);
        }
        setError("Error loading search results");
        setSearchResults([]);
      })
      .finally(() => setLoading(false));
  }, [searchRequest, date]);

  return { searchResults, loading, error };
}

export default useSearchResults;
