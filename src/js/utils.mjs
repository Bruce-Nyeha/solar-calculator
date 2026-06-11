export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Centralized access utilities protecting browser localStorage operations
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Asynchronously load and render reusable snippets into standard HTML layout nodes
export async function loadHeaderFooter() {
  try {
    const headerResponse = await fetch("/partials/header.html");
    const footerResponse = await fetch("/partials/footer.html");
    
    if (!headerResponse.ok || !footerResponse.ok)
       throw new Error("Partial layout missing.");
    
    const headerHtml = await headerResponse.text();
    const footerHtml = await footerResponse.text();
    
    qs("#main-header").innerHTML = headerHtml;
    qs("#main-footer").innerHTML = footerHtml;
  } catch (error) {
    console.error("Error building structural layouts:", error);
  }
}
