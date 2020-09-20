class CalcController {

    constructor(){

        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this._locale = 'pt-br';
        this.initialize();
        this.initButEvents();
    }     
    
    initialize(){

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();



    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach((event) => {

            element.addEventListener(event, fn, false);

        });
        

    }


    initButEvents() {

        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn,'click', e => {

                let textBtn = btn.className.baseVal.replace('btn-','');
                this.execBtn(textBtn);


            });

            this.addEventListenerAll(btn,'mouseover mouseup mousedown', e => {
                
                btn.style.cursor = 'pointer';

            });
        });




    }

    clearAll() {
        this._operation = [];
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    setError() {
        this.displayCalc = 'Error';
    }

    getLastOperation() {
        return this._operation[this._operation.length -1];
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    setLastOperation(value) {
        this._operation[this._operation.length -1] = value;
    }    

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    /** 
     * @returns retorna resultado de uma operação concatenada
     **/ 
    getResult() {
        return eval(this._operation.join(""));

    }

    /** 
     * calcula operações
     **/ 
    calc() {

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }
        else if (this._operation.length == 3) {
            this._lastNumber = this.getResult();
        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;
            this._operation = [result];

        }
        else {

            this._operation = [result];

            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();

    }

    /** 
     * pega último item do array comnforme solicitação
     * @param isOperator boolean - true = último operador, false = último número
     * @returns String - ultimo item do array operador ou número conforme parâmetro de entrada
     **/ 
    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length -1; i >= 0 ; i-- ){


            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    /** 
     * seta valor de exibição do display da calculadora  
     **/ 
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) {
            lastNumber = 0;
        }

        this.displayCalc = lastNumber;

    }

    addOperator(value) {

        //verifica se ultima operação é um númerico
        if (isNaN(this.getLastOperation())) {

            //ultimo item adicionado no array é um operador ?
            if (this.isOperator(value)) {
                //trocando item
                this.setLastOperation(value);
            }
            else if (isNaN(value)) {
                //outra coisa
                console.log(value);
                
            }
            else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();

            }
        }
        else {
            
            //é um operador
            if (this.isOperator(value)) {
                this.pushOperation(value);
            }
            else {
                //concatena números e adiciona na útima operação
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                this.setLastNumberToDisplay();
            }

        }
        console.log(this._operation);
    }


    execBtn(value) {

        switch(value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperator('+');
                break;
            case 'subtracao':
                this.addOperator('-');
                break;
           case 'divisao':
                this.addOperator('/');
                break;
            case 'multiplicacao':
                this.addOperator('*');
                break;
            case 'porcento':
                this.addOperator('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':

                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperator(parseInt(value));
                break;
            default:
                this.setError();
        }

    }

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
 
    set displayCalc(valor) {
        this._displayCalcEl.innerHTML = valor;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(data) {
        this._currentDate = data;
    }


}