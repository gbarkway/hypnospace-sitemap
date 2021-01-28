import { useState, useEffect } from "react";

const placeholder = {
    "tags": [
    ],
    "path": "",
    "zone": "",
    "date": "",
    "name": "Please Wait",
    "description": "",
    "user": ""
  };

//note, nest this in a container which keeps date and path as state?
export default function PageDetails({ date, path }) {
    const [data, setData] = useState(placeholder);
    useEffect(() => {
        fetch(`http://localhost:3000/captures/${date}/pages/${encodeURIComponent(path)}`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 404) {
                    return {...placeholder, ...{date, path, name: "Not Found"}}
                } else {
                    console.log(res);
                    throw new Error(res);
                }
            })
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
                <div>
                    {data.date}
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