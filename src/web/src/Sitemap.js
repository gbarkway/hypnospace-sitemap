import { useEffect, useState, useRef } from "react";
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import {Card, Button, Row, Col} from "react-bootstrap";
cytoscape.use(fcose);

export default function Sitemap({ date, onTap, selected }) {
    const [elements, setElements] = useState([
        { data: { id: 'one', label: 'Node 1' }},
        { data: { id: 'two', label: 'Node 2' }},
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
        ]);
    
    const container = useRef();
    const cyRef = useRef(); //TODO: is this right?
    const [hover, setHover] = useState("Hover over something");

    const selectNode = (node) => {
        if (!cyRef.current) return;
        cyRef.current.elements().removeClass("highlighted transparent selected");
        node.neighborhood().addClass("highlighted");
        node.addClass("selected");
        cyRef.current.elements().difference('.highlighted,.selected').addClass('transparent');
    };

    useEffect(() => {
        if (!cyRef.current) return;
        const node = cyRef.current.getElementById(selected);
        selectNode(node);
    }, [selected, elements]);

    useEffect(() => {
        fetch(`http://localhost:3001/captures/${date}`)
            .then((res) => {
                return res.json();
            })
            .then((capture) => {
                const thing = [
                    ...capture.pages.map((page) => { 
                        return {
                            data: {
                                id: page.path, 
                                label: page.path,
                                parent: page.path.substring(0, 2),
                            }
                        }
                    }), 
                    ...["01", "02", "03", "04", "05", "06", "07", "08", "99"].map(n => ({data: {id: n, label: n}, pannable: true})),
                    ...capture.links.map((link) => ({data: {source: link.sourcePath, target: link.targetPath}}))
                ];
                console.log(thing);
                return thing;
            })
            .then((asdf) => {
                setElements(asdf);
            })
            .catch(console.err);
    }, [date]);

    useEffect(() => {
        cyRef.current = cytoscape({
            container: container.current,
            elements: elements,
            autounselectify: true,
            autoungrabify: true,
            layout: { 
                name: 'fcose',
                animate: false,
                randomize: false,
            },
            style: [
                {
                    selector: "node",
                    style: {
                        'background-color': function (e) { //TODO: this is inefficient
                            if (e.id().includes('zone.hsp')) {
                                return 'red';
                            } else {
                                return 'gray';
                            }
                        },
                        'border-color': 'black',
                        'border-width': 1,
                    }
                },
                {
                    selector: "node.highlighted",
                    style: {
                        'background-color': 'blue',
                    }
                },
                {
                    selector: ".selected",
                    style: {
                        'background-color': 'darkblue', //TODO: change colors to fit win9x color scheme
                    }
                },
                {
                    selector: ":parent",
                    style: {
                        'background-color': "lightgray",
                        'border-color': 'black',
                        'content': "data(label)",
                    }
                },
                {
                    selector: "edge",
                    style: {
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                    }
                },
                {
                    selector: "edge.highlighted",
                    style: {
                        "line-color": "blue",
                        "target-arrow-color": "blue",
                    }
                },
                {
                    selector: "edge.transparent",
                    style: {
                        "line-opacity": 0.5,
                        'target-arrow-shape': 'none',
                    }
                },
                {
                    selector: "node:child.transparent",
                    style: {
                        "background-opacity": 0.5,
                        'border-width': 0,
                    }
                }
            ],
        });
       
        cyRef.current.on('tap', 'node', function(evt){
            //TODO: cache collection the first time instead of recalculating all the time
            var node = evt.target;
            if (node.hasClass("selected")) {
                cyRef.current.animate({
                    fit: {
                        eles: node.closedNeighborhood(),
                        padding: 100
                    }
                }, {
                    duration: 1000,
                    easing: "ease-out-quad"
                });
            }
            if (onTap) {
                onTap(node.id());
            }
        });

        cyRef.current.on('mouseover', 'node', function (e) {
            var node = e.target;
            setHover(node.id());
        })
    }, [elements, onTap]);


    const resetStyle = () => {
        if (!cyRef.current) return;
        
        cyRef.current.elements().removeClass("transparent highlighted");
        cyRef.current.elements().deselect();
    }

    //TODO: "jump to zone" option
    //TODO: start more zoomed-in
    //TODO: images, colors, pizazz
    return (
        <Card className="square">
            <Card.Header>
                <b>Site Graph - {date}</b>
            </Card.Header>
            <Card.Body style={{padding: 0}}>
                <div id="cy" ref={container}>

                </div>
            </Card.Body>
            <Card.Footer>
                <Row> 
                    <Col>
                        <i>{hover}</i>
                    </Col>
                    <Col>
                        <div className="float-right">
                            <Button onClick={() => cyRef.current.fit()}>Zoom to Fit</Button>
                            <Button onClick={resetStyle}>Clear Highlighting</Button>
                        </div>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>

    )
}