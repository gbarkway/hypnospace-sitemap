import { useEffect, useState } from "react";

const useSitemapData = (date) => {
  const [cyElements, setCyElements] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCapture(date)
      .then((capture) => {
        setCyElements(toCyElements(capture));
        setZones(toZoneList(capture));
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setError("Error loading sitemap");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  return { cyElements, zones, loading, error };
};

const fetchCapture = async (date) => {
  const res = await fetch(`${process.env.REACT_APP_CAPTURE_SERV_URL}/captures/${date}`);
  if (res.status !== 200) {
    throw new Error(
      `Error fetching sitemap. Url: ${res.url}, status code: ${res.status}, status text: ${res.statusText}`
    );
  }
  return res.json();
};

const toZoneList = (capture) => {
  return capture.pages
    .filter((page) => page.path.includes("zone.hsp"))
    .map((page) => ({ zone: page.zone, path: page.path }));
};

const toCyElements = (capture) => {
  const zs = toZoneList(capture);
  const zoneNodes = zs.map((z) => ({
    data: { id: z.zone, label: z.zone, zone: z.zone },
    pannable: true,
  }));

  const pageNodes = capture.pages.map((page) => {
    return {
      data: {
        id: page.path,
        label: page.path.split("\\")[1].split(".")[0],
        parent: page.zone,
        zone: page.zone,
      },
      pannable: true,
      classes: ["hidden", ...(page.path.includes("zone.hsp") ? ["zoneList"] : [])],
    };
  });

  const edges = capture.links.map((link) => ({
    data: { source: link.sourcePath, target: link.targetPath },
    classes: ["hidden"],
  }));

  return [...zoneNodes, ...pageNodes, ...edges];
};

export default useSitemapData;
