import Egg from "./egg.js";
import Log from "./log.js";
import Chart from "./chart.js";
import { ValueColorTextMap, ValueChartColorMap } from "./constant.js";


function main(){
    let form = document.getElementById("form");
    if(!(form instanceof HTMLFormElement)) throw new Error();

    let logEl = document.getElementById("logs");
    if(!(logEl instanceof HTMLOListElement)) throw new Error();

    let nextBtn = document.getElementById("next");
    let revertBtn = document.getElementById("revert");
    let clearBtn = document.getElementById("clear");

    let svgEl = document.getElementById("chart");
    let radioRowEl = document.getElementById("radio-row");

    let log = new Log(logEl);
    let chart = new Chart(svgEl);
    updateByLog(log);

    nextBtn.onclick = e => {
        let value = form["egg-value"].value;
        // Microsoft Edge
        if(value == null) value = form["egg-value"]["egg-value"].value
        log.add(value);
        updateByLog(log);
    };

    revertBtn.onclick = _ => {
        log.revert();
        updateByLog(log);
    }

    clearBtn.onclick = _ => {
        log.clear();
        updateByLog(log);
    }

    function updateByLog(log){

        let probability = Egg.getNextValueProbability(log.readTopValue(20).map(s=>+s))

        // assembleOptions(probability);
        updateRadioRow(probability);

        drawCharFromProbability(probability);

        /** @param {typeof probability} probability */
        function assembleOptions(probability){
            let select = form["egg-value"];
            if(!(select instanceof HTMLSelectElement)) throw new Error();
            let df = probability
                .map((v, i)=> [v, i])
                .filter(([v, _]) => v)
                .map(([_, i])=>{
                    let option = document.createElement("option");
                    option.value = i;
                    option.text = ValueColorTextMap[i];
                    return option;
                })
                .reduce((df, o) =>{
                    df.append(o);
                    return df;
                }, document.createDocumentFragment());
            select.innerHTML = "";
            select.append(df);
        }

        function updateRadioRow(probability){
            probability.forEach((p, i) => {
                if(p == null || i == 0) return;
                radioRowEl.children[i - 1].style.display = p == 0
                ?  "none"
                : "";
            });
            let defaultIndex = probability.findIndex(p => p) - 1;
            radioRowEl.children[defaultIndex].firstElementChild.checked = true;
        }

        function drawCharFromProbability(probability){
            chart.clear();
            probability.forEach((p, i) => {
                if(!p) return;
                chart.drawArcPercentage(p, ValueChartColorMap[i])
            });
        }
    }
}

main();


(async function(){
    let registration = null
    try{
        registration = await navigator.serviceWorker.register("/service-worker.js", {
            scope: "/"
        });
    }catch(e){
        console.log(e);
        console.log(registration);
    }
})();
