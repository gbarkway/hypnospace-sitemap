import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

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
            <Card className="square">
                <Card.Header>
                    <h4>{data.name}</h4>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle className="text-muted">
                        {data.path}
                    </Card.Subtitle>
                    <Card.Text>
                        <p><b>Zone:</b> {data.zone || "<None>"}</p>
                        <p><b>User:</b> {data.user || "<None>"}</p>
                        <p><b>Description:</b> {data.description || "<None>"}</p>
                    </Card.Text>
                    {data.tags.map((t,i) => <Card.Link key={`tag-${i}`} className="text-nowrap" href="#">&gt;{t}</Card.Link>)}
                </Card.Body>
            </Card>
        </div>
    );
}