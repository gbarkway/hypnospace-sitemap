import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const placeholder = {
    "tags": [
    ],
    "path": "",
    "zone": "",
    "date": "",
    "name": "Welcome!",
    "description": "",
    "user": ""
  };

//note, nest this in a container which keeps date and path as state?
export default function PageDetails({ date, path, onTagClick, onUserNameClick }) {
    onTagClick = onTagClick || (() => {});
    onUserNameClick = onUserNameClick || (() => {});

    const [data, setData] = useState(null);
    useEffect(() => {
        if (!path) return;

        fetch(`http://localhost:3000/captures/${date}/pages/${encodeURIComponent(path)}`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 404) {
                    return {...placeholder, ...{date, path, name: "Not Found"}}
                } else {
                    throw new Error(res);
                }
            })
            .then(setData)
            .catch((err) => {
                console.log(err);
            });
    }, [date, path]);

    if (data) {
        return (
            <div className="pageDetails">
                <Card className="square">
                    <Card.Header>
                        <h4>{data.name}</h4>
                    </Card.Header>
                    <Card.Body   style={{"max-height": '200px', "min-height": '200px', "overflow-y": "scroll"}}>
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
                            {data.tags.map((t, i) => <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>&gt;{t}</Button>)} 
                        </Card.Text>                 
                    </Card.Body>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="pageDetails">
                <Card className = "square">
                    <Card.Header>
                        <h4>Welcome!</h4>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            No page selected
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}