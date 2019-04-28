
// Checkers Game

// black.jpg
// gray.jpg
// you1.jpg -- normal piece (player/red)
// you2.jpg -- highlighted piece
// you1k.jpg -- kinged normal piece
// you2k.jpg -- kinged highlighted piece
// me1.jpg -- normal piece (computer/black)
// me2.jpg -- highlighted piece
// me1k.jpg -- kinged normal piece
// me2k.jpg -- kinged highlighted piece

function preload() {
this.length = preload.arguments.length;
for (var i = 0; i < this.length; i++) {
    this[i] = new Image();
    this[i].src = preload.arguments[i];
}
}
var pics = new preload("black.jpg","gray.jpg",
    "you1.jpg","you2.jpg","you1k.jpg","you2k.jpg",
    "me1.jpg","me2.jpg","me1k.jpg","me2k.jpg");

var black = -1; // computer is black
var red = 1; // visitor is red
var square_dim = Math.floor((document.body.clientHeight *0.8)/8);
var piece_toggled = false;
var my_turn = false;
var double_jump = false;
var comp_move = false;
var game_is_over = false;
var safe_from = safe_to = null;
var toggler = null;
var togglers = 0;
var HOST = 'https://checkers-game-api.herokuapp.com/';
function Board() {

    board = new Array();
    for (var i=0;i<8; i++) {
        board[i] = new Array();
        for (var j=0;j<8;j++)
            board[i][j] = Board.arguments[8*j+i];
    }

}
var board;
var selected={x:0,y:0};

var is_selected = false;
var legal_move_list=[{"deleted":[],"from":{"x":0,"y":5},"king":false,"to":{"x":1,"y":4}},{"deleted":[],"from":{"x":2,"y":5},"king":false,"to":{"x":3,"y":4}},{"deleted":[],"from":{"x":2,"y":5},"king":false,"to":{"x":1,"y":4}},{"deleted":[],"from":{"x":4,"y":5},"king":false,"to":{"x":5,"y":4}},{"deleted":[],"from":{"x":4,"y":5},"king":false,"to":{"x":3,"y":4}},{"deleted":[],"from":{"x":6,"y":5},"king":false,"to":{"x":7,"y":4}},{"deleted":[],"from":{"x":6,"y":5},"king":false,"to":{"x":5,"y":4}}]
// Board(1,0,1,0,1,0,1,0,
//     0,1,0,1,0,1,0,1,
//     1,0,1,0,1,0,1,0,
//     0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,
//     0,-1,0,-1,0,-1,0,-1,
//     -1,0,-1,0,-1,0,-1,0,
//    0,-1,0,-1,0,-1,0,-1);

Board(0,-1,0,-1,0,-1,0,-1,
    -1,0,-1,0,-1,0,-1,0,
    0,-1,0,-1,0,-1,0,-1,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    1,0,1,0,1,0,1,0,
    0,1,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0);

function message(str) {
    console.log(str);
    // $("#info").innerText="12";
    document.getElementById("info").innerText = str;
    return;
    if (!game_is_over)
        document.info.value = str;
}
function moveable_space(i,j) {
    // calculates whether it is a gray (moveable)
    // or black (non-moveable) space
    return (((i%2)+j)%2 == 0);
}
function Coord(x,y) {
    this.x = x;
    this.y = y;
}
function coord(x,y) {
    c = new Coord(x,y);
    return c;
}

document.write("<table border=0 cellspacing=0 cellpadding=0 width="+(square_dim*8+8)
    +"<tr><td><img src='black.jpg' width="+(square_dim*8+8)
    +" height=4><br></td></tr>");
for(var j=0;j<8;j++) {
    document.write("<tr><td><img src='black.jpg' width=4 height="+square_dim+">");
    for(var i=0;i<8;i++) {
        if (!moveable_space(i,j))
            document.write("<a href='javascript:clicked("+i+","+j+")'>");
        document.write("<img src='");
        if (board[i][j]==1) document.write("you1.jpg");
        else if (board[i][j]==-1) document.write("me1.jpg");
        else if (moveable_space(i,j)) document.write("gray.jpg");
        else document.write("black.jpg");
        document.write("' width="+square_dim+" height="+square_dim
            +" name='space"+i+""+j+"' border=0>");
        if (!moveable_space(i,j)) document.write("</a>");
    }
    document.write("<img src='black.jpg' width=4 height="+square_dim+"></td></tr>");
}
document.write("<tr><td><img src='black.jpg' width="+(square_dim*8+8)
    +" height=4><br></td></tr></table><br>"+
    "<button "
    +"type=button style='width: "+(square_dim*8).toString()+"px' class='btn' onClick=\"location.href+=''\">Начать заново</button>");

