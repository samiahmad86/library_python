function load() {
    var data;
     var a = document.currentScript.getAttribute('one');
    $.getJSON("../static/data.json", function(data) {
        console.log("My data: " + data["features"]);
        buildCanvas(data,);
    })
}
var hoverObjects = [];
var stage; 
var data;
var canvas;
var shelfName ='{{shelf_name}}';
var bookName = '{{book}}';
var buildCanvas = function(data) {
   
    console.log(a);
    canvas = document.getElementById("floorCanvas");
    stage = new createjs.Stage(canvas);
    data = data;
    var myParam = location.search.split('shelf_name=')[1]
    for(var i = 0; i < data.features.length ; i++ ) {
        if((data.features[i].object == "Shelf") &&(data.features[i].properties.name == shelfName)) {   

            var d = document.getElementById('info_obj');
            d.style.position = "absolute";
            d.style.display = "block";
            d.style.left = 450 +'px';
            d.style.top = 250 + 'px';
            d.innerHTML = data.features[i].properties.desc;
            var geometry = data.features[i].geometry;
            var property = data.features[i].properties;
            var shelfHeight, shelfWidth, numRows, rowHeight;
            var polygon = new createjs.Shape();
            polygon.graphics.setStrokeStyle(5).beginStroke("rgb(133, 173, 173)");
            polygon.graphics.beginFill("rgb(186, 169, 154)");
            var coordinates =   [[5.0, 5.0], [400.0, 5.0], [400.0, 600.0], [5.0, 600.0]];
            polygon.graphics.moveTo(coordinates[0][0], coordinates[0][1]);
            shelfHeight = coordinates[2][1] - coordinates[1][1];
            shelfWidth = coordinates[1][0] - coordinates[0][0];
            // make shelf frame
            for( var j = coordinates.length -1; j >= 0; j--) {
             polygon.graphics.lineTo(coordinates[j][0], coordinates[j][1]);
            }
            polygon.graphics.endFill();
            polygon.name = property.name;
            stage.addChild(polygon);
            numRows = property.rows.length;
            rowHeight = shelfHeight/ numRows;
            // make shelf  rows
            for(var l = 0; l < property.rows.length; l++) {
                var line = new createjs.Shape();
                line.graphics.setStrokeStyle(5);
                line.graphics.beginStroke("#000");
                line.graphics.moveTo(coordinates[0][0], coordinates[0][1] + rowHeight* (l+1));
                line.graphics.lineTo(coordinates[1][0], coordinates[1][1] + rowHeight* (l+1));
                line.graphics.endStroke();
                var text = new createjs.Text(property.rows[l].key, "40px Arial", "#000");
                text.x = 0;
                text.y = coordinates[0][1] + rowHeight* (l+1) - 100;   
                text.textBaseline = "bottom";
                stage.addChild(text);
                stage.addChild(line);
            }
            var img = new Image();
            img.onload = handleImageLoad;
            img.src = "../static/books.png";
            var imgWidth, bookHeight;
            function handleImageLoad() {
                bookWidth = img.width;
                bookHeight = img.height;
                var maxBook = 10;
                var scale = bookWidth / (shelfWidth/maxBook);
                for(var k = 0; k <=property.rows.length; k++) {
                    // var widthBook = shelfWidth / property.books_count[i];
                    var randomnumber = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
                     // traversing each shelf
                    for(var j = 0; j < randomnumber; j++) {
                        var currentLocation = new createjs.Bitmap(img);
                        stage.addChild(currentLocation);
                        currentLocation.x = coordinates[0][0] + j * bookWidth;
                        currentLocation.y = coordinates[0][1] + (rowHeight * (k+1)) - (bookHeight*scale);
                        currentLocation.name = "my_loc_"+k+j;
                        currentLocation.scaleX = scale;
                        currentLocation.scaleY = scale;
                        currentLocation.image.onload = function() {
                            stage.update();
                        };
                    }
                }
                stage.update();
            }
            for(var k = 0; k <property.rows.length; k++) {// traversing each shelf
                var res = property.rows[k].key.toLowerCase();
                if(res.indexOf(bookName[0]) !== -1) {
                    var d = document.getElementById('info');
                    d.style.position = "absolute";
                    d.style.display = "block";
                    d.style.left = 150 +'px';
                    d.style.top = coordinates[0][1] + rowHeight* (k)+'px';
                    d.innerHTML = 'your book is here';
                }
            }
           break;
        }
    }
    stage.update();
}

function handleMouseOver(event) {
    var d = document.getElementById('info_obj');
    d.style.position = "absolute";
    d.style.display = "block";
    var x =  event.localX  * 0.7;
    var y =  event.localY * 0.7;
    d.style.left = x + 50 +'px';
    d.style.top = y  + 'px';
    for(var i = 0; i < hoverObjects.length; i++) {
        if(hoverObjects[i][0] == event.currentTarget.name) {
            d.innerHTML = hoverObjects[i][1];
        }
    }
}
function handleMouseOut(event) {
    var d = document.getElementById('info_obj');
    d.style.position = "absolute";
    d.style.display = "none";
}

// TODO
function locateShelf() {
    stage.removeChild(stage.children[2]);
    var polygon = new createjs.Shape();
    polygon.graphics.setStrokeStyle(0.5).beginStroke("rgba(0,0,0,1)");
    polygon.graphics.beginFill("#ffe41c");
    polygon.graphics.moveTo(10, 10);
    polygon.graphics.lineTo(400, 10);
    polygon.graphics.lineTo(400, 50);
    polygon.graphics.lineTo(10, 50);
    polygon.graphics.lineTo(10, 10);
    polygon.graphics.endFill();
    stage.addChild(polygon);
    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(3);
    line.graphics.setStrokeDash([10,10]);
    line.graphics.beginStroke("#0d6de2");
    line.graphics.moveTo(500, 200);
    line.graphics.lineTo(200, 60);
    stage.addChild(line);
    stage.update();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}