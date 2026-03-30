document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("quizForm");
    const questions = form.querySelectorAll(".question");
    const progressBar = document.getElementById("progressBar");
    const submitBtn = form.querySelector("button[type='submit']");

    let currentQuestion = 0;

    // Hide all except first question
    questions.forEach((q, idx) => {
        if (idx !== currentQuestion) q.style.display = "none";
    });

    // Hide submit initially
    submitBtn.style.display = "none";

    // Move to next question on selection
    questions.forEach((q, idx) => {
        const select = q.querySelector("select");
        select.addEventListener("change", () => {
            // Show next question if exists
            currentQuestion++;
            let progressPercent = (currentQuestion / questions.length) * 100;
            progressBar.style.width = progressPercent + "%";

            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = "block";
            } else {
                submitBtn.style.display = "block";
            }
        });
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
    e.preventDefault();

    const answers = [
        form.q1.value, form.q2.value, form.q3.value,
        form.q4.value, form.q5.value, form.q6.value, form.q7.value
    ];

    let scores = {
        visual: 0, auditory: 0, kinesthetic: 0,
        dyslexiaRisk: 0, adhdRisk: 0, dyscalculiaRisk: 0, dysgraphiaRisk: 0
    };

    answers.forEach(ans => {
        switch(ans){
            case "Visual": scores.visual += 2; break;
            case "Auditory": scores.auditory += 2; break;
            case "Kinesthetic": scores.kinesthetic += 2; break;
            case "Dyslexia": scores.dyslexiaRisk += 3; break;
            case "ADHD": scores.adhdRisk += 3; break;
            case "Dyscalculia": scores.dyscalculiaRisk += 3; break;
            case "Dysgraphia": scores.dysgraphiaRisk += 3; break;
        }
    });

    // Determine main style
    let styleScores = {visual: scores.visual, auditory: scores.auditory, kinesthetic: scores.kinesthetic};
    let mainStyle = Object.keys(styleScores).reduce((a,b) => styleScores[a] > styleScores[b] ? a : b);
    mainStyle = mainStyle.charAt(0).toUpperCase() + mainStyle.slice(1) + " Learner";

    localStorage.setItem("learningResults", JSON.stringify({mainStyle, scores}));

    // Animate progress bar to 100%
    progressBar.style.width = "100%";

    // Launch confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24']
    });

    // Wait 1 second, then redirect
    setTimeout(() => {
        window.location.href = "results.html";
    }, 1000);
});
});