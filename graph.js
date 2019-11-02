function getRandomIntMinMax(min,max) {
    return min + getRandomIntMax(max-min);
}
function getRandomIntMax(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let circleSize = 50;
let fontSize = 16;

let Position = class {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
};

let Color = class{
    constructor(r,g = null,b = null){
        if(g === null || b === null){
            this.r = r;
            this.g = r;
            this.b = r;
        }else{
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }
};

let Node = class{
    constructor(position, tag){
        this.position = position;
        this.tag = tag;
        this.links = [];
        this.color = new Color(0);
        this.drawNode();
    }

    drawNode(){
        stroke(this.color.r,this.color.g,this.color.b);
        fill(255);
        ellipse(this.position.x, this.position.y, circleSize,circleSize);
        textSize(fontSize);
        fill(this.color.r,this.color.g,this.color.b);
        text(this.tag,this.position.x-fontSize/2+3,this.position.y+fontSize/2-1);
    }

    isLinkedWith(node){
        for(let i = 0; i < this.links.length; i++){
            let link = this.links[i];
            if(link.node1 === node || link.node2 === node){
                return true;
            }
        }
        return false;
    }
};


let Link = class {

    constructor(node1, node2, weight, oriented){
        this.node1 = node1;
        this.node2 = node2;
        this.node1.links.push(this);
        this.node2.links.push(this);
        this.weight = weight;
        this.oriented = oriented;
        this.color = new Color(0);
    }

    drawLink(){
        let x1 = this.node1.position.x;
        let y1 = this.node1.position.y;
        let x2 = this.node2.position.x;
        let y2 = this.node2.position.y;
        if(this.oriented) {
            push(); //start new drawing state
            stroke(this.color.r,this.color.g,this.color.b);
            fill(this.color.r,this.color.g,this.color.b);
            let angle = Math.atan2(y1 - y2, x1 - x2); //gets the angle of the line
            translate(x2, y2); //translates to the destination vertex
            rotate(angle-HALF_PI); //rotates the arrow point
            let offset = 15;
            let radians = Math.atan(angle);
            translate(0, (circleSize+ offset)/2 );
            triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
            pop();
        }
        stroke(this.color.r,this.color.g,this.color.b);
        line(x1, y1, x2, y2);
        if(this.weight != null) {
            fill(this.color.r,this.color.g,this.color.b);
            text(this.weight, (x1 + x2) / 2, (y1 + y2) / 2);
        }
        this.node1.drawNode();
        this.node2.drawNode();
    }
};

let Graph = class{
    constructor(size, weighted, oriented){
        this.weighted = weighted;
        this.oriented = oriented;
        //init Nodes
        this.nodeList = [];
        for(let i = 0; i < size; i++){
            let tag = String.fromCharCode(65 + i);
            if(i === 0){
                let posX = getRandomIntMinMax(circleSize,canvasW);
                let posY = getRandomIntMinMax(circleSize,canvasH);
                this.nodeList.push(new Node(new Position(posX, posY),tag));
            }else{
                let pos = null;
                while(pos === null){
                    pos = this.getNewRandomPosition();
                }
                this.nodeList.push(new Node(pos,tag));
            }
        }
        //init Links
        this.linkList = [];
        for(let i = 0; i < this.nodeList.length; i++){
            let n = this.nodeList[i];
            let tmp = this.nodeList.slice(0);
            tmp.splice(i,1);
            for(let j = 0; j<getRandomIntMinMax(1,4);j++){
                if(tmp.length !== 0) {
                    let nodeIndex = getRandomIntMax(tmp.length - 1);
                    let n2 = tmp[nodeIndex];
                    if (!n.isLinkedWith(n2)) {
                        let weight = null;
                        if (this.weighted) {
                            weight = getRandomIntMinMax(1, 15)
                        }
                        this.linkList.push(new Link(n, n2, weight, this.oriented));
                        tmp.splice(nodeIndex, 1);
                    }
                }
            }
        }
        this.drawGraph();
    }

    drawGraph(resetBlack = false){
        clear();
        background(255);
        for(let i = 0; i< this.linkList.length; i++){
            if(resetBlack){
                this.linkList[i].color = new Color(0);
            }
            this.linkList[i].drawLink();
        }
        for(let i = 0; i< this.nodeList.length; i++){
            if(resetBlack){
                this.nodeList[i].color = new Color(0);
            }
            this.nodeList[i].drawNode();
        }
    }
    getNewRandomPosition(){
        let posX = getRandomIntMinMax(circleSize*2,canvasW-circleSize);
        let posY = getRandomIntMinMax(circleSize*2,canvasH-circleSize);
        return new Position(posX, posY);
    }

};


let graph;
function setup(){
    let canvas = createCanvas(canvasW, canvasH);
    canvas.parent("graphVis");
    newGraph();
}

function newGraph(){
    clear();
    background(255);
    graph = new Graph(getRandomIntMinMax(5,10), weighted, oriented);
    document.getElementById("algoPrim").disabled = !(weighted && !oriented);
}

function reset(){
    clear();
    background(255);
    graph.drawGraph(true);
}

function draw(){
}

let pressed = false;
let pressedNode = null;
function mousePressed(){
    if(!pressed){
        pressedNode = getPressedNode(graph);
        pressed = true;
    }
}
function mouseReleased() {
    pressed = false;
    pressedNode = null
}
function mouseDragged(){
    if(pressed && pressedNode != null){
        pressedNode.position.x = mouseX;
        pressedNode.position.y = mouseY;
        graph.drawGraph();
    }
}

function getPressedNode(graph){
    for(let i = 0; i < graph.nodeList.length; i++){
        let n = graph.nodeList[i];
        let p = n.position;
        if(Math.abs(p.x - mouseX)<circleSize/2 && Math.abs(p.y - mouseY)<circleSize/2){
            return n;
        }
    }
    return null;
}

let primId=0;
let algo = null;

let Prim = class{
    constructor(){
        algo = primId;
        this.arbre = [];
        let startNode = graph.nodeList[0];
        this.arbre.push(startNode);
        startNode.color = new Color(200,0,0);
        graph.drawGraph();
        this.done = false;
    }
    step(){
        if(!this.done) {
            let minWeight = 999;
            let minNode = null;
            let minLink = null;
            for (let i = 0; i < this.arbre.length; i++) {
                let currentNode = this.arbre[i];
                for (let j = 0; j < currentNode.links.length; j++) {
                    let link = currentNode.links[j];
                    if (!this.isInTree(link.node1)) {
                        if (link.weight < minWeight) {
                            minWeight = link.weight;
                            minNode = link.node1;
                            minLink = link;
                        }
                    }
                    if (!this.isInTree(link.node2)) {
                        if (link.weight < minWeight) {
                            minWeight = link.weight;
                            minNode = link.node2;
                            minLink = link;
                        }
                    }
                }
            }
            if (minNode !== null) {
                this.arbre.push(minNode);
                minNode.color = new Color(200, 0, 0);
                minLink.color = new Color(200, 0, 0);
                graph.drawGraph();
            }
            this.checkIfDone();
        }
    }
    isInTree(node){
        for(let i = 0; i<this.arbre.length; i++) {
            let n = this.arbre[i];
            if(node.tag === n.tag){
                return true;
            }
        }
        return false;
    }
    checkIfDone(){
        let isDone = true;
        for(let i = 0; i<graph.nodeList.length; i++) {
            if(!this.isInTree(graph.nodeList[i])){
                isDone = false;
            }
        }
        this.done = isDone;
        document.getElementById("stepbtn").disabled = isDone;
    }
};

let primAlgo = null;
function prim() {
    document.getElementById("stepbtn").disabled = false;
    primAlgo = new Prim();
}

function stepAlgorithm(){
    if(algo === primId){
        primAlgo.step();
    }
}
