function saveToLocalStorage(knowledgeList) {
  localStorage.setItem("knowledgeList", JSON.stringify(knowledgeList));
}

function loadFromLocalStorage() {
  const storedList = localStorage.getItem("knowledgeList");
  return storedList ? JSON.parse(storedList) : [];
}
