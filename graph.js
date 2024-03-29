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

let Node = class{
    constructor(position, tag){
        this.position = position;
        this.tag = tag;
        this.links = [];
        this.drawNode();
    }

    drawNode(){
        stroke(0);
        fill(255);
        ellipse(this.position.x, this.position.y, circleSize,circleSize);
        textSize(fontSize);
        fill(0);
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

    constructor(node1, node2, weight){
        this.node1 = node1;
        this.node2 = node2;
        this.node1.links.push(this);
        this.node2.links.push(this);
        this.weight = weight;
    }

    drawLink(){
        let x1 = this.node1.position.x;
        let y1 = this.node1.position.y;
        let x2 = this.node2.position.x;
        let y2 = this.node2.position.y;
        stroke(0);
        line(x1,y1,x2,y2);
        fill(0);
        text(this.weight,(x1+x2)/2,(y1+y2)/2);
        this.node1.drawNode();
        this.node2.drawNode();
    }
};

let Graph = class{
    constructor(size){
        //init Nodes
        this.nodeList = [];
        for(let i = 0; i < size; i++){
            let tag = String.fromCharCode(65+i);
            if(i === 0){
                let posX = getRandomIntMinMax(circleSize,canvasW);
                let posY = getRandomIntMinMax(circleSize,canvasH);
                this.nodeList.push(new Node(new Position(posX, posY),tag));
            }else{
                this.nodeList.push(new Node(this.getNewRandomPosition(),tag));
            }
        }
        //init Links
        this.linkList = [];
        for(let i = 0; i < this.nodeList.length; i++){
            let n = this.nodeList[i];
            let tmp = this.nodeList.slice(0);
            tmp.splice(i,1);
            for(let j = 0; j<getRandomIntMinMax(1,4);j++){
                let nodeIndex = getRandomIntMax(tmp.length-1);
                let n2 = tmp[nodeIndex];
                if(!n.isLinkedWith(n2)){
                    this.linkList.push(new Link(n,n2,getRandomIntMinMax(1,15)));
                    tmp.splice(nodeIndex,1);
                }
            }
        }
        this.drawGraph();
    }

    drawGraph(){
        clear();
        background(255);
        for(let i = 0; i< this.linkList.length; i++){
            this.linkList[i].drawLink();
        }
        for(let i = 0; i< this.nodeList.length; i++){
            this.nodeList[i].drawNode();
        }
    }
    getNewRandomPosition(){
        let posX = getRandomIntMinMax(circleSize*2,canvasW-circleSize);
        let posY = getRandomIntMinMax(circleSize*2,canvasH-circleSize);
        let posIsOk = true;
        for(let i = 0; i<this.nodeList.length; i++){
            let n = this.nodeList[i];
            if(posIsOk && (Math.abs(n.position.x-posX)<circleSize || Math.abs(n.position.y-posY)<circleSize)){
                posIsOk = false;
            }
        }
        if(posIsOk){
            return new Position(posX, posY);
        }else{
            return this.getNewRandomPosition();
        }
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
    graph = new Graph(getRandomIntMinMax(5,10));
}

function reset(){
    clear();
    background(255);
    graph.drawGraph();
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
