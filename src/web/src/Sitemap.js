import { useEffect, useState, useRef } from "react";
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import {Card, Button, Nav, Navbar, Dropdown, DropdownButton, Spinner} from "react-bootstrap";
import worldIcon from "./win95-bootstrap/icons/world-1.png"
cytoscape.use(fcose);

//TODO: loading indicator
//TODO: make zones visually distinct
//TODO: tooltip on node hover or other indication of which nodes are which
export default function Sitemap({ date, onTap, selected, focused, onZoneMenuClick, onPanZoom }) {
    onZoneMenuClick = onZoneMenuClick || (() => {});
    const [elements, setElements] = useState([]);
    
    const container = useRef();
    const cyRef = useRef(); //TODO: is this right?
    const [hover, setHover] = useState("Hover over something");
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectNode = (node) => {
        if (!cyRef.current) return;
        if (!node.data('zone')) return;
        
        const zone = node.data('zone');
        const allNodes = cyRef.current.elements();
        const zoneNodes = cyRef.current.elements(`node[zone="${zone}"]`)
        const zoneNeighborhoodNodes = zoneNodes.closedNeighborhood();
        const zoneNeighborhoodParentNodes = zoneNeighborhoodNodes.parent();
        const myZone = node.parent();

        allNodes.not("node:parent").addClass('hidden');
        zoneNeighborhoodNodes.removeClass('hidden');
        zoneNeighborhoodParentNodes.removeClass('hidden');

        allNodes.removeClass("highlighted transparent selected");
        allNodes.difference(node.closedNeighborhood()).addClass('transparent');
        node.neighborhood().addClass("highlighted");
        node.addClass("selected");
        myZone.addClass("highlighted")
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
                eles: node.closedNeighborhood().not("#hub").filter("node"),
                padding: 100,
            }
        }, {
            duration: 1000,
            easing: "ease-out-quad",
            queue: false,
        });
    }, [focused])

    useEffect(() => {
        if (cyRef.current) {
            cyRef.current.destroy();
        }
        setLoading(true);
        fetch(`http://localhost:3001/captures/${date}`)
            .then((res) => {
                return res.json();
            })
            .then((capture) => {
                const zs = capture.pages.filter((page) => page.path.includes("zone.hsp")).map((page) => ({zone: page.zone, path: page.path}))
                const thing = [
                    ...zs.map(n => ({data: {id: n.zone, label: n.zone, zone: n.zone}, pannable: true})),
                    ...capture.pages.map((page) => { 
                        return {
                            data: {
                                id: page.path, 
                                label: page.path,
                                parent: page.zone,
                                zone: page.zone,
                            },
                            pannable: true,
                            classes: ["hidden", ...(page.path.includes("zone.hsp") ? ["zoneList"] : [])]
                        }
                    }), 
                    ...capture.links.map((link) => ({data: {source: link.sourcePath, target: link.targetPath}, classes: ['hidden']})),
                ];
                setZones(zs);
                return thing;
            })
            .then((asdf) => {
                setElements(asdf);
                setLoading(false);
            })
            .catch(console.err);
    }, [date]);

    useEffect(() => {
        //TODO: edges shouldn't be clickable
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
            minZoom: 0.1,
            style: [
                {
                    selector: "node",
                    style: {
                        'border-color': 'black',
                        'border-width': 1,
                    }
                },
                {
                    selector: 'node[parent="Hypnospace Central"]',
                    style: {
                        'background-color': 'orange',
                    }
                },
                {
                    selector: 'node[parent="The Cafe"]',
                    style: {
                        'background-color': 'red',
                    }
                },
                {
                    selector: 'node[parent="Goodtime Valley"]',
                    style: {
                        'background-color': 'green'
                    }
                },
                {
                    selector: 'node[parent="Teentopia"]',
                    style: {
                        'background-color': 'blue'
                    }
                },
                {
                    selector: 'node[parent="Coolpunk Paradise"],node[parent="The Venue"]',
                    style: {
                        'background-color': 'cyan'
                    }
                },
                {
                    selector: 'node[parent="Starport Castle Dreamstation"]',
                    style: {
                        'background-color': 'rgb(255,0,255)',
                    }
                },
                {
                    selector: 'node[parent="Open Eyed"]',
                    style: {
                        'background-color': 'purple'
                    }
                },
                {
                    selector: 'node[parent="HSPD Enforcer Handbook"]',
                    style: {
                        'background-color': 'gray'
                    }
                },
                {
                    selector: 'node[parent="FLIST DIRECTORY MASTER"]',
                    style: {
                        'background-color': 'black'
                    }
                },
                {
                    selector: "node.highlighted",
                    style: {
                        //'background-blacken': '0.5'
                        "z-index": "20",
                        "border-color": "black",
                    }
                },
                {
                    selector: "node.selected",
                    style: {
                        'width': '50',
                        'height': '50',
                        "border-color": "white",
                        "border-width": 5,
                    }
                },
                {
                    selector: "node:parent",
                    style: {
                        'background-color': "lightgray",
                        "background-opacity": 0.5,
                        'border-color': 'black',
                        'content': "data(label)",
                        'font-size': 55,
                        'font-weight': 'bold',
                    }
                },
                {
                    selector: "node:parent.highlighted",
                    style: {
                        'border-color': 'white',
                        'border-width': 10,
                        
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
                        "width": "5",
                        "line-color": "black",
                        "target-arrow-color": "black",
                        "z-index": "10",
                    }
                },
                {
                    selector: "edge.transparent",
                    style: {
                        "line-opacity": 0.2,
                        'target-arrow-shape': 'none',
                    }
                },
                {
                    selector: "node:child.transparent",
                    style: {
                        "background-opacity": 0.4,
                        'border-width': 0,
                    }
                },
                {
                    selector: ".hidden",
                    style: {
                        "visibility": "hidden",
                    }
                },
                {
                    selector: 'node.zoneListing',
                    style: {
                        "shape": "star",    
                        "border-color": "black",
                        "border-width": 5                   
                    }
                },
                {
                    selector: 'node.zoneListing.selected',
                    style: {
                        'border-color': 'white',
                    }
                },
                {
                    selector: '#hub',
                    style: {
                        "shape": "star",
                        "width": "100",
                        "height": "100",
                        'background-color': 'pink',
                        'border-color': 'black',
                        'border-width': 5,
                    }
                },
            ],
        });
       
        cyRef.current.on('tap', 'node', function(evt){
            //TODO: cache collection the first time instead of recalculating all the time
            let node = evt.target;
            if (onTap) {
                const isParent = node.isParent();
                if (isParent) {
                    node = node.children('.zoneList');
                }

                onTap(node.id(), node.hasClass("selected"), node.data('zone'), isParent);
            }
        });

        cyRef.current.on('viewport', function() {
            onPanZoom();
        });

        cyRef.current.on('mouseover', 'node', function (e) {
            var node = e.target;
            setHover(node.id());
        })
    }, [elements, onTap, onPanZoom]); //TODO: changing onTap causes sitemap to reload, that's probably not necessary

    const resetStyle = () => {
        if (!cyRef.current) return;
        
        cyRef.current.elements().removeClass("transparent highlighted");
        cyRef.current.elements().deselect();
    }

    //TODO: make toolbar nicer
    //TODO: images, colors, pizazz
    //TODO: "places of note" list
    return (
        <Card className="square">
            <Card.Header>
                <img src={worldIcon} alt=""></img>
                <b>Site Graph - {date}</b>
            </Card.Header>
            <Navbar className="navbar-95">
                <Nav>
                    <Nav.Item>
                        <Button className="mx-1" variant="secondary" onClick={() => cyRef.current.fit()} disabled={loading}>Zoom to Fit</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button className="mx-1" variant="secondary" onClick={resetStyle} disabled={loading}>Clear Highlighting</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <DropdownButton className="mx-1" variant="secondary" id="dropdown-basic-button" title="Go to zone" disabled={loading}>
                            {zones.map((z, i) => (
                                <Dropdown.Item key={`zoneDropDown${i}`} as="button" onClick={() => onZoneMenuClick(z)}>{z.zone}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Nav.Item>
                </Nav>
            </Navbar>
            <Card.Body style={{ padding: 0 }}>
                <div id="asdf" >
                    <div style={loading ? { "display": "block" } : { "display": "none" }}>
                        <div className="d-flex align-items-center justify-content-center" style={{"height": "700px"}}>
                            <Spinner  animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                    <div id="cy" ref={container} style={loading ? {"visibility": "none"} : {"visibility": "visible"}}>

                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <i>{hover}</i>
            </Card.Footer>
        </Card>

    )
}