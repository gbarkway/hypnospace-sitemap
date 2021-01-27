import { useState, useEffect } from "react";

const mock =   {
    "tags": [
      "news",
      "tech",
      "business",
      "politics",
      "weather",
      "sports",
      "global",
      "bytes",
      "ticker"
    ],
    "path": "01_hypnospace central\\globalnewsroom.hsp",
    "zone": "Hypnospace Central",
    "date": "1999-11-05",
    "name": "Hypnospace Global Newsroom",
    "description": "Visit the Hypnospace Global Newsroom daily for all the latest national and global headlines.",
    "user": "Merchantsoft"
  };

//note, nest this in a container which keeps date and path as state?
export default function PageDetails({ date, path }) {
    date = date || "1999-11-05";
    path = path || "99_flist\\~f00021d_01.hsp";
    const [data, setData] = useState(mock);
    useEffect(() => {
        fetch('http://localhost:3000/captures/1999-11-05/pages/06_starport%20castle%20dreamstation%5C~garyscontrolroom.hsp')
            .then((data) => data.json())
            .then(setData)
            .catch((err) => {
                console.log(err);
            });
    }, [date, path]);

    return (
        <div className="pageDetails">
            <div>
                <div>
                    {data.path}
                </div>
                <h2>{data.name}</h2>
                <div>
                    {data.zone}
                </div>
                <div>
                    {data.description}
                </div>
                <div>
                    {data.user}
                </div>
                <div>
                    {data.tags.join(',')}
                </div>
            </div>
        </div>
    );
}