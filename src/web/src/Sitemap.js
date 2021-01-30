import { useEffect, useState, useRef } from "react";
import cytoscape from 'cytoscape';
import spread from 'cytoscape-spread';

import euler from 'cytoscape-euler';

cytoscape.use(spread);

export default function Sitemap({ date }) {
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
                const thing = [...capture.pages.map((page) => ({data: {id: page.path, label: page.path}})), ...capture.links.map((link) => ({data: {source: link.sourcePath, target: link.targetPath, label: "uwu"}}))]
                // const thing = {
                //     nodes: capture.pages.map((page) => ({id: page.path, label: page.path})),
                //     links: capture.links.map((link) => ({source: link.sourcePath, target: link.targetPath, label: "uwu"}))
                // }
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
            layout: { name: 'cose'},
        })
    }, [elements]);

    return (
        <div ref={container} style={{height: 1000, width:1000, display:"block"}}>

        </div>
    )
    // const [data, setData] = useState({
    //     nodes: [],
    //     links: [
    //     ]
    // })
    
    // const a = useRef();

    // useEffect(() => {
    //     fetch(`http://localhost:3001/captures/${date}`)
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((capture) => {
    //             const thing = {
    //                 nodes: capture.pages.map((page) => ({id: page.path})),
    //                 links: capture.links.map((link) => ({source: link.sourcePath, target: link.targetPath}))
    //             }
    //             console.log(thing);
    //             return thing;
    //         })
    //         .then((asdf) => {
    //             setData(asdf);
    //         })
    //         .catch(console.err);
    // }, [date]);

    // // the graph configuration, just override the ones you need
    // const myConfig = {
    //     height: 800,
    //     d3: {
    //         //disableLinkForce: true,
    //     }
    // };
    
    // const onClickNode = function(nodeId) {
    //     window.alert(`Clicked node ${nodeId}`);
    // };
    
    // const onClickLink = function(source, target) {
    //     window.alert(`Clicked link between ${source} and ${target}`);
    // };

    // return (<Graph
    //         id="graph-id" // id is mandatory
    //         data={data}
    //         config={myConfig}
    //         ref={a}
    //         />);
}