function getboard() {
    var m=[[],[],[],[],[],[],[],[]];
    for (var i =0;i<8;i++){
        for(var k=0;k<8;k++){
            m[i][k]=board[k][i]
        }
    }
    return JSON.stringify(m);
}
function clicked(i,j) {

    if (my_turn) {
        if ( board[i][j]>0) {
            if(!is_selected)
                toggle(i,j);
            else{
                untoggle(selected.x,selected.y);
                toggle(i,j);
            }

        }
        else {
            if(is_selected) {
                console.log("MOVE");
                move(selected, coord(i, j));
            }
            else console.log("error");
        }
    } else {
        message("It's not your turn yet. Hang on a sec!");
    }


}
function toggle(x,y) {
    console.log("toggle");

    draw(x,y,"you2"+((board[x][y]==2)?"k":"")+".jpg");


    selected.x=x;
    selected.y=y;
    is_selected = true;
}
function untoggle(x,y) {
    console.log("untoggle");

    draw(x,y,"you1"+((board[x][y]==2)?"k":"")+".jpg");
    is_selected = false;

}
function draw(x,y,name) {
    document.images["space"+x+""+y].src = name;

}


function legal_move(from,to) {
    for (var leg in legal_move_list){
        let L =legal_move_list[leg];
        if(from.x===L.from.x && from.y===L.from.y && to.x===L.to.x && to.y===L.to.y){
            return L.deleted ;
        }
    }
    return false;
}

function king_me(x,y) {
    console.log('KING');
    console.log(board);
    if (board[x][y] === 1) {
        board[x][y] = 2; // king you
        draw(x,y,"you1k.jpg");
    } else if (board[x][y] === -1) {
        board[x][y] = -2; // king me
        draw(x,y,"me1k.jpg");
    }
}

function move(from,to) {
    my_turn = true;
    var del = legal_move(from,to);
    if (del) {

        untoggle(from.x,from.y);
        swap(from,to);
        for (d in del){
            remove(del[d].x,del[d].y)
        }

        console.log(board);

        $.get({
            url: "https://checkers-game-api.herokuapp.com/",
            data:{board:getboard() },
            success: function(resp){
                if(resp===0){
                    alert("Ничья.");
                    document.location.reload();
                    return;
                }
                if(resp===1){
                    alert("Вы победили! Добро пожаловать в клуб.");
                    document.location.href="https://www.humansnotinvited.com/";
                    return;
                }
                if(resp===-1){
                    alert("Ты слил. Машины захватывают мир! DEATH666!");
                    document.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                    return;
                }
                // resp=JSON.parse(resp);
                console.log(resp);
                setTimeout(()=>{move_comp(coord(resp.from.x,resp.from.y),coord(resp.to.x,resp.to.y),resp.deleted);},300)
            }
        });
        if(to.y===0)
            king_me(to.x,to.y);
        message("Ход соперника");

    }
    else {
        message("Недопустимый ход");
    }
    return ;

}

function swap(from,to) {
    if (my_turn || comp_move) {
        dummy_src = document.images["space"+to.x+""+to.y].src;
        document.images["space"+to.x+""+to.y].src = document.images["space"+from.x+""+from.y].src;
        document.images["space"+from.x+""+from.y].src = dummy_src;
    }
    dummy_num = board[from.x][from.y];
    board[from.x][from.y] = board[to.x][to.y];
    board[to.x][to.y] = dummy_num;
}
function remove(x,y) {
    if (my_turn || comp_move)
        draw(x,y,"black.jpg");
    board[x][y] = 0;
}

function move_comp(from,to,del=[]) {

    comp_move = true;
    my_turn = false;

    console.log(from,to);
    swap(from,to);

    for (d in del){
        remove(del[d].x,del[d].y)
    }
    $.get({
        url: "https://checkers-game-api.herokuapp.com/legal/",
        data:{board:getboard() },
        success: function(resp){
            if(resp===0){
                alert("Ничья.");
                document.location.reload();
                return;
            }
            if(resp===1){
                alert("Вы победили! Добро пожаловать в клуб.");
                document.location.href="https://www.humansnotinvited.com/";
                return;
            }
            if(resp===-1){
                alert("Ты слил. Машины захватывают мир! DEATH666!");
                document.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                return;
            }
            legal_move_list=resp;
        }
    });
    if(to.y===7)
        king_me(to.x,to.y);

    // draw(1,5,'gray.jpg');
    setTimeout(()=>{
        comp_move = false;
        my_turn = true;
    },800);
    message("Твой ход");

    return true;
}
function game_over() { // make sure game is not over (return false if game is over)
    message("You beat me!");
}


my_turn = true;
