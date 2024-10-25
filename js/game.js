// ========== Нужный канвас по id. Способ работы 2d ==========
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// ========== Загрузка визуальных материалов ==========
var rocket = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

rocket.src = "img/rocket.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

// Звуковые файлы
var count = new Audio();
var fly = new Audio();
var score_audio = new Audio();

count.src = "audio/countdown.mp3";
fly.src = "audio/rocket_in_flight.mp3";
score_audio.src = "audio/score.mp3";

count.play(); // обратный отсчёт при запуске

// ========== Подготовка переменных ==========
var xPos = 10; // Позиция ракеты x
var yPos = 150; // Позиция ракеты y
var grav = 1.5; // Притяжение Земли
var score = 0; // счётчик пройденных преград
var gap = 150; // расстояние между спутниками

document.addEventListener("keydown", moveUp); // взлёт вверх при нажатии на любую кнопку
function moveUp() {
    if (yPos > 0) {
        yPos -= 25;
        fly.play();
    }
}

var pipe = []; // Массив преград
pipe[0] = {
    x: cvs.width,
    y: 0
}

// ========== Анимация ==========
function draw() {
    // отрисовка фона-космоса
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {
        // отрисовка заготовленных препятствий
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

        // продвижение спутников к ракете
        pipe[i].x--;

        // создание новых препятствий
        if (pipe[i].x == 825) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height // генерация проходов в случайном месте
            });
        }

        // Отслеживание столкновений
        if (xPos + rocket.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && ((yPos >= pipe[i].y && yPos <= pipe[i].y + pipeUp.height) || (yPos + rocket.height <= pipe[i].y + pipeUp.height + gap + pipeBottom.height) && (yPos + rocket.height >= pipe[i].y + pipeUp.height + gap)) // касание между блоков
            || yPos + rocket.height >= cvs.height - fg.height) { // выход за пределы внизу
            location.reload(); // Перезагрузка страницы
        }

        // Увеличение счётчика обойдённых препятствий
        if (pipe[i].x == 5) {
            score++;
            score_audio.play();
        }

        // Удаление элемента за пределами поля
        if (pipe[i].x < -50) {
            pipe.shift();
        }

        pipe[0]
    }
    
    // отрисовка Земли и ракеты
    ctx.drawImage(fg, 0, cvs.height - fg.height); 
    ctx.drawImage(rocket, xPos, yPos);

    // Притяжение ракеты к Земле
    yPos += grav;

    // Счётчик обойдённых препятствий
    ctx.fillStyle = "#fff";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height - 20);
    
    //  перерисовку на следующем кадре анимации
    requestAnimationFrame(draw);
}

// ========== Первый запуск анимации ==========
pipeBottom.onload = draw;