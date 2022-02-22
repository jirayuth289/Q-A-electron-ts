
const questionRef = document.getElementById('question') as HTMLElement

const answerList = [
  {
    questionId: 1,
    answer: "answer 1"
  },
  {
    questionId: 2,
    answer: "answer 2"
  },
  {
    questionId: 3,
    answer: "answer 3"
  },
]

//@ts-expect-error
window.answerApi.handleAnswer((event, answer) => {
  questionRef.innerText = answer.answer;
})
