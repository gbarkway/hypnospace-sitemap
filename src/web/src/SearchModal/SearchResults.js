import { useEffect } from "react";
import { Table, Button } from "react-bootstrap";

import Spinner from "../Spinner";
import useSearchResults from "./useSearchResults";

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

  const { searchResults, loading, error } = useSearchResults(searchRequest, date);

  useEffect(() => {
    if (loading) {
      onLoadingStart();
    } else {
      onLoadingEnd();
    }
  }, [loading, onLoadingEnd, onLoadingStart]);

  if (!searchRequest) {
    return <span className="text-muted">Enter search terms and click "Search" to see results</span>;
  }

  return (
    <div>
      Search Results ({searchResults.length})
      <Spinner visible={loading} />
      <div className="search-results">
        <Table size="sm" className="my-0">
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
