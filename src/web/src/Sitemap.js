import { useEffect, useState, useRef } from "react";
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import {Card, Button, Nav, Navbar, Dropdown, DropdownButton} from "react-bootstrap";
cytoscape.use(fcose);

//TODO: loading indicator
//TODO: make zones visually distinct
export default function Sitemap({ date, onTap, selected, focused, onZoneMenuClick }) {
    onZoneMenuClick = onZoneMenuClick || (() => {});
    const [elements, setElements] = useState([
        { data: { id: 'one', label: 'Node 1' }},
        { data: { id: 'two', label: 'Node 2' }},
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
        ]);
    
    const container = useRef();
    const cyRef = useRef(); //TODO: is this right?
    const [hover, setHover] = useState("Hover over something");
    const [zones, setZones] = useState([]);

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
        if (!cyRef.current) return;
        if (!focused) return;

        const node = cyRef.current.getElementById(focused);
        if (!node.length) return;

        //TODO: this animation is queued, in-progress ones can't be preempted
        cyRef.current.animate({
            fit: {
                eles: node.closedNeighborhood(),
            }
        }, {
            duration: 1000,
            easing: "ease-out-quad"
        });
    }, [focused])

    useEffect(() => {
        console.log("getting capture from webservice");
        fetch(`http://localhost:3001/captures/${date}`)
            .then((res) => {
                return res.json();
            })
            .then((capture) => {
                const zs = [...(new Set(capture.pages.map(p => p.zone)))];
                const thing = [
                    ...zs.map(n => ({data: {id: n, label: n}, pannable: true})),
                    ...capture.pages.map((page) => { 
                        return {
                            data: {
                                id: page.path, 
                                label: page.path,
                                parent: page.zone,
                            }
                        }
                    }), 
                    ...capture.links.map((link) => ({data: {source: link.sourcePath, target: link.targetPath}}))
                ];
                setZones(zs);
                return thing;
            })
            .then((asdf) => {
                setElements(asdf);
            })
            .catch(console.err);
    }, [date]);

    useEffect(() => {
        console.log("rebuilding sitemap");
        cyRef.current = cytoscape({
            container: container.current,
            elements: elements,
            autounselectify: true,
            autoungrabify: true,
            layout: { 
                name: 'fcose',
                animate: false,
                nodeRepulsion: () => 50000, //prevent nodes from being too clustered
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
            if (onTap) {
                onTap(node.id(), node.hasClass("selected"));
            }
        });

        cyRef.current.on('mouseover', 'node', function (e) {
            var node = e.target;
            setHover(node.id());
        })
    }, [elements, onTap]); //TODO: changing onTap causes sitemap to reload, that's probably not necessary

    const resetStyle = () => {
        if (!cyRef.current) return;
        
        cyRef.current.elements().removeClass("transparent highlighted");
        cyRef.current.elements().deselect();
    }

    //TODO: make toolbar nicer
    //TODO: start more zoomed-in
    //TODO: images, colors, pizazz
    //TODO: "places of note" list
    return (
        <Card className="square">
            <Card.Header>
                <b>Site Graph - {date}</b>
            </Card.Header>
            <Navbar>
                <Nav>
                    <Nav.Item>
                        <Button onClick={() => cyRef.current.fit()}>Zoom to Fit</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button onClick={resetStyle}>Clear Highlighting</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <DropdownButton id="dropdown-basic-button" title="Go to zone">
                            {zones.map((z, i) => (
                                <Dropdown.Item key={`zoneDropDown${i}`} as="button" onClick={() => onZoneMenuClick(z)}>{z}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Nav.Item>
                </Nav>
            </Navbar>

            <Card.Body style={{ padding: 0 }}>
                <div id="cy" ref={container}>

                </div>
            </Card.Body>
            <Card.Footer>
                <i>{hover}</i>
            </Card.Footer>
        </Card>

    )
}