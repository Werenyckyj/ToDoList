console.log("Popup script loaded");

function newElement(inputValue, priority) {
  const ul = document.getElementById("todoList");
  const li = document.createElement("li");
  li.style.borderWidth = "1px";
  li.style.borderStyle = "solid";
  li.style.backgroundColor = "#1d1c2c";
  li.style.color = "#ffffff";
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  switch (priority) {
    case "Urgent":
      li.style.borderColor = "#80030eff";
      break;
    case "It will wait":
      li.style.borderColor = "#725700ff";
      break;
    case "Sleeper":
      li.style.borderColor = "#006577ff";
      break;
  }
  li.textContent = `${inputValue}`;

  const imageButton = document.createElement("img");
  imageButton.src = "../images/done.png";
  imageButton.alt = "Done";
  imageButton.style.cursor = "pointer";
  imageButton.style.width = "20px";
  imageButton.style.height = "20px";
  imageButton.addEventListener("click", () => {
    const doneList = document.getElementById("doneList");
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    li.textContent = `${inputValue} (Completed on: ${formattedDate})`;
    li.style.color = "#b8b8b8ff";
    doneList.insertBefore(li, doneList.firstChild);
    imageButton.remove();
    saveLists();
  });

  li.appendChild(imageButton);

  const items = Array.from(ul.children);
  const index = items.findIndex((item) => {
    const priorityOrder = { Urgent: 1, "It will wait": 2, Sleeper: 3 };
    const itemPriority = Object.keys(priorityOrder).find(
      (key) =>
        item.style.borderColor ===
        {
          "Urgent": "#80030eff",
          "It will wait": "#725700ff",
          "Sleeper": "#006577ff",
        }[key]
    );

    return priorityOrder[priority] < priorityOrder[itemPriority];
  });

  if (index === -1) {
    ul.appendChild(li);
  } else {
    ul.insertBefore(li, items[index]);
  }

  saveLists();
}

function saveLists() {
  const todoList = Array.from(document.getElementById("todoList").children).map(
    (item) => ({
      text: item.textContent.replace(
        /\s*\(Urgent\)|\(It will wait\)|\(Sleeper\)/g,
        ""
      ),
      priority: item.style.borderColor,
    })
  );
  const doneList = Array.from(document.getElementById("doneList").children).map(
    (item) => ({
      text: item.textContent.replace(
        /\s*\(Urgent\)|\(It will wait\)|\(Sleeper\)/g,
        ""
      ),
      priority: item.style.borderColor,
    })
  );

  localStorage.setItem("todoList", JSON.stringify(todoList));
  localStorage.setItem("doneList", JSON.stringify(doneList));
}

function loadLists() {
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  const doneList = JSON.parse(localStorage.getItem("doneList")) || [];

  const todoUl = document.getElementById("todoList");
  const doneUl = document.getElementById("doneList");

  todoList.forEach((item) => {
    const li = document.createElement("li");
    li.style.borderColor = item.priority;
    li.style.borderWidth = "1px";
    li.style.borderStyle = "solid";
    li.style.backgroundColor = "#1d1c2c";
    li.style.color = "#ffffff";
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = item.text;

    const imageButton = document.createElement("img");
    imageButton.src = "../images/done.png";
    imageButton.alt = "Done";
    imageButton.style.cursor = "pointer";
    imageButton.style.width = "20px";
    imageButton.style.height = "20px";
    imageButton.addEventListener("click", () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const dateContainer = document.createElement("div");
      dateContainer.style.marginTop = "5px";
      dateContainer.style.display = "block";

      const dateSpan = document.createElement("span");
      dateSpan.style.fontSize = "0.7em";
      dateSpan.style.color = "#b8b8b8";
      dateSpan.textContent = ` (Completed on: ${formattedDate})`;

      dateContainer.appendChild(dateSpan);
      li.appendChild(dateContainer);
      li.style.color = "#b8b8b8ff";
      doneUl.appendChild(li);
      imageButton.remove();
      saveLists();
    });

    li.appendChild(imageButton);
    todoUl.appendChild(li);
  });

  doneList.forEach((item) => {
    const li = document.createElement("li");
    li.style.borderColor = item.priority;
    li.style.borderWidth = "1px";
    li.style.borderStyle = "solid";
    li.style.backgroundColor = "#1d1c2c";
    li.style.color = "#b8b8b8ff";
    li.className = "list-group-item";
    li.textContent = item.text;

    doneUl.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadLists();

  const addButton = document.getElementById("addButton");
  const addItemForm = document.getElementById("addItemForm");
  const confirmAdd = document.getElementById("confirmAdd");

  addButton.addEventListener("click", () => {
    addButton.style.display = "none";
    addItemForm.style.display = "block";
  });

  confirmAdd.addEventListener("click", () => {
    const itemText = document.getElementById("itemText").value;
    const priority = document.querySelector("input[name='priority']:checked");

    if (!itemText || !priority) {
      alert("Please enter text and select a priority.");
      return;
    }

    newElement(itemText, priority.value);
    addItemForm.style.display = "none";
    addButton.style.display = "block";
    saveLists();
  });
});
