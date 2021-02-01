import { useEffect, useState, useRef } from "react";
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import {Card} from "react-bootstrap";
cytoscape.use(fcose);

export default function Sitemap({ date, onTap }) {
    const [elements, setElements] = useState([
        { data: { id: 'one', label: 'Node 1' }},
        { data: { id: 'two', label: 'Node 2' }},
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
        ]);
    
    const container = useRef();

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
                    ...["01", "02", "03", "04", "05", "06", "07", "08", "99"].map(n => ({data: {id: n, label: n}})),
                    ...capture.links.map((link) => ({data: {source: link.sourcePath, target: link.targetPath, label: "uwu"}}))
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
        var cy = cytoscape({
            container: container.current,
            elements: elements,
            layout: { 
                name: 'fcose',
                animate: false,
                randomize: false,
            },
            style: [
                {
                    selector: "node",
                    style: {
                        'background-color': function (e) {
                            if (e.id().includes('zone.hsp')) {
                                return 'blue';
                            } else {
                                return 'gray';
                            }
                        }
                    }
                },
                // {
                //     selector: "node:selected",
                //     style: {
                //         'background-color': 'pink',
                //     }
                // },
                {
                    selector: ":parent",
                    style: {
                        'background-color': "lightgray",
                        'border-color': 'black',
                        'border': '1px',
                        'content': "data(label)",
                    }
                },
                {
                    selector: "edge",
                    style: {
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                    }
                }
            ],
        });
        cy.on('tap', 'node', function(evt){
            var node = evt.target;
            console.log( 'tapped ' + node.id() );
            if (onTap) {
                onTap(node.id());
            }
          });
    }, [elements, onTap]);

    return (
        <Card className="square">
            <Card.Header>
                <b>Site Graph - {date}</b>
            </Card.Header>
            <Card.Body style={{padding: 0}}>
                <div id="cy" ref={container}>

                </div>
            </Card.Body>
            <Card.Footer><i>Instructions will go here. Or maybe control buttons like zoom, back, reset, etc. Or info about the hovered node?</i></Card.Footer>
        </Card>

    )
}