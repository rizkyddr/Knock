document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("postsContainer");
  const knowledgeList = loadFromLocalStorage();
  knowledgeList.forEach((post) => addPostToDOM(post, false));
  updateTimes();

  setInterval(updateTimes, 60000); // Update times every minute
});

function postKnowledge() {
  const input = document.getElementById("knowledgeInput");
  const text = input.value.trim();
  if (!text) return;

  const post = {
    id: Date.now(),
    text: text,
    status: "Locked",
    postDate: new Date(),
    unlockDate: null,
  };

  addPostToDOM(post, true);
  saveKnowledge(post);

  input.value = "";
}

function addPostToDOM(post, isNew) {
  const postsContainer = document.getElementById("postsContainer");

  const postElement = document.createElement("div");
  postElement.className = "bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8 mb-4";
  postElement.dataset.id = post.id;
  postElement.innerHTML = `
      <p class="knowledge-text">${post.text}</p>
      <p class="post-meta">Posted: <span class="post-date">${formatDate(new Date(post.postDate))}</span></p>
      <p class="post-meta">Status: <span class="status-text ${post.status === "Locked" ? "status-locked" : "status-unlocked"}">${post.status}</span></p>
      <p class="post-meta">Unlocked: <span class="unlock-date">${post.unlockDate ? timeSince(new Date(post.unlockDate)) : "Not unlocked!"}</span></p>
      <div class="btn-parent">
          <button class="btn btn-unlock" onclick="unlockKnowledge(this)">Unlock</button>
          <button class="btn btn-delete" onclick="deleteKnowledge(this)">Delete</button>
      </div>
  `;

  if (isNew) {
    postsContainer.appendChild(postElement);
  } else {
    if (post.status === "Unlocked") {
      postsContainer.insertBefore(postElement, postsContainer.firstChild);
    } else {
      postsContainer.appendChild(postElement);
    }
  }
}

function saveKnowledge(post) {
  const knowledgeList = loadFromLocalStorage();
  knowledgeList.push(post);
  saveToLocalStorage(knowledgeList);
}

function unlockKnowledge(button) {
  const postElement = button.closest("[data-id]");
  const postId = Number(postElement.dataset.id);
  const knowledgeList = loadFromLocalStorage();
  const post = knowledgeList.find((post) => post.id === postId);

  if (post && post.status === "Locked") {
    post.status = "Unlocked";
    post.unlockDate = new Date();
    saveToLocalStorage(knowledgeList);

    const statusText = postElement.querySelector(".status-text");
    statusText.textContent = post.status;
    statusText.className = `status-text ${post.status === "Locked" ? "status-locked" : "status-unlocked"}`;

    const unlockDate = postElement.querySelector(".unlock-date");
    unlockDate.textContent = timeSince(new Date(post.unlockDate));

    postElement.classList.add("transition-transform", "duration-500");

    setTimeout(() => {
      const postsContainer = document.getElementById("postsContainer");
      postElement.remove();
      postsContainer.insertBefore(postElement, postsContainer.firstChild);

      setTimeout(() => {
        postElement.classList.remove("transition-transform", "duration-500");
      }, 500);
    }, 50);

    updateTimes();
  }
}

function deleteKnowledge(button) {
  const postElement = button.closest("[data-id]");
  const postId = Number(postElement.dataset.id);
  const knowledgeList = loadFromLocalStorage();
  const updatedList = knowledgeList.filter((post) => post.id !== postId);
  saveToLocalStorage(updatedList);
  postElement.remove();
}

function updateTimes() {
  const knowledgeList = loadFromLocalStorage();
  document.querySelectorAll("[data-id]").forEach((postElement) => {
    const postId = Number(postElement.dataset.id);
    const post = knowledgeList.find((post) => post.id === postId);
    if (post && post.unlockDate) {
      const unlockDate = postElement.querySelector(".unlock-date");
      unlockDate.textContent = timeSince(new Date(post.unlockDate));
    }
  });
}
