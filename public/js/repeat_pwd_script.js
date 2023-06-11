const button = document.getElementById('btn') ;
const pwd = document.getElementById('pwd') ;
const repeatePw = document.getElementById('RepeatPW') ;
const error_holder = document.getElementById('error') ;

button.addEventListener ( 'click' , () => {
    verifyRepeatedPW() ;
}) 

const verifyRepeatedPW = () =>  {
    if ( pw.value != repeatePw.value ) {
        error_holder.innerText = 'Confirmation incorrect ' ;
        repeatePw.value = '' ;
    }
    else {
        error_holder.innerText = '' ;
    }
}