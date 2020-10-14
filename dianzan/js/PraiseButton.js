class PraiseButton{
    constructor(box){
        this.box = box;
    }
    private(){
        let number = this.box.find(".init").text();
        let boolean = this.box.find(".init").attr("data-boolean");
        if(boolean == "true"){
            number--;
            this.box.find(".init").html(`${number}`).attr('data-boolean',false);
        }else{
            number++;
            this.box.find(".init").html(`${number}`).attr('data-boolean',true);
        }
    }
}