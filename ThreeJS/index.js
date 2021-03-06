//配列コピーがヤバイのでは？

var width; //window.innerWidth;
var height; //window.innerHeight;
var rad = 3;
var scene;
var camera;
var renderer;
var controls;
var sphere = [];
var N = 8;
var twoExist;
var spherelist = [];
var save = [];
var firstUserColor = 0;
var usercolor = 0;
var maincolor = 1; //黒が先攻
var turn;
var command = document.getElementById("command");
var now = document.getElementById("now");
var flag = 0;
var tmp;
var aiList = ["randkun", "semimanabukun", "zodiac", "human"];
var vsAI = 0;
var step = 4;
var canput_list = [];
var skip = 0;
var luckypoint = [[0, 0], [0, N-1], [N-1, 0], [N-1, N-1]];
var spin = 10;
var c = 0.5; //UCB1

//me = AI
var mefirst = [
  [1303, 606, 754, 832, 699, 734, 586, 1295],
  [625, 378, 676, 542, 863, 699, 435, 616],
  [637, 689, 286, 1344, 265, 745, 679, 716],
  [753, 644, 770, 0, 0, 509, 692, 670],
  [601, 863, 327, 0, 0, 1287, 508, 777],
  [721, 613, 896, 465, 585, 498, 591, 646],
  [603, 369, 503, 704, 584, 693, 373, 589],
  [1314, 598, 676, 557, 502, 608, 1319]
]
var youafter = [
  [-45, -742, -595, -517, -650, -615, -763, -53],
  [-723, -971, -673, -807, -486, -650, -914, -733],
  [-712, -363, -1063, -5, -1084, -604, -670, -633],
  [-596, -705, -579, 0, 0, -840, -657, -679],
  [-748, -486, -1022, 0, 0, -62, -841, -571],
  [-628, -736, -453, -884, -764, -851, -758, -700],
  [-742, -978, -846, -644, -764, -654, -971, -755],
  [-32, -746, -671, -773, -791, -843, -733, -25]
]

var meafter = [
  [1295, 586, 734, 699, 832, 754, 606, 1303],
  [616, 435, 699, 863, 542, 676, 378, 625],
  [716, 679, 745, 265, 1344, 286, 986, 637],
  [670, 692, 509, 0, 0, 770, 644, 753],
  [777, 508, 1287, 0, 0, 327, 863, 601],
  [646, 591, 498, 585, 465, 896, 613, 721],
  [589, 373, 693, 584, 704, 502, 369, 603],
  [1319, 608, 502, 557, 575, 676, 598, 1314]
]
var youfirst = [
  [-53, -763, -615, -650, -517, -595, -742, -45],
  [-733, -914, -650, -486, -807, -673, -971, -723],
  [-633, -670, -604, -1084, -5, -1063, -363, -712],
  [-679, -657, -840, 0, 0, -579, -705, -596],
  [-571, -841, -62, 0, 0, -1022, -486, -748],
  [-700, -758, -851, -764, -884, -453, -736, -628],
  [-755, -971, -654, -764, -644, -846, -978, -742],
  [-25, -733, -843, -791, -773, -671, -746, -32]
]



function windSize(){
  height = window.innerHeight;
  width = window.innerWidth;
}



function init(){

  windSize(); //Windowサイズ取得

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);
  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  renderer = createRenderer(width, height);

  var k = 0;
  for(var i = 0; i < N; i++){
    sphere[i] = [];
    for(var j = 0; j < N; j++){
      if((i == N/2-1 && j == N/2-1) || (i == N/2 && j == N/2)){
        sphere[i][j] = createSphere(rad, -1, i, j);
      }else if((i == N/2-1 && j == N/2) || (i == N/2 && j == N/2-1)){
        sphere[i][j] = createSphere(rad, 1, i, j);
      }
      else sphere[i][j] = createSphere(rad, 0, i, j);
      spherelist[k++] = sphere[i][j];
    };
  };

  var light1 = createLight(0xFFFFFF, -1000, 2000, -1000);
  var light2 = createLight(0xFFFFFF, 1000, 2000, 1000);
  camera.position.x = 100;
  camera.position.y = 100;
  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(light1);
  scene.add(light2);
  update();
}



