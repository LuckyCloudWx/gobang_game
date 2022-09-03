(function () {
  // 仿jQuery编写元素获取函数
  function $(selector) {
    return document.querySelector(selector);
  }
  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  // 判断是否获胜
  // 保存棋子位置信息的数组
  var posArr = [];
  // 结束时的函数
  function end(list) {
    for (var i = 0; i < $$(".chess").length; i++) {
      // 棋子标出数字
      $$(".chess")[i].style.fontSize = "16px";
      // 赢棋标出阴影
      var xStr = $$(".chess")[i].style.left;
      var yStr = $$(".chess")[i].style.top;
      for (key in list) {
        if (
          xStr === list[key].x - 13 + "px" &&
          yStr === list[key].y - 13 + "px"
        ) {
          $$(".chess")[i].classList.add("win");
        }
      }
    }
  }

  // 判断棋子连续性
  function contiCheck(curChess, xd, yd) {
    var c2 = posArr.find(function (item) {
      return (
        curChess.x === item.x + xd * 30 &&
        curChess.y === item.y + yd * 30 &&
        curChess.c === item.c
      );
    });
    var c3 = posArr.find(function (item) {
      return (
        curChess.x === item.x + xd * 60 &&
        curChess.y === item.y + yd * 60 &&
        curChess.c === item.c
      );
    });
    var c4 = posArr.find(function (item) {
      return (
        curChess.x === item.x + xd * 90 &&
        curChess.y === item.y + yd * 90 &&
        curChess.c === item.c
      );
    });
    var c5 = posArr.find(function (item) {
      return (
        curChess.x === item.x + xd * 120 &&
        curChess.y === item.y + yd * 120 &&
        curChess.c === item.c
      );
    });
    if (c2 && c3 && c4 && c5) {
      return {
        c1: curChess,
        c2: c2,
        c3: c3,
        c4: c4,
        c5: c5,
      };
    }
  }

  // 根据当前回合，判断当前一方是否获胜
  function juedge() {
    // 判断棋盘是否有5个连子，包括4个方向：水平、垂直、斜方向（2个）
    for (var i = 0; i < posArr.length; i++) {
      var curChess = posArr[i];

      // 判断四个方向，有一个方向有5个连续的棋子即可
      var resultList =
        contiCheck(curChess, -1, 0) ||
        contiCheck(curChess, 0, -1) ||
        contiCheck(curChess, -1, -1) ||
        contiCheck(curChess, 1, -1);

      if (resultList) {
        var winResult =
          resultList.c1.c === "white" ? "白棋获胜！" : "黑棋获胜！";
        end(resultList);
        setTimeout(() => {
          if (window.confirm(winResult + "还要再来一局吗")) {
            posArr = [];
            var chesses = $$(".chess");
            for (var i = 0; i < chesses.length; i++) {
              chesses[i].remove();
            }
          }
        }, 100);
      }
    }
  }

  // 获取棋子坐标
  function getPosition(e) {
    var x = e.clientX - boardRect.x;
    x = x % 30 < 15 ? Math.floor(x / 30) * 30 : Math.floor(x / 30 + 1) * 30;
    var y = e.clientY - boardRect.y;
    y = y % 30 < 15 ? Math.floor(y / 30) * 30 : Math.floor(y / 30 + 1) * 30;
    return {
      x: x,
      y: y,
    };
  }

  // 检查是否有重复摆放
  function check(x, y) {
    for (var i = 0; i < posArr.length; i++) {
      if (posArr[i].x === x && posArr[i].y === y) {
        return true;
      }
    }
    return false;
  }

  // 进行下棋操作
  var round = 0;
  function putChess(e) {
    if (e.target.tagName === "SPAN") {
      return;
    }

    //   保存当前棋子位置信息
    var posInfo = {};
    var position = getPosition(e); // 获取点击处适当的横纵坐标
    var x = position.x;
    var y = position.y;

    //   创建棋子元素并放置在相应位置
    posInfo.x = x;
    posInfo.y = y;

    //   检查是否有重复摆放
    if (!check(x, y)) {
      round++;
      var chess = document.createElement("span");
      //   棋子颜色，1代表白色，0代表黑色
      var color = round % 2;

      if (color === 1) {
        chess.className = "chess white";
        posInfo.c = "white";
      } else {
        chess.className = "chess black";
        posInfo.c = "black";
      }

      //   添加棋子元素，显示在界面上
      posArr.push(posInfo);
      chess.style.left = x - 13 + "px";
      chess.style.top = y - 13 + "px";
      chess.innerHTML = round;
      board.appendChild(chess);
      console.log("chess has been put");

      //   判断是否获胜:
      juedge(posInfo);
    }
  }

  // 注册事件
  // 获取相关元素
  var board = $(".board");
  var lines = $$(".line");
  var rows = $$(".row");
  var boardRect = board.getBoundingClientRect();

  function eventRegist() {
    board.onclick = function (e) {
      putChess(e); // 点击时，根据位置下一枚棋
    };
  }

  // 主函数
  function main() {
    // 初始化：无

    // 事件注册
    eventRegist();
  }

  main();
})();
