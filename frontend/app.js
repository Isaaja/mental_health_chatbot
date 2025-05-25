let quickReplies = [];
let currentQueue = 1;

// Get DOM elements
const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("messageInput");
const quickRepliesDiv = document.getElementById("quickReplies");

// Load quick replies on page load
window.onload = () => {
  loadQuickReplies(currentQueue);
  // Add initial bot message
  appendMessage(
    "Hello! I'm your mental health assistant. How can I help you today?",
    "bot"
  );
};

async function loadQuickReplies(queue = 1) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/quick_replies?queue=${queue}`
    );
    const data = await response.json();
    if (data.quick_replies) {
      quickReplies = data.quick_replies;
      generateQuickReplies();
    }
  } catch (error) {
    console.error("Failed to load quick replies:", error);
  }
}

async function sendMessage(message = null) {
  const messageText = message || userInput.value.trim();
  if (!messageText) return;

  // Add user message to chat
  appendMessage(messageText, "user");
  if (!message) {
    userInput.value = "";
  }

  try {
    const response = await fetch("http://localhost:3000/api/chat-bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });

    const data = await response.json();

    if (response.ok) {
      appendMessage(data.summary, "bot");
      // Update quick replies after bot response
      currentQueue += 1;
      loadQuickReplies(currentQueue);
    } else {
      appendMessage("Sorry, I encountered an error. Please try again.", "bot");
    }
  } catch (error) {
    console.error("Error:", error);
    appendMessage("Sorry, I encountered an error. Please try again.", "bot");
  }
}

function appendMessage(text, sender) {
  const wrapper = document.createElement("div");
  wrapper.className = `mb-2 flex ${
    sender === "user" ? "justify-end" : "justify-start"
  }`;

  const bubble = document.createElement("div");
  bubble.className = `max-w-xs px-4 py-2 rounded-xl shadow ${
    sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
  }`;

  bubble.innerHTML = `<b>${
    sender === "user" ? "You" : "Bot"
  }:</b> ${text.replace(/\n/g, "<br>")}`;
  wrapper.appendChild(bubble);
  chatContainer.appendChild(wrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateQuickReplies() {
  quickRepliesDiv.innerHTML = "";
  quickReplies.forEach((text) => {
    const btn = document.createElement("button");
    btn.className =
      "bg-white border border-blue-300 text-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-50";
    btn.innerText = text;
    btn.onclick = () => {
      sendMessage(text);
    };
    quickRepliesDiv.appendChild(btn);
  });
}

// Add event listener for Enter key
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
