////////// js DOM manipulation
const main = document.getElementById('main');
const result = document.querySelector('.result');
const printName = document.querySelector('.lead p');
const startQuiz = document.getElementById('startQuiz');
const nextBtn = document.getElementById('nextBtn');
const checkAnswer = document.getElementById('checkAnswer');
const allAnswers = document.getElementById('allAnswers');
const displayCorrect = document.getElementById('displayCorrect');

////// API connect
const getQuestions = async() => {
    const query = 'https://opentdb.com/api.php?amount=10&type=multiple';
    const response = await fetch(query);
    const data = await response.json();
    return data;
};

/// start quiz
startQuiz.addEventListener('click', e => {
    e.preventDefault();
    greeting();

    getQuestions()
        .then(data => updateUI(data))
        .catch(err => console.log(err));
});

////// update the UI
let count = 0;
const updateUI = (data) => {
    const entries = data.results;
    console.log(entries);

    if (entries.length == 0) {
        console.log('No results returned.');
    } else {
        startQuiz.classList.add('d-none');
        main.classList.remove('d-none');

        /// to display the first question
        getQuestion(data);
        count++;
        /// use event on next btn for all other quesitons
        nextBtn.addEventListener('click', e => {
            e.preventDefault();
            displayCorrect.innerHTML = '';
            nextBtn.classList.add('disabled');
            if (entries.length > count) {
                getQuestion(data);
                count++;
            } else {
                main.innerHTML = 'No more questions. Do you want to play this quiz again? Just reload this page';
            }

        });
    }
};

const getQuestion = (data) => {
    const entries = data.results;
    /// push all answers in an array
    var answers = [];
    answers.push(entries[count].correct_answer);

    for (let i = 0; i < entries[count].incorrect_answers.length; i++) {
        answers.push(entries[count].incorrect_answers[i]);
    }
    console.table(answers);
    /* randomise order of answers */

    answers.sort(() => Math.random() - 0.5);

    /* print question Id */
    document.getElementById('questionId').innerHTML = `${count+1} of 10`;

    /* print category */
    document.getElementById('category').innerHTML = (entries[count].category);

    /* print question */
    document.getElementById('question').innerHTML = (entries[count].question);

    /* print all possible answers */
    allAnswers.innerHTML = '';
    for (let i = 0; i < answers.length; i++) {
        allAnswers.innerHTML += `
            <input class="answersBox" type="radio" value="${answers[i]}">
                <label class="answer ml-3">${answers[i]}</label>
            <br>
            `;
    }
    /* check answers */
    let score = 0;
    checkAnswer.addEventListener('click', e => {
        e.preventDefault();
        result.classList.remove('d-none');

        let userAnswer = document.getElementsByClassName('answersBox');
        let checkedOption;
        for (let i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i].checked) {
                checkedOption = userAnswer[i].value;
                console.log(checkedOption);
            }
        }
        // if (!userAnswer) {
        //     alert('please select one of the answers');
        // } else {
        if (entries[count - 1].correct_answer === checkedOption) {
            displayCorrect.style.backgroundColor = 'lightgreen';
            displayCorrect.innerHTML = 'Your answer is right';
            score += 10;
        } else {
            displayCorrect.style.backgroundColor = 'coral';
            displayCorrect.innerHTML = `ups..wrong. The right one is "${entries[count-1].correct_answer}"`;
        }
        nextBtn.classList.remove('disabled');

        let output = 0;
        const timer = setInterval(() => {
            result.querySelector('span').textContent = `${output}%`;
            if (output === score) {
                clearInterval(timer);
            } else {
                output++;
            }
        }, 10);

    });
};


//// greet user function
const greeting = () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const userName = form.userName.value.trim();
        form.reset();

        printName.innerHTML = `Hello ${userName}`;
        if (result.classList.contains('d-none')) {
            result.classList.remove('d-none');
        }
    });
};

/*
- radio box - should be clicked only once
- greeting() - use of the function?
- localstorage use for score, user info(e-mail. feedback message)?
*/