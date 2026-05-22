window.onload = function () {
    window.scrollTo(0, 0);
};

let selectedTheme = "";
let selectedTone = "";
let selectedFormat = "";

const sections = document.querySelectorAll(".themes");

const API_URL = "http://127.0.0.1:5000/generate";


// ==========================
// THEME SELECTION
// ==========================
sections[0].querySelectorAll("button").forEach(button => {

    button.addEventListener("click", function () {

        sections[0].querySelectorAll("button").forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        selectedTheme = this.innerText;

        console.log("Theme:", selectedTheme);

        document.getElementById("toneSection").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// ==========================
// TONE SELECTION
// ==========================
sections[1].querySelectorAll("button").forEach(button => {

    button.addEventListener("click", function () {

        sections[1].querySelectorAll("button").forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        selectedTone = this.innerText;

        console.log("Tone:", selectedTone);

    });

});


// ==========================
// FORMAT SELECTION
// ==========================
sections[2].querySelectorAll("button").forEach(button => {

    button.addEventListener("click", function () {

        sections[2].querySelectorAll("button").forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        selectedFormat = this.innerText;

        console.log("Format:", selectedFormat);

    });

});


// ==========================
// PROMPT CREATOR
// ==========================
function createPrompt() {

    if (!selectedTheme || !selectedTone || !selectedFormat) {

        alert("Please select Theme, Tone, and Format first.");
        return null;

    }

    let prompt = `
Generate 5 unique ${selectedTone} ${selectedFormat} writing prompts about ${selectedTheme}.

Requirements:
- Number each prompt
- Give each prompt a creative title
- Keep each prompt around 20-30 words
- Make every prompt very different from the others
- Do not include explanations or commentary
`;

    console.log(prompt);

    return prompt;
}


// ==========================
// TYPEWRITER EFFECT
// ==========================
function typeWriter(text, elementId, speed = 15) {

    let output = document.getElementById(elementId);

    // Markdown formatting
    text = text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/\n/g, "<br>");

    let i = 0;

    output.innerHTML = "";
    output.style.opacity = 1;

    function type() {

        if (i < text.length) {

            // Handle HTML tags properly
            if (text[i] === "<") {

                let end = text.indexOf(">", i);

                output.innerHTML += text.substring(i, end + 1);

                i = end + 1;

            }

            else {

                output.innerHTML += text[i];
                i++;

            }

            setTimeout(type, speed);

        }

    }

    type();
}


// ==========================
// GENERATE BUTTON
// ==========================
document.getElementById("generateBtn").addEventListener("click", async function () {

    let prompt = createPrompt();

    if (!prompt) return;

    const btn = document.getElementById("generateBtn");

    btn.disabled = true;
    btn.innerText = "Generating...";

    const output = document.getElementById("promptOutput");

    output.style.opacity = 0;

    output.innerHTML = "Generating prompts...";

    document.getElementById("generatedTitle").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    try {

        // Timeout controller
        const controller = new AbortController();

        setTimeout(() => controller.abort(), 15000);

        let response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt
            }),

            signal: controller.signal

        });

        let data = await response.json();

        if (data.result) {

            typeWriter(data.result, "promptOutput", 15);

        }

        else {

            output.innerHTML = "No response received.";

        }

    }

    catch (error) {

        console.error(error);

        if (error.name === "AbortError") {

            output.innerHTML =
                "Request timed out. Please try again.";

        }

        else {

            output.innerHTML =
                "Error generating prompt. Please try again.";

        }

    }

    finally {

        btn.disabled = false;
        btn.innerText = "Generate";

    }

});