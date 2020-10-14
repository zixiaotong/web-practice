class Thunmb{
    constructor(init){
        this.init = init;
    }
    private(){
        let number = this.init.text();
        let boolean = this.init.attr("data-boolean");
        if(boolean == "true"){
            number--;
            this.init.html(`${number}`).attr('data-boolean',false);
        }else{
            number++;
            this.init.html(`${number}`).attr('data-boolean',true);
        }
    }
}