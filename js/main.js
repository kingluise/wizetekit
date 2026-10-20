
document.documentElement.classList.add("js-reveal");

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menuButton.textContent = "☰";
    });
  });
}

const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
  if (link.dataset.page === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll(".reveal");

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    const filter = button.dataset.filter;

    projectCards.forEach(card => {
      card.hidden = !(
        filter === "all" || card.dataset.category === filter
      );
    });
  });
});

// Contact form: submit directly to Formspree.
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = document.querySelector("#form-status");

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    if (status) {
      status.textContent = "";
      status.classList.remove("show");
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        let errorMessage = "We couldn't submit your enquiry. Please try again.";

        try {
          const result = await response.json();

          if (result.errors && result.errors.length) {
            errorMessage = result.errors
              .map(error => error.message)
              .join(" ");
          } else if (result.error) {
            errorMessage = result.error;
          }
        } catch {
          // Keep the default error message if no JSON response is available.
        }

        throw new Error(errorMessage);
      }

      contactForm.reset();

      if (status) {
        status.textContent =
          "Thank you! Your enquiry has been submitted successfully. We'll get back to you as soon as possible.";
        status.classList.add("show");
      }
    } catch (error) {
      if (status) {
        status.textContent =
          error.message ||
          "Something went wrong. Please try again or email support@wizetekit.top directly.";
        status.classList.add("show");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Project Enquiry ↗";
      }
    }
  });
}

// Automatically update the copyright year.
document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = new Date().getFullYear();
});
