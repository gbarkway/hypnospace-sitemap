import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

import Spinner from "./Spinner";

const buildUrl = (date, { pageNameQuery, citizenNameQuery, tagsQuery }) => {
  const url = new URL(
    `${process.env.REACT_APP_PAGE_SERV_URL}/captures/${date}/pages`,
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

export default function SearchResults({
  date,
  searchRequest,
  onResultClick,
  onLoadingStart,
  onLoadingEnd,
}) {
  onResultClick = onResultClick || (() => {});
  onLoadingStart = onLoadingStart || (() => {});
  onLoadingEnd = onLoadingEnd || (() => {});

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
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
        setError("Error loading search results");
        setSearchResults([]);
      })
      .finally(() => setLoading(false));
  }, [searchRequest, date]);

  useEffect(() => {
    if (loading) {
      onLoadingStart();
    } else {
      onLoadingEnd();
    }
  }, [loading, onLoadingEnd, onLoadingStart]);

  if (!searchRequest)
    return <span className="text-muted">Enter search terms and click "Search" to see results</span>;
  return (
    <div>
      Search Results ({searchResults.length})
      <Spinner visible={loading} />
      <div className="search-results">
        <Table size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Zone</th>
              <th>Citizen Name</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((r, i) => (
              <tr key={`searchresult-${i}`}>
                <td>
                  <Button
                    variant="link"
                    onClick={() => onResultClick(r.path)}
                    className="text-left"
                  >
                    {r.name}
                  </Button>
                </td>
                <td>{r.zone}</td>
                <td>{r.citizenName}</td>
              </tr>
            ))}
            {error.length ? (
              <tr>
                <td className="text-danger">Error loading search results</td>
              </tr>
            ) : null}
            {!searchResults.length && !error.length && !loading ? (
              <tr>
                <td className="text-muted">No results found in {date}</td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </div>
      <span className="small text-muted">Click on page name to view page</span>
    </div>
  );
}