function createRenderer(width, height){
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0x2EFE2E, 1);
  document.body.appendChild(renderer.domElement);
  return renderer;
}



function createSphere(rad, color, x, z){

  //候補位置FF0040 (2)
  //何もないFACC2E (0)
  //白FFFFFF (-1)
  //黒000000 (1)

  var colorcord;
  if(color == 2){
    colorcord = 0xFF0040;
  }else if(color == -1){
    colorcord = 0xFFFFFF;
  }else if(color == 1){
    colorcord = 0x000000;
  }else{
    colorcord = 0xFACC2E;
  }

  var geometry = new THREE.SphereGeometry(rad, 25, 25);
  var material = new THREE.MeshPhongMaterial({color: colorcord});
  var sphere = new THREE.Mesh(geometry, material);

  sphere.color = color;

  //座標設定
  sphere.mapx = x;
  sphere.mapy = z;

  sphere.position.set((-N/2)*10+x*10+5, 0, (-N/2)*10+z*10+5);
  scene.add(sphere);
  return sphere;
}



function createLight(color, x, y, z){
  var light = new THREE.DirectionalLight(color);
  light.position.set(x, y, z);
  return light;
}



function showtext(){
  var str;
  if(skip != "fin"){
    if(skip == 0){
      turn = (maincolor == -1) ? "White turn.\n" : "Black turn.\n";
    }else{
      if(skip == 1){ //ME->AI(skip)->ME
        turn = (maincolor == -1) ? vsAI + " turn SKIP! White turn.\n" : vsAI + " turn SKIP! Black turn.\n";
      }else{ //AI->ME(skip)->AI->ME
        turn = (maincolor == -1) ? "White turn SKIPED! White turn.\n" : "Black turn SKIPED! Black turn.\n";
      }
    }
    str = turn + "おける箇所: " + canput(0) + " 箇所";
  }else{
    var whitepoint = 0;
    var blackpoint = 0;
    for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
      if(sphere[i][j].color == 1){
        blackpoint++;
      }else if(sphere[i][j].color == -1) whitepoint++;
      if(blackpoint > whitepoint){
        str = "Black WIN!\n" + "Black: " + blackpoint + " White: " + whitepoint;
      }else if(blackpoint < whitepoint){
        str = "White WIN!\n" + "Black: " + blackpoint + " White: " + whitepoint;
      }else str = "DRAW!\n" + "Black: " + blackpoint + " White: " + whitepoint;
    }}
  }
  now.textContent = str;
}



function wlh(str){
  return window.location.href.split("#")[1] == str;
}



