const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const API_KEY = "AIzaSyD_zESVVNZpB78gniVBEoH4A4tO45vZz0M";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

//Create message element with dynamic classis and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomeingMessageDiv) => {
  const messageElement=incomeingMessageDiv.querySelector(".message-text");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }],
        },
      ],
    }),
  };
  try {
    //fetch response
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    //Extract and display bot's response text
    const apiResponseText=data.candidates[0].content.parts[0].text.trim();
    messageElement.innerText=apiResponseText;

  } catch (error) {
    console.log(error);
  }
};

//Handle outgoing user message
const handOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";

  const messageContent = ` <div class="message-text"></div>`;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );

  outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);

  //Handle outgoing user message
  setTimeout(() => {
    const messageContent = `  <div class="message bot-message">
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-message-chatbot">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                    <path d="M9.5 9h.01" />
                    <path d="M14.5 9h.01" />
                    <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
                </svg>
                
                    <div class=" message-text thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                </div>
            </div>
        </div>`;
    const incomeingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomeingMessageDiv);
    generateBotResponse(incomeingMessageDiv);
  }, 300);
};

//Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
  const userMessege = e.target.value.trim();

  if (e.key === "Enter" && userMessege) {
    console.log(userMessege);
    handOutgoingMessage(e);
  }
});
//Handle send button for sending messages
sendMessageButton.addEventListener("click", (e) => {
  handOutgoingMessage(e);
});
