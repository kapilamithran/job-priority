const grid = document.getElementById("factors-grid");
let draggedItem = null;
let touchStartY = 0;

// Drag and Drop for Desktop
grid.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
        draggedItem = e.target;
        e.dataTransfer.setData("text/html", e.target.outerHTML);
    }
});

grid.addEventListener("dragover", (e) => e.preventDefault());

grid.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("draggable") && draggedItem) {
        const items = Array.from(grid.children);
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(e.target);

        if (draggedIndex < targetIndex) {
            grid.insertBefore(draggedItem, e.target.nextSibling);
        } else {
            grid.insertBefore(draggedItem, e.target);
        }
        updateNumbering(); // Update numbering after rearrangement
    }
});

// Touch Events for Mobile
grid.addEventListener("touchstart", (e) => {
    if (e.target.classList.contains("draggable")) {
        draggedItem = e.target;
        touchStartY = e.touches[0].clientY;
    }
});

grid.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const overItem = document.elementFromPoint(e.touches[0].clientX, touchY);

    if (overItem && overItem !== draggedItem && overItem.classList.contains("draggable")) {
        const items = Array.from(grid.children);
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(overItem);

        if (draggedIndex < targetIndex) {
            grid.insertBefore(draggedItem, overItem.nextSibling);
        } else {
            grid.insertBefore(draggedItem, overItem);
        }
        updateNumbering(); // Update numbering after rearrangement
    }
});

grid.addEventListener("touchend", () => {
    draggedItem = null;
});

// Update Numbering
function updateNumbering() {
    const items = Array.from(grid.children);
    items.forEach((item, index) => {
        item.textContent = `${index + 1}. ${item.textContent.split(". ")[1]}`;
    });
}

// Submit the form data and include the order
document.getElementById("submit-button").addEventListener("click", () => {
    const formAction =
        "https://docs.google.com/forms/d/e/1FAIpQLSeI_4hIokqEBzIdWQHjSIRa75lBf_X1dJkmmpPN3fONfb6DwQ/formResponse";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const experience = document.getElementById("experience").value;
    const age = document.getElementById("age").value;
    const order = Array.from(document.getElementById("factors-grid").children).map(
        (item) => item.textContent
    ).join("\n");

    if (!name || !email || !experience || !age) {
        alert("Please fill in all required fields.");
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("entry.28274034", name); // Replace with your actual field name
    formData.append("entry.2112322007", email); // Replace with your actual field name
    formData.append("entry.254278321", experience); // Replace with your actual field name
    formData.append("entry.1820404158", age); // Replace with your actual field name
    formData.append("entry.342785664", order); // Replace with your actual field name

    // Submit the form via fetch
    fetch(formAction, {
        method: "POST",
        body: formData,
        mode: "no-cors", // This avoids CORS errors for Google Forms
    })
        .then(() => {
            alert("Submitted..!!");
            // Optionally clear the form
            document.getElementById("player-form").reset();
        })
        .catch((error) => {
            console.error("Error submitting the form:", error);
            alert("Something went wrong. Please try again.");
        });
});