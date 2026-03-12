
window.onload = function () {
    window.scrollTo(0, 0);
};


let selectedTheme = "";
let selectedTone = "";
let selectedFormat = "";

let sections = document.querySelectorAll(".themes");

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



document.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("active")
);



function createPrompt() {

    if (!selectedTheme || !selectedTone || !selectedFormat) {
        alert("Please select Theme, Tone, and Format first.");
        return;
    }

    let prompt = `Generate 5 ${selectedTone} ${selectedFormat} writing prompts about ${selectedTheme}.
    Make them vibrant and apart from eachother.

Do not include any commentary outside the prompts.
Keep each prompt around 20-30 words
`;
    console.log(prompt);

    return prompt;
}



function typeWriter(text, elementId, speed = 0.1) {

    let output = document.getElementById(elementId);


    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");


    text = text.replace(/\n/g, "<br>");

    let i = 0;
    output.innerHTML = "";

    function type() {

        if (i < text.length) {


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


document.getElementById("generateBtn").addEventListener("click", async function () {

    let prompt = createPrompt();

    if (!prompt) return;

    document.getElementById("promptOutput").innerHTML = "Generating prompts...";


    document.getElementById("generatedTitle").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    try {

        let response = await fetch("http://127.0.0.1:5000/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt
            })

        });

        let data = await response.json();


        typeWriter(data.result, "promptOutput", 20);

    }

    catch (error) {

        document.getElementById("promptOutput").innerHTML =
            "Error generating prompt. Please try again.";

        console.error(error);
    }

});
