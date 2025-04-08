// import Cell, { Resistor, VoltageSource, CurrentSource, Component } from "./cell.js";
import NetItem from "./NetItem.jsx";
import Reference from "./Reference.jsx";
// import SendToPython from "./SendToPython.js";

//global var
let netnum;
let referenceNum;

export default class NodeVoltage {

    constructor(matrix, gameNodes) {
        this.DIRECTION_OFFSETS = {
            1: [-1, 0], // up
            2: [0, 1],  // right
            3: [1, 0],  // down
            4: [0, -1]  // left
        };
        this.matrix = matrix
        this.gameNodes = gameNodes
        this.finalNetList = ''
    }

    solve() {
        let nodes = this.gameNodes
        let gnd = this.setGroundNode(nodes)

        // Create a net list to be solved using PySpice
        let netlist = this.create_net_list(nodes)
        console.log("the netlist,", netlist)

        for(let i = 0; i < netlist.length ; i++) {
            this.check_orientation(netlist[i])
            netlist[i].create_string()
            this.finalNetList += netlist[i].string + '\n'
        }
    }
    setGroundNode(nodes) {
        if (nodes.length !== 0) {
            let row = 0;
            let gnd = null;
    
            nodes.forEach(node => {
                if (node.row > row) {
                    gnd = node;
                    row = node.row;
                }
                node.reference = null;
            });
    
            gnd.reference = new Reference(0, gnd);
    
            return gnd
        }
    }
    

    create_net_list(nodes) {
        // Now with a set of 'significant nodes' we must create a net list, however, the way net list references nodes
        // are different than the way we do: there also must be nodes in between any series connected components so that
        // we can differentiate parts in series and parallel. To avoid confusion, we will call the net list version of
        // nodes 'references'
        let seen = new Set()
        let list = [];
        referenceNum = 1
        netnum = 1
        if (nodes.length === 0) {
            list = this.netitems_from_wire(nodes, seen)
        } else {
            nodes.forEach(node => {
                let newList = this.netitems_from_node(nodes, seen)
                list = list.concat(newList)
            })
        }
        return list
    }

    netitems_from_wire(wire, seen) {
        let netItems = [];
        let components = [];
    
        const stack = [wire];
        seen.add(wire);
    
        while (stack.length > 0) {
            const current = stack.pop();
    
            const neighbors = this.findNeighbors(current.row, current.col);
    
            for (let neighbor of neighbors) {
                if (!this.hasNode(seen,neighbor)) {
                    seen.add(neighbor);
    
                    const type = this.findType(neighbor);
    
                    if (type === 'Component') {
                        components.push(neighbor);
                    } else if (type === 'Wire') {
                        stack.push(neighbor);
                    }
                }
            }
        }
    
        if (components.length === 0) {
            console.log("No components found in wire path.");
            return [];
        }
    
        // Build the netlist from the loop of components
        const firstRef = new Reference(0, wire);
        let prevRef = firstRef;
    
        for (let i = 0; i < components.length; i++) {
            const netitem = new NetItem(components[i], netnum, this.matrix);
            netnum++;
    
            netitem.node1 = prevRef;
    
            if (i === components.length - 1) {
                netitem.node2 = firstRef; // loop back to start
            } else {
                const inBetween = new Reference(referenceNum, netitem.component);
                referenceNum++;
    
                netitem.node2 = inBetween;
                netitem.component.reference = inBetween;
                prevRef = inBetween;
            }
    
            netItems.push(netitem);
        }
    
        return JSON.stringify(netItems);
    }
    
