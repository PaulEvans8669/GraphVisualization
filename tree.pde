final int canvasW = 750;
final int canvasH = 750;
final int circleSize = 50;
final int fontSize = 16;




class Position {
  public int x,y;
  Position(int x, int y){
    this.x = x;
    this.y = y;
  }
}

class Node {
  public Position position;
  public String tag;
  public ArrayList<Link> links;
  
  public void drawNode(){
    stroke(0);
    fill(255);
    circle(position.x, position.y, circleSize);    
    textSize(fontSize);
    fill(0);
    text(tag,position.x-fontSize/2+3,position.y+fontSize/2-1);
  }
  
  public boolean isLinkedWith(Node node){
    for(int i = 0; i < this.links.size(); i++){
      Link l = this.links.get(i);
      if(l.node1 == node || l.node2 == node){
        return true;
      }
    }
    return false;
  }
  
  Node(Position position, String tag){
    this.position = position;
    this.tag = tag;
    this.links = new ArrayList();
    drawNode();
  }
  
  Node(int x, int y, String tag){
    this.position = new Position(x,y);
    this.tag = tag;
    this.links = new ArrayList();
    drawNode();
  }
}


class Link{
  public Node node1, node2;
  public int weight;
  
  Link(Node node1, Node node2, int weight){
    this.node1 = node1;
    this.node2 = node2;
    this.node1.links.add(this);
    this.node2.links.add(this);
    this.weight = weight;
  }
  
  public void drawLink(){
    int x1 = this.node1.position.x;
    int y1 = this.node1.position.y;
    int x2 = this.node2.position.x;
    int y2 = this.node2.position.y;
    stroke(0);
    line(x1,y1,x2,y2);
    fill(0);
    text(weight,(x1+x2)/2,(y1+y2)/2);
    this.node1.drawNode();
    this.node2.drawNode();
    
  }
}

class Tree {
    
  ArrayList<Node> nodeList;
  ArrayList<Link> linkList;
  
  Tree(int size){
    this.nodeList = new ArrayList();
    for(int i = 0; i < size; i++){
      String tag = str(char(65+i));
      if(i == 0){
        int posX = int(random(circleSize,canvasW));
        int posY = int(random(circleSize,canvasH));
        nodeList.add(new Node(posX, posY,tag));
      }else{
        nodeList.add(new Node(getNewRandomPosition(),tag));
      }
    }
    
    this.linkList = new ArrayList();
    for(int i = 0; i < this.nodeList.size(); i++){
      Node n = this.nodeList.get(i);
      ArrayList<Node> tmp = (ArrayList<Node>) this.nodeList.clone();
      tmp.remove(i);
      for(int j = 0; j<random(1,2);j++){
        int nodeIndex = int(random(tmp.size()-1));
        Node n2 = tmp.get(nodeIndex);
        if(!n.isLinkedWith(n2)){
          this.linkList.add(new Link(n,n2,int(random(1,15))));
          tmp.remove(nodeIndex);
        }
      }
    }
    drawTree();
  }
  
  private void drawTree(){
    clear();
    background(255);
    for(int i = 0; i< this.linkList.size(); i++){
      this.linkList.get(i).drawLink();
    }
    for(int i = 0; i< this.nodeList.size(); i++){
      this.nodeList.get(i).drawNode();
    }
  }
  
  private Position getNewRandomPosition(){
    int posX = int(random(circleSize*2,canvasW-circleSize));
    int posY = int(random(circleSize*2,canvasH-circleSize));
    boolean posIsOk = true;
    for(int i = 0; i<nodeList.size(); i++){
      Node n = nodeList.get(i);
      if(posIsOk && (abs(n.position.x-posX)<circleSize || abs(n.position.y-posY)<circleSize)){
        posIsOk = false;
      }
    }
    if(posIsOk){
      return new Position(posX, posY);
    }else{
      return getNewRandomPosition();
    }
  }
  
}


Tree tree;
void setup() {
  fullScreen();
  background(255);
  tree = new Tree(7);
}
void draw(){
}

void mouseDragged(){
  Node n = getPressedNode(tree);
  if(n != null){
    int deltaX = mouseX - pmouseX;
    int deltaY = mouseY - pmouseY;
    n.position.x+= deltaX;
    n.position.y+= deltaY;
    tree.drawTree();
  }
}

public Node getPressedNode(Tree tree){
  for(int i = 0; i < tree.nodeList.size(); i++){
    Node n = tree.nodeList.get(i);
    Position p = n.position;
    if(abs(p.x - mouseX)<circleSize/2 && abs(p.y - mouseY)<circleSize/2){
      return n;
    }
  }
  return null;
} //<>//
