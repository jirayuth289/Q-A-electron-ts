const tableRef = document.getElementById('question-table') as HTMLTableElement;

function addRow(question: any) {
	// Insert a row at the end of the table
	let newRow = tableRef.insertRow(-1);

	// Insert a cell in the row at index 0
	let newCell = newRow.insertCell(0);

	// Append a div node to the cell
	const newText = document.createElement('div');
	newText.innerText = question.question;
	newText.id = question.id;

	newText.addEventListener('click', (ev) => {
		//@ts-expect-error
		window.myApi.openAnswerWindow(ev.target.id);
	});

	newCell.appendChild(newText);
}

//@ts-expect-error
window.myApi.getQuestion().then((response) => {
	response.rows.forEach((question: any) => {
		addRow(question)
	});
}).catch((error: any) => {
	throw error;
})