    netitems_from_node(node, seen) {
        seen.add(node);
        if (!node.reference) {
            node.reference = new Reference(referenceNum, node);
            referenceNum++;
        }
    
        const netItems = [];
    
        const neighbors = this.findNeighbors(node.row, node.col);
       
    
        for (let neighbor of neighbors) {
            if (this.hasNode(seen,neighbor)) continue;
    
            const itemList = [];
            let current = neighbor;
    
            // Traverse through wires and collect components
            while (current && !this.isNode(current)) {
                seen.add(current);
    
                if (this.findType(current) === 'Component') {
                    itemList.push(current);
                }
    
                const nextCandidates = this.findNeighbors(current.row, current.col)
                    .filter(n => !this.hasNode(seen,n) && n != node);
                    
                if (nextCandidates.length === 0) break;
                current = nextCandidates[0]; 
                
            }
    
            if (itemList.length === 0) {
                console.log("No components found from direction:", neighbor);
                continue;
            }
    
            // Assign a reference to the other end
            if (!current.reference) {
                current.reference = new Reference(referenceNum, current);
                referenceNum++;
            }
    
            let prevRef = node.reference;
    
            if (current.type === 'voltage source'){
                itemList.push(current)
            }

            for (let i = 0; i < itemList.length; i++) {
                const comp = itemList[i];
                const netitem = new NetItem(comp, netnum, this.matrix);
                netnum += 1;
    
                netitem.node1 = prevRef;
    
                if (i === itemList.length - 1) {
                    netitem.node2 = current.reference;
                } else {
                    const inBetween = new Reference(referenceNum, comp);
                    referenceNum++;
                    netitem.node2 = inBetween;
                    comp.reference = inBetween;
                    prevRef = inBetween;
                }
    
                netItems.push(netitem);
            }
        }
    
        return netItems;
    }
    
    direction_recurse(currentCell, seen, origin) {
        seen.add(currentCell);
    
        // If it's a component or a junction (node), return it
        if (
            this.findType(currentCell) === 'Component' ||
            this.isNode(currentCell)
        ) {
            return currentCell;
        }
    
        const neighbors = this.findNeighbors(currentCell.row, currentCell.col);
    
        for (let neighbor of neighbors) {
            if (!this.hasNode(seen,neighbor)) {
                const result = this.direction_recurse(neighbor, seen, origin);
                if (result) return result;
            }
        }
    
        // If nothing found, return to origin
        return origin;
    }
    

    check_orientation(NetItem) {
        let comp = NetItem.component
        
        if (comp.type === 'voltage source') {
            let seen = new Set()
            seen.add(comp)
            let checkCell = this.find_cell(comp,1)
            let next = this.direction_recurse(checkCell, seen, comp)
            if (next.reference === NetItem.node1) {
                NetItem.flip_nodes()
            }
        }
    }

    

    find_cell(cell,direction) {
        const [dRow, dCol] = this.DIRECTION_OFFSETS[direction] || [0, 0];
        const targetRow = cell.row + dRow;
        const targetCol = cell.col + dCol;
    
        const neighbors = this.findNeighbors(cell.row, cell.col); 
        for (let neighbor of neighbors) {
            if (neighbor.row === targetRow && neighbor.col === targetCol) {
                return neighbor;
            }
        }
    
        return null; 
    }


    findType(cell){
        if (cell.type.startsWith('wire')){
            return 'Wire'
        }
        //add other types once they are implemented
        else if (cell.type === 'voltage source' || cell.type.includes('resistor')){
            return 'Component'
        }
        return null
    }

    findNeighbors(row, col) {
        const toReturn = [];
        const numRows = this.matrix.length;
        const numCols = this.matrix[0].length;
    
        const directions = [
            [-1, 0], // up
            [1, 0],  // down
            [0, -1], // left
            [0, 1]   // right
        ];
    
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
    
            if (
                newRow >= 0 && newRow < numRows &&
                newCol >= 0 && newCol < numCols &&
                this.matrix[newRow][newCol] != null
            ) {
                const neighbor = this.matrix[newRow][newCol];
                neighbor.row = newRow;
                neighbor.col = newCol;
                toReturn.push(neighbor);
            }
        }
    
        return toReturn;
    }

    isNode(cell){
       
        let filteredNodes = this.gameNodes.filter(n => (n.row === cell.row && n.col === cell.col))
        return (filteredNodes.length != 0)
    }
    hasNode(seen, node){
       
        let filteredNodes = Array.from(seen).filter(n => (n.row === node.row && n.col === node.col))
        return (filteredNodes.length != 0)
    }
}