function update(){
  controls.update();
  requestAnimationFrame(update);
  renderer.render(scene, camera);

  var projector = new THREE.Projector();

  //マウスのグローバル変数
  var mouse = { x: 0, y: 0};

  if(flag == 0){//先攻後攻決定
    if(wlh(undefined)){
      command.textContent = "Please first decide a color.";
    }else if(!wlh("black") && !wlh("white")){
      command.textContent = "No! Please first decide the color!";
    }else{
      if(wlh("white")){
        firstUserColor = -1;
        usercolor = "You are White. after."
      }else if(wlh("black")){
        firstUserColor = 1;
        usercolor = "You are Black. first."
      }
      flag = 1;
      command.textContent = usercolor + "Please input a battle AI.";
    }
  }else if(flag == 1){//対戦AI決定
    if(wlh("randkun")){
      vsAI = "randkun";
    }else if(wlh("semimanabukun")){
      vsAI = "semimanabukun";
    }else if(wlh("zodiac")){
      vsAI = "zodiac";
    }else if(wlh("human")){
      vsAI = "human";
    }
    if(vsAI != 0) for(var i = 0; i < aiList.length; i++){
      if(aiList[i] != vsAI){
        tmp = document.getElementById(aiList[i]);
        tmp.parentNode.removeChild(tmp);
      }
      flag = 2;
    }
  }else if(flag == 2){
    command.textContent = usercolor + " VS. " + vsAI;
    showtext();
    if(firstUserColor == -1) ai();
    flag = 3;
  }

  if(flag == 3){

    window.location.hash = step + "step";

    window.onmousemove = function(ev){ //マウスが移動された時
      if(ev.target == renderer.domElement){
        //マウス座標2D変換
        var rect = ev.target.getBoundingClientRect();
        mouse.x =  ev.clientX - rect.left;
        mouse.y =  ev.clientY - rect.top;

        //マウス座標3D変換width(横)やheight(縦)は画面サイズ
        mouse.x =  (mouse.x / width) * 2 - 1;
        mouse.y = -(mouse.y / height) * 2 + 1;

        var vector = new THREE.Vector3(mouse.x, mouse.y ,1); //マウスベクトル

        projector.unprojectVector(vector, camera); //vectorはスクリーン座標系なので,オブジェクトの座標系に変換

        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize()); //始点,向きベクトルを渡してレイを作成

        // クリック判定
        var obj = ray.intersectObjects(spherelist);
        if(obj.length > 0){
          obj[0].object.material.color.setHex(0x0067C0);
          save.push(obj[0]);
        }else if(save.length > 0){
          for(var i = 0; i < save.length; i++){
            //候補位置FF0040 (2)
            //何もないFACC2E (0)
            //白FFFFFF (-1)
            //黒000000 (1)
            var objcolor;
            if(save[i].object.color == 0){
              objcolor = 0xFACC2E;
            }else if(save[i].object.color == 2){
              objcolor = 0xFF0040;
            }else if(save[i].object.color == 1){
              objcolor = 0x000000;
            }else objcolor = 0xFFFFFF;
            save[i].object.material.color.setHex(objcolor);
          }
          save = [];
        }
      }

      //マウスが押された時
      window.onmousedown = function(e){
        if(e.target == renderer.domElement) {
          //クリックされたら加速度切り替え(停止か稼働か)
          if(controls.autoRotate){
            controls.autoRotate = false;
          }else controls.autoRotate = true;
          if(obj.length > 0){
            if(sphere[obj[0].object.mapx][obj[0].object.mapy].color == 2){
              play(obj[0].object.mapx, obj[0].object.mapy, 0);
            }
            if(controls.autoRotate){ //加速度保持
              controls.autoRotate = false;
            }else controls.autoRotate = true;
          }
        }
      };
    };
  }
}



function river(x, y, sphere_array){
  var color = maincolor;
  var colorcord = (color == -1) ? 0xFFFFFF : 0x000000 ;
  for(var i = -1; i < 2; i++){for(var j = -1; j < 2; j++){
    if((i != 0 || j != 0) && 0 <= x+i && 0 <= y+j && x+i < N && y+j < N){
      var count = 0;
      var m = x+i;
      var n = y+j;
      while(((sphere_array == 0 && sphere[m][n].color == color * -1) || (sphere_array != 0 && sphere_array[m][n] == color * -1)) && 0 <= m+i && 0 <= n+j && m+i < N && n+j < N){
        count++;
        m+=i;
        n+=j;
      }
      if(sphere_array == 0 && sphere[m][n].color == color && count > 0){
        for(var k = 0; k < count; k++){
          sphere[m+(k+1)*i*-1][n+(k+1)*j*-1].color = color;
          sphere[m+(k+1)*i*-1][n+(k+1)*j*-1].material.color.setHex(colorcord);
        }
      }else if(sphere_array != 0 && sphere_array[m][n] == color && count > 0){
        for(var k = 0; k < count; k++) sphere_array[m+(k+1)*i*-1][n+(k+1)*j*-1] = color;
      }
    }
  }}
  if(sphere_array == 0){
    sphere[x][y].color = color;
    sphere[x][y].material.color.setHex(colorcord);
    maincolor *= -1;
    step++;
  }else if(sphere_array != 0){
    sphere_array[x][y] = color;
    maincolor *= -1;
  }
}




