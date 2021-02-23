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

//TODO: loading spinner
export default function PageDetails({ date, path, onTagClick, onUserNameClick }) {
    onTagClick = onTagClick || (() => {});
    onUserNameClick = onUserNameClick || (() => {});

    const [data, setData] = useState(null);
    useEffect(() => {
        if (!path) return;

        fetch(`${process.env.REACT_APP_PAGE_SERV_URL}/captures/${date}/pages/${encodeURIComponent(path)}`)
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
                        <b>Page Details - {data.name}</b>
                    </Card.Header>
                    <Card.Body style={{ "max-height": '250px', "min-height": '250px', "overflow-y": "scroll" }}>
                        <Card.Text><b>{data.name}</b></Card.Text>
                        <Card.Subtitle className="text-muted">
                            {data.path}
                        </Card.Subtitle>
                        <Card.Text><b>Zone:</b> {data.zone || "<None>"}</Card.Text>
                        <Card.Text><b>User:</b>
                            <Button onClick={() => onUserNameClick(data.user)} variant="link" disabled={!Boolean(data.user)}>
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
                <Card className="square">
                    <Card.Header>
                        <b>Page Details</b>
                    </Card.Header>
                    <Card.Body style={{ "max-height": '250px', "min-height": '250px'}}>
                        <Card.Text>
                            No page selected
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}