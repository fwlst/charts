/*  折线图组件  */
/*  基本图文组件  */
(function (win) {
    function ComponentPolyLine(parentClassName, cfg) {
        this.parentClassName = parentClassName;
        this.cfg = {
            width: cfg.width || 640,
            height: cfg.height || 320,
            data: cfg.data,
            xAxis: cfg.xAxis,
            yAxis: cfg.yAxis,
            point: cfg.point || {
                pointColor: null,
                pointSize: null
            },
            shadow: cfg.shadow || {
                shadowLineColor: null,
                shadowColor: null,
            },
            tip: cfg.tip || {
                tipCss: null,
                triangle: null,
                triangleColor: null
            }

        };
        if (this.cfg.data) {
            this.init();
        } else {
            this.cns = document.createElement('div');
            this.cns.innerHTML = '暂时没有数据';
            this.cns.style.textAlign = 'center';
            this.cns.style.fontSize = '30px';
            this.cns.style.marginTop = '50px';
        }

        return this.cns;
    }

    ComponentPolyLine.prototype = {
        init: function () {
            this.createCanvas();
            this.increaseAn();
        },
        createCanvas: function () {
            //加入一个画布 （绘制网格线）
            this.w = this.cfg.width;
            this.h = this.cfg.height;
            this.cns = document.createElement('canvas');
            this.ctx = this.cns.getContext('2d');
            this.cns.width = this.ctx.width = this.w;
            this.cns.height = this.ctx.height = this.h;
        },

        //绘制线段
        drawLine: function (ops) {
            //线段样式
            this.ctx.strokeStyle = ops.color;
            this.ctx.lineWidth = ops.lineWidth;
            if (ops.lineDashed) {
                this.ctx.setLineDash([5]);
            }
            //开始绘制
            this.ctx.moveTo(ops.startX, ops.startY);
            this.ctx.lineTo(ops.stopX, ops.stopY);
            this.ctx.stroke();
        },
        // 绘制文字
        drawText: function (ops) {
            let cof = {
                text: ops.text,
                x: ops.x,
                y: ops.y,
                color: ops.color || 'rgba(0,0,0,1)',
                fontSize: ops.fontSize || 10
            };
            //设置填充字体样式
            this.ctx.fillStyle = cof.color;
            this.ctx.font = cof.fontSize + "px Arial";
            //开始绘制
            this.ctx.fillText(cof.text, cof.x, cof.y);
        },
        //绘制点
        drawPoint: function (ops) {
            let cof = {
                x: ops.x,
                y: ops.y,
                color: ops.color || 'rgba(213,213,213,1)',
                r: ops.r || 10
            };
            this.ctx.fillStyle = cof.color;
            this.ctx.strokeStyle = cof.color;
            this.ctx.arc(cof.x, cof.y, cof.r, 0, Math.PI * 2, true);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill();
        },
        //保留两位小数
        toDecimal2: function (x) {
            let f = parseFloat(x);
            if (isNaN(f)) {
                return false;
            }
            let f1 = Math.round(x * 100) / 100;
            let s = f1.toString();
            let rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return s;
        },
        //绘制坐标系
        drawCoordinate: function (per) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            let lineNubX = this.cfg.xAxis.lineNubX || 6,
                rightSpace = this.cfg.xAxis.rightSpace || 30,
                xAxisColor = this.cfg.xAxis.axisColor || 'rgba(213,213,213,1)',
                xLineDashed = this.cfg.xAxis.lineDashed || false,
                xLineWidth = this.cfg.xAxis.lineWidth || 1,
                XScale = this.cfg.xAxis.XScale,
                yAxisColor = this.cfg.yAxis.axisColor || 'rgba(213,213,213,1)',
                yLineDashed = this.cfg.yAxis.lineDashed || false,
                yLineWidth = this.cfg.yAxis.lineWidth || 1,
                YScale = this.cfg.yAxis.YScale,
                pointColor = this.cfg.point.pointColor || 'rgba(234,82,26,1)',
                pointSize = this.cfg.point.pointSize || 4;
            //线条数
            let stepY = this.cfg.data.length,
                stepX = lineNubX,
                //间隔值
                ySpace = (this.w - rightSpace) / stepY;
            this.xSpace = this.h / stepX;

            let sortData = [].concat(this.cfg.data).sort(function (a, b) {
                    return a[YScale] - b[YScale];
                }.bind(this)),
                //Y轴最大值
                maxY = this.toDecimal2(Number(sortData[sortData.length - 1][YScale]) * 100),
                //Y轴刻度差
                yStep = maxY / (stepX - 2),
                textArr = [];
            for (let x = 0; x < stepX - 1; x++) {
                let y = this.xSpace * x + this.xSpace,
                    text = x != 0 ? this.toDecimal2(yStep * ((stepX - 1) - x)) : '',
                    textWidth = this.ctx.measureText(text).width,
                    textX = (ySpace - textWidth) / 2,
                    textY = y - this.xSpace + 5;
                textArr.push(text);
                //绘制Y轴文案
                this.drawText({
                    text: text,
                    x: textX,
                    y: textY,
                });
                //绘制横线
                this.ctx.save();
                this.ctx.beginPath();
                this.drawLine({
                    lineWidth: xLineWidth,
                    startX: ySpace,
                    startY: y,
                    stopX: this.w - rightSpace,
                    stopY: y,
                    color: xAxisColor,
                    lineDashed: xLineDashed
                });
                this.ctx.restore();
            }

            for (let i = 0; i < stepY; i++) {
                let x = ySpace * i + ySpace,
                    y = this.h - this.xSpace,
                    text = this.cfg.data[i][XScale],
                    textWidth = this.ctx.measureText(text).width,
                    textX = x - textWidth / 2 - 5,
                    textY = this.h - this.xSpace / 2,
                    maxText = textArr[1],
                    currentPositionY = y - ((y - this.xSpace) * (this.cfg.data[i][YScale] * 100 / maxText) * per);
                //绘制X轴文案
                this.drawText({
                    text: text,
                    x: textX,
                    y: textY,
                });
                //绘制竖线
                this.ctx.save();
                this.drawLine({
                    lineWidth: yLineWidth,
                    startX: x,
                    startY: 0,
                    stopX: x,
                    stopY: y,
                    color: yAxisColor,
                    lineDashed: yLineDashed
                });
                this.ctx.beginPath();
                this.ctx.restore();
                this.cfg.data[i].x = x;
                this.cfg.data[i].y = currentPositionY;

                //绘制圆点
                this.ctx.save();
                this.drawPoint({
                    x: x,
                    y: currentPositionY,
                    color: pointColor,
                    r: pointSize
                });
                this.ctx.beginPath();
                this.ctx.restore();
                if (i == stepY - 1) {
                    let data = this.cfg.data[i];
                    this.drawTip(data);
                }
            }
        },
        shadow: function (per) {
            let shadowLineColor = this.cfg.shadow.shadowLineColor || 'rgba(234,82,26,0.8)',
                shadowColor = this.cfg.shadow.shadowColor || 'rgba(234,82,26,0.2)';
            //连线
            this.cfg.data.forEach(function (data, index, arr) {

                this.ctx.lineWidth = 1.5;
                this.ctx.strokeStyle = shadowLineColor;
                if (index === 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(data.x, data.y);
                }
                if (index < arr.length - 1) {
                    this.ctx.lineTo(arr[index + 1].x, arr[index + 1].y);
                    this.ctx.stroke();
                } else {
                    this.ctx.lineTo(arr[arr.length - 1].x, this.h - this.xSpace);
                    this.ctx.lineTo(arr[0].x, this.h - this.xSpace);
                    this.ctx.lineTo(arr[0].x, arr[0].y);
                }
            }.bind(this));

            this.ctx.fillStyle = shadowColor;
            this.ctx.fill();
        },
        drawTip: function (data) {
            let tipCss = this.cfg.tip.tipCss || {
                        borderRadius: '5px',
                        backgroundColor: 'rgba(234,82,26,1)',
                        color: '#fff'
                    },
                triangle = this.cfg.tip.triangle || true,
                triangleColor = tipCss.backgroundColor,
                YScale = this.cfg.yAxis.YScale;
            let $node = $(document.createElement('span')),
                $parent = $(this.parentClassName),
                text = this.toDecimal2(data[YScale] * 100) + '%',
                top = data.y - 40,
                left = data.x - 23;
            this.$tip = $node;
            $parent.find('span').remove();
            $node.addClass('tip');
            $parent.append($node);
            $node.text(text);
            $node.css(tipCss);
            $node.css({
                fontSize: '10px',
                padding: '3px 5px',
                position: 'absolute',
                top: top,
                left: left,
                zIndex: 3
            });

            if (triangle) {
                let $triangle = $(document.createElement('span'));
                this.$triangle = $triangle;
                $triangle.addClass('triangle');
                $triangle.css({
                    position: 'absolute',
                    left: '18px',
                    bottom: '-10px',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '10px solid ' + triangleColor,
                });
                $node.append($triangle);
            }

        },
        increaseAn: function () {
            let s = 0;
            for (let i = 0; i < 100; i++) {
                setTimeout(function () {
                    s += 0.01;
                    this.drawCoordinate(s);
                    console.log(s);
                    this.shadow();
                    if (s > 1 || s == 1) {
                        this.bindEvent();
                    }
                }.bind(this), i * 10);
            }
        },
        bindEvent: function () {
            this.cns.addEventListener('touchstart', function (e) {
                let x = (e.touches[0].pageX - e.target.parentNode.offsetLeft),
                    y = (e.touches[0].pageY - e.target.parentNode.offsetTop);
                this.cfg.data.forEach(function (data) {
                    if (Math.abs(x - data.x) < 12) {
                        let text = this.toDecimal2(data[this.cfg.yAxis.YScale] * 100) + '%',
                            top = data.y - 40,
                            left = data.x - 23;
                        this.$tip.text(text);
                        this.$tip.css({
                            transition: 'all 1s',
                            webkitTransition: 'all 1s',
                            top: top,
                            left: left,
                        });
                        if (this.$triangle) {
                            this.$tip.append(this.$triangle);
                        }
                    }
                }.bind(this))
            }.bind(this))
        }
    };


    win.ComponentPolyLine = ComponentPolyLine;
})(window);