async function generateFaq() {
	try {
		const response = await fetch('./scripts/pages/faq/questions.json');

		// Check if the request was actually successful (e.g., status 200)
		if (!response.ok) {
			new Error(`HTTP error! status: ${response.status}`);
		}

		// Convert the data back into JSON
		const data = await response.json();

		// Define the FAQ area, and then map each question/answer pair.

		// q = Question; a = Answer; tag = the type of question.
		// The list of types of questions is dynamically generated based on the tags found in the questions JSON file. This is so that this file can dynamically create the buttons required to filter them without restricting the content of the JSON file.

		const faqArea = document.querySelector('#faq-questions');
		const listOfQuestionTypes = [];
		faqArea.innerHTML = data
			.map((item) => {
				const normalizedTag = item.tag.trim().toLowerCase();
				if (!listOfQuestionTypes.includes(normalizedTag)) {
					listOfQuestionTypes.push(normalizedTag);
				}

				return `
					<details class="faq-detail ${normalizedTag}">
						<summary>
							<span>${item.q}</span>
							<span>+</span>
						</summary>
						<div>
							<p>${item.a}</p>
						</div>
    				</details>`;
			})
			.join('');

		const faqTypeArea = document.querySelector('.faq-types');

		const listOfFilters = listOfQuestionTypes.map((t) => t.replace('_', '-'));

		const listItems = listOfFilters
			.map((id) => {
				let temp = id;
				if (id.includes('-')) {
					temp = id.split('-');
					for (let i = 0; i < temp.length; i++) {
						temp[i] = temp[i][0].toUpperCase() + temp[i].slice(1);
					}
					temp = temp.join(' ');
				}
				temp = temp[0].toUpperCase() + temp.slice(1);
				const label = temp;
				return `
					<li>
						<button class="faq-button" id="${id}">
							${label}
						</button>
					</li>`;
			})
			.join('');

		faqTypeArea.innerHTML = `<ul>${listItems}</ul>`;

		// Toggle-able filter buttons (replace previous buttons.forEach handler)
		const activeFilters = new Set();
		const buttons = faqTypeArea.querySelectorAll('.faq-button');

		buttons.forEach((btn) => {
			// Best practice: make the button appear and behave like a toggle for assistive tech
			btn.setAttribute('aria-pressed', 'false');

			btn.addEventListener('click', () => {
				const filterId = btn.id;

				// Toggle visual state and aria
				const isNowActive = btn.classList.toggle('active');
				btn.setAttribute('aria-pressed', String(isNowActive));

				if (isNowActive) {
					activeFilters.add(filterId);
				} else {
					activeFilters.delete(filterId);
				}

				// Update which details are visible:
				// - If no filters active => show all
				// - Otherwise show any detail that matches at least one active filter
				const details = document.querySelectorAll('.faq-detail');
				if (activeFilters.size === 0) {
					details.forEach((d) => (d.style.display = ''));
					return;
				}

				details.forEach((detail) => {
					const classList = Array.from(detail.classList);
					// A single detail can match any active filter (hyphen/underscore tolerant)
					let matches = false;
					for (const f of activeFilters) {
						if (classList.includes(f) || classList.includes(f.replace(/-/g, '_'))) {
							matches = true;
							break;
						}
					}
					detail.style.display = matches ? '' : 'none';
				});
			});
		});

		// False = All questions default to closed; True = All questions default to open
		let expandedQuestions = false;

		const collapseQuestions = document.querySelector('#collapse-questions');
		if (collapseQuestions) {
			collapseQuestions.addEventListener('click', () => {
				const details = Array.from(document.querySelectorAll('.faq-detail'));
				if (details.length === 0) return;

				// If every detail is open, collapse them; otherwise expand all
				const allOpen = details.every((d) => d.open);
				const newState = !allOpen;

				details.forEach((d) => (d.open = newState));

				collapseQuestions.textContent = newState ? 'Collapse All' : 'Expand All';
				expandedQuestions = newState;
			});
		}
	} catch (error) {
		console.log('There was an error:', error);
	}
}

const questionsContainer = document.querySelector('#faq-questions');
questionsContainer.addEventListener('click', (event) => {
	document
		.querySelectorAll('.faq-questions details')
		.forEach((/** @type {HTMLDetailsElement} */ detail) => {
			if (detail.children[0].innerText !== event.target.innerText) {
				detail.open = false;
			}
		});
});

(async function () {
	await generateFaq();
})();

async function getJson(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) new Error('Fetch failed');

		// Data is stored here locally
		const data = await response.json();

		// Pass the stored data to other functions in the space below

		// Pass the stored data to other functions in the space above
	} catch (error) {
		console.error('Error:', error);
	}
}
