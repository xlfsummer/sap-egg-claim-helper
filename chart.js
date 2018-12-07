export default class Chart {
    constructor(el){
        if(!(el instanceof SVGSVGElement)) return;
        this.el = el;
        el.viewBox.baseVal.x = 0;
        el.viewBox.baseVal.y = 0;
        el.viewBox.baseVal.width = 120;
        el.viewBox.baseVal.height = 120;
        this.currentRad = - Math.PI/ 2;
    }

    drawArcPercentage(percentage, color){
        if(percentage == 1){
            return this.drawCircle(color);
        }

        let rad = 2 * Math.PI * percentage;
        let R = 50;
        let start = {
            x: Math.cos(this.currentRad) * R,
            y: Math.sin(this.currentRad) * R
        };
        this.currentRad += rad;
        let end = {
            x: Math.cos(this.currentRad) * R,
            y: Math.sin(this.currentRad) * R
        };

        let getAbs = p => {
            return {
                x: p.x + 60,
                y: p.y + 60
            }
        };

        let absStart = getAbs(start);
        let absEnd = getAbs(end);

        let isGreat = rad > Math.PI ? 1 : 0;
        
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M 60 60 L ${absStart.x} ${absStart.y} A ${R} ${R} 0 ${isGreat} 1 ${absEnd.x} ${absEnd.y} Z`);
        path.style.fill = color;
        this.el.appendChild(path);
    }

    drawCircle(color){
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.cx.baseVal.value = 60;
        circle.cy.baseVal.value = 60;
        circle.r.baseVal.value = 50;
        circle.style.fill = color;
        this.el.appendChild(circle);
    }

    clear(){
        this.el.childNodes.forEach(n => n.remove());
        this.currentRad = - Math.PI/ 2;
    }
}
