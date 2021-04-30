const sectionOne = document.getElementById('sectionOne');
const startButton = document.getElementById("start");
const category = document.getElementById("category");
const questions = document.getElementById("questions");
const level = document.getElementById("level");

let ApiUrl;
let json_array = [];
let datafromApi;

let index = 0;
let score = 0;

let questionCount = 1;






const getInfo = ()=>{
    let categoryValue = category[category.selectedIndex].value
    
    let numberQuestions = questions.value;
    
    let levelDif = level[level.selectedIndex].value

    
    ApiUrl = `https://opentdb.com/api.php?amount=${numberQuestions}&category=${categoryValue}&difficulty=${levelDif}`;

}

const getAPi = async (url)=>{
  
    const json = await (await fetch(url)).json();
    
    const array = json.results;
    
    return array;
    

}



//Start Button
startButton.addEventListener("click",async (e)=>{
    

    e.preventDefault()
    startButton.disabled = true
    
    if(!isNaN(questions.value) && questions.value ){
        getInfo()

        json_array =  await getAPi(ApiUrl)  

        json_array.length !== 0 ? datafromApi = true : datafromApi = false
        
       
        if(datafromApi){
            sectionOne.classList.add('hide');
            CreateForm(json_array)
        }else{
            alert("no questions! Fill differently")
        }


    }else{
        alert("invalid Form!")
    }
})



//Create Forms

let Div = document.createElement("div")
Div.id = "MainDiv"


function CreateForm(json){
    console.log(json)
    let allQuestion = json.length;


    //data from api
    let object = json[index]
    let question = object.question


    let answers = []
    answers.push(object.correct_answer)

    object.incorrect_answers.forEach(element => {
        answers.push(element)
    });

    shuffle(answers)


    //create form


    let section = document.createElement("section");
    section.className = 'question';
    section.id = "question"

    let h3 = document.createElement("h3");
    h3.innerHTML = `${questionCount}. ${question}`

    let answersDiv = document.createElement("div");
    answersDiv.className = 'answers';

    

    let counter = document.createElement("div")
    counter.className = 'counter';
    let p = document.createElement("p");
    p.innerText = `${questionCount} of ${allQuestion} Questions`
    let button = document.createElement("button");
    button.innerText = "Next"
    button.id = "nextBtn"
    button.disabled = false

    let hr = document.createElement("hr");


    counter.append(p);
    counter.append(button)

    section.append(h3)
    section.append(answersDiv)
    section.append(hr)
    section.append(counter)

   
    Div.append(section)

    document.body.append(Div)


    answers.forEach(element => {
        let p = document.createElement("p")
        p.className = "answer"
        p.innerHTML = element
        answersDiv.append(p)

        clickAnswer(p,section)
  
    });





    //click nextButton

    nextButton(button,object.correct_answer,section,score)

   
    
    index ++
    questionCount ++
   

}



function nextButton(but,correctAnswer,section){
    but.addEventListener("click",()=>{
        let result = 0;
        let answers = section.childNodes[1].childNodes

        for(let i=0;i<answers.length;i++){
            answers[i].addEventListener("click",()=>{answers[i].classList.remove("clicked")})
        }

          
        
    
       
        for(let i=0;i<answers.length;i++){

            answers[i].innerText === correctAnswer ? answers[i].classList.add('correct') : ""
            
            if(answers[i].className === "answer clicked correct" ){
                result ++ 
                score ++
                console.log(score)
                console.log("+1")
            }

          
            if(answers[i].className === "answer clicked"){
                answers[i].classList.add("wrong")
            }

            
        }

   
        let increase = document.createElement("div")
        increase.className = "increase"
        increase.innerText = result;
        result === 1 ? increase.innerText = `+${result}` : increase.innerText = result
        section.childNodes[1].append(increase)

        section.classList.add('hide')  

        try{
            CreateForm(json_array) 
        }catch(err){
            finalScore(score)

            //initialize
            index = 0;
            score = 0;
            questionCount = 1;
            startButton.disabled = false
        }
          
    })

}


//click answer
function clickAnswer(ans,section){

    let answers = section.childNodes[1].childNodes

    ans.addEventListener("click",()=>{
        for(let i=0;i<answers.length;i++){
            answers[i].classList.remove("clicked")
        }

        ans.classList.toggle("clicked")
    })


}


//shuffle array
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);

}


function finalScore(score){
    let div = document.createElement("div");
    div.classList.add("finalscore");

    let text = document.createElement("p")
    text.innerText = `Your Score is ${score}`;
    div.append(text)


    let divFlex = document.createElement("div");

    let buttonRestart = document.createElement("button");
    buttonRestart.innerText = "Restart"
    divFlex.append(buttonRestart)

    let buttonShow = document.createElement("button")
    buttonShow.innerText = "Show answers"
    divFlex.append(buttonShow)

    div.append(divFlex)


    
    buttonShow.addEventListener("click",()=>{
        for(var item of Div.childNodes){
            item.className !== 'question hide old' ? item.classList.remove("hide") : ''

            item.childNodes[3].childNodes[1].disabled = true
        
            
            
        }
        
    })


    buttonRestart.addEventListener("click",()=>{
        let Main = document.getElementById("MainDiv")
        for(var item of Main.childNodes){
            Main.remove(item)
            item.classList.add("old")
        }

        
        div.classList.remove('finalscore')
        div.classList.add('hide')
        sectionOne.classList.remove('hide')

       Div = document.createElement("div")
       Div.id = "MainDiv"



    })




    document.body.append(div)
  
}