function canput(sphere_array){
  //候補位置をリセット
  var color = maincolor;
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(sphere_array == 0 && sphere[i][j].color == 2){
      sphere[i][j].color = 0;
      sphere[i][j].material.color.setHex(0xFACC2E);
    }else if(sphere_array != 0 && sphere_array[i][j] == 2) sphere_array[i][j] = 0;
  }}
  var twoExist = 0;
  canput_list = [];
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if((sphere_array == 0 && sphere[i][j].color == 0) || (sphere_array != 0 && sphere_array[i][j] == 0)){
      for(var k = -1; k < 2; k++){for(var l = -1; l < 2; l++){
        if((k != 0 || l != 0) && 0 <= i+k && 0 <= j+l && i+k < N && j+l < N){
          var count = 0;
          var m = i+k;
          var n = j+l;
          while(((sphere_array == 0 && sphere[m][n].color == color * -1) || (sphere_array != 0 && sphere_array[m][n] == color * -1)) && 0 <= m+k && 0 <= n+l && m+k < N && n+l < N){
            count++;
            m+=k;
            n+=l;
          }
          if(sphere_array == 0 && sphere[m][n].color == color && count > 0){
            sphere[i][j].color = 2;
            sphere[i][j].material.color.setHex(0xFF0040);
            canput_list[twoExist++] = [i, j];
          }else if(sphere_array != 0 && sphere_array[m][n] == color && count > 0){
            sphere_array[i][j] = 2;
            canput_list[twoExist++] = [i, j];
          }
        }
      }}
    }
  }}
  return twoExist;
}



function play(x, y, sphere_array){
  river(x, y, sphere_array);
  if(canput(0) == 0){
    maincolor *= -1;
    skip++;
    if(canput(0) == 0){
      skip = "fin";
      showtext();
    }else{
      if(maincolor != firstUserColor){
        skip++;
        showtext();
        skip = 0;
        ai();
      }else{
        showtext();
        skip = 0;
      }
    }
  }else{
    skip = 0;
    if(firstUserColor != maincolor){
      ai();
    }else showtext();
  }
}



function randkun(){
  var xy = [];
  var k = 0;
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(sphere[i][j].color == 2) xy[k++] = [i, j];
  }}
  return xy[getRandomInt(0, xy.length - 1)];
}



function maxer(sphere_array){
  var max;
  var flag = 0;
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if((sphere_array == 0 && sphere[i][j].color == 2) || (sphere_array != 0 && sphere_array[i][j] == 2)){
      if(flag++ == 0 || (firstUserColor == -1 && mefirst[max[0]][max[1]] + youafter[max[0]][max[1]] < mefirst[i][j] + youafter[i][j]) || (firstUserColor == 1 && meafter[max[0]][max[1]] + youfirst[max[0]][max[1]] < meafter[i][j] + youfirst[i][j])) max = [i, j];
    }
  }}
  return max;
}



function listmax(list){
  var max;
  var flag = 0;
  for(var i = 0; i < list.length; i++){
    if(flag++ == 0 || (maincolor == -1 && mefirst[max[0]][max[1]] + youafter[max[0]][max[1]] < mefirst[list[i][0]][list[i][1]] + youafter[list[i][0]][list[i][1]]) || (maincolor == 1 && meafter[max[0]][max[1]] + youfirst[max[0]][max[1]] < meafter[list[i][0]][list[i][1]] + youfirst[list[i][0]][list[i][1]])) max = list[i];
  }
  return max;
}



function semimanabukun(epsilon, sphere_array){
  var epsilonMax = 1.0;
  if(0 < epsilon && epsilon > Math.random()){
    return randkun();
  }else return maxer(sphere_array);
}



