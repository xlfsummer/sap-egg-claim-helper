import { ValueColorTextMap } from "./constant.js";

export default class Log {
    /** @param {HTMLOListElement} ol */
    constructor(ol){
        this.container = ol;
        this._read();
    }

    /** @param {string} v */
    add(value){
        let msg = ValueColorTextMap[value]
        let li = document.createElement("li");
        li.dataset.value = value;
        li.textContent = msg;
        this.container.insertAdjacentElement("afterbegin", li);
        this._save();
    }

    revert(){
        let li = this.container.children[0];
        if(li){ li.remove(); }
        this._save();
    }

    clear(){
        Array.from(this.container.children).forEach(c => c.remove());
        this._save();
    }

    readTopValue(count){
        let logEls = Array.from(this.container.children).slice(0, count);
        return logEls.map(li => li.dataset.value);
    }

    _save(){
        let values = this.readTopValue(20);
        window.localStorage.setItem("logs", JSON.stringify(values));
    }

    _read(){
        let logs = window.localStorage.getItem("logs");
        if(!logs) return;
        /** @type {string[]} */
        let logArr = JSON.parse(logs);
        logArr.reverse().forEach(log => this.add(log));
    }
}
