var big = document.getElementById('big');//背景图片
var bigX = 0;//背景图片位移记录
var birdie = document.getElementById('birdie');//小鸟
var birdieY = birdie.offsetTop;//记录小鸟当前高度
var rotate = 0;//小鸟角度
var speed = 0;//小鸟运动方向变量
var score = document.getElementById('score');//分数
score.num = 0;//分数记录
var timeBig = null;//背景动画定时器
var startGamebtn = document.getElementById('startGamebtn');//开始游戏按钮
var vertical = null;//小鸟高度动画计时器
var obstacleList = document.getElementsByClassName('obstacle');//游戏障碍父元素
var difficulty = 380;//难度属性(减小上下障碍空隙随机值)
onmousedown = function () {//增加小鸟高度
    speed = -6;
    rotate = -30;
    if (difficulty < 440) {
        difficulty = 380 + Math.floor(score.num / 2);
    }
}
onkeydown = function (e) {//增加小鸟高度
    if (e.keyCode == 32) {
        speed = -6;
        rotate = -30;//调整飞机图片角度,最大90
        if (difficulty < 420) {
            difficulty = 380 + Math.floor(score.num / 2);
        }
    }
}

function stopPlaying() {//游戏失败界面
    clearInterval(vertical);
    big.style.animation = '';
    for (var i = 0; i < obstacleList.length; i++) {
        clearInterval(obstacleList[i].timeID);
    }
    startGamebtn.style.display = 'block';
    startGamebtn.innerHTML = '分数:' + score.num + ',重新开始';
    birdieY = 200;
    score.num = 0;
}

function gameObstacle() {//创建四个初始障碍
    for (var i = 0; i < obstacleList.length; i++) {
        obstacleList[i].style.left = i * 230 + 400 + 'px';//设置障碍初始位置

        obstacleList[i].pTop = document.createElement('img');//创建上方障碍元素
        obstacleList[i].pTop.style.top = 0 + 'px';//top位移清0
        obstacleList[i].pTop.src = './img/conduit.jpg';//设置图片路径
        obstacleList[i].pTop.style.height = 40 + parseInt(Math.random() * 200) + 'px';//设置障碍高度
        obstacleList[i].appendChild(obstacleList[i].pTop);//添加元素
        obstacleList[i].topHead = document.createElement('img');//创建上方障碍头部元素
        obstacleList[i].topHead.style.height = '10px';//设置上方障碍头部元素高度
        obstacleList[i].topHead.style.top = obstacleList[i].pTop.offsetHeight - 10 + 'px';//top位移
        obstacleList[i].topHead.src = './img/topHend.jpg';//设置图片路径
        obstacleList[i].appendChild(obstacleList[i].topHead);//添加元素
        obstacleList[i].top = obstacleList[i].pTop.offsetHeight;//给父元素添加属性记录顶部高度

        obstacleList[i].pBottom = document.createElement('img');//创建下方障碍元素
        obstacleList[i].pBottom.style.bottom = 0 + 'px';//bottom位移清0
        obstacleList[i].pBottom.src = './img/conduit.jpg';//设置图片路径
        obstacleList[i].pBottom.style.height = difficulty - obstacleList[i].top - parseInt(Math.random() * 50) + 'px';//设置障碍高度
        obstacleList[i].appendChild(obstacleList[i].pBottom);//添加元素
        obstacleList[i].botHead = document.createElement('img');//创建下方障碍头部元素
        obstacleList[i].botHead.style.height = '10px';//设置下方障碍头部元素高度
        obstacleList[i].botHead.style.bottom = obstacleList[i].pBottom.offsetHeight - 10 + 'px';//top位移
        obstacleList[i].botHead.src = './img/bottomHend.jpg';//设置图片路径
        obstacleList[i].appendChild(obstacleList[i].botHead);//添加元素
        obstacleList[i].bottom = obstacleList[i].pBottom.offsetHeight;//给父元素添加属性记录底部高度
    }
}


//水平移动动画函数
function animationMove(ele, target) {
    //ele:操作的元素   target:需要移动到的位置

    //清除之前的计时器
    clearInterval(ele.timeID)

    //获取元素当前位置
    var current = ele.offsetLeft;

    //判断移动的方向
    var isLeft = current < target ? true : false;

    //开启计时器
    ele.timeID = setInterval(function () {
        //开始移动
        isLeft ? current += 3 : current -= 1;
        ele.style.left = current + 'px';

        //边界检测
        if (current < -50) {//当障碍移出页面时
            current = 850;
            ele.pTop.style.height = 40 + parseInt(Math.random() * 200) + 'px';//设置障碍高度
            ele.topHead.style.top = ele.pTop.offsetHeight - 10 + 'px';//top位移
            ele.top = ele.pTop.offsetHeight;//给父元素添加属性记录顶部高度

            ele.pBottom.style.height = difficulty - ele.top - parseInt(Math.random() * 60) + 'px';//设置底部障碍高度
            ele.botHead.style.bottom = ele.pBottom.offsetHeight - 10 + 'px';//top位移
            ele.bottom = ele.pBottom.offsetHeight;//给父元素添加属性记录底部高度

            score.num++;//游戏分数+1
            score.innerText = score.num;
        }

        if (ele.offsetLeft < 115 && ele.offsetLeft > 15) {//当障碍水平位置与小鸟相交时
            if (birdieY > (500 - ele.bottom - 25) || birdieY < (ele.top - 5)) {//当小鸟触碰到顶部或底部障碍时
                stopPlaying();////调用游戏失败界面函数
            }
        }
    }, 8);
}

var isPress = false;//判断开始按钮是否按下
startGamebtn.onclick = function () {//开始游戏按钮
    if (isPress) {
        return;
    } else {
        isPress = true;
        var time = 3;
        startGamebtn.style.paddingTop = 0 + 'px';//设置倒计时页面样式
        startGamebtn.style.lineHeight = '500px';
        startGamebtn.style.display = 'block';
        startGamebtn.innerHTML = time;

        var timeID = setInterval(function () {//开启倒计时计时器
            time--;
            startGamebtn.innerHTML = time;
            if (time == 0) {//当时间等于0时
                clearInterval(timeID);//清除当前计时器
                startGamebtn.style.display = 'none';//隐藏倒计时页面
                for (var i = 0; i < obstacleList.length; i++) {//重置障碍高度为0
                    obstacleList[i].innerHTML = '';
                }
                gameObstacle();//创建四个初始障碍
                startGame();//调用开始游戏函数
                isPress = false;
            }
        }, 1000);
    }
}

function startGame() {//开始游戏

    big.style.animation = 'big 3s infinite linear';

    vertical = setInterval(function () {//小鸟高度计时器
        speed += 0.3;//累加下落速度
        birdieY += speed;

        rotate += 1;//累加角度
        birdie.style.transform = 'rotate(' + rotate + 'deg)';//调整飞机图片角度

        birdie.style.top = birdieY + 'px';//设置小鸟高度

        //当小鸟超出顶部边界或底部边界,则结束游戏
        if (birdieY < 0 || (birdieY + birdie.offsetHeight) > big.offsetHeight) {
            stopPlaying();//调用游戏失败界面函数
        }
    }, 20);

    //给障碍添加动画
    animationMove(obstacleList[0], 0)
    animationMove(obstacleList[1], 0)
    animationMove(obstacleList[2], 0)
    animationMove(obstacleList[3], 0)
}

