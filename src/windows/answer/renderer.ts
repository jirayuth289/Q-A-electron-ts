
const questionRef = document.getElementById('question') as HTMLElement;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
window.answerApi.handleAnswer((event, answer) => {
  questionRef.innerText = answer.answer;
});
