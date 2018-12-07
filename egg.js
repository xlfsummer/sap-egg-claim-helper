export default class Egg {
    /**
     * @param {number[]} currentLog
     * @returns {[void, number, number, number, number, number]}
     */
    static getNextValueProbability(currentLog){
        if(currentLog.length == 0)
            return this._getDefaultNextValueProbability();
        let pg = new PredictGroup(currentLog);
        let p = pg.predictNextProbability();
        return p;
    }

    static _getDefaultNextValueProbability(){
        let totalCount = Egg.table.length;
        let count = v => Egg.table.filter(x => x == v).length;
        return new Array(6).fill(0).map((_, i)=> count(i) / totalCount);
    }

    /** @param {number | string} v */
    static allIndexOf(v){
        let indexes = [];
        let data = Egg.table;
        for(let i = 0, l = data.length; i < l; i++){
            if(data[i] == v) indexes.push(i);
        }
        return indexes;
    }

    static prevOfIndex(index){
        return index == 0
            ? index = this.table.length - 1
            : index - 1;
    }

    static nextOfIndex(index){
        return index == this.table.length - 1
            ? 0
            : index + 1;
    }
}

Egg.table = [
    4, 1, 1, 2, 1, 1, 1, 2, 1, 1,
    2, 1, 1, 1, 2, 1, 2, 1, 1, 1,
    3, 1, 1, 1, 2, 1, 1, 2, 1, 1,
    4, 1, 1, 2, 1, 1, 2, 1, 2, 1,
    1, 1, 2, 1, 1, 2, 1, 1, 1, 1,
    2, 1, 1, 3, 1, 1, 2, 1, 1, 1,
    2, 1, 2, 1, 1, 1, 1, 5, 1, 1,
    2, 1, 1, 1, 4, 1, 1, 1, 1, 1,
    2, 1, 1, 2, 1, 1, 1, 2, 1, 2,
    1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
    1, 1, 2, 1, 1, 1, 1, 4, 1, 1,
    2, 1, 1, 1, 2, 1, 2, 1, 1, 1,
    1, 2, 1, 1, 3, 1, 1, 1, 1, 2,
    1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
    1, 2, 1, 2, 1, 1, 1, 3, 1, 1,
    1, 2, 1, 1, 1
];


class PredictGroup{
    /** @param {number[]} logs*/
    constructor(logs){
        this.logs = logs.slice();
        let latestValue = this.logs.shift();
        let indexes = Egg.allIndexOf(latestValue);
        /** @type {Predict[]} */
        this.predicts = indexes.map(index => new Predict(this, index));
    }

    predictNextProbability(){
        while(this.predicts.length > 1 && this.logs.length > 0){
            let value = this.logs.shift();
            this.predicts = this.predicts.filter(p => p.assertPrev(value))
        }
        let nextValuePool = this.predicts.map(p => Egg.table[Egg.nextOfIndex(p.latestIndexOfTable)])
        let totalCount = nextValuePool.length;
        let count = v => nextValuePool.filter(x => x == v).length;
        return new Array(6).fill(0).map((_, i)=> count(i) / totalCount);
    }
}

class Predict{
    /**
     * @param {PredictGroup} group
     * @param {number} index
     */
    constructor(group, index){
        this.group = group;
        this.latestIndexOfTable = index;
        this.currentIndexOfTable = index;
    }

    assertPrev(value){
        this.currentIndexOfTable = Egg.prevOfIndex(this.currentIndexOfTable);
        return Egg.table[this.currentIndexOfTable] == value;
    }
}
