import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

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
export default function PageDetails({ date, path, onTagClick, onUserNameClick }) {
    onTagClick = onTagClick || (() => {});
    onUserNameClick = onUserNameClick || (() => {});

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
                    <Card.Text><b>Zone:</b> {data.zone || "<None>"}</Card.Text>
                    <Card.Text><b>User:</b> 
                        <Button onClick = {() => onUserNameClick(data.user)} variant="link" disabled={!Boolean(data.user)}>
                            {data.user || "<None>"}
                        </Button>
                    </Card.Text>
                    <Card.Text><b>Description:</b> {data.description || "<None>"}</Card.Text>
                    <Card.Text>
                        {/*TODO: link variant buttons still look like buttons*/
                        data.tags.map((t, i) => <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>&gt;{t}</Button>)} 
                    </Card.Text>                 
                </Card.Body>
            </Card>
        </div>
    );
}