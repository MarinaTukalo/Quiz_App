/// js DOM manipulation
const main = document.getElementById('main');
const result = document.querySelector('.result');
const startQuiz = document.getElementById('startQuiz');
const nextBtn = document.getElementById('nextBtn');
const checkAnswer = document.getElementById('checkAnswer');
const allAnswers = document.getElementById('allAnswers');
const displayCorrect = document.getElementById('displayCorrect');

/// API connect
const getQuestions = async() => {
    const query = 'https://opentdb.com/api.php?amount=10&type=multiple';
    const response = await fetch(query);
    const data = await response.json();
    return data;
};

/// start quiz
startQuiz.addEventListener('click', e => {
    e.preventDefault();

    getQuestions()
        .then(data => updateUI(data))
        .catch(err => console.log(err));
});

////// update the UI
let count = 0;
const updateUI = (data) => {
    const entries = data.results;
    //console.log(entries);

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
                main.innerHTML = `
                <div class="m-4">It was the last question out of 10. 
                Do you want to play this quiz again? Just wait for 5 sec</div>`;
                setTimeout(() => {
                    location.reload();
                }, 5000);
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
    //console.table(answers);
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
            <input class="answersBox" name='radio' type="radio" value="${answers[i]}">
                <label class="answer ml-3">${answers[i]}</label>
            <br>
            `;
    }

    /* check answers */
    let score = 0;
    checkAnswer.addEventListener('click', e => {
        e.preventDefault();
        result.classList.remove('d-none');
        displayCorrect.classList.remove('d-none');

        let userAnswer = document.getElementsByClassName('answersBox');
        let checkedOption = '';
        for (let i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i].checked) {
                checkedOption = userAnswer[i].value;
            }
        }

        if (entries[count - 1].correct_answer === checkedOption) {
            let words = ['Good for you!', 'That’s really nice', 'Superb', 'That’s great!', 'You’ve got it made', 'Way to go!', 'Terrific', 'That’s the way to do it!', 'Good thinking', 'Marvelous', 'Keep up the good work', 'That’s it!', 'You’re on the right track now!', 'You haven’t missed a thing', 'Outstanding!', 'Fantastic!', 'You’re doing a good job', 'Good work', 'Right on!', 'Well, look at you go!', 'Tremendous!', 'That’s RIGHT!', 'Perfect!', 'You must have been practicing!', 'Nice going', 'Great!', 'You remembered!', 'WOW!', 'Wonderful!', 'You’re really working hard today', 'I knew you could do it!', 'I’m very proud of you', 'Fine!', 'Super!', 'That’s good', 'Good job', 'Keep it up!', 'Good remembering', 'Congratulations', 'Nothing can stop you now', 'Exactly right!', 'Excellent!', 'Sensational!', 'You’re doing beautifully', 'I’ve never seen anyone do it better', 'You’ve just mastered that!', 'You are very good at that'];
            let randomNumber = Math.round(Math.random() * (words.length - 1));

            displayCorrect.style.backgroundColor = '#06c9b6';
            displayCorrect.style.color = '#fff';
            displayCorrect.innerHTML = `<p class="p-3 response">${words[randomNumber]}</p>`;
            score += 10;
        } else {
            displayCorrect.style.backgroundColor = '#c90671';
            displayCorrect.style.color = '#fff';
            displayCorrect.innerHTML = `<p class="p-3 response">ups..wrong. The right one is ${entries[count-1].correct_answer}</p>`;
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