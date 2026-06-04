const today = new Date();
const year = today.getFullYear();

function footer() {
	return `
      <div class="social">
        <a target="_blank" rel="noreferrer" href="https://www.instagram.com/runtheundergrad" aria-label="Instagram">
          <i class="fa-brands fa-instagram" aria-hidden="true"></i>
        </a>
	      	<a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/runtheundergrad/" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i>
        </a>
      </div>
      <p class="copyright">© ${year} UnderGrad Racing</p>
  `;
}

export function insertFooter() {
	const footerElement = footer();
	document.querySelector('footer').insertAdjacentHTML('beforeend', footerElement);
}