function epi(xy, saveArray, spin){
  var sum = 0;

  for(var i = 0; i < spin; i++){
    var savesaveArray = JSON.parse(JSON.stringify(saveArray));
    var savecolor = JSON.parse(JSON.stringify(maincolor));
    var win = -3;
    river(xy[0], xy[1], saveArray);
    while(win == -3){
      if(canput(saveArray) == 0){
        maincolor *= -1;
        if(canput(saveArray) == 0){
          var whitepoint = 0;
          var blackpoint = 0;
          for(var j = 0; j < N; j++){for(var k = 0; k < N; k++){
            if(saveArray[j][k] == 1){
              blackpoint++;
            }else if(saveArray[j][k] == -1){
              whitepoint++;
            }
          }}
          if(blackpoint > whitepoint){
            win = (firstUserColor == -1) ? 1 : -1;
          }else if(blackpoint < whitepoint){
            win = (firstUserColor == 1) ? 1 : -1;
          }else win = 0;
        }
      }else{
        var xypoint = semimanabukun(0.4, saveArray); //UCB1に変えたらもっとよくなるかもしれない
        river(xypoint[0], xypoint[1], saveArray);
      }
    }
    sum += win;

    saveArray = JSON.parse(JSON.stringify(savesaveArray)); 
    maincolor = JSON.parse(JSON.stringify(savecolor));
  }

  return [sum/spin+c*(Math.sqrt(Math.log(spin)/spin)), xy[0], xy[1]];
}



function best(saveArray){
  var canput_list_cp = JSON.parse(JSON.stringify(canput_list));
  var loop = (canput_list.length < spin) ? canput_list.length : spin;
  var hope = [];

  for(var i = 0; i < loop; i++){
    var max = listmax(canput_list_cp);
    var unluckypoint = 0;

    //max部分を削る
    for(var j = 0; j < canput_list_cp.length; j++){
      if(canput_list_cp[j].indexOf(max[0]) > -1 && canput_list_cp[j].indexOf(max[1]) > -1){
        canput_list_cp = canput_list_cp.slice(0, j).concat(canput_list_cp.slice(j+1, canput_list_cp.length));
        break;
      }
    }
    for(var j = -1; j < 2 && unluckypoint == 0 ; j++){for(var k = -1; k < 2 && unluckypoint == 0; k++){
      for(var l = 0; l < luckypoint.length && unluckypoint == 0; l++){
        if((j != 0 || k != 0) && max[0]+j == luckypoint[l][0] && max[1]+k == luckypoint[l][1]){
          unluckypoint = 1;
        }
      }
    }}

    var savecolor = JSON.parse(JSON.stringify(maincolor));
    var savesaveArray = JSON.parse(JSON.stringify(saveArray));
    //候補位置の選定
    if(unluckypoint == 0){
      hope[i] = epi(max, saveArray, Math.floor(loop/2)-Math.floor(i/2));
    }else hope[i] = [-100, max[0], max[1]];
    saveArray = JSON.parse(JSON.stringify(savesaveArray));
    maincolor = JSON.parse(JSON.stringify(savecolor));
    canput(saveArray);
  }
  var hopebest = hope[0];
  for(var i = 1; i < hope.length; i++){
    if(hopebest[0] < hope[i][0]) hopebest = hope[i];
  }

  return [hopebest[1], hopebest[2]];
}



function zodiac(){
  var xy = 0;

  //九局面までsemimanabukun
  if(step < 10){
    xy = semimanabukun(0.1, 0);
  }

  //十局面以降
  else{
    //角に置けるなら置く
    for(var i = 0; i < luckypoint.length; i++){
      if(sphere[luckypoint[i][0]][luckypoint[i][1]].color == 2){
        xy = [luckypoint[i][0], luckypoint[i][1]];
        break;
      }
    }

    //モンテカルロ木
    if(xy == 0){
      var saveArray = [];
      for(var i = 0; i < N; i++){
        saveArray[i] = [];
        for(var j = 0; j < N; j++) saveArray[i][j] = sphere[i][j].color;
      }
      var savecolor = JSON.parse(JSON.stringify(maincolor));
      xy = best(saveArray);
      maincolor = JSON.parse(JSON.stringify(savecolor));
    }
  }
  return xy;
}



function ai(){
  var xy = [];
  if(vsAI == "randkun"){
    xy = randkun();
  }else if(vsAI == "semimanabukun"){
    xy = semimanabukun(0.1, 0);
  }else if(vsAI == "zodiac"){
    xy = zodiac();
  }
  if(vsAI == "human"){
    showtext();
  }else play(xy[0], xy[1], 0);
}



function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



window.addEventListener('DOMContentLoaded', init);
